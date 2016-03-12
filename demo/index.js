var obj1, obj2, obj3, propertiesSchema, showObjects, syntaxHighlight;

propertiesSchema = {
  title: "Breaking Bad properties",
  liveEdit: true,
  editors: [
    {
      field: "id",
      title: "ID",
      type: "label",
      multiEdit: true
    }, {
      field: "name",
      title: "Name",
      type: "text",
      required: true,
      multiEdit: false,
      featured: true
    }, {
      field: "userName",
      title: "Nick name",
      type: "text",
      required: true,
      multiEdit: false,
      featured: true
    }, {
      field: "realName",
      title: "Real full name",
      toolTip: "This is the user's real born name",
      type: "text",
      required: false,
      readonly: true,
      multiEdit: false
    }, {
      field: "email",
      title: "E-mail",
      type: "email",
      required: false,
      multiEdit: false
    }, {
      field: "password",
      title: "Password",
      type: "password",
      placeHolder: "Password",
      required: true,
      multiEdit: true,
      featured: true,
      toolTip: "Enter the user's password",
      hint: "Minimum 6 characters",
      validate: function(value, objs) {
        if (value.length < 6) {
          return "Password is too short! Minimum 6 characters!";
        }
      }
    }, {
      field: "phone",
      title: "Phone",
      type: "text",
      required: false,
      multiEdit: true,
      pattern: "^[237]0/[0-9]{3}-[0-9]{4}$",
      hint: "Format: [20/30/70]000-0000"
    }, {
      field: "born",
      title: "Born",
      type: "text",
      required: false,
      multiEdit: true,
      disabled: true
    }, {
      field: "dob",
      title: "Date of birth",
      type: "date",
      format: "YYYY-MM-DD",
      required: false,
      multiEdit: true,
      validate: function(value, objs) {
        if (value === "1963-03-07") {
          return "Invalid date!";
        }
      }
    }, {
      field: "status",
      title: "Status",
      type: "boolean",
      required: true,
      "default": false,
      multiEdit: true
    }, {
      field: "avatar",
      title: "Avatar",
      type: "image",
      required: false,
      multiEdit: false
    }, {
      field: "created",
      title: "Created at",
      type: "timestamp",
      format: "YYYY-MM-DD HH:mm:ss",
      required: false,
      readonly: true
    }, {
      field: "skills",
      title: "Skills",
      type: "checklist",
      multiEdit: true,
      listBox: true,
      required: true,
      rows: 6,
      values: ["Chemist", "Teacher", "Student", "Lawyer", "Dealer", "Clever", "Unmindful", "Corrupt"]
    }, {
      type: "group",
      field: "settings",
      title: "Other settings",
      styleClass: "fa fa-group",
      collapsed: false,
      editors: [
        {
          field: "settings.isActor",
          title: "Is an actor?",
          type: "boolean",
          required: true,
          "default": false,
          multiEdit: true
        }, {
          field: "settings.themeColor",
          title: "Color of theme",
          type: "color",
          required: true,
          multiEdit: true
        }, {
          field: "settings.fontColor",
          title: "Color of text",
          type: "color",
          required: false,
          multiEdit: true
        }, {
          field: "settings.backgroundColor",
          title: "Color wih spectrum",
          type: "spectrum",
          required: false,
          multiEdit: true
        }, {
          field: "settings.motto",
          title: "Motto",
          type: "textarea",
          required: false,
          multiEdit: true,
          placeHolder: "What do you think?",
          rows: 3
        }, {
          field: "settings.nativeLang",
          title: "Native language",
          type: "select",
          required: true,
          multiEdit: true,
          values: [
            {
              id: "en",
              name: "English"
            }, {
              id: "de",
              name: "Deutsch"
            }, {
              id: "it",
              name: "Italiano"
            }, {
              id: "es",
              name: "Español"
            }, {
              id: "fr",
              name: "Français"
            }
          ]
        }
      ]
    }, {
      type: "group",
      field: "body",
      title: "Body properties",
      styleClass: "fa fa-user",
      collapsed: true,
      editors: (function(_this) {
        return function(pjs, schema, objs) {
          return [
            {
              field: "body.weight",
              title: "Body weight",
              type: "number",
              required: false,
              multiEdit: true,
              minValue: 1,
              maxValue: 200
            }, {
              field: "body.height",
              title: "Body height",
              type: "number",
              required: false,
              multiEdit: true,
              minValue: 50,
              maxValue: 250
            }, {
              field: "body.glasses",
              title: "Wear glasses",
              type: "boolean",
              required: true,
              "default": false,
              multiEdit: true
            }, {
              field: "body.foot",
              title: "Body foot",
              type: "number",
              required: false,
              multiEdit: true
            }
          ];
        };
      })(this)
    }, {
      field: "sendMessage",
      title: "Send message to user",
      styleClass: "fa fa-envelope",
      type: "button",
      multiEdit: true
    }, {
      field: "clone",
      title: "Clone user",
      styleClass: "fa fa-copy",
      type: "button",
      schemaFunction: true,
      multiEdit: false
    }, {
      field: "delete",
      title: "Delete user",
      styleClass: "fa fa-trash",
      type: "button",
      schemaFunction: true,
      multiEdit: true,
      disabled: true,
      onclick: function(objs) {
        return alert("Delete selected " + objs.length + " users");
      }
    }
  ],
  onChanged: function(editor, value, objs) {
    console.log("Field '" + editor.fieldName + "' value changed to '" + value + "'");
    return showObjects();
  }
};

