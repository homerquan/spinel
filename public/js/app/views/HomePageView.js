// HomePageView.js
// -------
define(["jquery", "backbone", "handlebars",
        "./BaseView", "views/SearchCardsView",
        "text!templates/login_home_page.hbr",
        "text!templates/anonymous_home_page.hbr"
    ],

    function($, Backbone, Handlebars, BaseView,
        SearchCardsView, loginTemplate, anonymousTemplate) {

        var View = BaseView.extend({

            // The DOM Element associated with this view
            el: "#page-container",
            loginTemplate: Handlebars.compile(loginTemplate),
            anonymousTemplate: Handlebars.compile(anonymousTemplate),

            initialize: function(context) {
                _.extend(this, context);
                if (this.session) {
                    this.session.bind('change', this.render, this);
                }
            },
            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {

                if (this.session && this.session.isLogin()) {
                    this.$el.html(this.loginTemplate(this.session.get('userProfile')));
                } else {
                    this.$el.html(this.anonymousTemplate());
                }
                return this;
            }

        });

        // Returns the View class
        return View;

    }

);