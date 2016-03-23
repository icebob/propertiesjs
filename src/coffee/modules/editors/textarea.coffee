_			= require "lodash"
PJSEditor 	= require "../editor"

module.exports = class PJSTextAreaEditor extends PJSEditor

	createInput: ->
		# Create input
		@input = $("<textarea/>")
		@input.attr("placeholder", @settings.placeHolder) if @settings.placeHolder?
		@input.attr("required", "required") if @settings.required is true
		@input.attr("maxlength", @settings.maxLength) if @settings.maxLength? and @settings.maxLength > 0
		@input.attr("rows", @settings.rows) if @settings.rows?
		
		# Event handlers
		@input.on "change", => @valueChanged @getInputValue()

		return @input

	getInputValue: -> @input.val()

	setInputValue: (newValue) -> 
		newValue = super newValue
		@input.val newValue
