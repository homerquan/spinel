// HomePageView.js
// -------
define(["jquery", "backbone", "handlebars",
        "./BaseView", "text!templates/home_page.handlebars"
    ],

    function($, Backbone, Handlebars, BaseView, template) {

        var View = BaseView.extend({

            // The DOM Element associated with this view
            el: "#page-container",
            template: Handlebars.compile(template),

            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {

                // Render Layout
                this.$el.html(this.template());

                // Maintains chainability
                return this;
            }

        });

        // Returns the View class
        return View;

    }

);