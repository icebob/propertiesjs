_			= require "lodash"
$			= require "jquery"
PJSEditor 	= require "../editor"

module.exports = class PJSSelectEditor extends PJSEditor

	constructor: (PJS, settings, tr) ->
		super PJS, settings, tr

		@values = []

	createInput: ->
		# Create input
		@input = $("<select/>")

		if @settings.required isnt true
			@input.append $("<option/>").text("None")

		@values = @getListValues()

		# Create options
		_.each @values, (option) =>
			@input.append $("<option/>").attr("value", if typeof(option) is "string" then option else option.id).text(if typeof(option) is "string" then option else option.name)

		# Event handlers
		@input.on "change", => @valueChanged @getInputValue()

		return @input

	getListValues: ->
		if _.isFunction @settings.values
			return @settings.values()
			# TODO promise
		else if _.isArray @settings.values
			return [].concat @settings.values

	getInputValue: -> @input.val()

	setInputValue: (newValue) -> 
		super newValue
		@input.val newValue

	getSelectedValueObject: ->
		value = @getInputValue()

		index = _.findIndex @values, (item) ->
			if typeof(item) is "string"
				item == value
			else
				item.id == value

		if index isnt -1
			return @values[index]
		else
			return null
