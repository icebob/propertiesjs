var $, PJS, expect, testData;

expect = require("chai").expect;

$ = require("jquery");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

describe("Test PJSBooleanEditor", function() {
  var objs, pe, pjs, schema;
  pjs = null;
  objs = null;
  schema = null;
  pe = null;
  before(function() {
    return testData.createDivs(this.test.parent.title);
  });
  beforeEach(function() {
    var ref;
    ref = testData.clone(), objs = ref[0], schema = ref[1];
    return pe = $(".propertyEditor");
  });
  it("check PJSBooleanEditor with 1 object", function() {
    var editor, helper, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["active"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    helper = tr.find(".helper");
    input = tr.find("input");
    expect(input.attr("type")).to.be.equal("checkbox");
    expect(input.attr("required")).to.be.equal("required");
    expect(helper).to.be.length(1);
    expect(editor.getInputValue()).to.be["true"];
    input.prop("checked", true).change();
    expect(input.prop("checked")).to.be["true"];
    expect(editor.getInputValue()).to.be["true"];
    expect(helper.text()).to.be.equal("Yes");
    expect(objs[0][editor.fieldName]).to.be["true"];
    input.prop("checked", false).change();
    expect(input.prop("checked")).to.be["false"];
    expect(editor.getInputValue()).to.be["false"];
    expect(helper.text()).to.be.equal("No");
    return expect(objs[0][editor.fieldName]).to.be["false"];
  });
  it("check PJSBooleanEditor with 2 object", function() {
    var editor, helper, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["active"]);
    pjs = new PJS(".propertyEditor", schema, objs.slice(0, 2));
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    helper = tr.find(".helper");
    input = tr.find("input");
    expect(pjs.objectHandler.objs).to.be.length(2);
    expect(editor.getInputValue()).to.be["false"];
    expect(helper.text()).to.be.equal("");
    input.prop("checked", true).change();
    expect(input.prop("checked")).to.be["true"];
    expect(editor.getInputValue()).to.be["true"];
    expect(helper.text()).to.be.equal("Yes");
    expect(objs[0][editor.fieldName]).to.be["true"];
    expect(objs[1][editor.fieldName]).to.be["true"];
    input.prop("checked", false).change();
    expect(input.prop("checked")).to.be["false"];
    expect(editor.getInputValue()).to.be["false"];
    expect(helper.text()).to.be.equal("No");
    expect(objs[0][editor.fieldName]).to.be["false"];
    return expect(objs[1][editor.fieldName]).to.be["false"];
  });
  return it("check PJSBooleanEditor with new object", function() {
    var editor, helper, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["active"]);
    pjs = new PJS(".propertyEditor", schema, null);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    helper = tr.find(".helper");
    input = tr.find("input");
    expect(pjs.objectHandler.objs).to.be.length(1);
    expect(editor.getInputValue()).to.be["true"];
    return expect(helper.text()).to.be.equal("Yes");
  });
});
