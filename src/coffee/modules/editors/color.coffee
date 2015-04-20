_			= require "lodash"
$			= require "jquery"
PJSEditor 	= require "../editor"

module.exports = class PJSColorEditor extends PJSEditor

	createInput: ->
		# Create input
		@input = $("<input/>").attr("type", @settings.type)
		@input.attr("required", "required") if @settings.required is true

		# Helper span
		@helper = $("<span/>").addClass("helper")
		setHelperText = (value) -> @helper.text value || ""
		
		# Event handlers
		@input.on "change", => @valueChanged @getInputValue()

		return [@input, @helper]


	getInputValue: -> @input.val()

	setInputValue: (newValue) -> 
		super newValue
		@input.val newValue
		@setHelperText()

	# Helper
	setHelperText: -> @helper.text @lastValue
