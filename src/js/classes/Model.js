var jQBind = jQBind || {};
jQBind.Model = (function ($) {
  "use strict";

  var NS = "jQBindModel";
  /**
  * Model object structure
      new Model() =>
      {
        // Contains user options merged into defaults
        options: {},

        // jQuery element object stored in the shadow
        // DOM. Used purely for easy event handling
        $el: $(this.options.el),

        // Object containing model data
        values: {}
      }
  **/

  /**
  * Constructor
  */

  // Model
  function Model(userOpts) {

    // Defaults
    var
      self = this,
      defaults = {
        el: "div"
      };

    // Merge options
    function mergeOpts() {
      self.options = $.extend({}, defaults, userOpts);
    }

    // Init
    function init() {
      mergeOpts();
      self.initVars();
    }
    init();
  }

  /**
  * Proto-Instance methods and properties
  */

  // Init vars
  Model.prototype.initVars = function () {
    var opts = this.options;
    this.$el = $(opts.el);
    this.values = {};
    return this;
  };

  // Trigger
  // .trigger("eventName" [, data]) => NS + ":eventName" gets triggered
  Model.prototype.trigger = function () {
    this.$el.trigger.call(this.$el, NS + ":" + Array.prototype.shift.call(arguments), arguments);
    return this;
  };

  // Event listening "On"
  Model.prototype.on = function (ev, fn, context) {
    var self = this;
    this.$el.on(NS + ":" + ev, function () {
      fn.apply(context || self, arguments);
    });
  };

  // Get object from key-string
  // .getValueObj("key.subkey.subsub") => subkey
  // .getValueObj("key") => values
  // .getValueObj("key.unKnownKey.subsub") => undefined
  Model.prototype.getValueObj = function (keyStr, context) {
    var
      keys = (/\./g).test(keyStr) ? keyStr.split(".") : [keyStr],
      valueObj;
    context = context || this.values;

    // Return context if only one key is left
    if (keys.length === 1) {
      valueObj = context;

    // Find first key object, get new value obj
    } else {
      context = context[keys.shift()];
      valueObj = this.getValueObj(keys.join("."), context);
    }
    return valueObj;
  };

  // Get key from string
  // .getKeyFromStr("key.subkey") => "subkey"
  // .getKeyFromStr("key") = "key"
  Model.prototype.getKeyFromStr = function (keyStr) {
    return keyStr.replace(/^(.+\.)/, "");
  };

  // Get value
  Model.prototype.get = function (key) {
    var root = this.getValueObj(key);
    key = this.getKeyFromStr(key);
    return root && root[key];
  };

  // Set value
  Model.prototype.set = function (keyStr, value) {
    var
      root = this.getValueObj(keyStr),
      key = this.getKeyFromStr(keyStr);
    if (root) {
      root[key] = value;

      // Trigger change
      this.trigger("change", [{
        value: value,
        key: key,
        keyStr: keyStr
      }, this]);
      return this;
    } else {
      // Throw error
    }
  };

  // Expose
  return Model;
}(jQuery));
