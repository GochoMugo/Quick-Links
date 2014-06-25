// Object holding the Presets
var QL_presets = {
	aim: 'presets', // Purpose of the object
	content: '',
	count: 0
};

/*
PROPERTIES OF INDIVIDUAL LINK OBJECT
====================================
- type      --> Shows if its a Preset () or Custom ("user")
- icon      --> Class display_name of the associated icon as in "Font Awesome"
- display_name      --> display_name of the Web Site e.g. Facebook
- url       --> URL address of the Site (HTTPS recommended)
- icon_id   --> Useful for Custom links.
- active    --> Boolean. If true, it's shown on add-on bar
*/

QL_presets.content = [
	{
		"id":"Apple",
		"icon" : "fa-apple",
		"display_name" : "Apple",
		"url" : "https://www.apple.com/",
		"active": false
	},
	{
		"id":"Bitbucket",
		"icon" : "fa-bitbucket",
		"display_name" : "Bitbucket",
		"url" : "https://bitbucket.com/",
		"active": false
	},
	{
		"id": "Bitcoin",
		"icon" : "fa-bitcoin",
		"display_name" : "Bitcoin",
		"url" : "http://bitcoin.com/",
		"active": false
	},
	{
		"id": "Codepen",
		"icon" : "fa-codepen",
		"display_name" : "Codepen",
		"url" : "https://codepen.io/",
		"active": false
	},
	{
		"id": "Dropbox",
		"icon" : "fa-dropbox",
		"display_name" : "Dropbox",
		"url" : "https://dropbox.com/",
		"active": false
	},
	{
		"id": "Drupal",
		"icon" : "fa-drupal",
		"display_name" : "Drupal",
		"url" : "https://www.drupal.org/",
		"active": false
	},
	{
		"id": "Facebook",
		"icon" : "fa-facebook",
		"display_name" : "Facebook",
		"url" : "https://facebook.com/",
		"active": true
	},
	{
		"id": "Flickr",
		"icon" : "fa-flickr",
		"display_name" : "Flickr",
		"url" : "https://flickr.com/",
		"active": false
	},
	{
		"id": "Foursquare",
		"icon" : "fa-foursquare",
		"display_name" : "Foursquare",
		"url" : "https://foursquare.com/",
		"active": false
	},
	{
		"id": "Git",
		"icon" : "fa-git",
		"display_name" : "Git",
		"url" : "http://git-scm.com/",
		"active": false
	},
	{
		"id": "Github",
		"icon" : "fa-github",
		"display_name" : "Github",
		"url" : "https://github.com/",
		"active": false
	},
	{
		"id": "Google",
		"icon" : "fa-google",
		"display_name" : "Google",
		"url" : "https://google.com/",
		"active": false
	},
	{
		"id": "GooglePlus",
		"icon" : "fa-google-plus",
		"display_name" : "Google-Plus",
		"url" : "https://plus.google.com/",
		"active": false
	},
	{
		"id": "Instagram",
		"icon" : "fa-instagram",
		"display_name" : "Instagram",
		"url" : "http://instagram.com/",
		"active": false
	},
	{
		"id": "JSFiddle",
		"icon" : "fa-jsfiddle",
		"display_name" : "JSFiddle",
		"url" : "http://jsfiddle.net/",
		"active": false
	},
	{
		"id": "LinkedIn",
		"icon" : "fa-linkedin",
		"display_name" : "LinkedIn",
		"url" : "https://linkedin.com/",
		"active": true
	},
	{
		"id": "Pinterest",
		"icon" : "fa-pinterest",
		"display_name" : "Pinterest",
		"url" : "https://www.pinterest.com/",
		"active": false
	},
	{
		"id": "Skype",
		"icon" : "fa-skype",
		"display_name" : "Skype",
		"url" : "http://skype.com/",
		"active": false
	},
	{
		"id": "SoundCloud",
		"icon" : "fa-soundcloud",
		"display_name" : "SoundCloud",
		"url" : "https://soundcloud.com/",
		"active": false
	},
	{
		"id": "StackExchange",
		"icon" : "fa-stack-exchange",
		"display_name" : "Stack Exchange",
		"url" : "https://stackexchange.com/",
		"active": false
	},
	{
		"id": "StackOverflow",
		"icon" : "fa-stack-overflow",
		"display_name" : "Stack Overflow",
		"url" : "https://stackoverflow.com/",
		"active": false
	},
	{
		"id": "Steam",
		"icon" : "fa-steam",
		"display_name" : "Steam",
		"url" : "http://store.steampowered.com/",
		"active": false
	},
	{
        "id": "Trello",
		"icon" : "fa-trello",
		"display_name" : "Trello",
		"url" : "https://trello.com/",
		"active": false
	},
	{
        "id": "Tumblr",
		"icon" : "fa-tumblr",
		"display_name" : "Tumblr",
		"url" : "https://www.tumblr.com/",
		"active": false
	},
	{
		"id": "Twitter",
		"icon" : "fa-twitter",
		"display_name" : "Twitter",
		"url" : "https://twitter.com/",
		"active": true
	},
	{
		"id": "Vimeo",
		"icon" : "fa-vimeo-square",
		"display_name" : "Vimeo",
		"url" : "https://vimeo.com/",
		"active": false
	},
	{
		"id": "Windows",
		"icon" : "fa-windows",
		"display_name" : "Windows",
		"url" : "http://windows.microsoft.com/",
		"active": false
	},
	{
		"id": "Wordpress",
		"icon" : "fa-wordpress",
		"display_name" : "Wordpress",
		"url" : "https://wordpress.org/",
		"active": false
	},
	{
		"id": "Yahoo",
		"icon" : "fa-yahoo",
		"display_name" : "Yahoo",
		"url" : "https://www.yahoo.com/",
		"active": false
	},
	{
		"id": "YouTube",
		"icon" : "fa-youtube-play",
		"display_name" : "YouTube",
		"url" : "https://youtube.com/",
		"active": false
	}
];

// If messaged 'appropriately', the Presets are messaged back
self.on('message', function (message) {
    /*
    * Handling messages received to this script
    *   "presets" - send back the presets. Invokes the translation.
    *   "translated" - a translated preset has been sent back. Looks for the 
    *       target link and updates it. If no more translations are expected, send 
    *       the links 
    */
	switch (message.aim) {
	case 'presets':
        QL_presets.content.forEach(function (link) {
            QL_presets.count++;
            self.postMessage({"aim": "translate", "content": link.id});
        });
        break;
    case "translated":
        QL_presets.content.forEach(function (link) {
            if (link.id === message.content[0]) {
                link.display_name = message.content[1];
                QL_presets.count--;
            }
        });
        if (QL_presets.count === 0) {self.postMessage(QL_presets);}
        break;
    } 
});

