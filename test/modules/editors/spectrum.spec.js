var PJS, _, expect, testData;

expect = require("chai").expect;

_ = require("lodash");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

describe("Test PJSSpectrumEditor", function() {
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
  return it("check PJSSpectrumEditor with 1 object", function() {
    var editor, helper, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["backgroundColor"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs.editors).to.be.length(1);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    helper = tr.find(".helper");
    input = tr.find("input");
    expect(input.attr("type")).to.be.equal("spectrum");
    expect(helper).to.be.length(1);
    expect(tr.find(".sp-replacer")).to.be.length(1);
    expect(editor.getInputValue()).to.be.equal("rgba(128, 56, 20, 0.6)");
    editor.setInputValue("#fab000");
    return expect(editor.getInputValue()).to.be.equal("#fab000");
  });
});
