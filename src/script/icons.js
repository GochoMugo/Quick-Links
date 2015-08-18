/**
 * Generating the icons files using the FortAwesome's source code
 */


/* eslint-env node */

// built-in modules
import fs from "fs";
import path from "path";


// npm-installed modules
import out from "cli-output";
import request from "request";
import yaml from "js-yaml";


// module variables
var iconsFileUrl = "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/src/icons.yml";
let data;


// read our defintion file
try {
  data = readYamlFile(path.join(__dirname, "presets-definition.yml"));
} catch(err) {
  out.error("errored reading presets definition file");
  throw err;
}


function readYamlFile(filepath) {
  return yaml.safeLoad(fs.readFileSync(filepath));
}


function getIcons(callback) {
  out.info("downloading icons definition file from github");
  return request.get(iconsFileUrl, function(getErr, res, body) {
    if (getErr) {
      out.error("errored while downloading");
      return callback(getErr);
    }

    let icons;

    try {
      icons = yaml.safeLoad(body).icons;
    } catch (err) {
      out.error("errored while parsing the definition file");
      return callback(err);
    }

    fs.writeFile("all.json", JSON.stringify(icons, null, "  "), function(err) {
      if (err) {
        out.error("errored writing file with all icons");
        return callback(err);
      }
      return callback(null, icons);
    });
  });
}


function parseIcons(icons) {
  out.info("parsing icons");
  let presets = {
    brand: [],
    custom: [],
  };
  let raw = {
    brand: [],
    custom: [],
  };

  icons.forEach(function(icon) {
    if (icon.categories.indexOf("Brand Icons") > -1) {
      raw.brand.push(icon);
    } else if (data.custom[icon.id]) {
      raw.custom.push(icon);
    }
  });

  try {
    fs.writeFileSync("brand-icons.json", JSON.stringify(raw.brand, null, "  "));
  } catch(err1) {
    out.error("could not write all brand icons");
  }

  raw.brand.forEach(function(icon) {
    let iconData = data.brand[icon.id];

    if (!iconData) {
      return;
    }

    presets.brand.push({
        id: icon.id,
        name: iconData.name,
        url: iconData.url,
    });
  });

  raw.custom.forEach(function(icon) {
    let iconData = data.custom[icon.id];
    presets.push();
  });

  out.info(`${brandIcons.length} available brand icons`);
  out.info(`${presets.length} available preset icons`);

  return presets;
}


function generatePresets(presets, callback) {
  out.info("generating presets");
  presets.forEach(function(preset, index) {
    let iconData = data[preset.id];
    // ensure we have a URL
    if (!iconData.url) {
        presets[index] = null;
        return;
    }
    // add all the data
    for (let key in iconData) {
        preset[key] = iconData[key];
    }
  });
  // remove nullified items
  presets = presets.filter(function(preset) {
      return preset.url !== null;
  });
  fs.writeFile("presets.json", JSON.stringify(presets, null, "  "), function(err) {
    if (err) {
      out.error("errored writing presets file");
      return callback(err);
    }
    return callback(null, presets);
  });
}


// start working
out.info("starting...");
getIcons((err, icons) => {
  if (err) {
    throw err;
  }
  generatePresets(parseIcons(icons), function(err2) {
    if (err2) {
      throw err2;
    }
    out.success("completed!");
  });
});
