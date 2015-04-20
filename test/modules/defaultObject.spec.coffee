expect 		= require("chai").expect
$			= require("jquery")
PJS 		= require "../../src/js/propertiesJS"
testData	= require "../test-data"

describe "Test editor defaults", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> 
		testData.createDivs(@test.parent.title)
		pe = $ ".propertyEditor"

	beforeEach -> [objs, schema] = testData.clone()

	describe "Test default values", ->

		it "check Editor default values", ->
			obj = {}

			pjs = new PJS ".propertyEditor", schema, obj

			expect(pjs.objectHandler.objs).to.be.length 1
			expect(pjs.schema).to.be.equal schema

			# 0. editor (name)
			editor = pjs.editors[1]
			expect(editor.settings.default).to.be.exist
			expect(obj.name).to.be.equal editor.settings.default