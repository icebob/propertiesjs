(function() {
  var PJSNumberEditor, PJSSliderEditor, _, moment,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  moment = require("moment");

  PJSNumberEditor = require("./number");

  module.exports = PJSSliderEditor = (function(superClass) {
    extend(PJSSliderEditor, superClass);

    function PJSSliderEditor() {
      return PJSSliderEditor.__super__.constructor.apply(this, arguments);
    }

    PJSSliderEditor.prototype.createInput = function() {
      PJSSliderEditor.__super__.createInput.apply(this, arguments);
      this.input.attr("type", "range");
      if (this.settings.step != null) {
        this.input.attr("step", this.settings.step);
      }
      return this.input;
    };

    return PJSSliderEditor;

  })(PJSNumberEditor);

}).call(this);
