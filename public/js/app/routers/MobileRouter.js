// MobileRouter.js
// ---------------
define(['jquery', 'backbone', './BaseRouter', 'views/HomePageView'],

    function($, Backbone, BaseRouter, View) {

        var MobileRouter = BaseRouter.extend({

            initialize: function() {

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start({
                    pushState: true
                });

            },

            // All of your Backbone Routes (add more)
            routes: {
                '': 'noMobile',
                '*anything': 'noMobile'
            },

            noMobile: function() {
                require(['views/StaticPageView'], function(StaticPageView) {
                    this.loadView(new StaticPageView({
                        session: this.session,
                        content: 'no_mobile'
                    }));
                }.bind(this));
            }

        });

        // Returns the MobileRouter class
        return MobileRouter;

    }

);