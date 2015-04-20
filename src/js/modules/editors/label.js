(function() {
  var $, PJSEditor, PJSLabelEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  $ = require("jquery");

  PJSEditor = require("../editor");

  module.exports = PJSLabelEditor = (function(superClass) {
    extend(PJSLabelEditor, superClass);

    function PJSLabelEditor() {
      return PJSLabelEditor.__super__.constructor.apply(this, arguments);
    }

    PJSLabelEditor.prototype.createInput = function() {
      this.input = $("<span/>").addClass("value").attr("type", this.settings.type);
      return this.input;
    };

    PJSLabelEditor.prototype.getInputValue = function() {
      return this.input.text();
    };

    PJSLabelEditor.prototype.setInputValue = function(newValue) {
      PJSLabelEditor.__super__.setInputValue.call(this, newValue);
      return this.input.text(newValue);
    };

    return PJSLabelEditor;

  })(PJSEditor);

}).call(this);
