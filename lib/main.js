
var _ = require('sdk/l10n').get; // Function for Localization
var QL_var = {
	data: require('sdk/self').data, // Data bundled with the add-on
	storage: require('sdk/simple-storage').storage, // Storage across restarts
	links: '', // Links available to be added to the addon bar
	activeLinks: [], // Links appearing in the addon bar
	generateLinks: function () { // Adds links to the addon bar
		if (!QL_var.widget) {return; } // Ensuring the Widget exists
        QL_var.widget.width = 40; // Reseting the width of the Widget if it exists
		QL_var.activeLinks = []; // Reseting the Links properties
        // Looping through the Links property looking for active ones
		for (var a = 0; a <= 1; a++) { // 2 iterations for the Presets and Customs
			for (var b = 0; b < QL_var.links[a].length; b++) {
				if (QL_var.links[a][b].active === true) {
                    // Adding the link to the ActiveLinks property and adjust the widgets width 
					QL_var.activeLinks.push(QL_var.links[a][b]);
					QL_var.widget.width += 10 + QL_var.links[a][b].icon_id.length * 12;
				}
			}
		}
		return QL_var.activeLinks; // Returns the array with the ActiveLinks
	},
    panel: undefined,
    widget: undefined
};

/*Checking if it a First run*/
if (!QL_var.storage.first_run) {
    require('sdk/tabs').open(QL_var.data.url('first-run.html')); // Opening tab with the page for First Run
    QL_var.storage.first_run = true; // Setting it to 'true' for Restarts
}

/*Creating the Links object if it doesn't already exist. Else restoring the Links across the Restarts*/
if (!QL_var.storage.links) {
	QL_var.links = [[], []]; // Reset:1st array for Presets, 2nd array for Customs
} else {
	QL_var.links = QL_var.storage.links; // Restoring data
}

// Panel for Settings
QL_var.panel = require('sdk/panel').Panel({
	width: 600,
	height: 520,
	contentURL: QL_var.data.url('add.html'), // html document
	contentScriptFile: QL_var.data.url('js/add.js'), // JS file
    // When showing, messages are posted, so that the HTML document is manipulated
	onShow: function () {  
		QL_var.panel.postMessage(QL_var.links[0]); // Presets
		QL_var.panel.postMessage(QL_var.links[1]); // Customs
	},
    // Panel is being hidden, messaging script of the closure
	onHide: function () {
		QL_var.panel.postMessage('close');
	},
    // Receiving messages
	onMessage: function (message) {
		if (message === 'close') { // Cmd to hide the panel
			QL_var.panel.hide();
			return;
		} else if (message.main === 'translate') { // Requiring translation
			// Creating new object to be messaged to the script
            var msg = {
				main: 'translate', // Purpose of the object
				text: _(message.text) // Translation
			};
			QL_var.panel.postMessage(msg); // Posting the object
			return;
		} else { // Getting the settings defined by the user in the panel
            QL_var.links = [[], []]; // Resetting
            // Looping through the array in the message containing Link objects
            for (var a = 0; a < message.length; a++) { // Loop thru' objects
                if (message[a].type === 'default') { // PRESET
                    QL_var.links[0].push(message[a]);
                } else { // CUSTOM
                    QL_var.links[1].push(message[a]);
                }
            }
		    QL_var.widget.postMessage(QL_var.generateLinks()); // Updating the addon bar
            QL_var.storage.links = QL_var.links; // Storing the Links in the sytem
        }
	}
});

// Widget on the Addon bar
QL_var.widget = require('sdk/widget').Widget({
	id: "QL_widget",
	label: 'Click to open...',
	contentURL: QL_var.data.url('main.html'), // html document
	contentScriptFile: [QL_var.data.url('js/defaults.js'), QL_var.data.url('js/main.js')], // JS files for the html document
	contentScriptWhen: 'ready',
	onAttach: function () {
        // on Attaching, if Preset Links are empty, a message is posted to have the 'Presets' messaged back. After which, Active links have to be added
		if (QL_var.links[0].length === 0) {QL_var.widget.postMessage('defaults');}
		QL_var.widget.postMessage(QL_var.generateLinks());
	},
	onMessage: function (message) { // Receiving messages
		if (message === 'add') { // 'Add' icon is clicked wanting the panel to be shown 
			QL_var.panel.show();
			return;
		} else if (message.main === 'defaults') { // PRESETS are received
			QL_var.links[0] = message.links;
			QL_var.widget.postMessage(QL_var.generateLinks()); // Adding the ActiveLinks
		} else { // Links clicked
		  require('sdk/tabs').open(message); // Opening tabs if Links are clicked
        }
	}
});

/*Ensuring OverQuota is handled*/
require('sdk/simple-storage').on('OverQuota', function(){
	QL_var.panel.postMessage('OverQuota');
});