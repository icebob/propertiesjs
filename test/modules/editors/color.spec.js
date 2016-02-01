var PJS, _, expect, testData;

expect = require("chai").expect;

_ = require("lodash");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

describe("Test PJSColorEditor", function() {
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
  return it("check PJSBooleanEditor with 1 object", function() {
    var editor, helper, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["themeColor"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs.editors).to.be.length(1);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    helper = tr.find(".helper");
    input = tr.find("input");
    expect(input.attr("type")).to.be.equal("color");
    expect(helper).to.be.length(1);
    return expect(editor.getInputValue()).to.be.equal("#fab000");
  });
});
