_			= require "lodash"
PJSEditor 	= require "../editor"

module.exports = class PJSButtonEditor extends PJSEditor

	createInput: ->
		# Create button
		if @settings.schemaFunction is true or @PJS.objectHandler.hasFunctionInObjects @settings.field
			@input = $("<button/>").addClass "function " + @settings.field
			if @settings.styleClass?
				@input.append $("<i/>").addClass(@settings.styleClass)

			# Button text
			@input.append $("<span/>").text(@settings.title)
			@tr.find("td:eq(0)").text("")
		
			# Event handlers
			@input.on "click", (event) =>	
				if @settings.schemaFunction is true
					@settings.onclick(@PJS.objectHandler.objs) if @settings["onclick"]
				else
					@PJS.objectHandler.callFunctionInObjects @fieldName

				@PJS.emit "function-" + @fieldName, @, @PJS.objectHandler.objs

				event.preventDefault()
				return false
		
		return @input

	getInputValue: -> 
	setInputValue: (newValue) -> 

