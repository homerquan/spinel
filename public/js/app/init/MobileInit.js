// MobileInit.js
// -------------

// Include Mobile Specific JavaScript files here (or inside of your Mobile router)
// load pnotify to jquery
require(['jquery', 'backbone', 'routers/MobileRouter', 'pnotify', 'jquery.cookie', 'jquery-mobile', 'backbone.validation'],

	function($, Backbone, MobileRouter) {

		$.pnotify.defaults.styling = 'bootstrap3';
		$.cookie.json = true;

		// Prevents all anchor click handling
		$.mobile.linkBindingEnabled = false;

		// Disabling this will prevent jQuery Mobile from handling hash changes
		$.mobile.hashListeningEnabled = false;

		// Instantiates a new Mobile Router instance
		new MobileRouter();

	}

);