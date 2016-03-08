var _;

_ = require("lodash");

module.exports.schema = {
  windowTitle: "Properties Editor",
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
      placeHolder: "Enter full name",
      required: true,
      multiEdit: true,
      featured: true,
      toolTip: "Enter the user's full name",
      "default": "Steve"
    }, {
      field: "username",
      title: "Nick name",
      type: "text",
      required: true,
      multiEdit: false,
      featured: true,
      maxLength: 50,
      validate: function(value, objs) {
        var res;
        res = [];
        if (/\s/.test(value)) {
          res.push("Invalid username!");
        }
        if (value.length < 6) {
          res.push("Username is too short! Minimum 6 characters!");
        }
        return res;
      }
    }, {
      field: "email",
      title: "E-mail",
      type: "email",
      required: false,
      multiEdit: false,
      validate: function(value, objs) {
        if (!/@/.test(value)) {
          return "Invalid email address";
        }
        if (value.length < 4) {
          return false;
        }
      }
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
      hint: "Format: [20/30/70]-000-0000"
    }, {
      field: "age",
      title: "Age",
      type: "number",
      required: false,
      multiEdit: true,
      minValue: 0,
      maxValue: null,
      disabled: function(editor, objs) {
        return objs[0].active;
      }
    }, {
      field: "dob",
      title: "Date of birth",
      type: "date",
      placeHolder: "Date of birth",
      format: "YYYYMMDD",
      required: false,
      multiEdit: true,
      validate: function(value, objs) {
        if (value === "19630307") {
          return "Invalid date!";
        }
      },
      onChanged: function(editor, value, workObject) {
        var age, ageEditor;
        age = new Date().getFullYear() - parseInt(value.substring(0, 4), 10);
        ageEditor = editor.PJS.getEditor("age");
        if (ageEditor != null) {
          return ageEditor.changeValue(age, true);
        }
      }
    }, {
      field: "active",
      title: "Active",
      type: "boolean",
      required: true,
      "default": true,
      multiEdit: true
    }, {
      field: "avatar",
      title: "Avatar",
      type: "image",
      required: false,
      multiEdit: false,
      preview: true,
      browse: true
    }, {
      field: "retired",
      title: "Retired",
      type: "boolean",
      required: true,
      "default": false,
      multiEdit: true
    }, {
      type: "group",
      field: "body",
      title: "Body properties",
      editors: [
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
      ]
    }, {
      field: "themeColor",
      title: "Theme color",
      type: "color"
    }, {
      field: "backgroundColor",
      title: "Background color",
      type: "spectrum"
    }, {
      field: "description",
      title: "Description",
      type: "textarea",
      required: false,
      multiEdit: true,
      placeHolder: "Your comment",
      maxLength: 500,
      rows: 3
    }, {
      field: "ratings",
      title: "Ratings",
      type: "slider",
      required: false,
      multiEdit: true,
      "default": 1,
      minValue: 1,
      maxValue: 5,
      step: 1
    }, {
      field: "nativeLang",
      title: "Native language",
      type: "select",
      required: true,
      multiEdit: true,
      "default": "de",
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
    }, {
      field: "sex",
      title: "Male/female",
      type: "select",
      required: false,
      multiEdit: true,
      values: ["Male", "Female"]
    }, {
      field: "skills",
      title: "Skills",
      type: "checklist",
      multiEdit: true,
      values: ["HTML5", "CSS3", "Javascript", "ES6", "Coffeescript", "ReactJS", "AngularJS", "SASS/SCSS", "Less"]
    }, {
      field: "favoriteMovie",
      title: "Favorite movie",
      type: "select",
      required: false,
      multiEdit: true,
      values: function() {
        return [
          {
            id: 1,
            name: "Matrix"
          }, {
            id: 2,
            name: "Inception"
          }, {
            id: 3,
            name: "Kill Bill"
          }, {
            id: 4,
            name: "Mission Impossible"
          }, {
            id: 5,
            name: "Interstellar"
          }
        ];
      }
    }, {
      field: "distance",
      title: "Distance",
      type: "text",
      readonly: true
    }, {
      field: "created",
      title: "Created at",
      type: "timestamp",
      format: "YYYYMMDD HHNNSS",
      multiEdit: true,
      readonly: true
    }, {
      field: "sendMessage",
      title: "Send message to user",
      styleClass: "fa fa-envelope",
      type: "button",
      multiEdit: true,
      disabled: function(editor, objs) {
        return !objs[0].active;
      }
    }, {
      field: "clone",
      title: "Clone user",
      styleClass: "fa fa-copy",
      type: "button",
      schemaFunction: true,
      multiEdit: false,
      onclick: function(objs) {
        return alert("Clone selected " + objs.length + " users");
      }
    }, {
      field: "delete",
      title: "Delete user",
      styleClass: "fa fa-trash",
      type: "button",
      schemaFunction: true,
      multiEdit: true,
      onclick: function(objs) {
        return alert("Delete selected " + objs.length + " users");
      }
    }
  ]
};

