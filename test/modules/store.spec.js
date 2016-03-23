var _, chai, store;

chai = require("chai").expect;

_ = require("lodash");

store = require("../../src/js/modules/store");

describe("Test Store helper class", function() {
  before(function() {});
  beforeEach(function() {});
  afterEach(function() {});
  it("check getGroupState if value is not exists", function() {
    var name;
    name = "test-group";
    expect(store.getGroupState(name, true)).to.be["true"];
    expect(store.getGroupState(name, false)).to.be["false"];
    return expect(store.getGroupState(name)).to.be.undefined;
  });
  return it("check setGroupState", function() {
    var name;
    name = "test-group";
    store.setGroupState(name, false);
    expect(store.getGroupState(name)).to.be["false"];
    store.setGroupState(name, true);
    return expect(store.getGroupState(name)).to.be["true"];
  });
});
