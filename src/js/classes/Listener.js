/* Requires: jQBind.Model, jQBind.Utils */
var jQBind = jQBind || {};
jQBind.Listener = (function ($) {
  "use strict";

  var
    NS = "jQBindListener",
    $BODY = $("body");

  /**
  * Constructor
  */

  // Listener
  function Listener(userOpts) {

    // Defaults
    var
      self = this,
      defaults = {

        // Event to listen for. Triggers update
        // of all views
        evt: "change",

        // Privilaged elements (editable)
        privilagedEls: [
          "input",
          "textarea"
        ],

        // Attribute that houses model key-string
        modelAttr: "data-model-field"
      };

    // Merge options
    function mergeOpts() {
      self.options = $.extend({}, defaults, userOpts);
    }

    // Init
    function init() {
      mergeOpts();
      self.initVars();
      self.setBinds();
    }
    init();
  }

  /**
  * Proto-Instance methods and properties
  */

  // Init vars
  Listener.prototype.initVars = function () {
    this.$elems = $("[" + this.options.modelAttr + "]");
    this.registerAllElems();
    return this;
  };

  // Set binds
  Listener.prototype.setBinds = function () {
    var
      self = this,
      opts = this.options,
      attrSel = "[" + opts.modelAttr + "]";
    $BODY.on(opts.evt, attrSel, function (ev) {
      if (ev.originalEvent) {
        self.update(ev.currentTarget);
      }
    });
    return this;
  };

  // Register all elements
  Listener.prototype.registerAllElems = function () {
    var self = this;
    this.registered = {};
    this.$elems.each(function (index, el) {
      self.registerElem(el);
    });
    return this;
  };

  // Register a single element
  Listener.prototype.registerElem = function (el) {
    var
      keyStr = $(el).attr(this.options.modelAttr),
      modelStr = keyStr.split(".")[0],
      utils = jQBind.Utils;

    // Create if it doesn't already exist
    this.registered[keyStr] = this.registered[keyStr] || (function () {
      var obj = {
        model: utils.getModel(modelStr),
        els: []
      };
      if (!obj.model) {
        obj.model = utils.addModel(modelStr);

        // Temporary
        obj.model.on("change", function () {
          console.log("Model change: " + modelStr, arguments[1][0]);
        });
      }
      return obj;
    }());

    // Add el
    this.registered[keyStr].els.push(el);
    return this;
  };

  // Update
  Listener.prototype.update = function (el) {
    var
      $el = $(el),
      keyStr = $el.attr(this.options.modelAttr),
      val = $el.val();

    // Update model
    this.updateModel(keyStr, val);

    // Update els
    this.updateEls(keyStr, val, el);
  };

  // Update model
  Listener.prototype.updateModel = function (keyStr, val) {
    var
      fieldStr = keyStr.replace(/^(.+\.)/, ""),
      model = this.registered[keyStr].model;
    model.set(fieldStr, val);
  };

  // Update els
  Listener.prototype.updateEls = function (keyStr, val, contextEl) {
    var
      opts = this.options,
      els = this.registered[keyStr].els,
      i = els.length,
      el;
    for (i; i; i -= 1) {
      el = els[i - 1];
      if (el !== contextEl) {
        if (opts.privilagedEls.indexOf(el.nodeName.toLowerCase()) >= 0) {
          $(el).val(val);
        } else {
          $(el).text(val);
        }
      }
    }
  };

  // Expose
  return Listener;
}(jQuery));
