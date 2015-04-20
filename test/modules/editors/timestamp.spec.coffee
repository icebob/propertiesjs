expect 		= require("chai").expect
$			= require("jquery")
moment 		= require("moment")
PJS 		= require "../../../src/js/propertiesJS"
testData	= require "../../test-data"

describe "Test PJSTimestampEditor", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> 
		testData.createDivs(@test.parent.title)
		pe = $ ".propertyEditor"

	beforeEach -> [objs, schema] = testData.clone()

	it "check PJSTimestampEditor with 1 object", ->
		schema.editors = testData.getEditors schema.editors, ["created"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 1
		expect(pjs.schema).to.be.equal schema
		expect(pjs.editors).to.be.length 1
		expect(pjs.changed).to.be.false

		# 0. editor (created)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "span"

		# Check input classes & type
		expect(input.length).to.be.equal 1

		# Check input values
		expect(input.text()).to.be.equal moment(objs[0][settings.field], settings.format).format(editor.timeFormat)
		expect(editor.getInputValue()).to.be.equal moment(objs[0][settings.field], settings.format).format(editor.timeFormat)


	it "check PJSTimestampEditor with 2 object", ->
		schema.editors = testData.getEditors schema.editors, ["created"]
		pjs = new PJS ".propertyEditor", schema, objs.slice 0, 2

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 2
		expect(pjs.editors).to.be.length 1

		# 0. editor (created)
		editor = pjs.editors[0]
		settings = editor.settings
		expect(settings).to.be.equal schema.editors[0]

		# check input field exist
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "span"

		# should undefined if object values different
		expect(input.text()).to.be.equal ""