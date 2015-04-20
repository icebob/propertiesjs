expect 		= require("chai").expect
$			= require("jquery")
PJS 		= require "../../../src/js/propertiesJS"
testData	= require "../../test-data"

describe "Test PJSTextEditor", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> 
		testData.createDivs(@test.parent.title)
		pe = $ ".propertyEditor"

	beforeEach -> [objs, schema] = testData.clone()

	it "check PJSTextEditor with 1 object", ->
		schema.editors = testData.getEditors schema.editors, ["name", "username", "email"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 1
		expect(pjs.schema).to.be.equal schema
		expect(pjs.editors).to.be.length 3
		expect(pjs.changed).to.be.false

		# 0. editor (name)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "input"

		# Check input classes & type
		expect(input.length).to.be.equal 1
		expect(input.attr("type")).to.be.equal settings.type
		expect(input.attr("required")).to.be.equal "required"
		expect(input.attr("placeholder")).to.be.equal settings.placeHolder

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
		expect(objs[0].name).to.be.equal "123"


		# 1. editor (username)
		editor = pjs.editors[1]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(1)"
		input = tr.find "input"

		# Check max length
		expect(input.attr("maxlength")).to.be.equal settings.maxLength.toString()
		expect(input.val()).to.be.equal objs[0][settings.field]

		#Check input change trigger
		input.val("Johnny").trigger("change")
		expect(pjs.workObject[editor.fieldName]).to.be.equal "Johnny"


	it "check editor schema validate function", (done) ->
		[objs, schema] = testData.clone()
		schema.editors = testData.getEditors schema.editors, ["username"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 
		editor = pjs.editors[0]
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "input"

		# Too short test
		expect(editor.valueChanged("Bob")).to.be.false
		expect(editor.errors).to.be.length 1
		expect(tr.hasClass("validation-error")).to.be.true
		expect(tr.find(".errors span")).to.be.length 1

		# Whitespace test
		expect(editor.valueChanged("Ice bob")).to.be.false
		expect(editor.errors).to.be.length 1
		expect(tr.hasClass("validation-error")).to.be.true
		expect(tr.find(".errors span")).to.be.length 1

		# Whitespace & short test
		expect(editor.valueChanged("I B")).to.be.false
		expect(editor.errors).to.be.length 2
		expect(tr.hasClass("validation-error")).to.be.true
		expect(tr.find(".errors span")).to.be.length 2

		# Good value no validation error
		expect(editor.valueChanged("Icebob")).to.be.true
		expect(editor.errors).to.be.length 0
		expect(tr.hasClass("validation-error")).to.be.false
		expect(tr.find(".errors span")).to.be.length 0

		done()

	it "check editor regexp validate function", ->
		[objs, schema] = testData.clone()
		schema.editors = testData.getEditors schema.editors, ["phone"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "input"

		expect(input.attr("pattern")).to.be.equal settings.pattern
		expect(tr.find(".hint")).to.be.length 1
		expect(tr.find(".hint").text()).to.be.equal settings.hint

		expect(pjs.checkEditorValidation()).to.be.true
		# not matched test
		expect(editor.valueChanged("Bob")).to.be.false
		expect(editor.errors).to.be.length 1
		expect(tr.hasClass("validation-error")).to.be.true
		expect(tr.find(".errors span")).to.be.length 1
		expect(pjs.checkEditorValidation()).to.be.false

		# not matched test
		expect(editor.valueChanged("70/589-3321123")).to.be.false
		expect(editor.errors).to.be.length 1
		expect(tr.hasClass("validation-error")).to.be.true
		expect(tr.find(".errors span")).to.be.length 1	
		expect(pjs.checkEditorValidation()).to.be.false
	
		# matched test
		expect(editor.valueChanged("70/589-3321")).to.be.true
		expect(editor.errors).to.be.length 0
		expect(tr.hasClass("validation-error")).to.be.false
		expect(tr.find(".errors span")).to.be.length 0
		expect(pjs.checkEditorValidation()).to.be.true

	it "check editor schema validate function return false", (done) ->
		[objs, schema] = testData.clone()
		schema.editors = testData.getEditors schema.editors, ["name", "username", "email"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 
		editor = pjs.editors[0]

		editor = pjs.editors[2]
		
		expect(editor.valueChanged("Bob")).to.be.false
		expect(editor.errors).to.be.length 1

		expect(editor.valueChanged("B@")).to.be.false
		expect(editor.errors).to.be.length 1

		done()



	it "check PJSTextEditor with 2 object", ->
		schema.editors = testData.getEditors schema.editors, ["name", "username"]
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
		input = tr.find "input"

		# should undefined if object values different
		expect(input.val()).to.be.unDefined

		# check objects' value
		s = "Johnny"
		editor.valueChanged s
		expect(objs[0][editor.fieldName]).to.be.equal s
		expect(objs[1][editor.fieldName]).to.be.equal s
