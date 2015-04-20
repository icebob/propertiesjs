var $, PJS, _, chai, expect, moment, sinon, sinonChai, testData;

$ = require("jquery");

_ = require("lodash");

moment = require("moment");

PJS = require("../../../src/js/propertiesJS");

testData = require("../../test-data");

chai = require("chai");

sinon = require("sinon");

sinonChai = require("sinon-chai");

expect = chai.expect;

chai.use(sinonChai);

describe("Test PJSTButtonEditor", function() {
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
  it("check PJSTButtonEditor with 1 object", function() {
    var editor, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["sendMessage", "clone", "delete"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(1);
    expect(pjs.schema).to.be.equal(schema);
    expect(pjs.editors).to.be.length(3);
    expect(pjs.changed).to.be["false"];
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("button");
    expect(input.length).to.be.equal(1);
    expect(input.hasClass("function")).to.be["true"];
    expect(input.hasClass(settings.field)).to.be["true"];
    expect(input.find("i.fa.fa-envelope")).to.be.length(1);
    expect(input.find("span")).to.be.length(1);
    expect(input.find("span").text()).to.be.equal(settings.title);
    expect(tr.find("td:eq(0)").text()).to.be.equal("");
    expect(editor.getInputValue()).to.be.unDefined;
    return expect(editor.setInputValue()).to.be.unDefined;
  });
  it("check PJSTButtonEditor with all objects", function() {
    schema.editors = testData.getEditors(schema.editors, ["sendMessage", "clone", "delete"]);
    pjs = new PJS(".propertyEditor", schema, objs);
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(4);
    expect(pjs.schema).to.be.equal(schema);
    expect(pjs.editors).to.be.length(1);
    return expect(pjs.editors[0].fieldName).to.be.equal(schema.editors[2].field);
  });
  it("check PJSTButtonEditor click", function() {
    var editor, fncClone, fncSendMessage, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["sendMessage", "clone"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(1);
    expect(pjs.schema).to.be.equal(schema);
    expect(pjs.editors).to.be.length(2);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("button");
    fncSendMessage = sinon.spy();
    _.each(objs, function(obj) {
      return obj.sendMessage = fncSendMessage;
    });
    input.click();
    expect(fncSendMessage).to.have.been.callCount(1);
    editor = pjs.editors[1];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(1)");
    input = tr.find("button");
    fncClone = sinon.spy();
    settings.onclick = fncClone;
    input.click();
    return expect(fncClone).to.have.been.callCount(1);
  });
  return it("check PJSTButtonEditor click with event emitter", function(done) {
    var editor, fncSendMessage, input, settings, tr;
    schema.editors = testData.getEditors(schema.editors, ["sendMessage", "clone"]);
    pjs = new PJS(".propertyEditor", schema, objs[0]);
    expect(pjs).to.be.exist;
    expect(pjs.objectHandler.objs).to.be.length(1);
    expect(pjs.schema).to.be.equal(schema);
    expect(pjs.editors).to.be.length(2);
    editor = pjs.editors[0];
    settings = editor.settings;
    tr = pe.find("tbody tr:eq(0)");
    input = tr.find("button");
    fncSendMessage = sinon.spy();
    pjs.on("function-sendMessage", function(_editor, _objs) {
      expect(_editor).to.be.equal(editor);
      expect(_objs[0]).to.be.equal(objs[0]);
      return done();
    });
    return input.click();
  });
});
