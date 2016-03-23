_					= require "lodash"
ui 					= require "./modules/ui"
Emitter				= require "event-emitter"
PJSObjectHandler 	= require "./modules/objects"
PJSEditors 			= require "./modules/editors"
store				= require "./modules/store"

# --- CREATE PROPERTY EDITOR CLASS ---	
module.exports = class PJS 

	container: null
	objectHandler: null
	schema: null
	editors: []
	liveEdit: true

	changed: false

	workObject: null

	constructor: (c, @schema, objs) ->	
		@editors = []
		@workObject = {}

		# Validation
		if c is undefined then throw new Error("Container is missing!")
		if @schema is undefined then throw new Error("Schema is missing!")
		unless objs?
			objs = {} # Create a new empty object with default values

		@liveEdit = @schema.liveEdit isnt false
		@container = ui.getContainer c		
		
		# Clear template
		@container.empty()

		if not _.isArray objs then objs = [objs]

		@objectHandler = new PJSObjectHandler objs

		# Create table
		[table, thead, tbody, tfoot] = ui.generatePJSTable @
		
		# Create editors
		if @schema.editors and @schema.editors.length > 0
			@createEditors @schema.editors, objs, tbody
		
		#LiveEdit
		if @liveEdit is false
			# Save button event handler
			tfoot.find("button.save").on "click", (e)=> 
				e.preventDefault()
				@onSave()
				return false

			# Cancel button event handler
			tfoot.find("button.cancel").on "click", (e)=> 
				e.preventDefault()
				@onCancel()
				return false

			@disableControlButtons()
		
		# Append table
		@container.append table

		@container.on "keydown", ":input:not(textarea)", (event) ->
			if event.keyCode is 13
				event.preventDefault()
				return false


		@clearChangedFlag()

		return @

	createEditors: (editors, objs, tbody, groupField) ->
		$.each editors, (i, editorSchema) =>
			
			# It is a group
			if editorSchema.type is "group"
				# Generate group TR
				[tr, nameCell] = ui.generateGroupRow @, editorSchema, groupField

				# Expand/collapse event handler
				nameCell.on "click", ->
					if tr.hasClass "collapsed"
						# Expand
						tr.removeClass "collapsed"
						tbody.find("tr.group-#{editorSchema.field}").show()
						store.setGroupState editorSchema.field, false
					else
						# Collapse
						tr.addClass "collapsed"
						tbody.find("tr.group-#{editorSchema.field}").hide()
						store.setGroupState editorSchema.field, true

				tr.appendTo tbody

				# Create editors from group
				if editorSchema.editors 
					if _.isFunction editorSchema.editors
						childEditors = editorSchema.editors this, this.schema, objs
					else
						childEditors = editorSchema.editors

					if childEditors and childEditors.length > 0
						@createEditors childEditors, objs, tbody, editorSchema.field


				# Set group state
				state = store.getGroupState editorSchema.field, editorSchema.collapsed is true
				if state
					tbody.find("tr.group-#{editorSchema.field}").hide()

				return

			# Skip if disabled multiedit
			if objs.length > 1 and editorSchema.multiEdit is false then return
			
			# Create table rows for editor
			[tr, nameCell, editorCell] = ui.generateEditorRow @, editorSchema, groupField

			EditorClass = PJSEditors[editorSchema.type]
			if EditorClass
				# Create editor
				editor = new EditorClass @, editorSchema, tr, nameCell, editorCell

				# Create input
				input = editor.createInput(tr, editorCell, nameCell)
				if input?

					if editorSchema.type isnt "button"
						# Lekérni az objektumokból az értéket
						value = @objectHandler.getValueFromObjects editor.fieldName, editorSchema.default
						# Beállítani a munka objektumnak
						@objectHandler.setObjectValueByPath @workObject, editor.fieldName, value												
						# Beállítani az input-nak
						editor.setInputValue value

					# Add input to cell
					editorCell.append input

					# Set hint for editor
					editorCell.find(".hint").text editorSchema.hint if editorSchema.hint?
					editorCell.find(".hint").insertAfter editorCell.children().last()

					# Move errors div to back
					editorCell.find(".errors").insertAfter editorCell.children().last()

					# Disable if neccessary
					if editorSchema.disabled is true
						editor.disable()

					if _.isFunction(editorSchema.disabled)
						editor.disable() if editorSchema.disabled(editor, objs) is true
						
					# Add to editors
					@editors.push editor
				else
					return

			else
				console.warn "Invalid editor type: " + editorSchema.type

			# Add editor cell to tr to tbody
			tr.appendTo tbody
				
			return true


	valueChanged: (editor, newValue) ->

		@setChangedFlag()

		# Set new value to work object
		@objectHandler.setObjectValueByPath @workObject, editor.fieldName, newValue

		# Set new values to objects
		if @liveEdit
			@objectHandler.setValueToObjects editor.fieldName, newValue

		# Call schema changed event
		if @schema.onChanged? 
			@schema.onChanged editor, newValue, @workObject

		# Call schema emitter
		@emit "changed", editor, newValue, @workObject

		# Call schema field-changed emitter
		@emit editor.fieldName + "-changed", editor, newValue, @workObject

		# Review editors disable functions
		@checkEditorsDisable()


	setChangedFlag: ->
		@changed = true
		unless @liveEdit
			if @checkEditorValidation()
				@enableControlButtons()
			else
				@disableControlButtons()
	
	disableControlButtons: ->
		unless @liveEdit
			@container.find("tfoot button.save").attr("disabled", "disabled").addClass("disabled")

	enableControlButtons: ->
		unless @liveEdit
			@container.find("tfoot button.save").removeAttr("disabled").removeClass("disabled")

	clearChangedFlag: ->
		@changed = false
		$.each @editors, (i, editor) ->	
			editor.changed = false 
			return

		@disableControlButtons()

	checkEditorsDisable: ->
		$.each @editors, (i, editor) =>
			if _.isFunction(editor.settings.disabled)
				oldState = not editor.isEnabled()
				newState = editor.settings.disabled(editor, @objectHandler.objs)
				if newState isnt oldState
					if newState is true then editor.disable() else editor.enable()


	checkEditorValidation: ->
		res = true
		$.each @editors, (i, editor) ->	if editor.errors.length > 0 then res = false
		return res

	getEditor: (field) ->
		res = null
		$.each @editors, (i, editor) ->
			if editor.fieldName is field
				res = editor
				return false

		return res

	getObject: -> return @workObject

	onSave: -> 
		@objectHandler.applyChanges @workObject
		@emit "save", @workObject
		@clearChangedFlag()

	onCancel: -> 
		@emit "cancel"
		@clearChangedFlag()

# jQuery plugin registration
if window.$
	window.$.fn.propertiesJS = (schema, objs)->
		return $(@).each -> 
			pjs = new PJS $(@), schema, objs
			$(@).data("propertiesJS", pjs)

Emitter PJS.prototype

window.PJS = PJS