chai				= require("chai").expect
_	 				= require "lodash"
ui 					= require "../../src/js/modules/ui.js"
testData			= require "../test-data"

###
chai				= require("chai")
sinon				= require "sinon"
sinonChai			= require "sinon-chai"
expect 				= chai.expect
chai.use sinonChai
###

describe "Test UI helper methods", ->

	pjs = null

	before -> testData.createDivs(@test.parent.title)

	beforeEach ->

	afterEach -> 


	it "check getContainer", ->
		expect(ui.getContainer).to.be.instanceof(Function)
		expect(ui.getContainer()).to.be.unDefined
		expect(ui.getContainer(".propertyEditor")).to.be.length 1
		expect(ui.getContainer($(".propertyEditor"))).to.be.length 1		

	it "check getContainer class name added", ->
		$(".propertyEditor").removeClass().addClass("testEditor")
		expect(ui.getContainer(".testEditor")).to.be.length 1
		expect(ui.getContainer(".propertyEditor")).to.be.length 1

	it "check generatePJSTable", ->
		[objs, schema] = testData.clone()
		pjs = new PJS(".propertyEditor", schema, objs)

		expect(pjs.objectHandler.objs).to.be.length 4

		[table, thead, tbody, tfoot] = ui.generatePJSTable pjs

		expect(table).to.be.exist
		expect(thead).to.be.exist
		expect(thead.find(".title")).to.be.length 1
		expect(thead.find(".title").text()).to.be.equal schema.windowTitle
		expect(thead.find(".subTitle")).to.be.length 1

		expect(tbody).to.be.exist
		expect(tfoot).to.be.exist

	it "check generatePJSTable if no liveEdit", ->
		[objs, schema] = testData.clone()
		schema.liveEdit = false
		pjs = new PJS(".propertyEditor", schema, objs)

		expect(pjs.objectHandler.objs).to.be.length 4

		[table, thead, tbody, tfoot] = ui.generatePJSTable pjs

		expect(table).to.be.exist
		expect(thead).to.be.exist

		expect(tbody).to.be.exist
		expect(tfoot).to.be.exist
		expect(tfoot.find("button.save")).to.be.length 1
		expect(tfoot.find("button.cancel")).to.be.length 1


	it "check generateEditorRow", ->
		[objs, schema] = testData.clone()
		pjs = new PJS(".propertyEditor", schema, objs)

		editor = testData.getEditors(schema.editors, ["name"])[0]

		[tr, nameCell, editorCell] = ui.generateEditorRow pjs, editor, "testgroup"

		expect(tr).to.be.exist
		expect(nameCell).to.be.exist
		expect(editorCell).to.be.exist

		expect(tr.attr("data-field")).to.be.equal editor.field
		expect(tr.hasClass("featured")).to.be.true
		expect(tr.hasClass("required")).to.be.true
		expect(tr.hasClass("readonly")).to.be.false
		expect(tr.hasClass(editor.type)).to.be.true
		expect(tr.hasClass("group-testgroup")).to.be.true

		toolTip = nameCell.find("span.toolTip")
		expect(toolTip).to.be.length 1
		expect(toolTip.attr("data-title")).to.be.equal editor.toolTip

		errorText = editorCell.find(".errors")
		expect(errorText).to.be.length 1

		hintText = editorCell.find(".hint")
		expect(hintText).to.be.length 1

		expect(editorCell.hasClass(editor.type)).to.be.true

		editor = testData.getEditors(schema.editors, ["created"])[0]
		[tr, nameCell, editorCell] = ui.generateEditorRow pjs, editor
		expect(tr.hasClass("featured")).to.be.false
		expect(tr.hasClass("required")).to.be.false
		expect(tr.hasClass("readonly")).to.be.true


	it "check generateGroupRow", ->
		[objs, schema] = testData.clone()
		pjs = new PJS(".propertyEditor", schema, objs)

		editor = testData.getEditors(schema.editors, ["body"])[0]
		editor.iconStyleClass = undefined

		[tr, nameCell] = ui.generateGroupRow pjs, editor

		expect(tr).to.be.exist
		expect(nameCell).to.be.exist

		expect(nameCell.attr("colspan")).to.be.equal "2"
		expect(nameCell.find("i")).to.be.length 0
		expect(nameCell.find("span:eq(0)").text()).to.be.equal editor.title
		expect(nameCell.find(".arrow")).to.be.length 1

		expect(tr.attr("data-field")).to.be.equal editor.field
		expect(tr.hasClass("featured")).to.be.false
		expect(tr.hasClass("required")).to.be.false
		expect(tr.hasClass("collapsed")).to.be.false
		expect(tr.hasClass(editor.type)).to.be.true
		expect(tr.hasClass("group")).to.be.true

	it "check generateGroupRow with icon", ->
		[objs, schema] = testData.clone()
		pjs = new PJS(".propertyEditor", schema, objs)

		editor = testData.getEditors(schema.editors, ["body"])[0]
		editor.iconStyleClass = "fa fa-user"

		[tr, nameCell] = ui.generateGroupRow pjs, editor

		expect(nameCell.find("i")).to.be.length 1
		expect(nameCell.find("i").attr("class")).to.be.equal editor.iconStyleClass

	it "check generateGroupRow with collapsed", ->
		[objs, schema] = testData.clone()
		pjs = new PJS(".propertyEditor", schema, objs)

		editor = testData.getEditors(schema.editors, ["body"])[0]
		editor.collapsed = true

		[tr, nameCell, editorCell] = ui.generateGroupRow pjs, editor
		expect(tr.attr("data-field")).to.be.equal editor.field
		expect(tr.hasClass("collapsed")).to.be.true
		expect(tr.hasClass("group")).to.be.true
