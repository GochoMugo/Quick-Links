// Object holding the Presets
var QL_defaults = {
	main: 'defaults', // Purpose of the object
	links: ''
};

/*
PROPERTIES OF INDIVIDUAL LINK OBJECT
====================================
- type      --> Shows if its a Preset ("default") or Custom ("user")
- icon      --> Class name of the associated icon as in "Font Awesome"
- name      --> Name of the Web Site e.g. Facebook
- url       --> URL address of the Site (HTTPS recommended)
- icon_id   --> Useful for Custom links.
- active    --> Boolean. If true, it's shown on add-on bar
*/

QL_defaults.links = [
	{
		"type" : "default",
		"icon" : "fa-apple",
		"name" : "Apple",
		"url" : "https://www.apple.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-bitbucket",
		"name" : "Bitbucket",
		"url" : "https://bitbucket.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-bitcoin",
		"name" : "Bitcoin",
		"url" : "http://bitcoin.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-codepen",
		"name" : "Codepen",
		"url" : "https://codepen.io/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-dropbox",
		"name" : "Dropbox",
		"url" : "https://dropbox.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-drupal",
		"name" : "Drupal",
		"url" : "https://www.drupal.org/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-facebook",
		"name" : "Facebook",
		"url" : "https://facebook.com/",
		"icon_id": " ",
		"active": true
	},
	{
		"type" : "default",
		"icon" : "fa-flickr",
		"name" : "Flickr",
		"url" : "https://flickr.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-git",
		"name" : "Git",
		"url" : "http://git-scm.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-github",
		"name" : "Github",
		"url" : "https://github.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-google",
		"name" : "Google",
		"url" : "https://google.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-google-plus",
		"name" : "Google-Plus",
		"url" : "https://plus.google.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-instagram",
		"name" : "Instagram",
		"url" : "http://instagram.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-linkedin",
		"name" : "LinkedIn",
		"url" : "https://linkedin.com/",
		"icon_id": " ",
		"active": true
	},
	{
		"type" : "default",
		"icon" : "fa-pinterest",
		"name" : "Pinterest",
		"url" : "https://www.pinterest.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-skype",
		"name" : "Skype",
		"url" : "http://skype.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-soundcloud",
		"name" : "SoundCloud",
		"url" : "https://soundcloud.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-stack-exchange",
		"name" : "StackExchange",
		"url" : "https://stackexchange.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-stack-overflow",
		"name" : "StackOverflow",
		"url" : "https://stackoverflow.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-steam",
		"name" : "Steam",
		"url" : "http://store.steampowered.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-tumblr",
		"name" : "Tumblr",
		"url" : "https://www.tumblr.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-twitter",
		"name" : "Twitter",
		"url" : "https://twitter.com/",
		"icon_id": " ",
		"active": true
	},
	{
		"type" : "default",
		"icon" : "fa-vimeo-square",
		"name" : "Vimeo",
		"url" : "https://vimeo.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-windows",
		"name" : "Windows",
		"url" : "http://windows.microsoft.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-wordpress",
		"name" : "Wordpress",
		"url" : "https://wordpress.org/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-yahoo",
		"name" : "Yahoo",
		"url" : "https://www.yahoo.com/",
		"icon_id": " ",
		"active": false
	},
	{
		"type" : "default",
		"icon" : "fa-youtube-play",
		"name" : "YouTube",
		"url" : "https://youtube.com/",
		"icon_id": " ",
		"active": false
	}
];

// If messaged 'appropriately', the Presets are messaged back
self.on('message', function (message) {
	if (message === 'defaults') {self.postMessage(QL_defaults); }
});
