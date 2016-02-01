_				= require "lodash"
moment			= require "moment"
PJSEditor 		= require "../editor"
PJSLabelEditor 	= require "./label"

module.exports = class PJSTimestampEditor extends PJSLabelEditor

	timeFormat: "LLL"

	createInput: ->
		super

	getInputValue: -> @input.text()

	setInputValue: (newValue) -> 
		super newValue
		if newValue?
			@input.text moment(newValue, @settings.format).format(@timeFormat)
		else
			@input.text ""
