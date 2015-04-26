
/*
 * properties.js - Javascript properties editor for browsers
 * @version v1.1.0
 * @link https://github.com/icebob/propertiesjs
 * @license MIT
 * Copyright (c) 2015 Icebob
 */

(function() {
  var $, Emitter, PJS, PJSEditors, PJSObjectHandler, _, ui;

  $ = require("jquery");

  _ = require("lodash");

  ui = require("./modules/ui");

  Emitter = require("event-emitter");

  PJSObjectHandler = require("./modules/objects");

  PJSEditors = require("./modules/editors");

  module.exports = PJS = (function() {
    PJS.prototype.container = null;

    PJS.prototype.objectHandler = null;

    PJS.prototype.schema = null;

    PJS.prototype.editors = [];

    PJS.prototype.liveEdit = true;

    PJS.prototype.changed = false;

    PJS.prototype.workObject = null;

    function PJS(c, schema1, objs) {
      var ref, table, tbody, tfoot, thead;
      this.schema = schema1;
      this.editors = [];
      this.workObject = {};
      if (c === void 0) {
        throw new Error("Container is missing!");
      }
      if (this.schema === void 0) {
        throw new Error("Schema is missing!");
      }
      if (objs == null) {
        objs = {};
      }
      this.liveEdit = this.schema.liveEdit !== false;
      this.container = ui.getContainer(c);
      this.container.empty();
      if (!_.isArray(objs)) {
        objs = [objs];
      }
      this.objectHandler = new PJSObjectHandler(objs);
      ref = ui.generatePJSTable(this), table = ref[0], thead = ref[1], tbody = ref[2], tfoot = ref[3];
      if (this.schema.editors && this.schema.editors.length > 0) {
        $.each(this.schema.editors, (function(_this) {
          return function(i, editorSchema) {
            var EditorClass, editor, editorCell, input, nameCell, ref1, tr, value;
            if (objs.length > 1 && editorSchema.multiEdit === false) {
              return;
            }
            ref1 = ui.generateEditorRow(_this, editorSchema), tr = ref1[0], nameCell = ref1[1], editorCell = ref1[2];
            EditorClass = PJSEditors[editorSchema.type];
            if (EditorClass) {
              editor = new EditorClass(_this, editorSchema, tr, nameCell, editorCell);
              input = editor.createInput(tr);
              if (input != null) {
                if (editorSchema.type !== "button") {
                  value = _this.objectHandler.getValueFromObjects(editor.fieldName, editorSchema["default"]);
                  _this.objectHandler.setObjectValueByPath(_this.workObject, editor.fieldName, value);
                  editor.setInputValue(value);
                }
                editorCell.append(input);
                if (editorSchema.hint != null) {
                  editorCell.find(".hint").text(editorSchema.hint);
                }
                editorCell.find(".hint").insertAfter(editorCell.children().last());
                editorCell.find(".errors").insertAfter(editorCell.children().last());
                if (editorSchema.disabled === true) {
                  editor.disable();
                }
                if (_.isFunction(editorSchema.disabled)) {
                  if (editorSchema.disabled(editor, objs) === true) {
                    editor.disable();
                  }
                }
                _this.editors.push(editor);
              } else {
                return;
              }
            } else {
              console.warn("Invalid editor type: " + editorSchema.type);
            }

            /*
            				switch editor.type
            					 * Color -> spectrum
            					when "color"
            						input = $("<input/>").attr("type", "text").appendTo td
            						input.attr("required", "required") if editor.required?
            						
            						 * Helper span
            						helper = $("<span/>").addClass("helper").appendTo td
            						setHelperText = (value) -> helper.text value || ""
            						
            						 * Set value
            						value = getObjectsValue editor.field
            						input.val value
            						setHelperText value
            						
            						 * Spectrum init
            						input.spectrum
            							 * Event handlers
            							change: (color) ->
            								value = color.toHexString()
            								setHelperText color.toHexString()
            								valueChanged value
             */
            tr.appendTo(tbody);
            return true;
          };
        })(this));
      }
      if (this.liveEdit === false) {
        tfoot.find("button.save").on("click", (function(_this) {
          return function() {
            return _this.onSave();
          };
        })(this));
        tfoot.find("button.cancel").on("click", (function(_this) {
          return function() {
            return _this.onCancel();
          };
        })(this));
        this.disableControlButtons();
      }
      this.container.append(table);
      this.clearChangedFlag();
      return this;
    }

    PJS.prototype.valueChanged = function(editor, newValue) {
      this.setChangedFlag();
      this.objectHandler.setObjectValueByPath(this.workObject, editor.fieldName, newValue);
      if (this.liveEdit) {
        this.objectHandler.setValueToObjects(editor.fieldName, newValue);
      }
      if (this.schema.onChanged != null) {
        this.schema.onChanged(editor, newValue, this.workObject);
      }
      this.emit("changed", editor, newValue, this.workObject);
      this.emit(editor.fieldName + "-changed", editor, newValue, this.workObject);
      return this.checkEditorsDisable();
    };

    PJS.prototype.setChangedFlag = function() {
      this.changed = true;
      if (!this.liveEdit) {
        if (this.checkEditorValidation()) {
          return this.enableControlButtons();
        } else {
          return this.disableControlButtons();
        }
      }
    };

    PJS.prototype.disableControlButtons = function() {
      if (!this.liveEdit) {
        return this.container.find("tfoot button.save").attr("disabled", "disabled").addClass("disabled");
      }
    };

    PJS.prototype.enableControlButtons = function() {
      if (!this.liveEdit) {
        return this.container.find("tfoot button.save").removeAttr("disabled").removeClass("disabled");
      }
    };

    PJS.prototype.clearChangedFlag = function() {
      this.changed = false;
      $.each(this.editors, function(i, editor) {
        editor.changed = false;
      });
      return this.disableControlButtons();
    };

    PJS.prototype.checkEditorsDisable = function() {
      return $.each(this.editors, (function(_this) {
        return function(i, editor) {
          var newState, oldState;
          if (_.isFunction(editor.settings.disabled)) {
            oldState = !editor.isEnabled();
            newState = editor.settings.disabled(editor, _this.objectHandler.objs);
            if (newState !== oldState) {
              if (newState === true) {
                return editor.disable();
              } else {
                return editor.enable();
              }
            }
          }
        };
      })(this));
    };

    PJS.prototype.checkEditorValidation = function() {
      var res;
      res = true;
      $.each(this.editors, function(i, editor) {
        if (editor.errors.length > 0) {
          return res = false;
        }
      });
      return res;
    };

    PJS.prototype.getEditor = function(field) {
      var res;
      res = null;
      $.each(this.editors, function(i, editor) {
        if (editor.fieldName === field) {
          res = editor;
          return false;
        }
      });
      return res;
    };

    PJS.prototype.getObject = function() {
      return this.workObject;
    };

    PJS.prototype.onSave = function() {
      this.objectHandler.applyChanges(this.workObject);
      this.emit("save", this.workObject);
      return this.clearChangedFlag();
    };

    PJS.prototype.onCancel = function() {
      this.emit("cancel");
      return this.clearChangedFlag();
    };

    return PJS;

  })();

  if ((window.jQuery == null) && ($ != null)) {
    window.jQuery = $;
  }

  if (window.jQuery) {
    window.jQuery.fn.propertiesJS = function(schema, objs) {
      return $(this).each(function() {
        var pjs;
        pjs = new PJS($(this), schema, objs);
        return $(this).data("propertiesJS", pjs);
      });
    };
  }

  Emitter(PJS.prototype);

  window.PJS = PJS;

}).call(this);