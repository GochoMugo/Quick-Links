// Function for Localization
var _ = require('sdk/l10n').get;
var QL_var = {
	data: require('sdk/self').data, // Data bundled with the add-on
	storage: require('sdk/simple-storage').storage, // Storage across restarts
	links: [], // Links available to be added to the addon bar
	translate: function (text) {
	    console.log("TRANSLATING>>>>>"+text);
	    return {
	        "aim":"translated",
            "content": _(text) // Translation
        }
	},
	activeLinks: [],
	getActiveLinks: function (links) {
	    console.log("GETTING ACTIVE LINKS....");
	    QL_var.widget.width = 40; 
	    QL_var.activeLinks = [];
	    links.forEach(function (link) {
	        if (link.active) {
	            QL_var.activeLinks.push(link);
	            QL_var.widget.width += 10;
	            if (link.keyword) {QL_var.widget.width += link.keyword.length * 12; console.log("HAS KEYWORD");}
            }
	    });
	    return QL_var.activeLinks;
	},
    panel: undefined,
    widget: undefined
};

/*Checking if it a First run*/
if (!QL_var.storage.first_run) {
    /* 
    * Opening tab with the page for First Run and set it to 'true' for Restarts
    * Also store the version number of the XPI
    */
    require('sdk/tabs').open(QL_var.data.url('first-run.html'));
    QL_var.storage.first_run = true;
    QL_var.storage.version = "1.0.0";
}

/*
* Restoring the Links across the Restarts
*/
if (QL_var.storage.links) {
	QL_var.links = QL_var.storage.links; // Restoring data
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
            QL_var.links = message.content;
            QL_var.widget.postMessage({"aim": "update", "content": QL_var.getActiveLinks(QL_var.links)});
            QL_var.storage.links = QL_var.links; // Stroring links in system
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
	                              QL_var.data.url('js/presets.js'), 
	                              QL_var.data.url('js/main.js')],
	contentScriptWhen: 'ready',
	onAttach: function () {
        /*
        * on Attaching, if Preset Links are empty, a message is posted to have
        * the 'Presets' messaged back. After which, Active links have to be added 
        */
        console.log("ATTACHING>>>>>>>>>");
		if (QL_var.links == []) {
		    console.log("REQUESTING PRESETS>>>>>>>>>>>>>>>>>>>>>>>");
		    QL_var.widget.postMessage({'aim': 'presets'});
	    }
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
        case "presets":
            console.log("WIDGET RECEIVING PRESETS.....");
            message.content.forEach(function (preset) {
                QL_var.links.push(preset);
            });
            QL_var.widget.postMessage({"aim": "update", "content": QL_var.getActiveLinks(QL_var.links)});
            /*
            * Sending message on behalf of panel to send links to add.js
            */
            QL_var.panel.postMessage({"aim":"links", "content": QL_var.links});
			break;
		case "translate":
		    console.log("TRANSLATING ["+ message.content +"]");
		    QL_var.widget.postMessage({
		        "aim": "translated", 
		        "content": [
		                message.content, 
                        QL_var.translate(message.content).content
                ]
            });
		    break;
	    }
	}
});

/*Ensuring OverQuota is handled*/
require('sdk/simple-storage').on('OverQuota', function(){
	QL_var.panel.postMessage('OverQuota');
});
