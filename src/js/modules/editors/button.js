(function() {
  var PJSButtonEditor, PJSEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  PJSEditor = require("../editor");

  module.exports = PJSButtonEditor = (function(superClass) {
    extend(PJSButtonEditor, superClass);

    function PJSButtonEditor() {
      return PJSButtonEditor.__super__.constructor.apply(this, arguments);
    }

    PJSButtonEditor.prototype.createInput = function() {
      if (this.settings.schemaFunction === true || this.PJS.objectHandler.hasFunctionInObjects(this.settings.field)) {
        this.input = $("<button/>").addClass("function " + this.settings.field);
        if (this.settings.styleClass != null) {
          this.input.append($("<i/>").addClass(this.settings.styleClass));
        }
        this.input.append($("<span/>").text(this.settings.title));
        this.tr.find("td:eq(0)").text("");
        this.input.on("click", (function(_this) {
          return function(event) {
            if (_this.settings.schemaFunction === true) {
              if (_this.settings["onclick"]) {
                _this.settings.onclick(_this.PJS.objectHandler.objs);
              }
            } else {
              _this.PJS.objectHandler.callFunctionInObjects(_this.fieldName);
            }
            _this.PJS.emit("function-" + _this.fieldName, _this, _this.PJS.objectHandler.objs);
            event.preventDefault();
            return false;
          };
        })(this));
      }
      return this.input;
    };

    PJSButtonEditor.prototype.getInputValue = function() {};

    PJSButtonEditor.prototype.setInputValue = function(newValue) {};

    return PJSButtonEditor;

  })(PJSEditor);

}).call(this);
