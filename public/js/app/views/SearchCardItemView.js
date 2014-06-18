// SearchCardItemView.js
// -------
define(["jquery", "backbone", "./BaseView",
        "models/GenericItemModel", "text!templates/search_card_item.hbr"
    ],

    function($, Backbone, BaseView, Model, template) {

        var View = BaseView.extend({

            tagName: "div",
            className: "search-card row",
            template: Handlebars.compile(template),

            render: function() {
                this.$el.html(this.template(this.model.attributes));
                return this;
            }

        });

        // Returns the View class
        return View;

    }

);