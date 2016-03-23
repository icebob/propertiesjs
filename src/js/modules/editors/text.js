(function() {
  var PJSEditor, PJSTextEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  PJSEditor = require("../editor");

  module.exports = PJSTextEditor = (function(superClass) {
    extend(PJSTextEditor, superClass);

    function PJSTextEditor() {
      return PJSTextEditor.__super__.constructor.apply(this, arguments);
    }

    PJSTextEditor.prototype.createInput = function() {
      this.input = $("<input/>").attr("type", this.settings.type);
      if (this.settings.placeHolder != null) {
        this.input.attr("placeholder", this.settings.placeHolder);
      }
      if (this.settings.required === true) {
        this.input.attr("required", "required");
      }
      if (this.settings.readonly === true) {
        this.input.attr("readonly", "readonly");
      }
      if ((this.settings.maxLength != null) && this.settings.maxLength > 0) {
        this.input.attr("maxlength", this.settings.maxLength);
      }
      if (this.settings.pattern != null) {
        this.input.attr("pattern", this.settings.pattern);
      }
      this.input.on("change", (function(_this) {
        return function() {
          return _this.valueChanged(_this.getInputValue());
        };
      })(this));
      this.input.on("keydown", (function(_this) {
        return function(event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            _this.input.trigger("change");
            return false;
          }
        };
      })(this));
      return this.input;
    };

    PJSTextEditor.prototype.getInputValue = function() {
      return this.input.val();
    };

    PJSTextEditor.prototype.setInputValue = function(newValue) {
      newValue = PJSTextEditor.__super__.setInputValue.call(this, newValue);
      return this.input.val(newValue);
    };

    PJSTextEditor.prototype.innerValidate = function(value) {
      var re;
      if (this.settings.required !== true && value === "") {
        return true;
      }
      if (this.settings.pattern != null) {
        re = new RegExp(this.settings.pattern);
        if (!re.test(value)) {
          this.errors.push("Not valid format!");
          return false;
        }
      }
      return true;
    };

    return PJSTextEditor;

  })(PJSEditor);

}).call(this);
