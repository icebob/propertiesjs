_			= require "lodash"
$			= require "jquery"
moment		= require "moment"
PJSNumberEditor 	= require "./number"

module.exports = class PJSSliderEditor extends PJSNumberEditor

	createInput: ->
		super		

		@input.attr("type", "range")
		@input.attr("step", @settings.step) if @settings.step?
		
		return @input
