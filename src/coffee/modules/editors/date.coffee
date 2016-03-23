_			= require "lodash"
moment		= require "moment"
PJSEditor 	= require "../editor"

module.exports = class PJSDateEditor extends PJSEditor

	baseFormat: "YYYY-MM-DD"

	createInput: ->
		# Create input
		@input = $("<input/>").attr("type", @settings.type)
		@input.attr("placeholder", @settings.placeHolder) if @settings.placeHolder?
		@input.attr("required", "required") if @settings.required is true
		
		# Event handlers
		@input.on "change", => @valueChanged @getInputValue()

		@input.on "keydown", (event) =>
			if event.keyCode is 13
				event.preventDefault()
				@input.trigger "change"
				return false

		return @input


	getInputValue: -> @getMomentValue().format @settings.format

	getMomentValue: -> moment @input.val(), @baseFormat

	setInputValue: (newValue) -> 
		newValue = super newValue
		@input.val moment(newValue, @settings.format).format @baseFormat

