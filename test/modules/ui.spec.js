var $, _, chai, testData, ui;

chai = require("chai").expect;

_ = require("lodash");

$ = require("jquery");

ui = require("../../src/js/modules/ui.js");

testData = require("../test-data");


/*
chai				= require("chai")
sinon				= require "sinon"
sinonChai			= require "sinon-chai"
expect 				= chai.expect
chai.use sinonChai
 */

describe("Test UI helper methods", function() {
  var pjs;
  pjs = null;
  before(function() {
    return testData.createDivs(this.test.parent.title);
  });
  beforeEach(function() {});
  afterEach(function() {});
  it("check getContainer", function() {
    expect(ui.getContainer).to.be.Function;
    expect(ui.getContainer()).to.be.unDefined;
    expect(ui.getContainer(".propertyEditor")).to.be.Array;
    expect(ui.getContainer(".propertyEditor")).to.be.length(1);
    expect(ui.getContainer($(".propertyEditor"))).to.be.Array;
    return expect(ui.getContainer($(".propertyEditor"))).to.be.length(1);
  });
  it("check getContainer class name added", function() {
    $(".propertyEditor").removeClass().addClass("testEditor");
    expect(ui.getContainer(".testEditor")).to.be.length(1);
    return expect(ui.getContainer(".propertyEditor")).to.be.length(1);
  });
  it("check generatePJSTable", function() {
    var objs, ref, ref1, schema, table, tbody, tfoot, thead;
    ref = testData.clone(), objs = ref[0], schema = ref[1];
    pjs = new PJS(".propertyEditor", schema, objs);
    expect(pjs.objectHandler.objs).to.be.length(4);
    ref1 = ui.generatePJSTable(pjs), table = ref1[0], thead = ref1[1], tbody = ref1[2], tfoot = ref1[3];
    expect(table).to.be.exist;
    expect(thead).to.be.exist;
    expect(tbody).to.be.exist;
    return expect(tfoot).to.be.exist;
  });
  it("check generatePJSTable if no liveEdit", function() {
    var objs, ref, ref1, schema, table, tbody, tfoot, thead;
    ref = testData.clone(), objs = ref[0], schema = ref[1];
    schema.liveEdit = false;
    pjs = new PJS(".propertyEditor", schema, objs);
    expect(pjs.objectHandler.objs).to.be.length(4);
    ref1 = ui.generatePJSTable(pjs), table = ref1[0], thead = ref1[1], tbody = ref1[2], tfoot = ref1[3];
    expect(table).to.be.exist;
    expect(thead).to.be.exist;
    expect(thead.find(".title")).to.be.length(1);
    expect(thead.find(".subTitle")).to.be.length(1);
    expect(tbody).to.be.exist;
    expect(tfoot).to.be.exist;
    expect(tfoot.find("button.save")).to.be.length(1);
    return expect(tfoot.find("button.cancel")).to.be.length(1);
  });
  return it("check generateEditorRow", function() {
    var editor, editorCell, errorText, hintText, nameCell, objs, ref, ref1, ref2, schema, toolTip, tr;
    ref = testData.clone(), objs = ref[0], schema = ref[1];
    pjs = new PJS(".propertyEditor", schema, objs);
    editor = testData.getEditors(schema.editors, ["name"])[0];
    ref1 = ui.generateEditorRow(pjs, editor), tr = ref1[0], nameCell = ref1[1], editorCell = ref1[2];
    expect(tr).to.be.exist;
    expect(nameCell).to.be.exist;
    expect(editorCell).to.be.exist;
    expect(tr.attr("data-field")).to.be.equal(editor.field);
    expect(tr.hasClass("featured")).to.be["true"];
    expect(tr.hasClass("required")).to.be["true"];
    expect(tr.hasClass("readonly")).to.be["false"];
    expect(tr.hasClass(editor.type)).to.be["true"];
    toolTip = nameCell.find("span.toolTip");
    expect(toolTip).to.be.length(1);
    expect(toolTip.attr("data-title")).to.be.equal(editor.toolTip);
    errorText = editorCell.find(".errors");
    expect(errorText).to.be.length(1);
    hintText = editorCell.find(".hint");
    expect(hintText).to.be.length(1);
    expect(editorCell.hasClass(editor.type)).to.be["true"];
    editor = testData.getEditors(schema.editors, ["created"])[0];
    ref2 = ui.generateEditorRow(pjs, editor), tr = ref2[0], nameCell = ref2[1], editorCell = ref2[2];
    expect(tr.hasClass("featured")).to.be["false"];
    expect(tr.hasClass("required")).to.be["false"];
    return expect(tr.hasClass("readonly")).to.be["true"];
  });
});
