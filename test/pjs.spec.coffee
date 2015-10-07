expect 		= require("chai").expect
$			= require("jquery")
PJS 		= require "../src/js/propertiesJS"
testData	= require "./test-data"

describe "Test PJS in Live mode", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> testData.createDivs(@test.parent.title)

	beforeEach -> 
		[objs, schema] = testData.clone()
		schema.liveEdit = true
		pe = $ ".propertyEditor"


	it "check constructor", ->
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect(pjs.container).to.be.length 1
		expect(pjs.objectHandler).to.be.exist
		expect(pjs.objectHandler.objs).to.be.Array
		expect(pjs.objectHandler.objs).to.be.length 1
		expect(pjs.objectHandler.objs[0]).to.be.equal objs[0]
		expect(pjs.schema).to.be.deep.equal schema
		expect(pjs.editors).to.be.Array
		expect(pjs.changed).to.be.False
		expect(pjs.on).to.be.exist
		expect(pjs.off).to.be.exist

	it "check constructor exceptions", ->
		expect(-> new PJS()).to.throw(/Container/)
		expect(-> new PJS(".propertyEditor")).to.throw(/Schema/)

	it "check constructor empty object", ->
		pjs = new PJS ".propertyEditor", schema
		expect(pjs.objectHandler.objs).to.be.length 1


	it "check getEditor method", ->
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs.getEditor()).to.be.unDefined

		editor = pjs.getEditor("name")
		expect(editor).to.be.exist
		expect(editor.settings).to.be.equal schema.editors[1]

	
describe "Test PJS in NON Live mode", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> testData.createDivs(@test.parent.title)

	beforeEach -> 
		[objs, schema] = testData.clone()
		schema.liveEdit = false
		pe = $ ".propertyEditor"


	it "check non live mode functions with save", (done)->
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect(pjs.container).to.be.length 1
		expect(pjs.objectHandler.objs[0]).to.be.equal objs[0]
		expect(pjs.schema).to.be.deep.equal schema

		editor = pjs.editors[1]
		prevValue = objs[0][editor.fieldName]

		editor.valueChanged "111"
		expect(objs[0][editor.fieldName]).to.be.equal prevValue
		expect(pjs.workObject[editor.fieldName]).to.be.equal "111"

		pjs.on "save", (resObj) ->

			expect(objs[0][editor.fieldName]).to.be.equal "111"
			expect(pjs.workObject).to.be.equal resObj

			done()

		pe.find("button.save").click()

	it "check non live mode functions with subeditor (body.weight) with save", (done)->
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect(pjs.container).to.be.length 1
		expect(pjs.objectHandler.objs[0]).to.be.equal objs[0]
		expect(pjs.schema).to.be.deep.equal schema

		editor = pjs.editors[11]
		prevValue = objs[0].body.weight

		expect(pjs.workObject.body.weight).to.be.equal prevValue
		editor.valueChanged "123"
		expect(objs[0].body.weight).to.be.equal prevValue
		expect(pjs.workObject.body.weight).to.be.equal "123"

		pjs.on "save", (resObj) ->

			expect(objs[0].body.weight).to.be.equal "123"
			expect(pjs.workObject).to.be.equal resObj

			done()

		pe.find("button.save").click()		


	it "check live mode functions with cancel", (done)->
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		editor = pjs.editors[0]
		prevValue = objs[0][editor.fieldName]

		editor.valueChanged "111"
		expect(objs[0][editor.fieldName]).to.be.equal prevValue
		expect(pjs.workObject[editor.fieldName]).to.be.equal "111"

		pjs.on "cancel", () ->
			expect(objs[0][editor.fieldName]).to.be.equal prevValue
			done()

		pe.find("button.cancel").click()

	it "check live mode save if has validation error", ->
		schema.editors = testData.getEditors schema.editors, ["name", "username"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect(pjs.container).to.be.length 1
		expect(pjs.objectHandler.objs[0]).to.be.equal objs[0]
		expect(pjs.schema).to.be.deep.equal schema

		editor = pjs.editors[1]
		btn = pe.find("button.save")

		# Changed should be false and buttons disabled
		expect(editor.changed).to.be.False
		expect(pjs.changed).to.be.False
		expect(pjs.checkEditorValidation()).to.be.true
		expect(btn.attr("disabled")).to.be.equal "disabled"
		expect(btn.hasClass("disabled")).to.be.true

		editor.changeValue "a"

		expect(editor.errors).to.be.length 1
		# Validation error, buttons disabled
		expect(pjs.changed).to.be.false
		expect(editor.changed).to.be.false
		expect(pjs.checkEditorValidation()).to.be.false
		expect(btn.attr("disabled")).to.be.equal "disabled"
		expect(btn.hasClass("disabled")).to.be.true

		editor.changeValue "abcdefg"

		expect(editor.errors).to.be.length 0
		# Good value, changed should be true, buttons enabled
		expect(pjs.changed).to.be.true
		expect(editor.changed).to.be.true
		expect(pjs.checkEditorValidation()).to.be.true
		expect(btn.attr("disabled")).to.be.unDefined
		expect(btn.hasClass("disabled")).to.be.false


describe "Test PJS windowTitles", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> testData.createDivs(@test.parent.title)

	beforeEach -> 
		[objs, schema] = testData.clone()
		schema.liveEdit = true
		schema.windowTitle = "New other title" 
		schema.windowSubTitle = "This is a subtitle" 
		pe = $ ".propertyEditor"


	it "check title from schema", ->
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect($(".propertyEditor").find("thead .title")).to.be.length 1
		expect($(".propertyEditor").find("thead .title").text()).to.be.equal "New other title"

	it "check subTitle from schema", ->
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect($(".propertyEditor").find("thead .subTitle")).to.be.length 1
		expect($(".propertyEditor").find("thead .subTitle").text()).to.be.equal "This is a subtitle"

describe "Test jQuery plugin mode", ->

	before -> testData.createDivs(@test.parent.title)

	it "check jQuery plugin registration", (done) ->
		[objs, schema] = testData.clone()

		expect(window.jQuery.fn.propertiesJS).to.be.exist
		window.jQuery(".propertyEditor").propertiesJS schema, objs[0]
		expect(window.jQuery(".propertyEditor tbody")).to.be.length 1

		pjs = $(".propertyEditor").data("propertiesJS")
		expect(pjs).to.be.exist
		editor = pjs.editors[0]

		pjs.on editor.fieldName + "-changed", (_editor, _newValue, _obj) -> 
			expect(_editor).to.be.equal editor
			expect(_newValue).to.be.equal "555"
			expect(_obj[_editor.fieldName]).to.be.equal "555"
			done()

		editor.valueChanged "555"

	after -> $(".propertyEditorWrapper").last().remove()