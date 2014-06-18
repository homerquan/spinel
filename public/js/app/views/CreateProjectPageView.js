// ProjectPageView.js
// 
// -------
define(["jquery", "backbone", "handlebars",
        "./BaseView", "models/ProjectModel", "backbone.forms"
    ],

    function($, Backbone, Handlebars, BaseView, ProjectModel) {

        var View = BaseView.extend({

            // The DOM Element associated with this view
            el: "#page-container",

            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {
                var project = new ProjectModel();
                var form = new Backbone.Form({
                    model: project
                }).render();

                // Render Layout
                this.$el.html(form.el);
                return this;
            }

        });

        // Returns the View class
        return View;

    }

);