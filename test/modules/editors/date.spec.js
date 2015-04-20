var $, PJS, expect, moment, testData;

expect = require("chai").expect;

$ = require("jquery");

moment = require("moment");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

describe("Test PJSDateEditor", function() {
  var objs, pe, pjs, schema;
  pjs = null;
  objs = null;
  schema = null;
  pe = null;
  before(function() {
    testData.createDivs(this.test.parent.title);
    return pe = $(".propertyEditor");
  });
  beforeEach(function() {
    var ref;
    return ref = testData.clone(), objs = ref[0], schema = ref[1], ref;
  });
  it("check PJSDateEditor with 1 object", function() {
    var editor, input, s, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["dob"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(1);
    expect(pjs.schema).to.be.equal(schema);
    expect(pjs.editors).to.be.length(1);
    expect(pjs.changed).to.be["false"];
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("input");
    expect(input.length).to.be.equal(1);
    expect(input.attr("type")).to.be.equal(settings.type);
    expect(input.attr("required")).to.be.unDefined;
    expect(input.attr("placeholder")).to.be.equal(settings.placeHolder);
    expect(input.val().replace(/-/g, "")).to.be.equal(objs[0][settings.field]);
    expect(editor.getInputValue()).to.be.equal(objs[0][settings.field]);
    s = "19510203";
    editor.setInputValue(s);
    expect(editor.getInputValue()).to.be.equal(s);
    expect(editor.getMomentValue().format("YYYYMMDD")).to.be.equal(s);
    s = "19620127";
    expect(editor.changed).to.be["false"];
    editor.valueChanged(s);
    expect(editor.changed).to.be["true"];
    expect(pjs.changed).to.be["true"];
    expect(editor.lastValue).to.be.equal(s);
    expect(editor.errors).to.be.length(0);
    expect(objs[0].dob).to.be.equal(s);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("input");
    input.val("1974-12-10").change();
    expect(pjs.workObject[editor.fieldName]).to.be.equal("19741210");
    expect(editor.getInputValue()).to.be.equal("19741210");
    expect(editor.valueChanged("19630307")).to.be["false"];
    return expect(editor.errors).to.be.length(1);
  });
  return it("check PJSDateEditor with 2 object", function() {
    var editor, input, s, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["dob"]);
    pjs = new PJS(".propertyEditor", schema, objs.slice(0, 2));
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(2);
    expect(pjs.editors).to.be.length(1);
    editor = pjs.editors[0];
    settings = editor.settings;
    expect(settings).to.be.equal(schema.editors[0]);
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("input");
    expect(input.val()).to.be.unDefined;
    s = "19990316";
    editor.valueChanged(s);
    expect(objs[0][editor.fieldName]).to.be.equal(s);
    return expect(objs[1][editor.fieldName]).to.be.equal(s);
  });
});
