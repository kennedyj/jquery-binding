var jQBind = jQBind || {};
jQBind.Utils = (function ($) {
  "use strict";

  var NS = "jQBindUtils";

  /**
  * Constructor
  */

  // Utils
  function Utils() {}

  /**
  * Static methods and properties
  **/

  // Get model
  Utils.getModel = function (modelStr) {
    jQBind.models = jQBind.models || {};
    return jQBind.models[modelStr];
  };

  // Add model
  Utils.addModel = function (modelStr) {
    var newModel = new jQBind.Model();
    jQBind.models = jQBind.models || {};
    jQBind.models[modelStr] = newModel;
    return newModel;
  };

  /**
  * Proto-Instance methods and properties
  */

  // Expose
  return Utils;
}(jQuery));
