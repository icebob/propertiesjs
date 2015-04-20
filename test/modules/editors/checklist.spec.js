var $, PJS, expect, testData;

expect = require("chai").expect;

$ = require("jquery");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

describe("Test PJSCheckListEditor", function() {
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
  it("check PJSCheckListEditor with 1 object", function(done) {
    var droplist, editor, input, newVal, row, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["skills"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(1);
    expect(pjs.schema).to.be.equal(schema);
    expect(pjs.editors).to.be.length(1);
    expect(pjs.changed).to.be["false"];
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("div.checklist");
    droplist = input.find(".droplist");
    expect(input.length).to.be.equal(1);
    expect(input.find(".info").length).to.be.equal(1);
    expect(input.find(".arrow").length).to.be.equal(1);
    expect(droplist.length).to.be.equal(1);
    expect(droplist.find(".row")).to.be.length(settings.values.length);
    row = droplist.find(".row:eq(0)");
    expect(row.find("input").attr("type")).to.be.equal("checkbox");
    expect(row.find("input").attr("data-value")).to.be.equal(settings.values[0]);
    expect(row.find("label span").text()).to.be.equal(settings.values[0]);
    input.find(".info").trigger("click");
    setTimeout(function() {
      expect(droplist.is(":visible")).to.be["true"];
      input.find(".info").trigger("click");
      return setTimeout(function() {
        expect(droplist.is(":visible")).to.be["false"];
        return done();
      }, 500);
    }, 500);
    expect(editor.getInputValue()).to.be.deep.equal(objs[0][settings.field]);
    editor.setInputValue(["CSS3", "ES6"]);
    expect(editor.getInputValue()).to.be.deep.equal(["CSS3", "ES6"]);
    newVal = ["HTML5", "ReactJS"];
    expect(editor.changed).to.be["false"];
    editor.changeValue(newVal, true);
    expect(editor.changed).to.be["true"];
    expect(pjs.changed).to.be["true"];
    expect(editor.lastValue).to.be.deep.equal(newVal);
    expect(editor.errors).to.be.length(0);
    expect(objs[0][editor.fieldName]).to.be.deep.equal(newVal);
    newVal.push("Less");
    input.find("input[data-value=Less]").click();
    expect(pjs.workObject[editor.fieldName]).to.be.deep.equal(newVal);
    return expect(objs[0][editor.fieldName]).to.be.deep.equal(newVal);
  });
  return it("check PJSCheckListEditor with 2 object", function() {
    var droplist, editor, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["skills"]);
    pjs = new PJS(".propertyEditor", schema, objs.slice(0, 2));
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(2);
    expect(pjs.schema).to.be.equal(schema);
    expect(pjs.editors).to.be.length(1);
    expect(pjs.changed).to.be["false"];
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("div.checklist");
    return droplist = input.find(".droplist");
  });
});


/*
		 * should undefined if object values different
		expect(editor.getInputValue()).to.be.deep.equal ["Javascript", "AngularJS"]
		 * check objects' value
		s = "it"
		input.val(s).trigger("change")
		expect(objs[2][editor.fieldName]).to.be.equal s
		expect(objs[3][editor.fieldName]).to.be.equal s
 */
