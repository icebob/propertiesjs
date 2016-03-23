(function() {
  window.PJSGroupStates = {};

  module.exports = {
    getGroupState: function(name, defValue) {
      if (window.PJSGroupStates[name] != null) {
        return window.PJSGroupStates[name];
      }
      return defValue;
    },
    setGroupState: function(name, state) {
      return window.PJSGroupStates[name] = state;
    }
  };

}).call(this);
