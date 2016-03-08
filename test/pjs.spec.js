var PJS, expect, testData;

expect = require("chai").expect;

PJS = require("../src/js/propertiesJS");

testData = require("./test-data");

describe("Test PJS in Live mode", function() {
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
    schema.liveEdit = true;
    return pe = $(".propertyEditor");
  });
  it("check constructor", function() {
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.container).to.be.length(1);
    expect(pjs.objectHandler).to.be.exist;
    expect(pjs.objectHandler.objs).to.be["instanceof"](Array);
    expect(pjs.objectHandler.objs).to.be.length(1);
    expect(pjs.objectHandler.objs[0]).to.be.equal(objs[0]);
    expect(pjs.schema).to.be.deep.equal(schema);
    expect(pjs.editors).to.be["instanceof"](Array);
    expect(pjs.changed).to.be.False;
    expect(pjs.on).to.be.exist;
    return expect(pjs.off).to.be.exist;
  });
  it("check constructor exceptions", function() {
    expect(function() {
      return new PJS();
    }).to["throw"](/Container/);
    return expect(function() {
      return new PJS(".propertyEditor");
    }).to["throw"](/Schema/);
  });
  it("check constructor empty object", function() {
    pjs = new PJS(".propertyEditor", schema);
    return expect(pjs.objectHandler.objs).to.be.length(1);
  });
  return it("check getEditor method", function() {
    var editor;
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs.getEditor()).to.be.unDefined;
    editor = pjs.getEditor("name");
    expect(editor).to.be.exist;
    return expect(editor.settings).to.be.equal(schema.editors[1]);
  });
});

describe("Test PJS in NON Live mode", function() {
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
    schema.liveEdit = false;
    return pe = $(".propertyEditor");
  });
  it("check non live mode functions with save", function(done) {
    var editor, prevValue;
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.container).to.be.length(1);
    expect(pjs.objectHandler.objs[0]).to.be.equal(objs[0]);
    expect(pjs.schema).to.be.deep.equal(schema);
    editor = pjs.editors[1];
    prevValue = objs[0][editor.fieldName];
    editor.valueChanged("111");
    expect(objs[0][editor.fieldName]).to.be.equal(prevValue);
    expect(pjs.workObject[editor.fieldName]).to.be.equal("111");
    pjs.on("save", function(resObj) {
      expect(objs[0][editor.fieldName]).to.be.equal("111");
      expect(pjs.workObject).to.be.equal(resObj);
      return done();
    });
    return pe.find("button.save").click();
  });
  it("check non live mode functions with subeditor (body.weight) with save", function(done) {
    var editor, prevValue;
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.container).to.be.length(1);
    expect(pjs.objectHandler.objs[0]).to.be.equal(objs[0]);
    expect(pjs.schema).to.be.deep.equal(schema);
    editor = pjs.editors[11];
    prevValue = objs[0].body.weight;
    expect(pjs.workObject.body.weight).to.be.equal(prevValue);
    editor.valueChanged("123");
    expect(objs[0].body.weight).to.be.equal(prevValue);
    expect(pjs.workObject.body.weight).to.be.equal("123");
    pjs.on("save", function(resObj) {
      expect(objs[0].body.weight).to.be.equal("123");
      expect(pjs.workObject).to.be.equal(resObj);
      return done();
    });
    return pe.find("button.save").click();
  });
  it("check live mode functions with cancel", function(done) {
    var editor, prevValue;
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    editor = pjs.editors[0];
    prevValue = objs[0][editor.fieldName];
    editor.valueChanged("111");
    expect(objs[0][editor.fieldName]).to.be.equal(prevValue);
    expect(pjs.workObject[editor.fieldName]).to.be.equal("111");
    pjs.on("cancel", function() {
      expect(objs[0][editor.fieldName]).to.be.equal(prevValue);
      return done();
    });
    return pe.find("button.cancel").click();
  });
  return it("check live mode save if has validation error", function() {
    var btn, editor;
    schema.editors = testData.getEditors(schema.editors, ["name", "username"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.container).to.be.length(1);
    expect(pjs.objectHandler.objs[0]).to.be.equal(objs[0]);
    expect(pjs.schema).to.be.deep.equal(schema);
    editor = pjs.editors[1];
    btn = pe.find("button.save");
    expect(editor.changed).to.be.False;
    expect(pjs.changed).to.be.False;
    expect(pjs.checkEditorValidation()).to.be["true"];
    expect(btn.attr("disabled")).to.be.equal("disabled");
    expect(btn.hasClass("disabled")).to.be["true"];
    editor.changeValue("a");
    expect(editor.errors).to.be.length(1);
    expect(pjs.changed).to.be["false"];
    expect(editor.changed).to.be["false"];
    expect(pjs.checkEditorValidation()).to.be["false"];
    expect(btn.attr("disabled")).to.be.equal("disabled");
    expect(btn.hasClass("disabled")).to.be["true"];
    editor.changeValue("abcdefg");
    expect(editor.errors).to.be.length(0);
    expect(pjs.changed).to.be["true"];
    expect(editor.changed).to.be["true"];
    expect(pjs.checkEditorValidation()).to.be["true"];
    expect(btn.attr("disabled")).to.be.unDefined;
    return expect(btn.hasClass("disabled")).to.be["false"];
  });
});

describe("Test PJS windowTitles", function() {
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
    schema.liveEdit = true;
    schema.windowTitle = "New other title";
    schema.windowSubTitle = "This is a subtitle";
    return pe = $(".propertyEditor");
  });
  it("check title from schema", function() {
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect($(".propertyEditor").find("thead .title")).to.be.length(1);
    return expect($(".propertyEditor").find("thead .title").text()).to.be.equal("New other title");
  });
  return it("check subTitle from schema", function() {
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect($(".propertyEditor").find("thead .subTitle")).to.be.length(1);
    return expect($(".propertyEditor").find("thead .subTitle").text()).to.be.equal("This is a subtitle");
  });
});

describe("Test PJS grouping", function() {
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
  it("check group item", function() {
    var group;
    group = testData.getEditors(schema.editors, ["body"]);
    return expect(group).to.be.length(1);
  });
  return it("check group row in DOM", function() {
    var group, tr;
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    group = testData.getEditors(schema.editors, ["body"])[0];
    expect(pjs).to.be.exist;
    tr = $(".propertyEditor").find("tbody tr.group");
    expect(tr).to.be.length(1);
    return expect($(".propertyEditor").find("tbody tr.group-body")).to.be.length(group.editors.length);
  });
});

describe("Test jQuery plugin mode", function() {
  before(function() {
    return testData.createDivs(this.test.parent.title);
  });
  it("check jQuery plugin registration", function(done) {
    var editor, objs, pjs, ref, schema;
    ref = testData.clone(), objs = ref[0], schema = ref[1];
    expect(window.$.fn.propertiesJS).to.be.exist;
    window.$(".propertyEditor").propertiesJS(schema, objs[0]);
    expect(window.$(".propertyEditor tbody")).to.be.length(1);
    pjs = window.$(".propertyEditor").data("propertiesJS");
    expect(pjs).to.be.exist;
    editor = pjs.editors[0];
    pjs.on(editor.fieldName + "-changed", function(_editor, _newValue, _obj) {
      expect(_editor).to.be.equal(editor);
      expect(_newValue).to.be.equal("555");
      expect(_obj[_editor.fieldName]).to.be.equal("555");
      return done();
    });
    return editor.valueChanged("555");
  });
  return after(function() {
    return $(".propertyEditorWrapper").last().remove();
  });
});
