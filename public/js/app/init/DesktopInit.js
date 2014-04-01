// DesktopInit.js
// --------------

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
// load pnotify to jquery
require(["jquery", "backbone", "routers/DesktopRouter", "bootstrap", "backbone.validateAll", "pnotify"],

    function($, Backbone, DesktopRouter) {

        // Instantiates a new Desktop Router instance
        new DesktopRouter();

    }

);