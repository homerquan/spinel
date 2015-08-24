define(['jquery', 'backbone', 'handlebars', './BaseView',
        'text!../../../tpl/login_user_status.hbr',
        'text!../../../tpl/anonymous_user_status.hbr',
        'text!../../../tpl/loader_overlay.hbr'
    ],

    function($, Backbone, Handlebars, BaseView, loginTemplate, anonymousTemplate, loaderTemplate) {

        var View = BaseView.extend({

            el: '#user-status',
            className: '',
            loginTemplate: Handlebars.compile(loginTemplate),
            anonymousTemplate: Handlebars.compile(anonymousTemplate),
            loaderTemplate: Handlebars.compile(loaderTemplate),

            initialize: function(context) {
                _.extend(this, context);
                if (this.session) {
                    this.session.bind('change', this.render, this);
                }

                // add notification subscription 
                this.pubsub.on('system:notify', function(notice) {
                    new $.pnotify(notice);
                });

                // add global message subscription
                this.pubsub.on('system:global-message', function(message) {
                    var stack = {
                        'dir1': 'down',
                        'dir2': 'right',
                        'push': 'top',
                        'spacing1': 0,
                        'spacing2': 0,
                        'context': $('#global-message-container')
                    };
                    message.stack = stack;
                    message.delay = 10000;
                    new $.pnotify(message);
                });

                // add global loader
                this.pubsub.on('system:startLoadView', function() {
                    $('#overlay-container').html(this.loaderTemplate());
                }.bind(this));
                this.pubsub.on('system:finishLoadView', function() {
                    $('#overlay-container .overlay-loader').remove();
                });
            },

            events: {
                'click #user-signin': 'signin',
                'click #user-signup': 'signup',
                'click #user-logout': 'logout',
                'click #toggle-db': 'dashboardToggle'
            },

            render: function() {
                if (this.session && this.session.isLogin()) {
                    var user = this.session.get('userInfo');
                    this.$el.html(this.loginTemplate(user));
                } else {
                    this.$el.html(this.anonymousTemplate());
                }
                $('#navbar [data-toggle="tooltip"]').tooltip();
                return this;
            },

            //login user only subscribtion events
            loadSub: function() {},

            signin: function() {
                Backbone.history.navigate('login', {
                    trigger: true
                });
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
                if (!this.userDashboardView) {
                    this.loadSub();
                }
            }

        });

        // Returns the View class
        return View;

    }

);