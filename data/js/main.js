/*HANDLES LINKS ON THE ADDON BAR*/
// "holder" - id of container of the links in the HTML document

var QL_obj = {
	add: function (icon, url, id) { // Adding Links to the addon bar. 
        // Icon - class of the icon as in Font Awesome. 
        // Url - address of the Site. 
        // Id - Letters shown next to the Icon
		document.getElementById('holder').innerHTML = '&middot; <i class="fa ' + icon + ' icon" id="' + url + '"></i><span class="cloud-id">' + id + '</span>' + document.getElementById('holder').innerHTML;
		return;
	},
	init: function (array) { // Initializing function
        // array - array of the ActiveLinks to initialize with
		document.getElementById('holder').innerHTML = "<i class='fa fa-plus' id='add'></i>"; // Adding the "+" icon to the addon bar
		if (array.length === 0) {return; } // Array is empty
        // Looping thru' the array
		for (var i = 0; i < array.length; i++) {
			QL_obj.add(array[i].icon, array[i].url, array[i].icon_id); // ADD
		}

		var collection = document.getElementsByClassName('icon'); // All the icons added.
        // Adding the Click functionality for the Links for opening tabs
		for (var j = 0; j < collection.length; j++) {
			collection[j].onclick = function () {
				self.postMessage(this.id); // Posting message so a new tab is added
			}
		}
        // Adding the Click functionality for Showing the panel
		document.getElementById('add').onclick = function () {
			self.postMessage('add'); // Posting message so the panel is shown
		}
		return;
	}
};

/*Receiving messages*/
self.on('message', function (message) {
	QL_obj.init(message); // Initializing & re-initializing
});
