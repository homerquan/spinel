// UserStatusModel
// The model stores user session status, and handles login/logout
// --------
define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Model = Backbone.Model.extend({

            url: "api/user/status?action=",

            // Model Constructor
            initialize: function() {
                //Check for sessionStorage support
                if (Storage && sessionStorage) {
                    this.supportStorage = true;
                };
            },

            // Default values for all of the Model attributes
            defaults: {
                userId: null,
                userProfile: null,
                sessionId: null,
            },

            isLogin: function() {
                return Boolean(this.get("sessionId"));
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
                }
            },

            login: function(credentials) {
                var that = this;
                var login = $.ajax({
                    url: this.url + 'login',
                    data: credentials,
                    type: 'POST'
                });
                login.done(function(response) {
                    that.set('userId', response.userId);
                    that.set('sessionId', response.sessionId);
                    that.set('userProfile', JSON.stringify(response.userProfile));
                    if (that.get('redirectFrom')) {
                        var path = that.get('redirectFrom');
                        that.unset('redirectFrom');
                        Backbone.history.navigate(path, {
                            trigger: true
                        });
                    } else {
                        Backbone.history.navigate('', {
                            trigger: true
                        });
                    }
                });
                login.fail(function() {
                    Backbone.history.navigate('login', {
                        trigger: true
                    });
                });
            },

            logout: function(callback) {
                var that = this;
                $.ajax({
                    url: this.url + 'logout',
                    type: 'POST'
                }).done(function(response) {
                    //Clear all session data
                    that.clear();
                    //Set the new csrf token to csrf vaiable and
                    //call initialize to update the $.ajaxSetup 
                    // with new csrf
                    csrf = response.csrf;
                    that.initialize();
                    callback();
                });
            },

        });

        // Returns the Model class
        return Model;

    }

);