(function() {
  var $, PJSColorEditor, PJSEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  $ = require("jquery");

  PJSEditor = require("../editor");

  module.exports = PJSColorEditor = (function(superClass) {
    extend(PJSColorEditor, superClass);

    function PJSColorEditor() {
      return PJSColorEditor.__super__.constructor.apply(this, arguments);
    }

    PJSColorEditor.prototype.createInput = function() {
      var setHelperText;
      this.input = $("<input/>").attr("type", this.settings.type);
      if (this.settings.required === true) {
        this.input.attr("required", "required");
      }
      this.helper = $("<span/>").addClass("helper");
      setHelperText = function(value) {
        return this.helper.text(value || "");
      };
      this.input.on("change", (function(_this) {
        return function() {
          return _this.valueChanged(_this.getInputValue());
        };
      })(this));
      return [this.input, this.helper];
    };

    PJSColorEditor.prototype.getInputValue = function() {
      return this.input.val();
    };

    PJSColorEditor.prototype.setInputValue = function(newValue) {
      PJSColorEditor.__super__.setInputValue.call(this, newValue);
      this.input.val(newValue);
      return this.setHelperText();
    };

    PJSColorEditor.prototype.setHelperText = function() {
      return this.helper.text(this.lastValue);
    };

    return PJSColorEditor;

  })(PJSEditor);

}).call(this);
