// DesktopRouter.js
// ----------------
define(['jquery', 'backbone', './BaseRouter', '../models/SessionModel',
        'views/UserStatusView'
    ],
    function($, Backbone, BaseRouter, Session,
        UserStatusView) {

        var DesktopRouter = BaseRouter.extend({

            requresAuth: ['verify-email'],
            preventAccessWhenAuth: ['login', 'register', 'reset-password'],
            initialize: function() {
                // Tells Backbone to start watching for hashchange events
                this.session = new Session();
                // Singleton Views
                this.userStatusView = new UserStatusView({
                    session: this.session
                });
                this.userStatusView.render();
                Backbone.history.start({
                    pushState: true // if upper level rewrite, add hashChange: false
                });
                //all internal urls use html5 push status
                $(document).on('click', 'a[href]:not([data-bypass])', function(e) {
                    e.preventDefault();
                    if (this.host === location.host && !this.getAttribute('href').match(new RegExp('^\/(font|css|img|js|api)'))) {
                        Backbone.history.navigate(this.getAttribute('href'), true);
                    } else {
                        window.open(this.getAttribute('href'), '_blank');
                    }
                });
            },

            // All of your Backbone Routes (add more)
            routes: {
                // When there is no hash on the url, the home method is called
                '': 'home',
                'login': 'login',
                'register': 'register',
                'verify-email/:token': 'verifyEmail',
                'reset-password': 'resetPassword',
                'reset-password/:token': 'resetPassword',
                '*anything': 'notFound'
            },

            //Route handlers
            home: function() {
                require(['views/HomePageView'], function(HomePageView) {
                    this.loadView(new HomePageView({
                        session: this.session
                    }));
                }.bind(this));
            },

            login: function() {
                // if already login, redirect to home page
                if (this.session.isLogin()) {
                    Backbone.history.navigate('/', true);
                } else {
                    require(['views/LoginPageView'], function(LoginPageView) {
                        this.loadView(new LoginPageView({
                            session: this.session
                        }));
                    }.bind(this));
                }
            },


            verifyEmail: function(token) {
                require(['views/EmailVerifyPageView'], function(EmailVerifyPageView) {
                    this.loadView(new EmailVerifyPageView({
                        session: this.session,
                        token: token
                    }));
                }.bind(this));
            },

            resetPassword: function(token) {
                if (!token) {
                    require(['views/ResetPasswordPageView'], function(ResetPasswordPageView) {
                        this.loadView(new ResetPasswordPageView({
                            session: this.session
                        }));
                    }.bind(this));
                } else {
                    require(['views/UpdatePasswordPageView'], function(UpdatePasswordPageView) {
                        this.loadView(new UpdatePasswordPageView({
                            session: this.session,
                            token: token
                        }));
                    }.bind(this));
                }
            },

            notFound: function() {
                require(['views/StaticPageView'], function(StaticPageView) {
                    this.loadView(new StaticPageView({
                        session: this.session,
                        content: 'not_found'
                    }));
                }.bind(this));
            }
        });

        // Returns the DesktopRouter class
        return DesktopRouter;
    }
);