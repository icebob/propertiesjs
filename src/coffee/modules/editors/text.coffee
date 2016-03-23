_			= require "lodash"
PJSEditor 	= require "../editor"

module.exports = class PJSTextEditor extends PJSEditor

	createInput: ->
		# Create input
		@input = $("<input/>").attr("type", @settings.type)
		@input.attr("placeholder", @settings.placeHolder) if @settings.placeHolder?
		@input.attr("required", "required") if @settings.required is true
		@input.attr("readonly", "readonly") if @settings.readonly is true
		@input.attr("maxlength", @settings.maxLength) if @settings.maxLength? and @settings.maxLength > 0
		@input.attr("pattern", @settings.pattern) if @settings.pattern?
		
		# Event handlers
		@input.on "change", => @valueChanged @getInputValue()

		@input.on "keydown", (event) =>
			if event.keyCode is 13
				event.preventDefault()
				@input.trigger "change"
				return false

		return @input


	getInputValue: -> @input.val()

	setInputValue: (newValue) -> 
		newValue = super newValue
		@input.val newValue


	innerValidate: (value) ->
		if @settings.required isnt true and value is "" then return true

		if @settings.pattern?
			re = new RegExp @settings.pattern
			if not re.test value
				@errors.push "Not valid format!"
				return false

		return true

