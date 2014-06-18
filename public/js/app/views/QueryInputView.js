define(["jquery", "backbone", "views/BaseView",
        "views/QuerySuggestionsView",
        "text!templates/query_input.hbr"
    ],

    function($, Backbone, BaseView, QuerySuggestionsView, template) {

        var View = BaseView.extend({

            el: "#query-input-container",
            className: "",
            template: Handlebars.compile(template),

            events: {
                "click #search-query": "search"
            },

            render: function() {

                this.$el.html(this.template());
                var input = $("#query-input");
                // Render inside UI components 
                _.defer(function() {
                    new QuerySuggestionsView({
                        query: this.query,
                        input: input
                    }).render();
                }.bind(this));
                return this;
            },

            search: function() {
                this.pubsub.trigger("action:reset-suggestion");
                Backbone.history.navigate('search/' + $("#query-input").val(), {
                    trigger: true
                });
            }
        });

        // Returns the View class
        return View;

    }

);