obj1 = {
  id: 1,
  name: "Walter White",
  userName: "Heisenberg",
  realName: "Brian Cranston",
  email: "heisenberg@breakingbad.com",
  born: "California, USA",
  dob: "1956-03-07",
  status: true,
  avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/peterlandt/128.jpg",
  created: "2015-03-30 22:49:32",
  skills: ["Chemist", "Teacher", "Clever"],
  settings: {
    themeColor: "#fab000",
    backgroundColor: "#FF3300",
    motto: "Say my name!"
  },
  sendMessage: function() {
    return alert("Send message to Heisenberg");
  }
};

obj2 = {
  id: 2,
  name: "Jesse Pinkman",
  userName: "jessy",
  realName: "Aaron Paul",
  email: "j.pinkman@breakingbad.com",
  born: "Idaho, USA",
  dob: "1979-08-27",
  status: true,
  created: "2015-03-30 23:50:11",
  skills: ["Student", "Dealer", "Unmindful"],
  settings: {
    themeColor: "#000",
    motto: "You're my free pass...!"
  }
};

obj3 = {
  id: 3,
  name: "Saul Goodman",
  userName: "saul",
  realName: "James Morgan McGill",
  email: "saul@breakingbad.com",
  born: "Illinois, USA",
  dob: "1962-10-22",
  status: true,
  created: "2015-03-31 13:42:50",
  skills: ["Lawyer", "Clever", "Corrupt"],
  settings: {
    themeColor: "Red",
    motto: "Better call Saul!"
  }
};

showObjects = function() {
  $("#obj1 pre").html(syntaxHighlight(JSON.stringify(obj1, null, 4)));
  $("#obj2 pre").html(syntaxHighlight(JSON.stringify(obj2, null, 4)));
  return $("#obj3 pre").html(syntaxHighlight(JSON.stringify(obj3, null, 4)));
};

$(function() {
  var showEditor;
  showObjects();
  showEditor = function() {
    var objs, pjs;
    objs = [];
    if ($("#obj1 input:checked").length > 0) {
      objs.push(obj1);
    }
    if ($("#obj2 input:checked").length > 0) {
      objs.push(obj2);
    }
    if ($("#obj3 input:checked").length > 0) {
      objs.push(obj3);
    }
    pjs = new PJS(".propertyEditor", propertiesSchema, objs);
    pjs.on("changed", function(editor, value, objs) {});
    pjs.on("function-clone", function(editor, objs) {});
    return pjs.on("save", function() {
      return showObjects();
    });
  };
  showEditor();
  return $(".objects input[type=checkbox]").on("change", function() {
    return showEditor();
  });
});

syntaxHighlight = function(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    var cls;
    cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
};
