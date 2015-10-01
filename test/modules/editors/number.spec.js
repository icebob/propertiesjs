var $, PJS, expect, testData;

expect = require("chai").expect;

$ = require("jquery");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

describe("Test PJSNumberEditor", function() {
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
  it("check minValue validator with 1 object", function() {
    var editor, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["age"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("input");
    expect(input.length).to.be.equal(1);
    expect(input.attr("min")).to.be.equal(settings.minValue.toString());
    expect(input.attr("max")).to.be.unDefined;
    expect(editor.valueChanged(60)).to.be["true"];
    expect(pjs.objectHandler.objs[0][settings.field]).to.be.a('Number');
    expect(pjs.objectHandler.objs[0][settings.field]).to.be.equal(60);
    expect(editor.valueChanged(-2)).to.be["false"];
    expect(editor.errors).to.be.length(1);
    expect(editor.valueChanged("Hello")).to.be["false"];
    expect(editor.errors).to.be.length(1);
    editor.setInputValue("4567");
    expect(editor.getInputValue()).to.be.a('Number');
    describe("Validation event", function() {
      return it("check validation-error event", function(done) {
        editor.on("validation-error", function(_editor, _value, _errors) {
          expect(_editor).to.be.equal(editor);
          expect(_value).to.be.equal(-31);
          expect(_errors).to.be.length(1);
          return done();
        });
        return expect(editor.valueChanged(-31)).to.be["false"];
      });
    });
    expect(editor.valueChanged(9999999)).to.be["true"];
    return expect(pjs.objectHandler.objs[0][settings.field]).to.be.equal(9999999);
  });
  return it("check maxValue validator with 1 object", function() {
    var editor, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["body.height"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("input");
    expect(input.length).to.be.equal(1);
    expect(input.attr("min")).to.be.equal(settings.minValue.toString());
    expect(input.attr("max")).to.be.equal(settings.maxValue.toString());
    expect(editor.valueChanged(60)).to.be["true"];
    expect(editor.errors).to.be.length(0);
    expect(editor.valueChanged(5)).to.be["false"];
    expect(editor.errors).to.be.length(1);
    expect(editor.valueChanged(268)).to.be["false"];
    expect(editor.errors).to.be.length(1);
    expect(editor.valueChanged(settings.minValue)).to.be["true"];
    expect(editor.errors).to.be.length(0);
    expect(editor.valueChanged(settings.maxValue)).to.be["true"];
    expect(editor.errors).to.be.length(0);
    input.val(111).trigger("change");
    expect(pjs.objectHandler.getObjectValueByPath(pjs.objectHandler.objs[0], editor.fieldName)).to.be.equal(111);
    return expect(pjs.objectHandler.getObjectValueByPath(pjs.objectHandler.objs[0], editor.fieldName)).to.be.a('Number');
  });
});
