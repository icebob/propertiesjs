(function() {
  var PJSBooleanEditor, PJSEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  PJSEditor = require("../editor");

  module.exports = PJSBooleanEditor = (function(superClass) {
    extend(PJSBooleanEditor, superClass);

    function PJSBooleanEditor() {
      return PJSBooleanEditor.__super__.constructor.apply(this, arguments);
    }

    PJSBooleanEditor.prototype.createInput = function() {
      this.input = $("<input/>").attr("type", "checkbox");
      if (this.settings.required === true) {
        this.input.attr("required", "required");
      }
      this.helper = $("<span/>").addClass("helper");
      this.input.on("change", (function(_this) {
        return function() {
          return _this.valueChanged(_this.getInputValue());
        };
      })(this));
      return [this.input, this.helper];
    };

    PJSBooleanEditor.prototype.getInputValue = function() {
      return this.input.prop("checked");
    };

    PJSBooleanEditor.prototype.setInputValue = function(newValue) {
      newValue = PJSBooleanEditor.__super__.setInputValue.call(this, newValue);
      this.input.prop("checked", newValue);
      this.setHelperText();
      return this;
    };

    PJSBooleanEditor.prototype.setHelperText = function() {
      var value;
      value = this.lastValue;
      if (value === true) {
        return this.helper.text(this.settings.booleanTrueText || "Yes");
      } else if (value === false) {
        return this.helper.text(this.settings.booleanFalseText || "No");
      } else {
        return this.helper.text("");
      }
    };

    return PJSBooleanEditor;

  })(PJSEditor);

}).call(this);
