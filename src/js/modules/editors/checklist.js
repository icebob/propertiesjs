(function() {
  var PJSCheckListEditor, PJSEditor, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  PJSEditor = require("../editor");

  module.exports = PJSCheckListEditor = (function(superClass) {
    extend(PJSCheckListEditor, superClass);

    function PJSCheckListEditor(PJS, settings, tr) {
      PJSCheckListEditor.__super__.constructor.call(this, PJS, settings, tr);
      this.values = [];
      this.selectedValues = [];
      this.dropList = null;
      this.dropListVisible = false;
      this.listBox = settings.listBox === true;
    }

    PJSCheckListEditor.prototype.createInput = function() {
      this.input = $("<div/>").append([$("<span />").addClass("info").text("0 selected"), $("<span />").addClass("arrow"), this.dropList = $("<div />").addClass("droplist")]);
      if (this.settings.rows > 0) {
        this.dropList.css("max-height", 24 * (this.settings.rows || 6) + "px");
      }
      if (this.listBox) {
        this.input.addClass("listBox");
        if (!(this.settings.rows > 0)) {
          this.input.find(".droplist").css({
            overflow: "hidden"
          });
        }
      } else {
        this.input.addClass("checklist");
      }
      this.values = this.getListValues();
      this.createDropDownList();
      this.input.find(".info, .arrow").on("click", (function(_this) {
        return function(e) {
          var offset;
          offset = $(e.target).offset();
          if (_this.dropListVisible) {
            return _this.hideDropDownList();
          } else {
            return _this.showDropDownList();
          }
        };
      })(this));
      return this.input;
    };

    PJSCheckListEditor.prototype.getListValues = function() {
      if (_.isFunction(this.settings.values)) {
        return this.settings.values();
      } else if (_.isArray(this.settings.values)) {
        return [].concat(this.settings.values);
      }
    };

    PJSCheckListEditor.prototype.createDropDownList = function() {
      this.dropList.empty();
      this.values = this.getListValues();
      _.each(this.values, (function(_this) {
        return function(option) {
          var checkbox, id, name, row, span;
          id = typeof option === "string" ? option : option.id;
          name = typeof option === "string" ? option : option.name;
          row = $("<div />").addClass("row");
          checkbox = $("<input/>", {
            type: "checkbox",
            "data-value": id
          });
          span = $("<span/>").text(name);
          $("<label/>").append([checkbox, span]).appendTo(row);
          if (_this.selectedValues.indexOf(id) !== -1) {
            row.find("input").prop("checked", true);
          }
          return row.appendTo(_this.dropList);
        };
      })(this));
      return this.dropList.find("input").on("change", (function(_this) {
        return function() {
          _this.valueChanged(_this.getInputValue());
          return _this.refreshMainText();
        };
      })(this));
    };

    PJSCheckListEditor.prototype.showDropDownList = function() {
      this.dropList.slideDown("fast");
      this.input.addClass("expanded");
      return this.dropListVisible = true;
    };

    PJSCheckListEditor.prototype.hideDropDownList = function() {
      this.dropList.slideUp("fast");
      this.input.removeClass("expanded");
      this.refreshMainText();
      return this.dropListVisible = false;
    };

    PJSCheckListEditor.prototype.refreshMainText = function() {
      var txt;
      txt = "0 selected";
      if (this.selectedValues.length === 1) {
        txt = "" + this.selectedValues[0];
      } else if (this.selectedValues.length > 1) {
        txt = this.selectedValues.length + " selected";
      }
      return this.input.find(".info").text(txt);
    };

    PJSCheckListEditor.prototype.getInputValue = function() {
      this.selectedValues = [];
      this.input.find("input").each((function(_this) {
        return function(i, item) {
          if ($(item).prop("checked")) {
            return _this.selectedValues.push($(item).attr("data-value"));
          }
        };
      })(this));
      return this.selectedValues;
    };

    PJSCheckListEditor.prototype.setInputValue = function(newValues) {
      PJSCheckListEditor.__super__.setInputValue.call(this, newValues);
      this.selectedValues = newValues || [];
      this.createDropDownList();
      return this.refreshMainText();
    };

    PJSCheckListEditor.prototype.innerValidate = function(value) {
      if (this.settings.required === true && this.selectedValues.length === 0) {
        this.errors.push("Please select an item!");
        return false;
      }
      return true;
    };

    return PJSCheckListEditor;

  })(PJSEditor);

}).call(this);
