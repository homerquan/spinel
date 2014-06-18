// LoginModalView.js
// -------
define(["jquery", "backbone", "handlebars",
        "./BaseView", "text!templates/register_page.hbr",
        "backbone.validateAll"
    ],

    function($, Backbone, Handlebars, BaseView, template) {

        var View = BaseView.extend({

            // The DOM Element associated with this view
            el: "#page-container",
            template: Handlebars.compile(template),

            // View Event Handlers
            events: {
                "click #btn-signup": "signup"
            },

            // Renders the view's template to the UI
            render: function() {
                this.$el.html(this.template());
                // Maintains chainability
                return this;
            },

            signup: function() {

            }
        });

        // Returns the View class
        return View;

    }

);