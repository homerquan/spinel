define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    var BaseRouter = Backbone.Router.extend({

        // Routes that need authentication and if user is not authenticated
        // gets redirect to login page
        requresAuth: ['#profile', '#project'],

        // Routes that should not be accessible if user is authenticated
        // for example, login, register, forgetpasword ...
        preventAccessWhenAuth: ['#login'],

        currentPage: null,

        loadView: function(view) {
            // avoid event leaking
            if (this.currentPage) {
                this.currentPage.clear();
            }
            this.currentPage = view;
            // events need to rebind, only render doesn't work
            this.currentPage.delegateEvents();
            this.currentPage.render();
        },

        route: function(route, name, callback) {
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) callback = this[name];

            var router = this;

            Backbone.history.route(route, function(fragment) {
                var args = router._extractParameters(route, fragment);

                var next = function() {
                    if (typeof(callback) == "function")
                        callback.apply(router, args);
                    router.trigger.apply(router, ['route:' + name].concat(args));
                    router.trigger('route', name, args);
                    Backbone.history.trigger('route', router, name, args);
                    router.after.apply(router, args);
                };
                router.before.apply(router, [args, next]);
            });
            return this;
        },


        before: function(params, next) {
            //Checking if user is authenticated or not
            //then check the path if the path requires authentication 
            var isLogin = this.session.isLogin();
            var path = Backbone.history.location.hash;
            var needAuth = _.contains(this.requresAuth, path);
            var cancleAccess = _.contains(this.preventAccessWhenAuth, path);

            if (needAuth && !isLogin) {
                //If user gets redirect to login because wanted to access
                // to a route that requires login, save the path in session
                // to redirect the user back to path after successful login
                this.session.set('redirectFrom', path);
                Backbone.history.navigate('login', {
                    trigger: true
                });
            } else if (isLogin && cancleAccess) {
                //User is authenticated and tries to go to login, register ...
                // so redirect the user to home page
                Backbone.history.navigate('', {
                    trigger: true
                });
            } else {
                //No problem, handle the route
                return next();
            }
        },

        after: function() {
            // put analysis here
        },

        fetchError: function(error) {
            //If during fetching data from server, session expired
            // and server send 401, call getAuth to get the new CSRF
            // and reset the session settings and then redirect the user
            // to login
            if (error.status === 401) {
                this.session.getAuth(function() {
                    Backbone.history.navigate('login', {
                        trigger: true
                    });
                });
            }
        }
    });

    return BaseRouter;

});