var PJS, _, expect, testData;

expect = require("chai").expect;

_ = require("lodash");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

describe("Test PJSImageEditor", function() {
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
  it("check DOM with 1 object", function() {
    var button, editor, input, preview, settings, tr, url;
    schema.editors = testData.getEditors(schema.editors, ["avatar"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs.editors).to.be.length(1);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("input[type=text]");
    preview = tr.find(".preview");
    button = tr.find("input[type=file]");
    expect(preview).to.be.length(1);
    expect(button).to.be.length(1);
    url = "https://s3.amazonaws.com/uifaces/faces/twitter/peterlandt/128.jpg";
    expect(input.attr("type")).to.be.equal("text");
    expect(editor.getInputValue()).to.be.equal(url);
    return expect(preview.css("background-image")).to.be.equal("url(" + url + ")");
  });
  it("check disabled preview", function() {
    var button, preview, tr;
    schema.editors = testData.getEditors(schema.editors, ["avatar"]);
    schema.editors[0].preview = false;
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    tr = pe.find("tbody tr:eq(0)");
    preview = tr.find(".preview");
    button = tr.find("input[type=file]");
    expect(preview).to.be.length(0);
    return expect(button).to.be.length(1);
  });
  return it("check disabled browse button", function() {
    var button, preview, tr;
    schema.editors = testData.getEditors(schema.editors, ["avatar"]);
    schema.editors[0].browse = false;
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    tr = pe.find("tbody tr:eq(0)");
    preview = tr.find(".preview");
    button = tr.find("input[type=file]");
    expect(preview).to.be.length(1);
    return expect(button).to.be.length(0);
  });

  /*
  	it "check browse file", ->
  		schema.editors = testData.getEditors schema.editors, ["avatar"]
  
  		pjs = new PJS ".propertyEditor", schema, objs[0] 
  
  		tr = pe.find "tbody tr:eq(0)"
  		button = tr.find "input[type=file]"
  
  		file = button[0]
  		expect(file).to.be.exists
  		file.files.push new File([], "image.jpg")
  		button.trigger("change")
   */
});
