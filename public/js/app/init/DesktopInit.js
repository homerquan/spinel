// DesktopInit.js
// --------------

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
// load pnotify to jquery
require(["jquery", "backbone", "routers/DesktopRouter", "pnotify", "cookie", "bootstrap", "backbone.validateAll"],

	function($, Backbone, DesktopRouter) {

		$.pnotify.defaults.styling = "bootstrap3";
		$.cookie.json = true;

		// Instantiates a new Desktop Router instance
		new DesktopRouter();

	}

);