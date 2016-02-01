var PJS, expect, moment, testData;

expect = require("chai").expect;

moment = require("moment");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

describe("Test PJSTLabelEditor", function() {
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
  it("check PJSTLabelEditor with 1 object", function() {
    var editor, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["id"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(1);
    expect(pjs.schema).to.be.equal(schema);
    expect(pjs.editors).to.be.length(1);
    expect(pjs.changed).to.be["false"];
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("span");
    expect(input.length).to.be.equal(1);
    expect(input.text()).to.be.equal(objs[0][settings.field].toString());
    return expect(editor.getInputValue()).to.be.equal(objs[0][settings.field].toString());
  });
  return it("check PJSTLabelEditor with 2 object", function() {
    var editor, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["id"]);
    pjs = new PJS(".propertyEditor", schema, objs.slice(0, 2));
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(2);
    expect(pjs.editors).to.be.length(1);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("input");
    return expect(input.text()).to.be.equal("");
  });
});
