expect 		= require("chai").expect
$			= require "jquery"
_			= require "lodash"
PJS 		= require "../../../src/js/propertiesJS"
testData	= require "../../test-data"

describe "Test PJSColorEditor", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> testData.createDivs(@test.parent.title)

	beforeEach -> 
		[objs, schema] = testData.clone()
		pe = $ ".propertyEditor"


	it "check PJSBooleanEditor with 1 object", ->
		schema.editors = testData.getEditors schema.editors, ["themeColor"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 
		
		expect(pjs.editors).to.be.length 1

		# 0. editor (active)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		helper = tr.find ".helper"
		input = tr.find "input"

		expect(input.attr("type")).to.be.equal "color"
		expect(helper).to.be.length 1

		expect(editor.getInputValue()).to.be.equal "#fab000"
