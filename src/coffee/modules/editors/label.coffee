_			= require "lodash"
$			= require "jquery"
PJSEditor 	= require "../editor"

module.exports = class PJSLabelEditor extends PJSEditor

	createInput: ->
		# Create input
		@input = $("<span/>").addClass("value").attr("type", @settings.type)
		
		return @input


	getInputValue: -> @input.text()

	setInputValue: (newValue) -> 
		super newValue
		@input.text newValue

