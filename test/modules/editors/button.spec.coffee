$			= require("jquery")
_			= require("lodash")
moment 		= require("moment")
PJS 		= require "../../../src/js/propertiesJS"
testData	= require "../../test-data"

chai				= require("chai")
sinon				= require "sinon"
sinonChai			= require "sinon-chai"
expect 				= chai.expect
chai.use sinonChai


describe "Test PJSTButtonEditor", ->

	pjs = null
	objs = null
	schema = null
	pe = null

	before -> 
		testData.createDivs(@test.parent.title)
		pe = $ ".propertyEditor"

	beforeEach -> [objs, schema] = testData.clone()

	it "check PJSTButtonEditor with 1 object", ->
		schema.editors = testData.getEditors schema.editors, ["sendMessage", "clone", "delete"]
		pjs = new PJS ".propertyEditor", schema, objs[0]

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 1
		expect(pjs.schema).to.be.equal schema
		expect(pjs.editors).to.be.length 3
		expect(pjs.changed).to.be.false

		# 0. editor (sendMessage)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "button"

		# Check input classes & type
		expect(input.length).to.be.equal 1
		expect(input.hasClass("function")).to.be.true
		expect(input.hasClass(settings.field)).to.be.true

		expect(input.find("i.fa.fa-envelope")).to.be.length 1
		expect(input.find("span")).to.be.length 1
		expect(input.find("span").text()).to.be.equal settings.title
		expect(tr.find("td:eq(0)").text()).to.be.equal ""

		expect(editor.getInputValue()).to.be.unDefined
		expect(editor.setInputValue()).to.be.unDefined

	it "check PJSTButtonEditor with all objects", ->
		schema.editors = testData.getEditors schema.editors, ["sendMessage", "clone", "delete"]
		pjs = new PJS ".propertyEditor", schema, objs

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 4
		expect(pjs.schema).to.be.equal schema
		expect(pjs.editors).to.be.length 1

		expect(pjs.editors[0].fieldName).to.be.equal schema.editors[2].field

	it "check PJSTButtonEditor click", ->
		schema.editors = testData.getEditors schema.editors, ["sendMessage", "clone"]
		pjs = new PJS ".propertyEditor", schema, objs[0]

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 1
		expect(pjs.schema).to.be.equal schema
		expect(pjs.editors).to.be.length 2

		# 0. editor (sendMessage)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "button"

		# Create spy for sendMessage callback
		fncSendMessage = sinon.spy()
		_.each objs, (obj) ->
			obj.sendMessage = fncSendMessage

		input.click()
		expect(fncSendMessage).to.have.been.callCount 1

		# 1. editor (clone)
		editor = pjs.editors[1]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(1)"
		input = tr.find "button"

		# Create spy for sendMessage callback
		fncClone = sinon.spy()
		settings.onclick = fncClone

		input.click()
		expect(fncClone).to.have.been.callCount 1

	it "check PJSTButtonEditor click with event emitter", (done)->
		schema.editors = testData.getEditors schema.editors, ["sendMessage", "clone"]
		pjs = new PJS ".propertyEditor", schema, objs[0]

		expect(pjs).to.be.exist
		expect(pjs.objectHandler.objs).to.be.length 1
		expect(pjs.schema).to.be.equal schema
		expect(pjs.editors).to.be.length 2

		# 0. editor (sendMessage)
		editor = pjs.editors[0]
		settings = editor.settings
		tr = pe.find "tbody tr:eq(0)"
		input = tr.find "button"

		# Create spy for sendMessage callback on PJS emitter
		fncSendMessage = sinon.spy()
		pjs.on "function-sendMessage", (_editor, _objs) ->
			expect(_editor).to.be.equal editor
			expect(_objs[0]).to.be.equal objs[0]
			done()

		input.click()
