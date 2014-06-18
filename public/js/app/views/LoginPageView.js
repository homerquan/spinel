// LoginModalView.js
// -------
define(["jquery", "backbone", "handlebars",
        "./BaseView", "text!templates/login_page.hbr"
    ],

    function($, Backbone, Handlebars, BaseView, template) {

        var View = BaseView.extend({

            // The DOM Element associated with this view
            el: "#page-container",
            template: Handlebars.compile(template),

            // View Event Handlers
            events: {
                "click #btn-signin": "signin",
                "click #btn-signup": "signup"
            },

            // Renders the view's template to the UI
            // If bisic cookie exists, use it
            render: function() {
                var basicCookie = $.cookie('B') || null;
                this.$el.html(this.template(basicCookie));
                // Maintains chainability
                return this;
            },

            signin: function(e) {
                e.preventDefault();
                var credentials = {
                    username: this.$('input[name=username]').val(),
                    password: this.$('input[name=password]').val(),
                    remember: this.$('input[name=remember]').prop('checked')
                };
                this.session.login(credentials, 'login');
            }
        });

        // Returns the View class
        return View;

    }

);