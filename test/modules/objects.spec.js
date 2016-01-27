var PSObjectHandler, _, chai, expect, sinon, sinonChai, testData;

_ = require("lodash");

PSObjectHandler = require("../../src/js/modules/objects.js");

testData = require("../test-data");

chai = require("chai");

sinon = require("sinon");

sinonChai = require("sinon-chai");

expect = chai.expect;

chai.use(sinonChai);

describe("Test PJSObjectHandler methods", function() {
  var objectHandler, objs;
  objectHandler = null;
  objs = null;
  beforeEach(function() {
    var ref, schema;
    ref = testData.clone(), objs = ref[0], schema = ref[1];
    return objectHandler = new PSObjectHandler(objs);
  });
  it("check constructor & setObjs", function() {
    expect(objectHandler).to.be.exist;
    expect(objectHandler.objs).to.be.exist;
    expect(objectHandler.objs).to.be["instanceof"](Array);
    expect(objectHandler.objs).to.be.length(4);
    objectHandler.setObjects([objs[0], objs[2]]);
    expect(objectHandler.objs).to.be["instanceof"](Array);
    return expect(objectHandler.objs).to.be.length(2);
  });
  it("check getObjectValueByPath", function() {
    expect(objectHandler.getObjectValueByPath(objs[0], "name")).to.be.equal(objs[0].name);
    expect(objectHandler.getObjectValueByPath(objs[0], "age")).to.be.equal(objs[0].age);
    expect(objectHandler.getObjectValueByPath(objs[0], "sex")).to.be.unDefined;
    expect(objectHandler.getObjectValueByPath(objs[0], "body")).to.be.equal(objs[0].body);
    expect(objectHandler.getObjectValueByPath(objs[0], "body.weight")).to.be.equal(objs[0].body.weight);
    expect(objectHandler.getObjectValueByPath(objs[0], "body.weight.size")).to.be.unDefined;
    expect(objectHandler.getObjectValueByPath(objs[0], "bodies.weight.size")).to.be.unDefined;
    expect(objectHandler.getObjectValueByPath(objs[0], "")).to.be.unDefined;
    expect(objectHandler.getObjectValueByPath(objs[0], null)).to.be.unDefined;
    return expect(objectHandler.getObjectValueByPath(objs[0], "skills")).to.be.equal(objs[0].skills);
  });
  it("check setObjectValueByPath", function() {
    objectHandler.setObjectValueByPath(objs[0], "name", "Jack Black");
    expect(objs[0].name).to.be.equal("Jack Black");
    objectHandler.setObjectValueByPath(objs[0], "age", 44);
    expect(objs[0].age).to.be.equal(44);
    objectHandler.setObjectValueByPath(objs[0], "body.weight", 95);
    expect(objs[0].body.weight).to.be.equal(95);
    objectHandler.setObjectValueByPath(objs[0], "body", {
      weight: 76,
      height: 198
    });
    expect(objs[0].body.weight).to.be.equal(76);
    expect(objs[0].body.height).to.be.equal(198);
    objectHandler.setObjectValueByPath(objs[0], "bodies.body.weight", 100);
    expect(objs[0].bodies).to.be.unDefined;
    expect(objs[0].body.weight).to.be.equal(76);
    objectHandler.setObjectValueByPath(objs[0], "skills", ["HTML5", "CSS3"]);
    return expect(objs[0].skills).to.be.deep.equal(["HTML5", "CSS3"]);
  });
  it("check getValueFromObjects", function() {
    expect(objectHandler.getValueFromObjects("name")).to.be["null"];
    expect(objectHandler.getValueFromObjects("active")).to.be["null"];
    expect(objectHandler.getValueFromObjects("retired")).to.be["null"];
    expect(objectHandler.getValueFromObjects("body.glasses")).to.be["null"];
    expect(objectHandler.getValueFromObjects("body.height")).to.be["null"];
    expect(objectHandler.getValueFromObjects("body.foot")).to.be.equal(42);
    expect(objectHandler.getValueFromObjects("skills")).to.be["null"];
    objectHandler.setObjects([objs[0], objs[2]]);
    expect(objectHandler.getValueFromObjects("name")).to.be["null"];
    expect(objectHandler.getValueFromObjects("active")).to.be["true"];
    expect(objectHandler.getValueFromObjects("retired")).to.be["null"];
    expect(objectHandler.getValueFromObjects("body.glasses")).to.be["true"];
    expect(objectHandler.getValueFromObjects("body.height")).to.be.equal(180);
    expect(objectHandler.getValueFromObjects("body.foot")).to.be.equal(42);
    objectHandler.setObjects([objs[1]]);
    expect(objectHandler.getValueFromObjects("name")).to.be.equal(objs[1].name);
    expect(objectHandler.getValueFromObjects("active")).to.be["false"];
    expect(objectHandler.getValueFromObjects("retired")).to.be["false"];
    expect(objectHandler.getValueFromObjects("body.glasses")).to.be["false"];
    expect(objectHandler.getValueFromObjects("body.height")).to.be.equal(165);
    expect(objectHandler.getValueFromObjects("body.foot")).to.be.equal(42);
    objectHandler.setObjects([objs[0], objs[1]]);
    return expect(objectHandler.getValueFromObjects("skills")).to.be.deep.equal(["Javascript", "AngularJS"]);
  });
  it("check setValueToObjects with exist propety", function() {
    var newFoot, newName;
    newName = "Steve Douglas";
    objectHandler.setValueToObjects("name", newName);
    expect(objectHandler.getValueFromObjects("name")).to.be.equal(newName);
    _.each(objectHandler.objs, function(obj) {
      return expect(obj.name).to.be.equal(newName);
    });
    objectHandler.setValueToObjects("retired", true);
    expect(objectHandler.getValueFromObjects("retired")).to.be["true"];
    _.each(objectHandler.objs, function(obj) {
      return expect(obj.retired).to.be["true"];
    });
    newFoot = 44;
    objectHandler.setValueToObjects("body.foot", newFoot);
    expect(objectHandler.getValueFromObjects("body.foot")).to.be.equal(newFoot);
    return _.each(objectHandler.objs, function(obj) {
      return expect(obj.body.foot).to.be.equal(newFoot);
    });
  });
  it("check setValueToObjects with new property", function() {
    var newProp;
    expect(objectHandler.getValueFromObjects("body.head")).to.be["null"];
    newProp = 12;
    objectHandler.setValueToObjects("body.head", newProp);
    expect(objectHandler.getValueFromObjects("body.head")).to.be.equal(newProp);
    _.each(objectHandler.objs, function(obj) {
      return expect(obj.body.head).to.be.equal(newProp);
    });
    expect(objectHandler.getValueFromObjects("live")).to.be["null"];
    newProp = true;
    objectHandler.setValueToObjects("live", newProp);
    expect(objectHandler.getValueFromObjects("live")).to.be.equal(newProp);
    return _.each(objectHandler.objs, function(obj) {
      return expect(obj.live).to.be.equal(newProp);
    });
  });
  it("check hasFunctionInObjects", function() {
    expect(objectHandler.hasFunctionInObjects("onchanged")).to.be["false"];
    objs[2].onchanged = "Hello";
    expect(objectHandler.hasFunctionInObjects("onchanged")).to.be["false"];
    objs[2].onchanged = function() {
      return "Jim's value changed";
    };
    expect(objectHandler.hasFunctionInObjects("onchanged")).to.be["true"];
    objectHandler.setObjects([]);
    expect(objectHandler.hasFunctionInObjects("onchanged")).to.be["false"];
    objectHandler.setObjects(void 0);
    expect(objectHandler.hasFunctionInObjects("onchanged")).to.be["false"];
    return expect(objectHandler.hasFunctionInObjects()).to.be["false"];
  });
  return it("check callFunctionInObjects", function() {
    var fncSendMessage;
    fncSendMessage = sinon.spy();
    _.each(objs, function(obj) {
      return obj.sendMessage = fncSendMessage;
    });
    objectHandler.callFunctionInObjects("sendMessage");
    return expect(fncSendMessage).to.have.been.callCount(4);
  });
});
