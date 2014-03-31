/*HANDLES SETTINGS ON THE PANEL*/
var QL_add = {
	JSON: [], // Holds the Links
	OverQuota: false, // Memory exhausted
	collection: document.getElementsByClassName('fa-times'), // All the close icons
	remove: function () { // Removing rows in the User table
		QL_add.collection = document.getElementsByClassName('fa-times'); // All the close icons
        // Looping thru' the Icons
		for (var i = 0; i < QL_add.collection.length; i++) {
            // Adding the Click functionality
			QL_add.collection[i].onclick = function () {
				var currentRow = this.parentNode.parentNode; // the Row
				var table = currentRow.parentNode.parentNode; // the Table
				var title = currentRow.childNodes[2].innerHTML; // the Name e.g. Codecademy
				QL_add.generate('remove', '', title); // Updating the JSON object
				table.innerHTML = table.innerHTML.replace('<tr>' + currentRow.innerHTML + '</tr>', ''); // Removing the Row
				QL_add.remove(); // Re-putting the Click functionality			
			}
		}
//		if (QL_add.OverQuota === true) QL_add.posting(); RE-THINK
		return;
	},
	add: function (table_id, title, icon, url, id, active, asMessage, index) {
        // Adding Links details to the Presets Table and Rows in the User Table
        // table_id     --> id of either the Presets or User table
        // title        --> title/name of the site e.g. Codecademy
        // icon         --> class of the icon
        // url          --> URL address of the site
        // id           --> Letters shown next to the Icon
        // active       --> Boolean.True that's shown or to be shown on addon bar
        // asMessage    --> True. Wanting to know if the Link exists in the JSON object
        // index        -->
		var proceed = QL_add.generate('add', table_id, title, icon, url, id, active, asMessage); 
		if (proceed === false) {return; }
		document.getElementById('add-alert').innerHTML = '';
		var checked = ''; // State of the checkbox next to Presets 
		if (active === true) {checked = 'checked'; } // Setting the State (true/false)

		if (table_id === 'major-sites') { // Presets table
            // Getting the appropriate row
			var row = document.getElementById(title + '-group').innerHTML;
			document.getElementById(title + '-group').innerHTML = '<td><input type="checkbox" class="chkbx" id="' + title + '-chkbx" '+ checked + '><label for="' + title + '-chkbx"> </label></td>'; // Checkbox and Label
			document.getElementById(title + '-group').innerHTML += row;
		} else { // User Table
            // Creates a new row to be inserted
			var newRow = '<tr>';
				newRow += '<td><input type="checkbox" class="chkbx" id="' + title + '-chkbx" '+ checked + '><label for="' + title + '-chkbx"> </label></td>';
				newRow += '<td><i class="fa ' + icon + '"></i><span class="cloud-id">' + id + '</span></td>';
				newRow += '<td>' + title + '</td>';
				if(table_id === 'add-table') newRow += '<td><i class="fa fa-times"></i></td>';
			newRow += '</tr>';
			document.getElementById(table_id).childNodes[1].innerHTML += newRow;
		}
		QL_add.remove(); // Re-initialize the Click functionality of Close buttons
		return;
	},
	btn: function () { // Handles the Button fucntionality of the User form
        // Once the button for adding custom link is added
		document.getElementById('add-btn').onclick = function () {
			var title = document.getElementById('add-title').value, // Name of the site
				url = document.getElementById('add-url').value, // URL address
				id = document.getElementById('add-id').value, // Letters next to icon
				radios = document.getElementsByClassName('radios'); // All the radios

			var iconClass = undefined; //  Icon class name
            // Looping to get the Radio that has been checked/chosen
			for (var i = 0; i < radios.length; i++) {
				if (radios[i].checked ){
					iconClass = radios[i].id;
				}
			}
			if (iconClass == undefined) { // No radio has been checked
				QL_add.alert('warning', 'alert_NoIconChecked'); // Alerting user
				return;
			}
			if (title === '') { //  Title has not been inputed
				QL_add.alert('warning', 'alert_BlankTitle'); // Alerting user
				document.getElementById('add-title').parentNode.className += ' has-warning'; // Making the input box highlighted with error
				document.getElementById('add-title').focus(); //  Focussing input box
				return;
			} 
			document.getElementById('add-title').parentNode.className = 'input-group has-success'; // Successful title added
			if (url === '') { // No URL address added
				QL_add.alert('warning', 'alert_BlankUrl'); // Alerting user
				document.getElementById('add-url').parentNode.className += ' has-warning'; // Highlighting input box
				document.getElementById('add-url').focus(); // Focussing input box
				return;
			}
			document.getElementById('add-url').parentNode.className = 'input-group has-success'; // Successful URL address added
			if (id === '') { // No letters have been added
				QL_add.alert('warning', 'alert_BlankIdentifier'); // Alerting user
				document.getElementById('add-id').parentNode.className += ' has-warning'; // Highlighting input box
				document.getElementById('add-id').focus();// Focussing input box
				return;
			} else if (id.length > 2) { // The Id should not be longer than 2
				QL_add.alert('danger', 'alert_MaxIdLength'); // Alerting user
				document.getElementById('add-id').parentNode.className += ' has-warning'; // Highlighting input box
				document.getElementById('add-id').focus(); // Focussing input box
				return;
			}
			document.getElementById('add-id').parentNode.className = 'input-group has-success'; // Successful Id added
			QL_add.add('add-table', title, iconClass, url, id, true, false); // adding row
			/*Reseting Class Names on SUCCESS*/
			document.getElementById('add-title').parentNode.className = 'input-group';
			document.getElementById('add-url').parentNode.className = 'input-group';
			document.getElementById('add-id').parentNode.className = 'input-group';
			return;
		}
	},
	generate: function (action, type, name, icon, url, icon_id, active, asMessage) {
        // Updating the JSON object
        // Params described above
		if (action === 'add') { // Adding a new Link
            // Looping to ensure that the Link doesn't exist already
			for (var i = 0; i <QL_add.JSON.length; i++) {
				if (QL_add.JSON[i].name === name) {
					if (asMessage === true) {return false; }
					QL_add.alert('danger', 'alert_ExistingTitle'); // Alerting user that the Link already exists
					return false;
				}
			}
            // Creating a new Link object
			var newType = 'default';
			if (type === 'add-table') {newType = 'user'; } // Getting the type
			var newJSONItem = {
				"type" : newType,
				"name" : name,
				"icon" : icon,
				"url" : url,
				"icon_id": icon_id,
				"active" : active
			};
			QL_add.JSON.push(newJSONItem); // Pushing to the JSON
		} else if (action === 'remove') { // Removing from the JSON object
			var newJSON = [];
            // Looping thru' the Link objects
			for (var j = 0; j < QL_add.JSON.length; j++) {
                // Adding the Link if its not the targeted link
				if (QL_add.JSON[j].name !== name) {
					newJSON.push(QL_add.JSON[j]);
				}
			}
			QL_add.JSON = newJSON;
		}
		return;
	},
	alert: function (type, message) { // Alerts User
        // Translation is required. Thus a new message object is created and posted
		var msg = {
			main: 'translate',
			text: message
		};
		self.postMessage(msg); // posting the message for translation
        // Receiving message from translation
		self.on('message', function (message) {
			if (message.main === 'translate') {
				var newAlert = "<div class='alert alert-"+ type +" alert-dismissable'>";
					newAlert += "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>";
					newAlert += message.text; // The translation
				newAlert += "</div>";
				document.getElementById('add-alert').innerHTML =  newAlert; // Showing to user
			}
		});
		return;
	},
	checking: function (array) { // Getting the checkbox state for Presets
		var newArray = array, checkbox;
		for (var z = 0; z < newArray.length; z++) {
			checkbox = document.getElementById(newArray[z].name + '-chkbx');
			if (checkbox === null) {
				newArray[z].active = false;
			} else {
				newArray[z].active = checkbox.checked;
			}
		}
		return newArray;
	},
	init: function () { // Initializing
        // Receiving messages
		self.on('message', function (message) {
			if (message === 'close') { // 'closing" the panel
				QL_add.posting();
			} else if (typeof message === 'object') {
                // Looping through the Links received
				for (var i = 0; i < message.length; i++) {
					if (message[i].type === 'user') { // Custom
						QL_add.add('add-table', message[i].name, message[i].icon, message[i].url, message[i].icon_id, message[i].active, true);
					} else { // Preset
						QL_add.add('major-sites', message[i].name, message[i].icon, message[i].url, message[i].icon_id, message[i].active, true, i);
					}
				}
                // Handling the Click functionalities
				QL_add.btn();
				QL_add.remove();
			} else if (message === 'OverQuota') { // OverQuota reached
				QL_add.OverQuota = true;
				QL_add.alert('danger', 'alert_OverQuota'); // Alerting user of OverQuota
			}
		});
        // Adding the Click functionality for the Close button for the Panel
		document.getElementById('close-button').onclick = function () {
			self.postMessage('close');
			QL_add.OverQuota = false;
		};
	},
	posting: function () { // Posting the JSON with the links
		self.postMessage(QL_add.checking(QL_add.JSON));
	}
};

/*Initializing*/
QL_add.init(); 
