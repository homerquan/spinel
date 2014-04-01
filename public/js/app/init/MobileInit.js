// MobileInit.js
// -------------

// Include Mobile Specific JavaScript files here (or inside of your Mobile router)
// load pnotify to jquery
require(["jquery", "backbone", "routers/MobileRouter", "jquerymobile", "backbone.validateAll", "pnotify"],

  function($, Backbone, MobileRouter) {

    // Prevents all anchor click handling
    $.mobile.linkBindingEnabled = false;

    // Disabling this will prevent jQuery Mobile from handling hash changes
    $.mobile.hashListeningEnabled = false;

    $.pnotify.defaults.styling = "bootstrap3";
    
    // Instantiates a new Mobile Router instance
    new MobileRouter();

  }

);