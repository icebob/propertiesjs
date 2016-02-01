(function() {
  var PJSEditor, PJSLabelEditor, PJSTimestampEditor, _, moment,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  moment = require("moment");

  PJSEditor = require("../editor");

  PJSLabelEditor = require("./label");

  module.exports = PJSTimestampEditor = (function(superClass) {
    extend(PJSTimestampEditor, superClass);

    function PJSTimestampEditor() {
      return PJSTimestampEditor.__super__.constructor.apply(this, arguments);
    }

    PJSTimestampEditor.prototype.timeFormat = "LLL";

    PJSTimestampEditor.prototype.createInput = function() {
      return PJSTimestampEditor.__super__.createInput.apply(this, arguments);
    };

    PJSTimestampEditor.prototype.getInputValue = function() {
      return this.input.text();
    };

    PJSTimestampEditor.prototype.setInputValue = function(newValue) {
      PJSTimestampEditor.__super__.setInputValue.call(this, newValue);
      if (newValue != null) {
        return this.input.text(moment(newValue, this.settings.format).format(this.timeFormat));
      } else {
        return this.input.text("");
      }
    };

    return PJSTimestampEditor;

  })(PJSLabelEditor);

}).call(this);
