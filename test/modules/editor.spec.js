var PJS, PJSEditor, expect, testData;

expect = require("chai").expect;

PJS = require("../../src/js/propertiesJS");

PJSEditor = require("../../src/js/modules/editor");

testData = require("../test-data");

describe("Test abstract editor", function() {
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
  return describe("Test abstract editor", function() {
    it("check abstract Editor functions", function() {
      var editor, settings, tr;
      schema.editors = testData.getEditors(schema.editors, ["name"]);
      pjs = new PJS(".propertyEditor", schema, objs[0]);
      expect(pjs.objectHandler.objs).to.be.length(1);
      expect(pjs.schema).to.be.equal(schema);
      expect(pjs.editors).to.be.length(1);
      editor = pjs.editors[0];
      tr = pe.find("tbody tr:eq(0)");
      expect(editor.changed).to.be.False;
      expect(editor.errors).to.be.length(0);
      expect(editor.lastValue).to.be.unDefined;
      expect(editor.fieldName).to.be.equal(schema.editors[0].field);
      expect(editor.on).to.be.exist;
      expect(editor.off).to.be.exist;
      settings = editor.settings;
      expect(settings).to.be.equal(schema.editors[0]);
      expect(tr.find("td:eq(0)").text()).to.be.equal(editor.settings.title);
      expect(tr.hasClass("required")).to.be["true"];
      expect(tr.hasClass("featured")).to.be["true"];
      expect(tr.hasClass(settings.type)).to.be["true"];
      expect(tr.attr("data-field")).to.be.equal(settings.field);
      expect(editor.isEnabled()).to.be["true"];
      expect(editor.disable()).to.be.equal(editor);
      expect(editor.isEnabled()).to.be["false"];
      expect(editor.input.attr("disabled")).to.be.equal("disabled");
      expect(tr.hasClass("disabled")).to.be["true"];
      expect(editor.enable()).to.be.equal(editor);
      expect(editor.isEnabled()).to.be["true"];
      expect(editor.input.attr("disabled")).to.be.unDefined;
      expect(tr.hasClass("disabled")).to.be["false"];
      editor.setInputValue("123");
      expect(editor.lastValue).to.be.equal("123");
      expect(pjs.workObject[editor.fieldName]).to.be.equal(objs[0][settings.field]);
      editor.valueChanged("555");
      expect(pjs.workObject[editor.fieldName]).to.be.equal("555");
      editor.changeValue("888", false);
      expect(editor.lastValue).to.be.equal("888");
      expect(pjs.workObject[editor.fieldName]).to.be.equal(objs[0][settings.field]);
      editor.changeValue("999", true);
      expect(editor.lastValue).to.be.equal("999");
      return expect(pjs.workObject[editor.fieldName]).to.be.equal("999");
    });
    it("check editor abstract methods", function() {
      var editor;
      editor = new PJSEditor(null, schema);
      expect(function() {
        return editor.createInput();
      }).to["throw"](/Abstract/);
      return expect(function() {
        return editor.getInputValue();
      }).to["throw"](/Abstract/);
    });
    it("check schema disabled property", function() {
      var editor, tr;
      schema.editors = testData.getEditors(schema.editors, ["name"]);
      schema.editors[0].disabled = true;
      pjs = new PJS(".propertyEditor", schema, objs[0]);
      editor = pjs.editors[0];
      tr = pe.find("tbody tr:eq(0)");
      expect(editor.isEnabled()).to.be["false"];
      expect(editor.input.attr("disabled")).to.be.equal("disabled");
      return expect(tr.hasClass("disabled")).to.be["true"];
    });
    it("check editor onChanged event", function(done) {
      var editor;
      schema.editors = testData.getEditors(schema.editors, ["name"]);
      pjs = new PJS(".propertyEditor", schema, objs[0]);
      editor = pjs.editors[0];
      schema.editors[0].onChanged = function(_editor, _newValue, _obj) {
        expect(_editor).to.be.equal(editor);
        expect(_newValue).to.be.equal("111");
        expect(_obj).to.be.exist;
        expect(pjs.getObject()).to.be.equal(_obj);
        expect(_obj[editor.fieldName]).to.be.equal("111");
        return done();
      };
      return editor.valueChanged("111");
    });
    it("check schema onChanged event", function(done) {
      var editor;
      schema.editors = testData.getEditors(schema.editors, ["name"]);
      pjs = new PJS(".propertyEditor", schema, objs[0]);
      editor = pjs.editors[0];
      schema.onChanged = function(_editor, _newValue, _obj) {
        expect(_editor).to.be.equal(editor);
        expect(_newValue).to.be.equal("123");
        expect(_obj[_editor.fieldName]).to.be.equal("123");
        return done();
      };
      return editor.valueChanged("123");
    });
    it("check editor event-emitter", function(done) {
      var editor;
      schema.editors = testData.getEditors(schema.editors, ["name"]);
      pjs = new PJS(".propertyEditor", schema, objs[0]);
      editor = pjs.editors[0];
      editor.on("changed", function(_editor, _newValue, _obj) {
        expect(_editor).to.be.equal(editor);
        expect(_newValue).to.be.equal("234");
        expect(_obj[_editor.fieldName]).to.be.equal("234");
        return done();
      });
      return editor.valueChanged("234");
    });
    it("check PJS event-emitter", function(done) {
      var editor;
      schema.editors = testData.getEditors(schema.editors, ["name"]);
      pjs = new PJS(".propertyEditor", schema, objs[0]);
      editor = pjs.editors[0];
      pjs.on("changed", function(_editor, _newValue, _obj) {
        expect(_editor).to.be.equal(editor);
        expect(_newValue).to.be.equal("345");
        expect(_obj[_editor.fieldName]).to.be.equal("345");
        return done();
      });
      return editor.valueChanged("345");
    });
    it("check PJS field-changed event-emitter", function(done) {
      var editor;
      schema.editors = testData.getEditors(schema.editors, ["name"]);
      pjs = new PJS(".propertyEditor", schema, objs[0]);
      editor = pjs.editors[0];
      pjs.on(editor.fieldName + "-changed", function(_editor, _newValue, _obj) {
        expect(_editor).to.be.equal(editor);
        expect(_newValue).to.be.equal("555");
        expect(_obj[_editor.fieldName]).to.be.equal("555");
        return done();
      });
      return editor.valueChanged("555");
    });
    return it("check PJS auto disable/enable editors", function() {
      var editorActive, editorAge;
      schema.editors = testData.getEditors(schema.editors, ["age", "active"]);
      pjs = new PJS(".propertyEditor", schema, objs[0]);
      editorAge = pjs.editors[0];
      editorActive = pjs.editors[1];
      expect(editorActive.getInputValue()).to.be["true"];
      expect(editorAge.isEnabled()).to.be["false"];
      editorActive.valueChanged(false);
      expect(editorAge.isEnabled()).to.be["true"];
      editorActive.valueChanged(true);
      return expect(editorAge.isEnabled()).to.be["false"];
    });
  });
});
