(function() {
  var PJSEditor, PJSTextAreaEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  PJSEditor = require("../editor");

  module.exports = PJSTextAreaEditor = (function(superClass) {
    extend(PJSTextAreaEditor, superClass);

    function PJSTextAreaEditor() {
      return PJSTextAreaEditor.__super__.constructor.apply(this, arguments);
    }

    PJSTextAreaEditor.prototype.createInput = function() {
      this.input = $("<textarea/>");
      if (this.settings.placeHolder != null) {
        this.input.attr("placeholder", this.settings.placeHolder);
      }
      if (this.settings.required === true) {
        this.input.attr("required", "required");
      }
      if ((this.settings.maxLength != null) && this.settings.maxLength > 0) {
        this.input.attr("maxlength", this.settings.maxLength);
      }
      if (this.settings.rows != null) {
        this.input.attr("rows", this.settings.rows);
      }
      this.input.on("change", (function(_this) {
        return function() {
          return _this.valueChanged(_this.getInputValue());
        };
      })(this));
      return this.input;
    };

    PJSTextAreaEditor.prototype.getInputValue = function() {
      return this.input.val();
    };

    PJSTextAreaEditor.prototype.setInputValue = function(newValue) {
      newValue = PJSTextAreaEditor.__super__.setInputValue.call(this, newValue);
      return this.input.val(newValue);
    };

    return PJSTextAreaEditor;

  })(PJSEditor);

}).call(this);
