// DesktopRouter.js
// ----------------
define(["jquery", "backbone", "./BaseRouter", "../models/SessionModel",
        "views/HomePageView", "views/LoginPageView",
        "views/ProfilePageView", "views/UserStatusView",
        "views/RegisterPageView"
    ],

    function($, Backbone, BaseRouter, Session,
        HomePageView, LoginPageView,
        ProfilePageView, UserStatusView,
        RegisterPageView) {

        var DesktopRouter = BaseRouter.extend({

            initialize: function() {
                // Tells Backbone to start watching for hashchange events
                this.session = new Session();
                // Singleton Views
                this.userStatusView = new UserStatusView({
                    session: this.session
                });

                this.userStatusView.render();
                Backbone.history.start();
            },

            // All of your Backbone Routes (add more)
            routes: {
                // When there is no hash on the url, the home method is called
                "": "home",
                "login": "login",
                "profile": "profile",
                "profile/:query": "profile",
                "register": "register"
            },

            //Route handlers
            home: function() {
                this.loadView(new HomePageView({
                    session: this.session
                }));
            },


            login: function() {
                this.loadView(new LoginPageView({
                    session: this.session
                }));
            },

            profile: function() {

                this.loadView(new ProfilePageView({
                    session: this.session
                }));
            },

            register: function() {
                this.loadView(new RegisterPageView({
                    session: this.session
                }));
            }

        });

        // Returns the DesktopRouter class
        return DesktopRouter;

    }

);