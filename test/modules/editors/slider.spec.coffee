expect 		= require("chai").expect
$			= require("jquery")
PJS 		= require "../../../src/js/propertiesJS"
testData	= require "../../test-data"

describe "Test PJSSliderEditor", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> testData.createDivs(@test.parent.title)

	beforeEach -> 
		[objs, schema] = testData.clone()
		pe = $ ".propertyEditor"


	it "check attributes", ->
		schema.editors = testData.getEditors schema.editors, ["ratings"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		#  editor
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "input"

		expect(input.length).to.be.equal 1
		expect(input.attr("type")).to.be.equal "range"
		expect(input.attr("min")).to.be.equal settings.minValue.toString()
		expect(input.attr("max")).to.be.equal settings.maxValue.toString()
		expect(input.attr("step")).to.be.equal settings.step.toString()
		
	it "check value", ->
		schema.editors = testData.getEditors schema.editors, ["ratings"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		#  editor
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "input"

		expect(pjs.objectHandler.objs[0][settings.field]).to.be.equal 5
		expect(editor.valueChanged(3)).to.be.true
		expect(pjs.objectHandler.objs[0][settings.field]).to.be.equal 3

		expect(editor.valueChanged(-2)).to.be.false
		expect(editor.errors).to.be.length 1

		expect(editor.valueChanged(88)).to.be.false
		expect(editor.errors).to.be.length 1

		expect(editor.valueChanged("Hello")).to.be.false
		expect(editor.errors).to.be.length 1

