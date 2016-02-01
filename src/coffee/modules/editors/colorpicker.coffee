_			= require "lodash"
$			= require "jquery"
PJSEditor 	= require "../editor"

module.exports = class PJSColorPickerEditor extends PJSEditor

	createInput: ->
		# Create input
		@input = $("<input/>").attr("type", @settings.type)
		@input.attr("required", "required") if @settings.required is true

		try
			@input.colorPicker
				renderCallback: (elm, toggled) -> if toggled is false then @valueChanged @getInputValue()
		catch e
			console.warn "Tiny color picker library is missing. Please download from http://www.dematte.at/tinyColorPicker/ and load the script in the HTML head section!"

		# Event handlers
		@input.on "change", => @valueChanged @getInputValue()

		return @input

	getInputValue: -> @input.val()

	setInputValue: (newValue) -> 
		super newValue
		@input.val newValue

