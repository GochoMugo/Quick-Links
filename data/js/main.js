/*HANDLES LINKS ON THE ADDON BAR*/
// "holder" - id of container of the links in the HTML document

var QL_obj = {
	add: function (icon, url, id) { // Adding Links to the addon bar. 
        // Icon - class of the icon as in Font Awesome. 
        // Url - address of the Site. 
        // Id - Letters shown next to the Icon
        
        // *** HTML Insertion using jQuery
        var id_besides = document.createElement("span"),
                new_icon = document.createElement("i");
        // Styling the Icon
        new_icon.className = "fa " + icon + " icon";
        new_icon.id = url;
        // Adding text and styling the id next to the Icon
        $(id_besides).text(id);
        id_besides.className = "cloud-id";
        
        // Prepending it to the Container to appear in the Bar
        $("#holder").prepend(
            "&middot;", // Separator dot
            new_icon,
            id_besides
        );;
		return;
	},
	init: function (array) { // Initializing function
        // array - array of the ActiveLinks to initialize with
        // Blanking th Icons
        $("#holder").text("");
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
