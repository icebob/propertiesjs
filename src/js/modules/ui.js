(function() {
  var $;

  $ = require("jquery");

  module.exports = {
    getContainer: function(c) {
      if (c != null) {
        c = typeof c === "string" ? $(c) : c;
        if (!c.hasClass("propertyEditor")) {
          c.addClass("propertyEditor");
        }
      }
      return c;
    },
    generatePJSTable: function(PJS) {
      var tables, tbody, tfoot, thead;
      thead = $("<thead/>").append($("<tr/>").append($("<th/>").append([$("<span/>").addClass("title").text(PJS.schema.windowTitle || "Properties"), $("<span/>").addClass("subTitle").text(PJS.schema.windowSubTitle || (PJS.objectHandler.objs.length + " selected object(s)"))])));
      tbody = $("<tbody/>");
      tfoot = $("<tfoot/>");
      if (PJS.liveEdit === false) {
        tfoot.append($("<tr/>").append($("<td/>").append($("<div/>").addClass("pjsButtons").append([$("<button>").addClass("save").text("Save"), $("<button>").addClass("cancel").text("Cancel")]))));
      }
      tables = [$("<table/>").append(thead), $("<table/>").append(tbody), $("<table/>").append(tfoot)];
      return [tables, thead, tbody, tfoot];
    },
    generateEditorRow: function(PJS, editor) {
      var editorCell, nameCell, tr;
      tr = $("<tr/>").attr("data-field", editor.field);
      nameCell = $("<td/>").text(editor.title);
      if (editor.toolTip != null) {
        nameCell.prepend($("<span/>").addClass("toolTip").attr("data-title", editor.toolTip));
      }
      tr.append(nameCell);
      if (editor.featured === true) {
        tr.addClass("featured");
      }
      if (editor.readonly === true) {
        tr.addClass("readonly");
      }
      if (editor.required === true) {
        tr.addClass("required");
      }
      tr.addClass(editor.type);
      editorCell = $("<td/>").addClass(editor.type).appendTo(tr);
      editorCell.append($("<div/>").addClass("errors"));
      editorCell.append($("<div/>").addClass("hint"));
      return [tr, nameCell, editorCell];
    }
  };

}).call(this);
