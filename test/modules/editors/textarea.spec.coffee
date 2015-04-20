expect 		= require("chai").expect
$			= require("jquery")
PJS 		= require "../../../src/js/propertiesJS"
testData	= require "../../test-data"

describe "Test PJSTextAreaEditor", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> 
		testData.createDivs(@test.parent.title)
		pe = $ ".propertyEditor"

	beforeEach -> [objs, schema] = testData.clone()

	it "check PJSTextAreaEditor with 1 object", ->
		schema.editors = testData.getEditors schema.editors, ["description"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 1
		expect(pjs.schema).to.be.equal schema
		expect(pjs.editors).to.be.length 1
		expect(pjs.changed).to.be.false

		# 0. editor (name)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "textarea"

		# Check input classes & type
		expect(input.length).to.be.equal 1
		expect(input.attr("required")).to.be.unDefined
		expect(input.attr("placeholder")).to.be.equal settings.placeHolder
		expect(input.attr("rows")).to.be.equal settings.rows.toString()

		# Check input values
		expect(input.val()).to.be.equal objs[0][settings.field]
		expect(editor.getInputValue()).to.be.equal objs[0][settings.field]
		editor.setInputValue "222"
		expect(editor.getInputValue()).to.be.equal "222"

		# check changes flag
		expect(editor.changed).to.be.false
		editor.valueChanged "123"
		expect(editor.changed).to.be.true
		expect(pjs.changed).to.be.true
		expect(editor.lastValue).to.be.equal "123"
		expect(editor.errors).to.be.length 0
		expect(objs[0][editor.fieldName]).to.be.equal "123"

		# Check max length
		expect(input.attr("maxlength")).to.be.equal settings.maxLength.toString()

		# Check input change trigger
		input.val("First testing comment").trigger("change")
		expect(pjs.workObject[editor.fieldName]).to.be.equal "First testing comment"

	it "check PJSTextAreaEditor with 2 object", ->
		schema.editors = testData.getEditors schema.editors, ["description"]
		pjs = new PJS ".propertyEditor", schema, objs.slice 0, 2

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 2
		expect(pjs.editors).to.be.length 1

		# 0. editor (name)
		editor = pjs.editors[0]
		settings = editor.settings
		expect(settings).to.be.equal schema.editors[0]

		# check input field exist
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "textarea"

		# should undefined if object values different
		expect(input.val()).to.be.unDefined

		# check objects' value
		s = "Second testing comment"
		editor.valueChanged s
		expect(objs[0][editor.fieldName]).to.be.equal s
		expect(objs[1][editor.fieldName]).to.be.equal s
