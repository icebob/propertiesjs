(function() {
  var Emitter, PJS, PJSEditors, PJSObjectHandler, _, store, ui;

  _ = require("lodash");

  ui = require("./modules/ui");

  Emitter = require("event-emitter");

  PJSObjectHandler = require("./modules/objects");

  PJSEditors = require("./modules/editors");

  store = require("./modules/store");

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
        this.createEditors(this.schema.editors, objs, tbody);
      }
      if (this.liveEdit === false) {
        tfoot.find("button.save").on("click", (function(_this) {
          return function(e) {
            e.preventDefault();
            _this.onSave();
            return false;
          };
        })(this));
        tfoot.find("button.cancel").on("click", (function(_this) {
          return function(e) {
            e.preventDefault();
            _this.onCancel();
            return false;
          };
        })(this));
        this.disableControlButtons();
      }
      this.container.append(table);
      this.container.on("keydown", ":input:not(textarea)", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          return false;
        }
      });
      this.clearChangedFlag();
      return this;
    }

    PJS.prototype.createEditors = function(editors, objs, tbody, groupField) {
      return $.each(editors, (function(_this) {
        return function(i, editorSchema) {
          var EditorClass, childEditors, editor, editorCell, input, nameCell, ref, ref1, state, tr, value;
          if (editorSchema.type === "group") {
            ref = ui.generateGroupRow(_this, editorSchema, groupField), tr = ref[0], nameCell = ref[1];
            nameCell.on("click", function() {
              if (tr.hasClass("collapsed")) {
                tr.removeClass("collapsed");
                tbody.find("tr.group-" + editorSchema.field).show();
                return store.setGroupState(editorSchema.field, false);
              } else {
                tr.addClass("collapsed");
                tbody.find("tr.group-" + editorSchema.field).hide();
                return store.setGroupState(editorSchema.field, true);
              }
            });
            tr.appendTo(tbody);
            if (editorSchema.editors) {
              if (_.isFunction(editorSchema.editors)) {
                childEditors = editorSchema.editors(_this, _this.schema, objs);
              } else {
                childEditors = editorSchema.editors;
              }
              if (childEditors && childEditors.length > 0) {
                _this.createEditors(childEditors, objs, tbody, editorSchema.field);
              }
            }
            state = store.getGroupState(editorSchema.field, editorSchema.collapsed === true);
            if (state) {
              tbody.find("tr.group-" + editorSchema.field).hide();
            }
            return;
          }
          if (objs.length > 1 && editorSchema.multiEdit === false) {
            return;
          }
          ref1 = ui.generateEditorRow(_this, editorSchema, groupField), tr = ref1[0], nameCell = ref1[1], editorCell = ref1[2];
          EditorClass = PJSEditors[editorSchema.type];
          if (EditorClass) {
            editor = new EditorClass(_this, editorSchema, tr, nameCell, editorCell);
            input = editor.createInput(tr, editorCell, nameCell);
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
          tr.appendTo(tbody);
          return true;
        };
      })(this));
    };

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

  if (window.$) {
    window.$.fn.propertiesJS = function(schema, objs) {
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
