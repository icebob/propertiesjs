var $, PJS, expect, moment, testData;

expect = require("chai").expect;

$ = require("jquery");

moment = require("moment");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

describe("Test PJSTimestampEditor", function() {
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
  it("check PJSTimestampEditor with 1 object", function() {
    var editor, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["created"]);
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
    expect(input.text()).to.be.equal(moment(objs[0][settings.field], settings.format).format(editor.timeFormat));
    return expect(editor.getInputValue()).to.be.equal(moment(objs[0][settings.field], settings.format).format(editor.timeFormat));
  });
  return it("check PJSTimestampEditor with 2 object", function() {
    var editor, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["created"]);
    pjs = new PJS(".propertyEditor", schema, objs.slice(0, 2));
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(2);
    expect(pjs.editors).to.be.length(1);
    editor = pjs.editors[0];
    settings = editor.settings;
    expect(settings).to.be.equal(schema.editors[0]);
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("span");
    return expect(input.text()).to.be.equal("");
  });
});
