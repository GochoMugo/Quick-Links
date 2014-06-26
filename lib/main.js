/*Function for Localization*/
var _ = require('sdk/l10n').get;
/*
* 'Encaspluating' variables under one variable
*   .version - version of the addon
*   .migration - migration module
*   .data - data bundled with the addon
*   .storage - addon storage across restarts
*   .links - array of all the links
*   .translate() - function to translate a message. Returns a message object
*   .activeLinks - array of links to show on addon bar
*   .getLinks() - function allowed to parse all links and return the active links. 
        No other function or method should manipulate links directly. 
*   .panel - addon's panel
*   .widget - addon's widget
*   .notification - addon's notification ui
*   .hotkey - hotkey handler
*/
var QL_var = {
    version: require('sdk/self').version,
    migration: require("./migration"),
	data: require('sdk/self').data,
	storage: require('sdk/simple-storage').storage,
	links: [],
	translate: function (text) {
	    return {
	        "aim":"translated",
            "content": _(text) // Translation
        }
	},
	activeLinks: [],
	getLinks: function (links) {
	    QL_var.widget.width = 40; 
	    QL_var.links = links;
	    QL_var.activeLinks = [];
	    links.forEach(function (link) {
	        if (link.active) {
	            QL_var.activeLinks.push(link);
	            QL_var.widget.width += 15;
	            if (link.keyword) {QL_var.widget.width += link.keyword.length * 12;}
            }
	    });
	    QL_var.storage.links = QL_var.links; // Storing links in system
	    return QL_var.activeLinks;
	},
    panel: undefined,
    widget: undefined,
    notify: function ($title, $text, $func) {
        require('sdk/notifications').notify({
            title: $title,
            text: $text,
            onClick: function () {
                if ($func) $func();
            },
            iconURL: QL_var.data.url("images/icon.png")
        });
    },
    hotkey: undefined
};

/*Checking if it a First run*/
if (!QL_var.storage.first_run) {
    /* 
    * Opening tab with the page for First Run and set it to 'true' for Restarts
    * Also store the version number of the XPI
    */
    require('sdk/tabs').open(QL_var.data.url('first-run.html'));
    QL_var.storage.first_run = true;
    QL_var.storage.version = QL_var.version;
}


/*
* A new version has been downloaded
* Initate Migration. Handles versions that didn't register their version numbers 
* by setting it to 'vUnknown'
* Register the new version number
* Show notification
*/
if (QL_var.version != QL_var.storage.version) {
    if (!QL_var.storage.version) {QL_var.storage.version = "Unknown"; }
    QL_var.storage.links = QL_var.migration.init("v" + QL_var.storage.version 
                                    + " to v" + QL_var.version, QL_var.storage.links);
    QL_var.storage.version = QL_var.version;
    QL_var.notify("Upgraded to version " + QL_var.version, 
            "Quick Links has been upgraded. Click to see the updates \
and new features.",
            function () {
                require('sdk/tabs').open(
                    "https://gochomugo.github.io/Quick-Links/upgrades.html#" 
                    + QL_var.version);
            }
    );
}

// Panel for Settings
QL_var.panel = require('sdk/panel').Panel({
	width: 600,
	height: 520,
	contentURL: QL_var.data.url('add.html'), // html document
	contentScriptFile: [QL_var.data.url('jquery/jquery-1.10.2.js'), 
	                              QL_var.data.url('bootstrap/dist/js/bootstrap.min.js'), 
	                              QL_var.data.url('js/add.js')],
    contentScriptWhen: 'ready',
	onHide: function () {
	    /* Panel is being hidden, messaging script of the closure*/
		QL_var.panel.postMessage({"aim":"close"});
	},
	onMessage: function (message) {
	    /* 
	    * Receiving messages 
	    *   "close": hide the panel
	    *   "translate":  translate text using locales
	    *   "links": links received from the panel. Tell widget to update addon
	    */
	    switch (message.aim) {
	    case "close":
	        QL_var.panel.hide();
	        break;
        case "translate":
            QL_var.panel.postMessage(QL_var.translate(message.content));
            break;
        case "links":
            QL_var.widget.postMessage({
                "aim": "update", 
                "content": QL_var.getLinks(message.content)
            });
            break;
	    }
	}
});

// Widget on the Addon bar
QL_var.widget = require('sdk/widget').Widget({
	id: "QL_widget",
	label: 'Click to open...',
	contentURL: QL_var.data.url('main.html'), // html document
	contentScriptFile: [QL_var.data.url('jquery/jquery-1.10.2.js'), 
	                              QL_var.data.url('js/main.js')],
	contentScriptWhen: 'ready',
	onAttach: function () {
        /*
        * If links had been stored, we placed in the .links variable. If no links had 
        * been stored we load the presets from the 'presets' module and place 
        * them in the variable
        * We then update widget and the panel
        */
        if (!QL_var.storage.links) {
            QL_var.links = require("./presets").get();
        } else {
            QL_var.links = QL_var.storage.links;
        }
        QL_var.widget.postMessage({
            "aim": "update", 
            "content": QL_var.getLinks(QL_var.links)
        });
        QL_var.panel.postMessage({
            "aim":"links", 
            "content": QL_var.links
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
	        QL_var.panel.show();
	        break;
        case "url":
            require('sdk/tabs').open(message.content);
            break;
	    }
	}
});

/*
* Registering the hotkey {Ctrl-Alt-Q}
* This will take note of the current tab's URL and title and fill them in the panel
* while showing it
*/
QL_var.hotkey = require('sdk/hotkeys').Hotkey({
    combo: "accel-alt-q",
    onPress: function () {
        /*
        * Gets the active tab. Extracts the title and URL
        * Sends message on behalf of panel to have the second tab activated and 
        * the appropriate textboxes be filled with the title and url 
        * Opens the Panel after that
        */
        var activeTab = require('sdk/tabs').activeTab,
               title = activeTab.title,
               url = activeTab.url;
       QL_var.panel.postMessage({
            "aim": "bookmark",
            "content": {
                "title": title,
                "url" : url
            }
       });
       QL_var.panel.show() 
    }
});

/*Ensuring OverQuota is handled*/
require('sdk/simple-storage').on('OverQuota', function(){
	QL_var.panel.postMessage('OverQuota');
	QL_var.notify("Memory Exhaustion", 
	        "You have used up memory reserved for Quick Links. \
	        You may delete some icons.", 
	        function () {
	            QL_var.panel.show();
	        });
});
