/*
* This module is in charge of handling all the preset links stored in 
* '/data/js/presets.json'.
* Exports the function .get() that returns the translated presets
*/

var QL_presets = {
    l10n: require('sdk/l10n'),
    links: JSON.parse(require('sdk/self').data.load('js/presets.json')),
    translate: function (text) {
        return QL_presets.l10n.get(text);
    },
    get: function () {
        /*
        * This translates the display_names of the links to the values found in the
        * locales. Returns the translated links.
        */
        QL_presets.links.forEach(function (preset) {
            preset.display_name = QL_presets.translate(preset.display_name);
        });
        return QL_presets.links;
    }
};

exports.get = QL_presets.get;
