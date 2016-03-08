(function() {
  var PJSEditor, PJSImageEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  PJSEditor = require("../editor");

  module.exports = PJSImageEditor = (function(superClass) {
    extend(PJSImageEditor, superClass);

    function PJSImageEditor() {
      return PJSImageEditor.__super__.constructor.apply(this, arguments);
    }

    PJSImageEditor.prototype.createInput = function() {
      this.input = $("<input/>").attr("type", "text");
      if (this.settings.required === true) {
        this.input.attr("required", "required");
      }
      if (this.settings.browse !== false) {
        this.fileInput = $("<input />").attr("type", "file").on("change", (function(_this) {
          return function(event) {
            var reader;
            reader = new FileReader();
            reader.onload = function(e) {
              _this.setInputValue(e.target.result);
              return _this.valueChanged(e.target.result);
            };
            if (event.target.files && event.target.files.length > 0) {
              console.log(event.target.files[0]);
              return reader.readAsDataURL(event.target.files[0]);
            }
          };
        })(this));
      }
      if (this.settings.preview !== false) {
        this.preview = $("<div/>").addClass("preview");
      }
      this.input.on("change", (function(_this) {
        return function() {
          _this.valueChanged(_this.getInputValue());
          return _this.setPreview(_this.getInputValue());
        };
      })(this));
      return [this.input, this.fileInput, this.preview];
    };

    PJSImageEditor.prototype.getInputValue = function() {
      return this.input.val();
    };

    PJSImageEditor.prototype.setInputValue = function(newValue) {
      newValue = PJSImageEditor.__super__.setInputValue.call(this, newValue);
      this.input.val(newValue);
      return this.setPreview(newValue);
    };

    PJSImageEditor.prototype.setPreview = function(val) {
      if (this.settings.preview !== false) {
        if (val != null) {
          return this.preview.css({
            "background-image": 'url(' + val + ')'
          });
        }
      }
    };

    return PJSImageEditor;

  })(PJSEditor);

}).call(this);
