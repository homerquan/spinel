// DesktopInit.js
// --------------

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
// load pnotify to jquery
require(['jquery', 'backbone', 'routers/DesktopRouter', 'pnotify', 'jquery.cookie', 'bootstrap'],

	function($, Backbone, DesktopRouter) {
		//config pnotify 
		$.pnotify.defaults.styling = 'bootstrap3';
		$.pnotify.defaults.history = false;
		$.pnotify.defaults.stack = {
			'dir1': 'down',
			'dir2': 'right',
			'push': 'top',
			'spacing1': 0,
			'spacing2': 0,
			'context': $('#notice-container')
		};
		$.pnotify.defaults.addclass = 'stack-bar-top';
		$.pnotify.defaults.width = '100%';
		$.pnotify.defaults.min_height = '25px';
		$.pnotify.defaults.delay = 5000;

		$.cookie.json = true;

		// Instantiates a new Desktop Router instance
		new DesktopRouter();

	}

);