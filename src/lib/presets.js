/**
 * This module is in charge of handling all the preset links stored in
 * '/data/js/presets.json'.
 * Exports the function .get() that returns the translated presets
 */


export default {
    get,
};


// built-in modules
import self from "sdk/self";


// own modules
import utils from "./utils";


// module variables
var links = JSON.parse(self.data.load("js/presets.json"));


/*
 * Return localized links
 */
function get() {
  links.forEach(function(preset) {
    preset.label = utils.localize(preset.id);
  });
  return links;
}
