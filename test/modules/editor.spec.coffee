expect 		= require("chai").expect
PJS 		= require "../../src/js/propertiesJS"
PJSEditor	= require "../../src/js/modules/editor"
testData	= require "../test-data"

describe "Test abstract editor", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> 
		testData.createDivs(@test.parent.title)
		pe = $ ".propertyEditor"

	beforeEach -> [objs, schema] = testData.clone()

	describe "Test abstract editor", ->

		it "check abstract Editor functions", ->
			schema.editors = testData.getEditors schema.editors, ["name"]
			pjs = new PJS ".propertyEditor", schema, objs[0] 

			expect(pjs.objectHandler.objs).to.be.length 1
			expect(pjs.schema).to.be.equal schema
			expect(pjs.editors).to.be.length 1

			# 0. editor (name)
			editor = pjs.editors[0]
			tr = pe.find "tbody tr:eq(0)"

			# Init property values
			expect(editor.changed).to.be.False
			expect(editor.errors).to.be.length 0
			expect(editor.lastValue).to.be.unDefined
			expect(editor.fieldName).to.be.equal schema.editors[0].field

			# Event emitters
			expect(editor.on).to.be.exist
			expect(editor.off).to.be.exist

			# Settings
			settings = editor.settings
			expect(settings).to.be.equal schema.editors[0]

			# tr text & classes
			expect(tr.find("td:eq(0)").text()).to.be.equal editor.settings.title
			expect(tr.hasClass("required")).to.be.true
			expect(tr.hasClass("featured")).to.be.true
			expect(tr.hasClass(settings.type)).to.be.true
			expect(tr.attr("data-field")).to.be.equal settings.field

			# Check enable/disable
			expect(editor.isEnabled()).to.be.true
			expect(editor.disable()).to.be.equal editor
			expect(editor.isEnabled()).to.be.false
			expect(editor.input.attr("disabled")).to.be.equal "disabled"
			expect(tr.hasClass("disabled")).to.be.true
			expect(editor.enable()).to.be.equal editor
			expect(editor.isEnabled()).to.be.true
			expect(editor.input.attr("disabled")).to.be.unDefined
			expect(tr.hasClass("disabled")).to.be.false

			# Check value changes
			editor.setInputValue "123"
			expect(editor.lastValue).to.be.equal "123"
			expect(pjs.workObject[editor.fieldName]).to.be.equal objs[0][settings.field]

			editor.valueChanged "555"
			expect(pjs.workObject[editor.fieldName]).to.be.equal "555"

			# Check changeValue method
			editor.changeValue "888", false
			expect(editor.lastValue).to.be.equal "888"
			expect(pjs.workObject[editor.fieldName]).to.be.equal objs[0][settings.field]

			editor.changeValue "999", true
			expect(editor.lastValue).to.be.equal "999"
			expect(pjs.workObject[editor.fieldName]).to.be.equal "999"


		it "check editor abstract methods", ->
			editor = new PJSEditor null, schema
			expect(-> editor.createInput()).to.throw(/Abstract/)
			expect(-> editor.getInputValue()).to.throw(/Abstract/)

		it "check schema disabled property", ->
			schema.editors = testData.getEditors schema.editors, ["name"]
			schema.editors[0].disabled = true
			pjs = new PJS ".propertyEditor", schema, objs[0] 
			editor = pjs.editors[0]
			tr = pe.find "tbody tr:eq(0)"
			
			expect(editor.isEnabled()).to.be.false
			expect(editor.input.attr("disabled")).to.be.equal "disabled"
			expect(tr.hasClass("disabled")).to.be.true


		it "check editor onChanged event", (done) ->
			schema.editors = testData.getEditors schema.editors, ["name"]
			pjs = new PJS ".propertyEditor", schema, objs[0] 
			editor = pjs.editors[0]

			schema.editors[0].onChanged = (_editor, _newValue, _obj) -> 
				expect(_editor).to.be.equal editor
				expect(_newValue).to.be.equal "111"
				expect(_obj).to.be.exist
				expect(pjs.getObject()).to.be.equal _obj
				expect(_obj[editor.fieldName]).to.be.equal "111"
				done()

			editor.valueChanged "111"

		it "check schema onChanged event", (done) ->
			schema.editors = testData.getEditors schema.editors, ["name"]
			pjs = new PJS ".propertyEditor", schema, objs[0] 
			editor = pjs.editors[0]

			schema.onChanged = (_editor, _newValue, _obj) -> 
				expect(_editor).to.be.equal editor
				expect(_newValue).to.be.equal "123"
				expect(_obj[_editor.fieldName]).to.be.equal "123"
				done()

			editor.valueChanged "123"

		it "check editor event-emitter", (done) ->
			schema.editors = testData.getEditors schema.editors, ["name"]
			pjs = new PJS ".propertyEditor", schema, objs[0] 
			editor = pjs.editors[0]

			editor.on "changed", (_editor, _newValue, _obj) -> 
				expect(_editor).to.be.equal editor
				expect(_newValue).to.be.equal "234"
				expect(_obj[_editor.fieldName]).to.be.equal "234"
				done()

			editor.valueChanged "234"

		it "check PJS event-emitter", (done) ->
			schema.editors = testData.getEditors schema.editors, ["name"]
			pjs = new PJS ".propertyEditor", schema, objs[0] 
			editor = pjs.editors[0]

			pjs.on "changed", (_editor, _newValue, _obj) -> 
				expect(_editor).to.be.equal editor
				expect(_newValue).to.be.equal "345"
				expect(_obj[_editor.fieldName]).to.be.equal "345"
				done()

			editor.valueChanged "345"

		it "check PJS field-changed event-emitter", (done) ->
			schema.editors = testData.getEditors schema.editors, ["name"]
			pjs = new PJS ".propertyEditor", schema, objs[0] 
			editor = pjs.editors[0]

			pjs.on editor.fieldName + "-changed", (_editor, _newValue, _obj) -> 
				expect(_editor).to.be.equal editor
				expect(_newValue).to.be.equal "555"
				expect(_obj[_editor.fieldName]).to.be.equal "555"
				done()

			editor.valueChanged "555"
		
		it "check PJS auto disable/enable editors", ->
			schema.editors = testData.getEditors schema.editors, ["age", "active"]
			pjs = new PJS ".propertyEditor", schema, objs[0]
			editorAge = pjs.editors[0]
			editorActive = pjs.editors[1]

			expect(editorActive.getInputValue()).to.be.true
			expect(editorAge.isEnabled()).to.be.false

			editorActive.valueChanged(false)
			expect(editorAge.isEnabled()).to.be.true

			editorActive.valueChanged(true)
			expect(editorAge.isEnabled()).to.be.false
