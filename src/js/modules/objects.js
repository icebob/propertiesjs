(function() {
  var PJSObjectHandler, _,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require("lodash");

  module.exports = PJSObjectHandler = (function() {
    function PJSObjectHandler(objs) {
      this.objs = objs;
      this.callFunctionInObjects = bind(this.callFunctionInObjects, this);
    }

    PJSObjectHandler.prototype.setObjects = function(objs) {
      this.objs = objs;
    };

    PJSObjectHandler.prototype.getObjectValueByPath = function(o, s) {
      var a, i, k, n;
      if (s == null) {
        return;
      }
      s = s.replace(/\[(\w+)\]/g, '.$1');
      s = s.replace(/^\./, '');
      a = s.split('.');
      i = 0;
      n = a.length;
      while (i < n) {
        k = a[i];
        if (o[k] !== void 0) {
          o = o[k];
        } else {
          return null;
        }
        ++i;
      }
      return o;
    };

    PJSObjectHandler.prototype.setObjectValueByPath = function(o, s, val) {
      var a, i, k, n;
      s = s.replace(/\[(\w+)\]/g, '.$1');
      s = s.replace(/^\./, '');
      a = s.split('.');
      i = 0;
      n = a.length;
      while (i < n) {
        k = a[i];
        if (i < n - 1) {
          if (o[k] !== void 0) {
            o = o[k];
          } else {
            return;
          }
        } else {
          o[k] = val;
          return;
        }
        ++i;
      }
    };

    PJSObjectHandler.prototype.getValueFromObjects = function(field, defValue) {
      var res;
      res = null;
      _.each(this.objs, (function(_this) {
        return function(obj, i) {
          var val;
          val = _this.getObjectValueByPath(obj, field);
          if ((val == null) && _this.objs.length === 1 && (defValue != null)) {
            _this.setObjectValueByPath(obj, field, defValue);
            res = defValue;
            return false;
          }
          if (res === null) {
            res = val;
          } else {
            if ((val != null) && _.isArray(res)) {
              res = _.intersection(res, val);
            } else if (res !== val) {
              res = null;
              return false;
            }
          }
        };
      })(this));
      return res;
    };

    PJSObjectHandler.prototype.setValueToObjects = function(field, value) {
      return _.each(this.objs, (function(_this) {
        return function(obj, i) {
          _this.setObjectValueByPath(obj, field, value);
        };
      })(this));
    };

    PJSObjectHandler.prototype.hasFunctionInObjects = function(field) {
      var has;
      if ((this.objs == null) || this.objs.length === 0 || (field == null)) {
        return false;
      }
      has = true;
      _.each(this.objs, function(obj, i) {
        if (!_.isFunction(obj[field])) {
          return has = false;
        }
      });
      return has;
    };

    PJSObjectHandler.prototype.callFunctionInObjects = function(functionName) {
      return _.each(this.objs, function(obj) {
        if (obj[functionName] != null) {
          return obj[functionName](obj);
        }
      });
    };

    PJSObjectHandler.prototype.applyChanges = function(changesObject) {
      return _.each(this.objs, function(obj) {
        return _.assign(obj, changesObject);
      });
    };

    return PJSObjectHandler;

  })();

}).call(this);
