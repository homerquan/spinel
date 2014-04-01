// UserStatusModel
// The model stores user session status, and handles login/logout
// --------
define(["jquery", "backbone", "./BaseModel"],

    function($, Backbone, BaseModel) {

        // Creates a new Backbone Model class object
        var Model = BaseModel.extend({

            getUrl: function(action) {
                return this.apiUrl + "/user/status?action=" + action;
            },

            // Model Constructor
            initialize: function() {
                //Check for sessionStorage support
                if (Storage && sessionStorage) {
                    this.supportStorage = true;
                };
            },

            // Default values for all of the Model attributes
            defaults: {
                authenticated: false,
                message: "",
                userId: null,
                userProfile: null,
                sessionId: null,
            },

            isLogin: function() {
                return Boolean(this.get('authenticated'));
            },

            get: function(key) {
                if (this.supportStorage) {
                    var data = sessionStorage.getItem(key);
                    if (data && data[0] === '{') {
                        return JSON.parse(data);
                    } else {
                        return data;
                    }
                } else {
                    return Backbone.Model.prototype.get.call(this, key);
                }
            },

            set: function(key, value) {
                if (this.supportStorage) {
                    sessionStorage.setItem(key, value);
                } else {
                    Backbone.Model.prototype.set.call(this, key, value);
                }
                return this;
            },

            unset: function(key) {
                if (this.supportStorage) {
                    sessionStorage.removeItem(key);
                } else {
                    Backbone.Model.prototype.unset.call(this, key);
                }
                return this;
            },

            clear: function() {
                if (this.supportStorage) {
                    sessionStorage.clear();
                } else {
                    Backbone.Model.prototype.clear(this);
                };
                this.trigger('change');
            },

            login: function(name, pass, cb) {
                var credentials = {
                    username: name,
                    password: pass
                };
                var that = this;
                var login = $.ajax({
                    url: that.getUrl('login'),
                    data: credentials,
                    type: 'POST'
                });
                login.done(function(response) {
                    that.set('authenticated', true);
                    that.set('userId', response.userId);
                    that.set('sessionId', response.sessionId);
                    that.set('userProfile', JSON.stringify(response.userProfile));
                    var path = that.get('redirectFrom');
                    if (path && path !== "login") {
                        that.unset('redirectFrom');
                        Backbone.history.navigate(path, {
                            trigger: true
                        });
                    } else {
                        Backbone.history.navigate('', {
                            trigger: true
                        });
                    };
                    //pubsub
                    that.pubsub.trigger('user:login');
                    that.trigger('change');
                    if (_.isFunction(cb)) {
                        cb();
                    };
                });
                login.fail(function(response, status, error) {
                    Backbone.history.navigate('login', {
                        trigger: true
                    });
                });
            },

            logout: function(cb) {
                var that = this;
                $.ajax({
                    url: that.getUrl('logout'),
                    type: 'POST'
                }).done(function(response) {
                    //Clear all session data
                    that.clear();
                    //Set the new csrf token to csrf vaiable and
                    //call initialize to update the $.ajaxSetup 
                    // with new csrf
                    csrf = response.csrf;
                    that.initialize();
                    //pubsub
                    that.pubsub.trigger('user:logout');
                    if (_.isFunction(cb)) {
                        cb();
                    };
                });
            },

            getAuth: function(cb) {
                var that = this;
                var Session = this.fetch();

                Session.done(function(response) {
                    that.set('authenticated', true);
                    that.set('user', JSON.stringify(response.user));
                });

                Session.fail(function(response) {
                    response = JSON.parse(response.responseText);
                    that.clear();
                    csrf = response.csrf !== csrf ? response.csrf : csrf;
                    that.initialize();
                });
                if (_.isFunction(cb)) {
                    Session.always(cb);
                }
            }
        });

        // Returns the Model class
        return Model;

    }

);