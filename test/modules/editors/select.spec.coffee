expect 		= require("chai").expect
$			= require("jquery")
PJS 		= require "../../../src/js/propertiesJS"
testData	= require "../../test-data"

describe "Test PJSSelectEditor", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> 
		testData.createDivs(@test.parent.title)
		pe = $ ".propertyEditor"

	beforeEach -> [objs, schema] = testData.clone()

	it "check PJSSelectEditor (required) with 1 object", ->
		schema.editors = testData.getEditors schema.editors, ["nativeLang"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 1
		expect(pjs.schema).to.be.equal schema
		expect(pjs.editors).to.be.length 1
		expect(pjs.changed).to.be.false

		# nativeLang editor
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "select"
		options = input.find "option"

		# Check input
		expect(input.length).to.be.equal 1

		# Check require option item
		expect(options.length).to.be.equal settings.values.length

		# Check input values
		expect(input.val()).to.be.equal objs[0][settings.field]
		expect(editor.getInputValue()).to.be.equal objs[0][settings.field]
		editor.setInputValue "it"
		expect(editor.getInputValue()).to.be.equal "it"
		expect(editor.getSelectedValueObject()).to.be.equal settings.values[2]

		# check changes flag
		expect(editor.changed).to.be.false
		editor.valueChanged "de"
		expect(editor.changed).to.be.true
		expect(pjs.changed).to.be.true
		expect(editor.lastValue).to.be.equal "de"
		expect(editor.errors).to.be.length 0
		expect(objs[0][editor.fieldName]).to.be.equal "de"

		# Check input change trigger
		input.val("fr").trigger("change")
		expect(pjs.workObject[editor.fieldName]).to.be.equal "fr"
		expect(editor.getSelectedValueObject()).to.be.equal settings.values[4]
		expect(objs[0][editor.fieldName]).to.be.equal "fr"

	it "check PJSSelectEditor (not required) with 1 object", ->
		schema.editors = testData.getEditors schema.editors, ["sex"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 1
		expect(pjs.schema).to.be.equal schema
		expect(pjs.editors).to.be.length 1
		expect(pjs.changed).to.be.false

		# sex editor
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "select"
		options = input.find "option"

		# Check input
		expect(input.length).to.be.equal 1

		# Check require option item
		expect(options.length).to.be.equal settings.values.length + 1
		expect($(options[0]).text()).to.be.equal "None"

		# Check input values
		expect(input.val()).to.be.equal objs[0][settings.field]
		expect(editor.getInputValue()).to.be.equal objs[0][settings.field]
		editor.setInputValue "Female"
		expect(editor.getInputValue()).to.be.equal "Female"
		expect(editor.getSelectedValueObject()).to.be.equal settings.values[1]

		# check changes flag
		expect(editor.changed).to.be.false
		editor.valueChanged "Male"
		expect(editor.changed).to.be.true
		expect(pjs.changed).to.be.true
		expect(editor.lastValue).to.be.equal "Male"
		expect(editor.errors).to.be.length 0
		expect(objs[0][editor.fieldName]).to.be.equal "Male"

		# Check input change trigger
		input.val("Female").trigger("change")
		expect(pjs.workObject[editor.fieldName]).to.be.equal "Female"
		expect(editor.getSelectedValueObject()).to.be.equal settings.values[1]
		expect(objs[0][editor.fieldName]).to.be.equal "Female"
		
		input.val(null).trigger("change")
		expect(input.val()).to.be.equal null
		expect(pjs.workObject[editor.fieldName]).to.be.undefined
		expect(editor.getSelectedValueObject()).to.be.undefined
		expect(objs[0][editor.fieldName]).to.be.undefined


	it "check PJSSelectEditor (required) with 2 object", ->
		schema.editors = testData.getEditors schema.editors, ["nativeLang"]
		pjs = new PJS ".propertyEditor", schema, objs.slice 2, 4

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 2
		expect(pjs.editors).to.be.length 1

		# nativeLang editor
		editor = pjs.editors[0]
		settings = editor.settings
		expect(settings).to.be.equal schema.editors[0]

		# check input field exist
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "select"
		options = input.find "option"

		# should undefined if object values different
		expect(input.val()).to.be.unDefined

		# check objects' value
		s = "it"
		input.val(s).trigger("change")
		expect(objs[2][editor.fieldName]).to.be.equal s
		expect(objs[3][editor.fieldName]).to.be.equal s

	it "check PJSSelectEditor (not required) with 2 object", ->
		schema.editors = testData.getEditors schema.editors, ["sex"]
		pjs = new PJS ".propertyEditor", schema, objs.slice 2, 4

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 2
		expect(pjs.editors).to.be.length 1

		# sex editor
		editor = pjs.editors[0]
		settings = editor.settings
		expect(settings).to.be.equal schema.editors[0]

		# check input field exist
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "select"
		options = input.find "option"

		# should undefined if object values different
		expect(input.val()).to.be.unDefined

		# check objects' value
		s = settings.values[1]
		input.val(s).trigger("change")
		expect(objs[2][editor.fieldName]).to.be.equal s
		expect(objs[3][editor.fieldName]).to.be.equal s		

		input.val(null).trigger("change")
		expect(pjs.workObject[editor.fieldName]).to.be.undefined
		expect(editor.getSelectedValueObject()).to.be.undefined
		expect(objs[2][editor.fieldName]).to.be.undefined
		expect(objs[3][editor.fieldName]).to.be.undefined

	it "check PJSSelectEditor (not required) with function values", ->
		schema.editors = testData.getEditors schema.editors, ["favoriteMovie"]
		pjs = new PJS ".propertyEditor", schema, objs[0] 

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 1
		expect(pjs.editors).to.be.length 1

		# favoriteMovie editor
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "select"
		options = input.find "option"

		expect(settings.values).to.be.a('function')
		expect(editor.values).to.be.instanceof(Array)

		# Check input change trigger
		input.val(2).trigger("change")
		expect(pjs.workObject[editor.fieldName]).to.be.equal 2
		expect(editor.getSelectedValueObject()).to.be.equal editor.values[1]
		expect(objs[0][editor.fieldName]).to.be.equal 2
		
		input.val(null).trigger("change")
		expect(input.val()).to.be.null
		expect(pjs.workObject[editor.fieldName]).to.be.undefined
		expect(editor.getSelectedValueObject()).to.be.undefined
		expect(objs[0][editor.fieldName]).to.be.undefined

