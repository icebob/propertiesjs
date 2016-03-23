chai				= require("chai").expect
_	 				= require "lodash"
store				= require "../../src/js/modules/store"

describe "Test Store helper class", ->

	before -> 

	beforeEach ->

	afterEach -> 


	it "check getGroupState if value is not exists", ->
		name = "test-group"

		expect(store.getGroupState(name, true)).to.be.true
		expect(store.getGroupState(name, false)).to.be.false
		expect(store.getGroupState(name)).to.be.undefined

	it "check setGroupState", ->
		name = "test-group"

		store.setGroupState name, false
		expect(store.getGroupState(name)).to.be.false

		store.setGroupState name, true
		expect(store.getGroupState(name)).to.be.true
