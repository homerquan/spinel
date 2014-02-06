// LoginPageView.js
// -------
define(["jquery", "backbone", "handlebars", "models/LoginStatusModel", "text!templates/login_page.handlebars"],

    function($, Backbone, Handlebars, Model, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#page-container",
            template: Handlebars.compile(template),

            // View constructor
            initialize: function() {

                // Calls the view's render method
                this.render();

            },

            // View Event Handlers
            events: {
                "click #btn-signin" : "signin",
                "click #btn-signup" : "signup"
            },

            // Renders the view's template to the UI
            render: function() {

                this.$el.html(this.template());

                // Maintains chainability
                return this;
            }

        });

        // Returns the View class
        return View;

    }

);