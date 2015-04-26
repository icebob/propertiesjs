_			= require "lodash"
$			= require "jquery"
PJSEditor 	= require "../editor"

module.exports = class PJSTextEditor extends PJSEditor

	createInput: ->
		# Create input
		@input = $("<input/>").attr("type", @settings.type)
		@input.attr("placeholder", @settings.placeHolder) if @settings.placeHolder?
		@input.attr("required", "required") if @settings.required is true
		@input.attr("maxlength", @settings.maxLength) if @settings.maxLength? and @settings.maxLength > 0
		@input.attr("pattern", @settings.pattern) if @settings.pattern?
		
		# Event handlers
		@input.on "change", => @valueChanged @getInputValue()

		return @input


	getInputValue: -> @input.val()

	setInputValue: (newValue) -> 
		super newValue
		@input.val newValue


	innerValidate: (value) ->
		if @settings.required isnt true and value is "" then return true

		if @settings.pattern?
			re = new RegExp @settings.pattern
			if not re.test value
				@errors.push "Not valid format!"
				return false

		return true
