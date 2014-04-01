define(["jquery", "backbone", "./BaseView",
        "./LoginModalView",
        "text!templates/login_user_status.handlebars", "text!templates/anonymous_user_status.handlebars"
    ],

    function($, Backbone, BaseView, LoginModalView, loginTemplate, anonymousTemplate) {

        var View = BaseView.extend({

            el: "#user-status",
            className: "",
            loginTemplate: Handlebars.compile(loginTemplate),
            anonymousTemplate: Handlebars.compile(anonymousTemplate),

            initialize: function(context) {
                _.extend(this, context);
                if (this.session) {
                    this.session.bind('change', this.render, this);
                }
            },

            events: {
                "click #user-signin": "signin",
                "click #user-signup": "signup",
                "click #user-logout": "logout",
                "click #toggle-db": "dashboardToggle",
            },

            render: function() {
                if (this.session && this.session.isLogin()) {
                    this.$el.html(this.loginTemplate(this.session.get('userProfile')));
                } else {
                    this.$el.html(this.anonymousTemplate());
                };
                return this;
            },

            signin: function() {
                new LoginModalView({
                    session: this.session
                }).render();
            },

            signup: function() {
                Backbone.history.navigate('register', {
                    trigger: true
                });
            },

            logout: function() {
                this.session.logout(function() {
                    Backbone.history.navigate('', {
                        trigger: true
                    });
                });
            },

            dashboardToggle: function() {
                $('#overcanvas-container').toggleClass('active');
            }

        });

        // Returns the View class
        return View;

    }

);