module.exports.objects = [
  {
    id: 1,
    name: "John Doe",
    username: "john79",
    email: "john79@gmail.com",
    age: 36,
    dob: "19790522",
    active: true,
    retired: false,
    created: "20150411 150530",
    body: {
      weight: 72,
      height: 180,
      glasses: true,
      foot: 42
    },
    description: "First user",
    ratings: 5,
    nativeLang: "en",
    sex: "Male",
    avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/peterlandt/128.jpg",
    skills: ["Javascript", "Coffeescript", "AngularJS"],
    themeColor: "#fab000",
    backgroundColor: "rgba(128, 56, 20, 0.6)",
    onchanged: function() {
      return console.log("John's value changed");
    },
    sendMessage: function(obj) {
      return console.log("Sent message to " + obj.name);
    }
  }, {
    id: 2,
    name: "Michael Smith",
    username: "michael88",
    email: "michael88@gmail.com",
    age: 27,
    dob: "19880127",
    active: false,
    retired: false,
    created: "20150411 150535",
    body: {
      weight: 64,
      height: 165,
      glasses: false,
      foot: 42
    },
    ratings: 3,
    nativeLang: "de",
    sex: "Male",
    skills: ["Javascript", "AngularJS", "ReactJS"],
    themeColor: "#FF00F0",
    onchanged: function() {
      return console.log("Michael's value changed");
    }
  }, {
    id: 3,
    name: "Jim Beam",
    username: "jimmy.bean",
    email: "jimmy.bean@gmail.com",
    age: 61,
    dob: "19541204",
    active: true,
    retired: true,
    created: "20150319 063320",
    body: {
      weight: 88,
      height: 180,
      glasses: true,
      foot: 42
    },
    description: "Last user",
    ratings: 5,
    nativeLang: "en",
    sex: "Male"
  }, {
    id: 4,
    name: "Sarah Cooper",
    username: "sarah77",
    email: "sarah77@gmail.com",
    age: 38,
    dob: "19770921",
    active: true,
    retired: false,
    created: "20150410 123430",
    body: {
      weight: 57,
      height: 171,
      glasses: false,
      foot: 42
    },
    description: "Woman",
    ratings: 1,
    nativeLang: "de",
    sex: "Female",
    onchanged: function() {
      return console.log("Sarah's value changed");
    }
  }
];

module.exports.clone = function() {
  return [_.cloneDeep(module.exports.objects), _.cloneDeep(module.exports.schema)];
};

module.exports.createDivs = function(title) {
  console.log("Running " + title + "...");
  $(".propertyEditor").removeClass().addClass("propertyEditorOld");
  return $("<div />").addClass("propertyEditorWrapper").append($("<div />").addClass("title").text(title), $("<div />").addClass("propertyEditor")).appendTo($("body"));
};

module.exports.getEditors = function(editors, fields) {
  var res;
  res = [];
  _.each(editors, function(v) {
    var subRes;
    if (fields.indexOf(v.field) !== -1) {
      res.push(v);
    }
    if (v.type === "group") {
      subRes = module.exports.getEditors(v.editors, fields);
      res = res.concat(subRes);
    }
  });
  return res;
};
