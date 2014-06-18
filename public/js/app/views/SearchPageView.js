// SearchPageView.js
// -------
define(["jquery", "backbone", "handlebars",
        "./BaseView", "views/SearchCardsView", "text!templates/search_page.hbr"
    ],

    function($, Backbone, Handlebars, BaseView, SearchCardsView, template) {

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
                var input = $("#find-input");
                // Render inside UI components 
                _.defer(function() {
                    new SearchCardsView({
                        query: this.query,
                        input: input
                    }).render();
                }.bind(this));

                // Maintains chainability
                return this;
            }

        });

        // Returns the View class
        return View;

    }

);