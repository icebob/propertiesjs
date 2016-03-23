_			= require "lodash"
PJSEditor 	= require "../editor"

module.exports = class PJSImageEditor extends PJSEditor

	createInput: ->
		# Create input
		@input = $("<input/>").attr("type", "text")
		@input.attr("required", "required") if @settings.required is true

		# Upload button
		if @settings.browse isnt false
			@fileInput = $("<input />").attr("type", "file").on "change", (event) =>
				reader = new FileReader()

				reader.onload = (e) =>
					@setInputValue e.target.result
					@valueChanged e.target.result

				if event.target.files and event.target.files.length > 0
					console.log event.target.files[0]
					reader.readAsDataURL event.target.files[0]


		# Preview
		if @settings.preview isnt false
			removeButton = $("<div/>").addClass("remove").attr("title", "Remove image").on "click", => 
				@input.val("")
				@fileInput.val("")
				@input.trigger "change"

			@preview = $("<div/>").addClass("preview").append removeButton
		
		# Press ENTER
		@input.on "keydown", (event) =>
			if event.keyCode is 13
				event.preventDefault()
				@input.trigger "change"
				return false

		# Event handlers
		@input.on "change", => 
			@valueChanged @getInputValue()
			@setPreview @getInputValue()

		return [@input, @fileInput, @preview]


	getInputValue: -> @input.val()

	setInputValue: (newValue) -> 
		newValue = super newValue
		@input.val newValue
		@setPreview newValue

	# Helper
	setPreview: (val) -> 
		if @settings.preview isnt false
			if val? and val isnt ""
				@preview.css 
					"background-image": 'url(' + val + ')'
					"display": "block"
			else
				@preview.css 
					"display": "none"
