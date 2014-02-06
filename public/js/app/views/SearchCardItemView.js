// View.js
// -------
define(["jquery", "backbone", "models/SearchCardModel", "text!templates/search_card_item.handlebars"],

    function($, Backbone, Model, template) {

        var View = Backbone.View.extend({

            tagName: "div",
            className: "search-card pin",
            template: Handlebars.compile(template),

            events: {
                "click": "select"
            },

            render: function() {
                this.$el.html(this.template(this.model.attributes));
                return this;
            },

            select: function() {
                this.options.parent.hide().select(this.model);
                return false;
            }

        });

        // Returns the View class
        return View;

    }

);