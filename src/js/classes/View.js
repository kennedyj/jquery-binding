/* Requires: jQBind.Model, jQBind.DOMNode */
var jQBind = jQBind || {};
jQBind.View = (function ($) {
  "use strict";

  var
    NS = "jQBindView",
    $BODY = $("body");

  /**
  * Constructor
  */

  // View
  function View(userOpts) {

    // Defaults
    var
      self = this,
      defaults = {

        // Element object. Alternatively, could pass
        // $el for the jQuery element object
        el: null,

        // Event to listen for. Triggers update
        // of all views
        evt: "change",

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
      self
        .initVars()
        .setBinds();
      console.log(self);
    }
    init();
  }

  /**
  * Static methods and properties
  */

  // Editable fields
  // NOTE: This should be pulled out and used in an 'element'
  // class of some sort
  View.editable = [
    "input",
    "textarea"
  ];

  /**
  * Proto-Instance methods and properties
  */

  // Resolve el and $el
  View.prototype.resolveEl = function () {
    this.$el = this.options.$el || $(this.options.el);
    this.el = this.$el[0];
    return this;
  };

  // Init vars
  View.prototype.initVars = function () {
    var ks;

    // Element
    this.resolveEl();

    // Booleans
    this.isEditable = View.editable.indexOf(this.el.nodeName.toLowerCase()) >= 0;

    // String values
    ks = this.$el.attr(this.options.modelAttr) || "";
    ks = ks.split(".");
    this.modelStr = ks.shift();
    this.fieldStr = ks[ks.length - 1];
    this.keyStr = ks.join(".");

    // Object values
    this.model = jQBind.Utils.getModel(this.modelStr);
    this.node = new jQBind.DOMNode({
      el: this.el
    });
    return this;
  };

  // Set binds
  View.prototype.setBinds = function () {
    var self = this;

    if (this.model) {

      // Listen to model for change
      this.model.on("change", function (evt, data) {
        self.updateEl(data[0].key, data[0].value);
      });
      if (this.isEditable) {

        // Listen to view for target event
        this.$el.on(this.options.evt, function () {
          self.updateModel();
        });
      }
    }
    return this;
  };

  // Update model
  View.prototype.updateModel = function () {
    this.model.set(this.fieldStr, this.node.getValue());
    return this;
  };

  // Update els
  View.prototype.updateEl = function (key, newVal) {
    var val = this.node.getValue();
    if (this.keyStr === key && val !== newVal) {
      this.node.setValue(newVal);
    }
    return this;
  };

  // Expose
  return View;
}(jQuery));
