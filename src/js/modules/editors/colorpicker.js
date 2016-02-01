(function() {
  var $, PJSColorPickerEditor, PJSEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  $ = require("jquery");

  PJSEditor = require("../editor");

  module.exports = PJSColorPickerEditor = (function(superClass) {
    extend(PJSColorPickerEditor, superClass);

    function PJSColorPickerEditor() {
      return PJSColorPickerEditor.__super__.constructor.apply(this, arguments);
    }

    PJSColorPickerEditor.prototype.createInput = function() {
      var e;
      this.input = $("<input/>").attr("type", this.settings.type);
      if (this.settings.required === true) {
        this.input.attr("required", "required");
      }
      try {
        this.input.colorPicker({
          renderCallback: function(elm, toggled) {
            if (toggled === false) {
              return this.valueChanged(this.getInputValue());
            }
          }
        });
      } catch (_error) {
        e = _error;
        console.warn("Tiny color picker library is missing. Please download from http://www.dematte.at/tinyColorPicker/ and load the script in the HTML head section!");
      }
      this.input.on("change", (function(_this) {
        return function() {
          return _this.valueChanged(_this.getInputValue());
        };
      })(this));
      return this.input;
    };

    PJSColorPickerEditor.prototype.getInputValue = function() {
      return this.input.val();
    };

    PJSColorPickerEditor.prototype.setInputValue = function(newValue) {
      PJSColorPickerEditor.__super__.setInputValue.call(this, newValue);
      return this.input.val(newValue);
    };

    return PJSColorPickerEditor;

  })(PJSEditor);

}).call(this);
