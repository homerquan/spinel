// DesktopRouter.js
// ----------------
define(["jquery", "backbone", "./BaseRouter", "../models/SessionModel",
        "views/HomePageView", "views/LoginPageView",
        "views/SearchPageView", "views/ProfilePageView", "views/UserStatusView",
        "views/ProjectPageView", "views/RegisterPageView", "views/UserDashboardView",
        "views/QueryInputView", "views/CreateProjectPageView"
    ],

    function($, Backbone, BaseRouter, Session,
        HomePageView, LoginPageView, SearchPageView,
        ProfilePageView, UserStatusView, ProjectPageView,
        RegisterPageView, UserDashboardView, QueryInputView,
        CreateProjectPageView) {

        var DesktopRouter = BaseRouter.extend({

            initialize: function() {
                // Tells Backbone to start watching for hashchange events
                this.session = new Session();
                // Singleton Views
                this.queryInputView = new QueryInputView();
                this.userStatusView = new UserStatusView({
                    session: this.session
                });
                // TODO: daily pick skills
                this.userDashboardView = new UserDashboardView({
                    session: this.session,
                    topic: {
                        id: 't/1',
                        name: 'java'
                    }
                });
                this.queryInputView.render();
                this.userStatusView.render();
                this.userDashboardView.render();
                Backbone.history.start();
            },

            // All of your Backbone Routes (add more)
            routes: {
                // When there is no hash on the url, the home method is called
                "": "home",
                "search": "search",
                "search/:query": "search",
                "login": "login",
                "profile": "profile",
                "profile/:query": "profile",
                "p/:query": "project",
                "register": "register",
                "create-project": "createProject"
            },

            //Route handlers
            home: function() {
                this.loadView(new HomePageView({
                    session: this.session
                }));
            },

            search: function(query) {
                //TODO add input check here
                var checkedQuery = query || '';
                this.loadView(new SearchPageView({
                    query: checkedQuery,
                    session: this.session
                }));
            },

            login: function() {
                this.loadView(new LoginPageView({
                    session: this.session
                }));
            },

            profile: function() {

                this.loadView(new ProfilePageView({
                    session: this.session
                }));
            },

            project: function() {
                this.loadView(new ProjectPageView({
                    session: this.session
                }));
            },

            register: function() {
                this.loadView(new RegisterPageView({
                    session: this.session
                }));
            },

            createProject: function() {
                this.loadView(new CreateProjectPageView({
                    session: this.session
                }));
            }

        });

        // Returns the DesktopRouter class
        return DesktopRouter;

    }

);