/*HANDLES LINKS ON THE ADDON BAR*/
var QL_obj = {
  add: function (icon_class, url, id) {
    "use strict";
    /*
    * Adds links to the addon bar
    */
    var create = function (el) { document.createElement(el); };
    var span = create("span");
    var icon = create("i");
    // Styling the Icon
    icon.className = "fa " + icon_class + " icon";
    icon.id = url;
    // Adding text and styling the id next to the Icon
    $(span).text(id);
    // Prepending it to the Container to appear in the Bar
    $("#holder").prepend("&middot;", icon, span);
    return;
  },
  init: function (array) { 
    "use strict";
    /*
    * INITIALIZER.
    * 1. Empty the Holder in addonbar
    * 2. If the array is empty, it should return immediately.
    * 3. Loops through links to add ONLY active links to the addon bar
    * 4. Add the click functionality to icons
    * 5. Add the click functionality to show panel
    */

    $("#holder").text("");
    if (array.length === 0) {return; }

    for (var i = 0; i < array.length; i++) {
      if (array[i].keyword) {
        QL_obj.add(array[i].icon, array[i].url, array[i].keyword);
      } else {
        QL_obj.add(array[i].icon, array[i].url, '');
      }
    }

    var collection = document.getElementsByClassName('icon'); 
    for (var j = 0; j < collection.length; j++) {
      collection[j].onclick = function () {
        self.postMessage({"aim": "url", "content": this.id});
      };
    }

    document.getElementById('add').onclick = function () {
      self.postMessage({"aim":"open_panel"});
    };
    return;
  }
};

/*Receiving messages*/
self.on('message', function (message) {
  "use strict";
  if (message.aim === "update") {
    QL_obj.init(message.content); // Initializing & re-initializing  
  }
});
