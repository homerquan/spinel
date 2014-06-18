// StudyComboView.js
// -------
define(["jquery", "backbone", "handlebars",
        "./BaseView", "models/GenericModel",
        "text!templates/topic_courses.hbr",
        "text!templates/topic_contents.hbr",
        "text!templates/topic_acadamy.hbr",
        "text!templates/topic_industry.hbr"
    ],

    function($, Backbone, Handlebars, BaseView,
        Model, coursesTemplate, contentsTemplate,
        acadamyTemplate, industryTemplate) {

        var View = BaseView.extend({

            el: "#overcanvas-container",
            contentsEl: "#topic-contents-container",
            coursesEl: "#topic-couses-container",
            acadamyEl: "#topic-acadamy-container",
            industryEl: "#topic-industry-container",
            coursesTemplate: Handlebars.compile(coursesTemplate),
            contentsTemplate: Handlebars.compile(contentsTemplate),
            acadamyTemplate: Handlebars.compile(acadamyTemplate),
            industryTemplate: Handlebars.compile(industryTemplate),

            initialize: function(context) {
                _.extend(this, context);
                this.model = new Model({
                    query: this.query
                });
                this.model.fetch({
                    success: function() {
                        this.render();
                    }.bind(this)
                });
            },

            // View Event Handlers
            events: {

            },

            changeQuery: function(query) {
                this.model = new Model({
                    query: query
                });
                this.model.fetch({
                    success: function() {
                        this.render();
                    }.bind(this)
                });
            },

            render: function() {
                // Render Two Parts
                $(this.contentsEl, this.$el).html(this.contentsTemplate(this.model.attributes.contents));
                $(this.coursesEl, this.$el).html(this.coursesTemplate(this.model.attributes.courses));
                // TODO add content in model
                $(this.acadamyEl, this.$el).html(this.acadamyTemplate());
                $(this.industryEl, this.$el).html(this.industryTemplate());

                // Maintains chainability
                return this;
            }

        });

        // Returns the View class
        return View;

    }

);