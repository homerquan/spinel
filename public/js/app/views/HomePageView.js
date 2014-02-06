// HomePageView.js
// -------
define(["jquery", "backbone", "handlebars", "views/SearchCardsView", "text!templates/home_page.handlebars"],

    function($, Backbone, Handlebars, SearchCardsView, template) {

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#page-container",
            template: Handlebars.compile(template),

            // View constructor
            initialize: function(options) {
                _.extend(this, options); 
                // Calls the view's render method
                this.render();
            },

            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {

                // Render Layout
                this.$el.html(this.template());
                var input = $("#find-input",this.$el);
                var smallInputContainer = $("#small-find-input-container",this.$el);
                // Render UI components 
                _.defer(function() {
                    new SearchCardsView({
                        input: input,
                        smallInputContainer: smallInputContainer
                    }).render();
                });
                // Maintains chainability
                return this;

            }

        });

        // Returns the View class
        return View;

    }

);