/**
* This module is concerned with migration of users from an older version to the
* current version
*
* Copyright (c) 2014-2015 GochoMugo <mugo@forfuture.co.ke>
* See LICENSE in project root directory
*/


var QL_migration = {
  v0_0_2_to_v0_1_0: function (oldData) {
    "use strict";
    /*
    * The data for links was in two arrays. One for preset links and the other
    * for the custom links. The old link object had the following keys:
    *   1)type  2)name  3)icon  4) url  5)icon_id   6)active
    * These link objects are to be replaced with ones with following keys:
    *   1)id    2)icon  3)display_name  4)url   5)active 6)keyword(custom links)
    * All links are placed in one array
    * Checks whether there are new presets. If so, appends them to the newly
    * migrated data.
    * Arranges them alphabetically afterwards
    * If no data is passed, return an empty array
    */
    var newData = [];
    var names = [];
    if (oldData == undefined) { return newData; }
    oldData.forEach(function (group) {
      "use strict";
      group.forEach(function (oldLink) {
        var newLink = {
          "id": oldLink.name,
          "icon": oldLink.icon,
          "display_name": oldLink.name,
          "url": oldLink.url,
          "active": oldLink.active
        };
        if (oldLink.icon_id != " ") {newLink.keyword = oldLink.icon_id;}
        newData.push(newLink);
        names.push(newLink.id);
      });
    });
    packedPresets = require("./presets").get();
    packedPresets.forEach(function (preset) {
      "use strict";
      var seen = false;
      newData.forEach(function (link) {
        if (preset.id === link.id) {seen = true;}
      });
      if (!seen) {
        newData.push(preset);
        names.push(preset.id);
      }
    });
    /*Sorting then Arranging*/
    names = names.sort();
    var temp = [];
    names.forEach(function (name) {
      "use strict";
      newData.forEach(function (link) {
        if (link.id == name) {
          temp.push(link);
        }
      });
    });
    newData = temp;
    return newData;
  },
  init: function (version_info, oldContent) {
    "use strict";
    /*
    * Decides from what version to start migrating
    */
    switch (version_info) {
    case "vUnknown to v0.1.0":
      /*Earlier versions didn't register their version numbers'*/
      return QL_migration.v0_0_2_to_v0_1_0(oldContent);
    default:
      /*We just return the same data if we cant migrate it*/
     return oldContent;
    }
  }
}


exports.init = QL_migration.init;
