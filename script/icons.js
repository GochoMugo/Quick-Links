/**
 * Generating the icons files using the FortAwesome's source code
 */


"use strict";


// npm-installed modules
var request = require("request");
var yaml = require("js-yaml");


// own modules
var presetsData = require("./presets-data");


// module variables
var iconsFileUrl = "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/src/icons.yml";


// download and read the icons definition file
function readFile(callback) {
    return request.get(iconsFileUrl, function(err, res, body) {
        if (err) {
            return callback(err);
        }
        var icons;
        try {
            icons = yaml.safeload(body);
        } catch (err) {
            return callback(err);
        }
        return callback(null, icons);
    });
}


// generate a JSON file for our use
function generatePresets(data) {
    var presets = {};
    data.icons.forEach(function(icon) {
        presets.push({
            id: icon.id,
            icon: icon.id
        });
    });
}


// process the just-generated presets
function processData(presets) {
    presets.forEach(function(preset, index) {
        var data = presetsData[preset.id];
        // ensure we have a URL
        if (!data.url) {
            return presets[index] = null;
        }
        // add all the data
        for (var key in data) {
            preset[key] = data[key];
        }
    });
    // remove nullified items
    return presets.filter(function(preset) {
        return preset.url !== undefined;
    });
}


// start working
