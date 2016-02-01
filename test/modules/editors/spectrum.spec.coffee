expect 		= require("chai").expect
_			= require "lodash"
PJS 		= require "../../../src/js/propertiesJS"
testData	= require "../../test-data"

describe "Test PJSSpectrumEditor", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> 
		testData.createDivs(@test.parent.title)
		pe = $ ".propertyEditor"

	beforeEach -> 
		[objs, schema] = testData.clone()

	it "check PJSSpectrumEditor with 1 object", ->
		schema.editors = testData.getEditors schema.editors, ["backgroundColor"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 
		
		expect(pjs.editors).to.be.length 1

		# 0. editor (active)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		helper = tr.find ".helper"
		input = tr.find "input"

		expect(input.attr("type")).to.be.equal "spectrum"
		expect(helper).to.be.length 1
		expect(tr.find(".sp-replacer")).to.be.length 1

		expect(editor.getInputValue()).to.be.equal "rgba(128, 56, 20, 0.6)"

		editor.setInputValue "#fab000"
		expect(editor.getInputValue()).to.be.equal "#fab000" # rgb(250, 176, 0)"
