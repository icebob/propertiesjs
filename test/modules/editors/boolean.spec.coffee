expect 		= require("chai").expect
PJS 		= require "../../../src/js/propertiesJS"
testData	= require "../../test-data"

describe "Test PJSBooleanEditor", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> testData.createDivs(@test.parent.title)

	beforeEach -> 
		[objs, schema] = testData.clone()
		pe = $ ".propertyEditor"


	it "check PJSBooleanEditor with 1 object", ->
		schema.editors = testData.getEditors schema.editors, ["active"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 
		
		# 0. editor (active)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		helper = tr.find ".helper"
		input = tr.find "input"

		expect(input.attr("type")).to.be.equal "checkbox"
		expect(input.attr("required")).to.be.equal "required"
		expect(helper).to.be.length 1

		expect(editor.getInputValue()).to.be.true

		# Set to yes
		input.prop("checked", true).change()
		expect(input.prop("checked")).to.be.true
		expect(editor.getInputValue()).to.be.true
		expect(helper.text()).to.be.equal "Yes"
		expect(objs[0][editor.fieldName]).to.be.true

		# Set to no
		input.prop("checked", false).change()
		expect(input.prop("checked")).to.be.false
		expect(editor.getInputValue()).to.be.false
		expect(helper.text()).to.be.equal "No"
		expect(objs[0][editor.fieldName]).to.be.false
		

	it "check PJSBooleanEditor with 2 object", ->
		schema.editors = testData.getEditors schema.editors, ["active"]
		pjs = new PJS ".propertyEditor", schema, objs.slice 0, 2
		
		# 0. editor (active)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		helper = tr.find ".helper"
		input = tr.find "input"

		expect(pjs.objectHandler.objs).to.be.length 2
		expect(editor.getInputValue()).to.be.false
		expect(helper.text()).to.be.equal ""

		# Set to yes
		input.prop("checked", true).change()
		expect(input.prop("checked")).to.be.true
		expect(editor.getInputValue()).to.be.true
		expect(helper.text()).to.be.equal "Yes"
		expect(objs[0][editor.fieldName]).to.be.true
		expect(objs[1][editor.fieldName]).to.be.true

		# Set to no
		input.prop("checked", false).change()
		expect(input.prop("checked")).to.be.false
		expect(editor.getInputValue()).to.be.false
		expect(helper.text()).to.be.equal "No"
		expect(objs[0][editor.fieldName]).to.be.false
		expect(objs[1][editor.fieldName]).to.be.false


	it "check PJSBooleanEditor with new object", ->
		schema.editors = testData.getEditors schema.editors, ["active"]
		pjs = new PJS ".propertyEditor", schema, null
		
		# 0. editor (active)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		helper = tr.find ".helper"
		input = tr.find "input"

		expect(pjs.objectHandler.objs).to.be.length 1
		expect(editor.getInputValue()).to.be.true
		expect(helper.text()).to.be.equal "Yes"
