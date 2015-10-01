_				= require "lodash"
$				= require "jquery"
PJSTextEditor 	= require("./text")

module.exports = class PJSNumberEditor extends PJSTextEditor

	createInput: ->
		super

		@input.attr("min", @settings.minValue) if @settings.minValue?
		@input.attr("max", @settings.maxValue) if @settings.maxValue?

		return @input

	getInputValue: -> parseFloat @input.val()

	innerValidate: (value) ->
		val = parseFloat value
		if isNaN(val) 
			@errors.push "Invalid number!"
			return false

		if @settings.minValue? and val < @settings.minValue 
			@errors.push "Number is too small! Minimum: " + @settings.minValue 
			return false

		if @settings.maxValue? and val > @settings.maxValue 
			@errors.push "Number is too big! Maximum: " + @settings.maxValue 
			return false

		return true

