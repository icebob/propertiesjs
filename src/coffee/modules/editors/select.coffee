_			= require "lodash"
PJSEditor 	= require "../editor"

module.exports = class PJSSelectEditor extends PJSEditor

	constructor: (PJS, settings, tr) ->
		super PJS, settings, tr

		@values = []

	createInput: ->
		# Create input
		@input = $("<select/>")

		if @settings.required isnt true
			@input.append $("<option/>").text("None")

		@values = @getListValues()

		# Create options
		_.each @values, (option) =>
			@input.append $("<option/>").data("pjs-obj", option).attr("value", if typeof(option) is "string" then option else option.id).text(if typeof(option) is "string" then option else option.name)

		# Event handlers
		@input.on "change", => @valueChanged @getInputValue()

		return @input

	getListValues: ->
		if _.isFunction @settings.values
			return @settings.values()
			# TODO promise
		else if _.isArray @settings.values
			return [].concat @settings.values

	getInputValue: -> 
		item = @getSelectedValueObject()
		if typeof(item) is "string" 
			return item 
		else if typeof(item) is "object" 
			return item.id

	setInputValue: (newValue) -> 
		super newValue
		@input.val newValue

	getSelectedValueObject: ->
		selected = @input.find("option:selected")

		if selected.length > 0
			item = selected.data 'pjs-obj'
			return item
