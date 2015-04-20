(function() {
  var $, PJSEditor, PJSSelectEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  $ = require("jquery");

  PJSEditor = require("../editor");

  module.exports = PJSSelectEditor = (function(superClass) {
    extend(PJSSelectEditor, superClass);

    function PJSSelectEditor(PJS, settings, tr) {
      PJSSelectEditor.__super__.constructor.call(this, PJS, settings, tr);
      this.values = [];
    }

    PJSSelectEditor.prototype.createInput = function() {
      this.input = $("<select/>");
      if (this.settings.required !== true) {
        this.input.append($("<option/>").text("None"));
      }
      this.values = this.getListValues();
      _.each(this.values, (function(_this) {
        return function(option) {
          return _this.input.append($("<option/>").attr("value", typeof option === "string" ? option : option.id).text(typeof option === "string" ? option : option.name));
        };
      })(this));
      this.input.on("change", (function(_this) {
        return function() {
          return _this.valueChanged(_this.getInputValue());
        };
      })(this));
      return this.input;
    };

    PJSSelectEditor.prototype.getListValues = function() {
      if (_.isFunction(this.settings.values)) {
        return this.settings.values();
      } else if (_.isArray(this.settings.values)) {
        return [].concat(this.settings.values);
      }
    };

    PJSSelectEditor.prototype.getInputValue = function() {
      return this.input.val();
    };

    PJSSelectEditor.prototype.setInputValue = function(newValue) {
      PJSSelectEditor.__super__.setInputValue.call(this, newValue);
      return this.input.val(newValue);
    };

    PJSSelectEditor.prototype.getSelectedValueObject = function() {
      var index, value;
      value = this.getInputValue();
      index = _.findIndex(this.values, function(item) {
        if (typeof item === "string") {
          return item === value;
        } else {
          return item.id === value;
        }
      });
      if (index !== -1) {
        return this.values[index];
      } else {
        return null;
      }
    };

    return PJSSelectEditor;

  })(PJSEditor);

}).call(this);
