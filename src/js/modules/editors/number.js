(function() {
  var PJSNumberEditor, PJSTextEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  PJSTextEditor = require("./text");

  module.exports = PJSNumberEditor = (function(superClass) {
    extend(PJSNumberEditor, superClass);

    function PJSNumberEditor() {
      return PJSNumberEditor.__super__.constructor.apply(this, arguments);
    }

    PJSNumberEditor.prototype.createInput = function() {
      PJSNumberEditor.__super__.createInput.apply(this, arguments);
      if (this.settings.minValue != null) {
        this.input.attr("min", this.settings.minValue);
      }
      if (this.settings.maxValue != null) {
        this.input.attr("max", this.settings.maxValue);
      }
      return this.input;
    };

    PJSNumberEditor.prototype.getInputValue = function() {
      return parseFloat(this.input.val());
    };

    PJSNumberEditor.prototype.innerValidate = function(value) {
      var val;
      val = parseFloat(value);
      if (isNaN(val)) {
        this.errors.push("Invalid number!");
        return false;
      }
      if ((this.settings.minValue != null) && val < this.settings.minValue) {
        this.errors.push("Number is too small! Minimum: " + this.settings.minValue);
        return false;
      }
      if ((this.settings.maxValue != null) && val > this.settings.maxValue) {
        this.errors.push("Number is too big! Maximum: " + this.settings.maxValue);
        return false;
      }
      return true;
    };

    return PJSNumberEditor;

  })(PJSTextEditor);

}).call(this);
