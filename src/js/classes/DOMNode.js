var jQBind = jQBind || {};
jQBind.DOMNode = (function ($) {
  "use strict";

  // Constructor
  function DOMNode(opts) {
    var
      self = this,
      defaults = {};

    // Init vars
    function initVars() {
      self.options = $.extend({}, defaults, opts);
      self.config = self.options.config;
      self.el = self.options.el;
      self.$el = $(self.el);
      self.isEditable = [
        "input",
        "select",
        "textarea"
      ].indexOf(self.el.nodeName.toLowerCase()) >= 0;
      self.type = self.getElemType();
      self.resetValue = ["radio", "select"].indexOf(self.type) >= 0 ? "null" : "";
    }

    // Init
    function init() {
      initVars();
    }
    init();
  }

  /**
  * Instance methods and properties
  */

  // Get elem type
  DOMNode.prototype.getElemType = function () {
    var type = this.el.nodeName.toLowerCase();
    if (type === "input") {
      type = this.$el.prop("type");
    }
    return type;
  };

  // Reset form elem
  DOMNode.prototype.reset = function () {
    this.setValue(this.resetValue);
    return this;
  };

  // Get name
  DOMNode.prototype.getName = function () {
    return this.$el.attr("name");
  };

  // Get value
  DOMNode.prototype.getValue = function () {
    var
      $el = this.$el,
      val = $el.val(),
      $form;

    // Radio inputs
    if (this.type === "radio") {
      $form = $el.parents("form") || $el.parents("body");
      if ($form.length) {
        $el = $form.find("[type='radio'][name='" + $el.attr("name") + "']:checked");
        if ($el.length) {
          val = $el.val();
        } else {
          val = "";
        }
      }
    }
    return val;
  };

  // Set value
  DOMNode.prototype.setValue = function (v) {
    var
      $el = this.$el,
      $elVal,
      $els,
      type = this.type,
      $form;

    // Radio
    if (type === "radio") {
      $form = $el.parents("form");
      if ($form.length) {
        $els = $form.find("[type='radio'][name='" + $el.attr("name") + "']");
        if (!!v) {
          $els.each(function () {
            var $this = $(this);
            if ($this.val() === v) {
              $this.attr("checked", "checked");
            } else {
              $this.removeAttr("checked");
            }
          });
        }
      }

    // Select
    } else if (type === "select" && v === "null") {
      v = $el.find("option:first").val();
      $el.val(v);
    } else if (this.isEditable) {
      $el.val(v);
    } else {
      $el.text(v);
    }
    return this;
  };

  return DOMNode;
}(jQuery));
