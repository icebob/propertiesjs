var $, PJS, expect, testData;

expect = require("chai").expect;

$ = require("jquery");

PJS = require("../../src/js/propertiesJS");

testData = require("../test-data");

describe("Test editor defaults", function() {
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
  return describe("Test default values", function() {
    return it("check Editor default values", function() {
      var editor, obj;
      obj = {};
      pjs = new PJS(".propertyEditor", schema, obj);
      expect(pjs.objectHandler.objs).to.be.length(1);
      expect(pjs.schema).to.be.equal(schema);
      editor = pjs.editors[1];
      expect(editor.settings["default"]).to.be.exist;
      return expect(obj.name).to.be.equal(editor.settings["default"]);
    });
  });
});
