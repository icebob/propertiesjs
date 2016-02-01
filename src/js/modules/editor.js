(function() {
  var Emitter, PJSEditor, _;

  _ = require("lodash");

  Emitter = require("event-emitter");

  module.exports = PJSEditor = (function() {
    PJSEditor.prototype.PJS = null;

    PJSEditor.prototype.settings = null;

    PJSEditor.prototype.input = null;

    PJSEditor.prototype.changed = false;

    PJSEditor.prototype.fieldName = null;

    PJSEditor.prototype.disabled = false;

    PJSEditor.prototype.lastValue = null;

    PJSEditor.prototype.errors = [];

    function PJSEditor(PJS, settings, tr) {
      this.PJS = PJS;
      this.settings = settings;
      this.tr = tr;
      this.fieldName = this.settings.field;
      this.input = null;
      this.changed = false;
      this.errors = [];
      this.lastValue = null;
    }

    PJSEditor.prototype.createInput = function() {
      throw new Error("Abstract method!");
    };

    PJSEditor.prototype.getInputValue = function() {
      throw new Error("Abstract method!");
    };

    PJSEditor.prototype.setInputValue = function(value) {
      return this.lastValue = value;
    };

    PJSEditor.prototype.changeValue = function(value, trigger) {
      if (trigger == null) {
        trigger = true;
      }
      this.setInputValue(value);
      if (trigger === true) {
        return this.valueChanged(value);
      }
    };

    PJSEditor.prototype.cancelInputValue = function() {
      return this.setInputValue(this.lastValue);
    };

    PJSEditor.prototype.valueChanged = function(newValue) {
      if (this.validate(newValue) === true) {
        this.changed = true;
        this.PJS.valueChanged(this, newValue);
        this.doChangeEvents(newValue);
        this.lastValue = newValue;
        if (this.setHelperText) {
          this.setHelperText();
        }
        return true;
      } else {
        this.PJS.disableControlButtons();
        return false;
      }
    };

    PJSEditor.prototype.doChangeEvents = function(newValue) {
      this.emit("changed", this, newValue, this.PJS.workObject);
      if (this.settings.onChanged != null) {
        return this.settings.onChanged(this, newValue, this.PJS.workObject);
      }
    };

    PJSEditor.prototype.enable = function() {
      this.disabled = false;
      this.doEnable();
      return this;
    };

    PJSEditor.prototype.disable = function() {
      this.disabled = true;
      this.doDisable();
      return this;
    };

    PJSEditor.prototype.isEnabled = function() {
      return !this.disabled;
    };

    PJSEditor.prototype.doEnable = function() {
      var ref, ref1;
      if ((ref = this.tr) != null) {
        ref.removeClass("disabled");
      }
      return (ref1 = this.input) != null ? ref1.removeAttr("disabled") : void 0;
    };

    PJSEditor.prototype.doDisable = function() {
      var ref, ref1;
      if ((ref = this.tr) != null) {
        ref.addClass("disabled");
      }
      return (ref1 = this.input) != null ? ref1.attr("disabled", "disabled") : void 0;
    };

    PJSEditor.prototype.innerValidate = function() {
      return true;
    };

    PJSEditor.prototype.clearErrors = function() {
      this.errors = [];
      this.tr.removeClass("validation-error");
      return this.tr.find(".errors").empty();
    };

    PJSEditor.prototype.validate = function(value) {
      var errorDiv, res;
      this.clearErrors();
      if (this.innerValidate(value) === true) {
        if (this.settings.validate == null) {
          return true;
        }
        res = this.settings.validate(value, this.PJS.workObject);
        if (res === true || res === void 0 || (_.isArray(res) && res.length === 0)) {
          return true;
        } else {
          if (res === false) {
            this.errors.push("Validation error!");
          } else if (_.isArray(res)) {
            this.errors = this.errors.concat(res);
          } else {
            this.errors.push("Validation error! " + res);
          }
        }
      }
      this.emit("validation-error", this, value, this.errors);
      this.tr.addClass("validation-error");
      errorDiv = this.tr.find(".errors");
      _.each(this.errors, function(err) {
        return $("<span/>").text(err).appendTo(errorDiv);
      });
      this.tr.addClass("shake");
      setTimeout((function(_this) {
        return function() {
          return _this.tr.removeClass("shake");
        };
      })(this), 1000);
      return false;
    };

    return PJSEditor;

  })();

  Emitter(PJSEditor.prototype);

}).call(this);
