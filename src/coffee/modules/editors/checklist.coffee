_			= require "lodash"
$			= require "jquery"
PJSEditor 	= require "../editor"

module.exports = class PJSCheckListEditor extends PJSEditor

	constructor: (PJS, settings, tr) ->
		super PJS, settings, tr

		@values = []
		@selectedValues = []
		@dropList = null
		@dropListVisible = false
		@listBox = settings.listBox is true

	createInput: ->
		# Create main div
		@input = $("<div/>").append([
			$("<span />").addClass("info").text("0 selected")
			$("<span />").addClass("arrow")
			@dropList = $("<div />").addClass("droplist")
		])
		@dropList.css("max-height", 24 * (@settings.rows || 6) + "px") if @settings.rows > 0

		if @listBox 
			@input.addClass "listBox" 
			unless @settings.rows > 0
				@input.find(".droplist").css overflow: "hidden"
		else 
			@input.addClass "checklist"

		@values = @getListValues()

		@createDropDownList()

		# Event handlers
		@input.find(".info, .arrow").on "click", (e) =>
			offset = $(e.target).offset()
			if @dropListVisible then @hideDropDownList() else @showDropDownList()

		return @input

	getListValues: ->
		if _.isFunction @settings.values
			return @settings.values()
		else if _.isArray @settings.values
			return [].concat @settings.values

	createDropDownList: ->
		@dropList.empty()

		@values = @getListValues()
		_.each @values, (option) =>
			id = if typeof(option) is "string" then option else option.id
			name = if typeof(option) is "string" then option else option.name
			row = $("<div />").addClass "row"
			checkbox = $ "<input/>", 
				type: "checkbox"
				"data-value": id

			span = $("<span/>").text name
			$("<label/>").append([checkbox, span]).appendTo row

			if @selectedValues.indexOf(id) isnt -1
				row.find("input").prop "checked", true

			row.appendTo @dropList

		@dropList.find("input").on "change", => 
			@valueChanged @getInputValue()

			@refreshMainText()


	showDropDownList: ->
		@dropList.slideDown("fast")
		@input.addClass "expanded"
		@dropListVisible = true

	hideDropDownList: ->
		@dropList.slideUp("fast")
		@input.removeClass "expanded"
		@refreshMainText()
		@dropListVisible = false

	refreshMainText: ->
		txt = "0 selected"
		if @selectedValues.length == 1
			txt = "#{@selectedValues[0]}"
		else if @selectedValues.length > 1
			txt = "#{@selectedValues.length} selected"

		@input.find(".info").text txt

	getInputValue: -> 
		@selectedValues = []
		@input.find("input").each (i, item) =>
			if $(item).prop "checked" then @selectedValues.push $(item).attr("data-value")
		return @selectedValues		

	setInputValue: (newValues) -> 
		super newValues

		@selectedValues = newValues || []

		# Recreate droplist
		@createDropDownList()

		@refreshMainText()

	innerValidate: (value) ->
		if @settings.required is true and @selectedValues.length == 0 
			@errors.push "Please select an item!"
			return false

		return true