_			= require "lodash"
$			= require "jquery"
PJSEditor 	= require "../editor"

module.exports = class PJSBooleanEditor extends PJSEditor

	createInput: ->
		# Create input
		@input = $("<input/>").attr("type", "checkbox")
		@input.attr("required", "required") if @settings.required is true

		# Helper
		@helper = $("<span/>").addClass("helper")
		
		# Event handlers
		@input.on "change", => @valueChanged @getInputValue()

		return [@input, @helper]


	getInputValue: -> @input.prop "checked"

	setInputValue: (newValue) -> 
		super newValue
		@input.prop "checked", newValue
		@setHelperText()

		return @

	# Helper
	setHelperText: ->
		value = @lastValue
		if value is true then @helper.text(@settings.booleanTrueText || "Yes") 
		else if value is false then @helper.text(@settings.booleanFalseText || "No")
		else @helper.text("")

