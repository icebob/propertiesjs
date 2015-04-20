var $, PJS, expect, testData;

expect = require("chai").expect;

$ = require("jquery");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

describe("Test PJSTextAreaEditor", function() {
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
  it("check PJSTextAreaEditor with 1 object", function() {
    var editor, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["description"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(1);
    expect(pjs.schema).to.be.equal(schema);
    expect(pjs.editors).to.be.length(1);
    expect(pjs.changed).to.be["false"];
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("textarea");
    expect(input.length).to.be.equal(1);
    expect(input.attr("required")).to.be.unDefined;
    expect(input.attr("placeholder")).to.be.equal(settings.placeHolder);
    expect(input.attr("rows")).to.be.equal(settings.rows.toString());
    expect(input.val()).to.be.equal(objs[0][settings.field]);
    expect(editor.getInputValue()).to.be.equal(objs[0][settings.field]);
    editor.setInputValue("222");
    expect(editor.getInputValue()).to.be.equal("222");
    expect(editor.changed).to.be["false"];
    editor.valueChanged("123");
    expect(editor.changed).to.be["true"];
    expect(pjs.changed).to.be["true"];
    expect(editor.lastValue).to.be.equal("123");
    expect(editor.errors).to.be.length(0);
    expect(objs[0][editor.fieldName]).to.be.equal("123");
    expect(input.attr("maxlength")).to.be.equal(settings.maxLength.toString());
    input.val("First testing comment").trigger("change");
    return expect(pjs.workObject[editor.fieldName]).to.be.equal("First testing comment");
  });
  return it("check PJSTextAreaEditor with 2 object", function() {
    var editor, input, s, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["description"]);
    pjs = new PJS(".propertyEditor", schema, objs.slice(0, 2));
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(2);
    expect(pjs.editors).to.be.length(1);
    editor = pjs.editors[0];
    settings = editor.settings;
    expect(settings).to.be.equal(schema.editors[0]);
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("textarea");
    expect(input.val()).to.be.unDefined;
    s = "Second testing comment";
    editor.valueChanged(s);
    expect(objs[0][editor.fieldName]).to.be.equal(s);
    return expect(objs[1][editor.fieldName]).to.be.equal(s);
  });
});
