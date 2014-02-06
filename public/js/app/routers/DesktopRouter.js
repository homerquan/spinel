// DesktopRouter.js
// ----------------
define(["jquery", "backbone", "models/Model", "views/HomePageView", "views/LoginPageView", "collections/Collection"],

    function($, Backbone, Model, HomePageView, LoginPageView, Collection) {

        var DesktopRouter = Backbone.Router.extend({

            initialize: function() {
                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();
            },

            // All of your Backbone Routes (add more)
            routes: {
                // When there is no hash on the url, the home method is called
                "": "index",
                "home/:query": "home",
                "login" : "login"
            },

            index: function() {
                 new HomePageView();
            },

            home: function(query) {
                new HomePageView({query:query});
            },

            login: function() {
                new LoginPageView();
            }


        });

        // Returns the DesktopRouter class
        return DesktopRouter;

    }

);