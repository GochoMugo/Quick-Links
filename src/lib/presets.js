/**
 * This module is in charge of handling all the preset links stored in
 * '/data/js/presets.json'.
 * Exports the function .get() that returns the translated presets
 */


(function() {


"use strict";


// exported from module
exports = {
    get: get
};


// built-in modules
var l10n = require("sdk/l10n");
var self = require("sdk/self");


// module variables
var links = JSON.parse(self.data.load("js/presets.json"));


/**
 *
 */
function get() {

}

})();

var QL_presets = {
  l10n: require('sdk/l10n'),
  links: JSON.parse(require('sdk/self').data.load('js/presets.json')),
  translate: function (text) {
    "use strict";
    return QL_presets.l10n.get(text);
  },
  get: function () {
    "use strict";
    /*
    * This translates the display_names of the links to the values found in the
    * locales. Returns the translated links.
    */
    QL_presets.links.forEach(function(preset) {
      preset.display_name = QL_presets.translate(preset.display_name);
    });
    return QL_presets.links;
  }
};


exports.get = QL_presets.get;
