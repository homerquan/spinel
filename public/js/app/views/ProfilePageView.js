// ProfilePageView.js
// show self profile from session 
// or other's specified by id
// -------
define(["jquery", "backbone", "handlebars",
        "./BaseView", "text!templates/profile_page.hbr"
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
                return this;
            }

        });

        // Returns the View class
        return View;

    }

);