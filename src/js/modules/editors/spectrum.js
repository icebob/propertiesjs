(function() {
  var PJSEditor, PJSSpectrumEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  PJSEditor = require("../editor");

  module.exports = PJSSpectrumEditor = (function(superClass) {
    extend(PJSSpectrumEditor, superClass);

    function PJSSpectrumEditor() {
      return PJSSpectrumEditor.__super__.constructor.apply(this, arguments);
    }

    PJSSpectrumEditor.prototype.createInput = function(tr, editorCell, nameCell) {
      var e, setHelperText;
      this.input = $("<input/>").attr("type", this.settings.type);
      if (this.settings.required === true) {
        this.input.attr("required", "required");
      }
      editorCell.append(this.input);
      this.helper = $("<span/>").addClass("helper");
      setHelperText = function(value) {
        return this.helper.text(value || "");
      };
      editorCell.append(this.helper);
      try {
        this.input.spectrum({
          showInput: true,
          showAlpha: true,
          allowEmpty: !this.settings.required,
          preferredFormat: "hex",
          change: (function(_this) {
            return function(color) {
              var value;
              console.log(color);
              if (color != null) {
                value = color.toRgbString();
              } else {
                value = null;
              }
              return _this.valueChanged(value);
            };
          })(this)
        });
      } catch (_error) {
        e = _error;
        console.warn("Spectrum color library is missing. Please download from http://bgrins.github.io/spectrum/ and load the script in the HTML head section!");
      }
      return [];
    };

    PJSSpectrumEditor.prototype.getInputValue = function() {
      return this.lastValue;
    };

    PJSSpectrumEditor.prototype.setInputValue = function(newValue) {
      newValue = PJSSpectrumEditor.__super__.setInputValue.call(this, newValue);
      if (this.input.spectrum != null) {
        this.input.spectrum("set", newValue);
      }
      return this.setHelperText();
    };

    PJSSpectrumEditor.prototype.setHelperText = function() {
      return this.helper.text(this.lastValue);
    };

    return PJSSpectrumEditor;

  })(PJSEditor);

}).call(this);
