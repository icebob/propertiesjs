_			= require "lodash"
$			= require "jquery"
Emitter		= require "event-emitter"

#window.PJSEditors = {}

module.exports = class PJSEditor

	PJS: null
	settings: null
	input: null
	changed: false
	fieldName: null
	disabled: false

	lastValue: null

	errors: []

	constructor: (@PJS, @settings, @tr) ->
		@fieldName = @settings.field
		@input = null
		@changed = false
		@errors = []
		@lastValue = null


	createInput: -> throw new Error("Abstract method!")

	getInputValue: -> throw new Error("Abstract method!")

	setInputValue: (value) -> @lastValue = value

	# Change editor value from outside
	changeValue: (value, trigger = true) ->
		@setInputValue value
		@valueChanged(value) if trigger is true

	cancelInputValue: -> @setInputValue @lastValue

	valueChanged: (newValue) ->

		# Call validate before change
		if @validate(newValue) is true

			# Set changed flags
			@changed = true			

			# Call PJS value changed
			@PJS.valueChanged @, newValue

			# Call editor change events
			@doChangeEvents newValue

			# console.log @fieldName + " value changed from " + @lastValue + " to " + newValue

			@lastValue = newValue

			# Refresh helper text
			if @setHelperText then @setHelperText()

			return true

		else 
			# Validate error
			@PJS.disableControlButtons()

			console.warn @errors
			return false

	doChangeEvents: (newValue)->
		# Call editor emitter
		@emit "changed", @, newValue, @PJS.workObject

		# Call editor changed event
		if @settings.onChanged? 
			@settings.onChanged @, newValue, @PJS.workObject

	enable: -> 
		@disabled = false
		@doEnable()
		return @

	disable: -> 
		@disabled = true
		@doDisable()
		return @

	isEnabled: -> !@disabled

	doEnable: -> 
		@tr?.removeClass("disabled")
		@input?.removeAttr("disabled")


	doDisable: -> 
		@tr?.addClass("disabled")
		@input?.attr("disabled", "disabled")

	innerValidate: -> return true

	clearErrors: ->
		@errors = []
		@tr.removeClass "validation-error"
		@tr.find(".errors").empty()

	validate: (value) ->
		@clearErrors()

		if @innerValidate(value) is true 

			unless @settings.validate? then return true

			res = @settings.validate value, @PJS.workObject
			if res is true or res is undefined or (_.isArray(res) && res.length is 0)
				# No errors
				return true				
			else
				if res is false
					# Has error but no message
					@errors.push "Validation error!"
				else if _.isArray res
					# Has multiple errors with message
					@errors = @errors.concat res
				else
					# Has error with message
					@errors.push "Validation error! " + res

		@emit "validation-error", @, value, @errors
		#@cancelInputValue()

		@tr.addClass "validation-error"
		errorDiv = @tr.find(".errors")
		_.each @errors, (err) ->
			$("<span/>").text(err).appendTo errorDiv

		@tr.addClass("shake")
		setTimeout => 
			@tr.removeClass("shake")
		, 1000


		return false


Emitter PJSEditor.prototype
