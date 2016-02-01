_			= require "lodash"
PJSEditor 	= require "../editor"

module.exports = class PJSSpectrumEditor extends PJSEditor

	createInput: (tr, editorCell, nameCell) ->
		# Create input
		@input = $("<input/>").attr("type", @settings.type)
		@input.attr("required", "required") if @settings.required is true

		editorCell.append @input

		# Helper span
		@helper = $("<span/>").addClass("helper")
		setHelperText = (value) -> @helper.text value || ""

		editorCell.append @helper

		try
			@input.spectrum
				showInput: true
				showAlpha: true
				allowEmpty: not @settings.required
				#chooseText: "Choose"
				#cancelText: "Cancel"
				preferredFormat: "hex"
				change: (color) => 
					console.log color
					if color? then value = color.toRgbString() else	value = null
					@valueChanged value					

		catch e
			console.warn "Spectrum color library is missing. Please download from http://bgrins.github.io/spectrum/ and load the script in the HTML head section!"

		return [] # Empty because appended

	getInputValue: -> @lastValue

	setInputValue: (newValue) -> 
		super newValue
		if @input.spectrum?
			@input.spectrum "set", newValue
		@setHelperText()

	# Helper
	setHelperText: -> @helper.text @lastValue