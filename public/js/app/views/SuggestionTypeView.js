// SuggestionTypeView.js
// Show suggestion part by its type: project, people, topic ...
// -------
define(["jquery", "backbone", "./BaseView",
        "models/GenericItemModel",
        "text!templates/suggestion_projects.hbr",
        "text!templates/suggestion_people.hbr",
        "text!templates/suggestion_topics.hbr"
    ],

    function($, Backbone, BaseView, Model,
        projectsTemplate, peopleTemplate, topicsTemplate) {

        var View = BaseView.extend({

            tagName: "div",
            className: "query-suggestions row",

            render: function() {
                if (this.type === "projects")
                    this.$el.html(Handlebars.compile(projectsTemplate)(this.model));
                if (this.type === "people")
                    this.$el.html(Handlebars.compile(peopleTemplate)(this.model));
                if (this.type === "topics")
                    this.$el.html(Handlebars.compile(topicsTemplate)(this.model));
                return this;
            }

        });

        // Returns the View class
        return View;

    }

);