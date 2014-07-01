// Require.js Configurations
// -------------------------
require.config({

    // Sets the js folder as the base directory for all future relative paths
    baseUrl: "./js/app",

    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
    // probably a good idea to keep version numbers in the file names for updates checking
    paths: {

        // Core Libraries
        // --------------
        "jquery": "../libs/jquery",

        "jqueryui": "../libs/jqueryui",

        "jquerymobile": "../libs/jquery.mobile",

        "underscore": "../libs/lodash",

        "backbone": "../libs/backbone",

        "handlebars": "../libs/handlebars",

        // Plugins
        // -------

        "backbone.validateAll": "../libs/plugins/backbone.validateAll",

        "backbone.forms": "../libs/plugins/backbone.forms",

        "bootstrap": "../libs/plugins/bootstrap",

        "text": "../libs/plugins/text",

        "arbor": "../libs/plugins/arbor",

        "jasminejquery": "../libs/plugins/jasmine-jquery",

        "pnotify": "../libs/plugins/jquery.pnotify",

        "cookie": "../libs/plugins/jquery.cookie",

        "d3": "../libs/plugins/d3"

    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {

        // jQuery Mobile
        "jquerymobile": ["jquery"],

        // Twitter Bootstrap jQuery plugins
        "bootstrap": ["jquery"],

        // jQueryUI
        "jqueryui": ["jquery"],

        // Backbone
        "backbone": {

            // Depends on underscore/lodash and jQuery
            "deps": ["underscore", "jquery"],

            // Exports the global window.Backbone object
            "exports": "Backbone"

        },

        // Arbor graph viz lib
        "arbor": {
            "deps": ["jquery"],
            "exports": "arbor"
        },

        // Notification
        "pnotify": ['jquery'],

        // Jquery cookie
        "cookie": ['jquery'],

        // Handlebars
        "handlebars": {
            "exports": "Handlebars"
        },

        // Backbone.validateAll plugin that depends on Backbone
        "backbone.validateAll": ["backbone"],

        // Jasmine-jQuery plugin
        "jasminejquery": ["jquery"],

        // d3
        "d3": {
            "exports": "d3"
        }

    }

});
