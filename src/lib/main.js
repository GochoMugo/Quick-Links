/**
 * QuickLinks -- Addon main module
 *
 * Copyright (c) 2014-2015 GochoMugo <mugo@forfuture.co.ke>
 * See LICENSE in project root directory
 */


// built-in modules
import hotkeys from "sdk/hotkeys";
import panels from "sdk/panel";
import self from "sdk/self";
import storage from "sdk/simple-storage";
import tabs from "sdk/tabs";
import widgets from "sdk/widget";


// own modules
import migrations from "./migrations";
import presets from "./presets";
import utils from "./utils";


// module variables
let links, activeLinks, panel, widget, hotkey; // eslint-disable-line no-unused-vars


// Run migrations
migrations.run();


function getLinks(l) {
  widget.width = 40;
  links = l;
  activeLinks = [];
  links.forEach(function(link) {
    if (link.active) {
      activeLinks.push(link);
      widget.width += 15;
      if (link.keyword) {
        widget.width += link.keyword.length * 12;
      }
    }
  });
  storage.links = links; // Storing links in system
  return activeLinks;
}


// Panel for Settings
panel = panels.Panel({
  width: 600,
  height: 520,
  contentURL: self.data.url("add.html"), // html document
  contentScriptFile: [
    self.data.url("vendor/jquery/jquery-1.10.2.js"),
    self.data.url("vendor/bootstrap/dist/js/bootstrap.min.js"),
    self.data.url("js/add.js"),
  ],
  contentScriptWhen: "ready",
  onHide: function () {
    panel.postMessage({ aim: "close" });
  },
  onMessage: function (message) {
    /*
     * Receiving messages:
     *   "close": hide the panel
     *   "translate":  translate text using locales
     *   "links": links received from the panel. Tell widget to update addon
     *   "openLink": iconic link on panel has been clicked. Open a tab.
     */
    switch (message.aim) {
    case "close":
      panel.hide();
      break;
    case "translate":
      panel.postMessage(utils.translate(message.content));
      break;
    case "links":
      widget.postMessage({
        aim: "update",
        content: getLinks(message.content),
      });
      break;
    case "linkOpen":
      tabs.open(message.content);
      panel.hide();
      break;
    }
  },
});


// Widget on the Addon bar
widget = widgets.Widget({
  id: "QL_widget",
  label: "Click to open...",
  contentURL: self.data.url("main.html"),
  contentScriptFile: [
    self.data.url("jquery/jquery-1.10.2.js"),
    self.data.url("js/main.js"),
  ],
  contentScriptWhen: "ready",
  onAttach: function () {
    /*
     * If links had been stored, we placed in the .links variable. If no links had
     * been stored we load the presets from the "presets" module and place
     * them in the variable
     * We then update widget and the panel
     */
    if (!storage.links) {
      links = presets.get();
    } else {
      links = storage.links;
    }
    widget.postMessage({
      aim: "update",
      content: getLinks(links),
    });
    panel.postMessage({
      aim: "links",
      content: links,
    });
  },
  onMessage: function (message) {
    /*
     * Receives all messages sent to the Widget.
     *   "open_panel": open the panel
     *   "url": open new tab with url
     *   "presets": receive presets from presets.js
     *   "translate": presets require translation
     */
    switch (message.aim) {
    case "open_panel":
      panel.show();
      break;
    case "url":
      tabs.open(message.content);
      break;
    }
  },
});


/*
 * Registering the hotkey {Ctrl-Alt-Q}
 *
 * This will take note of the current tab"s URL and title and fill them in the panel
 * while showing it
 */
 hotkey = hotkeys.Hotkey({
  combo: "accel-alt-q",
  onPress: function () {
    /*
     * Gets the active tab. Extracts the title and URL
     * Sends message on behalf of panel to have the second tab activated and
     * the appropriate textboxes be filled with the title and url
     * Opens the Panel after that
     */
    var activeTab = tabs.activeTab;
    var title = activeTab.title;
    var url = activeTab.url;
    panel.postMessage({
      aim: "bookmark",
      content: {
        title,
        url,
      },
    });
   panel.show();
  },
});


/*
 * Ensuring OverQuota is handled
 */
storage.on("OverQuota", function(){
  panel.postMessage("OverQuota");
  utils.notify(
    "Memory Exhaustion",
    "You have used up memory reserved for Quick Links. You may delete some icons.",
    function () {
      panel.show();
    }
  );
});
