// UserStatusModel
// The model stores user session status, and handles login/logout
// --------
define(['jquery', 'backbone', './BaseModel', './MeModel'],

    function($, Backbone, BaseModel, MeModel) {

        // Creates a new Backbone Model class object
        var Model = BaseModel.extend({

            getUrl: function(action) {
                return this.apiUrl + '/user/status?action=' + action;
            },

            // Model Constructor
            initialize: function() {
                // if not login, try auth via A cookie
                if (!this.isLogin()) {
                    var refreshToken = $.cookie('A');
                    if (refreshToken) {
                        this.login({
                            refresh_token: refreshToken
                        }, 'refresh');
                    }
                }

                // Check for sessionStorage support
                if (Storage && sessionStorage) {
                    this.supportStorage = true;
                }

                this.setAuthHeader();

            },

            setAuthHeader: function() {
                // init authorization header when refreshing page
                $.ajaxSetup({
                    headers: {
                        'Authorization': this.getAuthToken()
                    }
                });
            },

            // Default values for all of the Model attributes
            defaults: {
                accessToken: null,
                refreshToken: null,
                tokenType: null,
                expiresIn: null,
                userInfo: null,
                rememberAuth: false
            },

            isLogin: function() {
                return Boolean(this.get('accessToken'));
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
                this.trigger('change');
            },

            getAuthToken: function() {
                if (!this.get('accessToken') || !this.get('tokenType'))
                    return null;
                else
                    return this.get('tokenType') + ' ' + this.get('accessToken');
            },
            /*
             * Login in either username/password or refreshToken
             * @credentials either username/password or refresh token (required)
             * @param type of login [login|refresh] (required)
             */
            login: function(credentials, type, cb) {
                if (credentials.remember) {
                    this.set('rememberAuth', true);
                }
                var that = this;
                var login = $.ajax({
                    url: that.getUrl(type),
                    data: JSON.stringify(credentials) || '{}',
                    contentType: 'application/json',
                    type: 'POST'
                });
                login.done(function(response) {
                    var meModel = new MeModel();
                    meModel.setRemote(true); //has to set remote to strip 'data'
                    that.set('accessToken', response.access_token);
                    that.set('refreshToken', response.refresh_token);
                    that.set('tokenType', response.token_type);
                    that.set('expiresIn', response.expires_in);
                    if (that.get('rememberAuth')) {
                        $.cookie('A', response.refresh_token, {
                            expires: 1
                        });
                    }
                    that.setAuthHeader.call(that);
                    meModel.fetch({
                        success: function(model, response) {
                            var userInfo = model.attributes || {};
                            that.set('userInfo', JSON.stringify(userInfo));
                            $.cookie('B', userInfo, {
                                expires: 365
                            });
                            that.pubsub.trigger('user:login');
                            that.trigger('change');
                            var path = that.get('redirectFrom');
                            if (path && path !== 'login') {
                                that.unset('redirectFrom');
                                Backbone.history.navigate(path, {
                                    trigger: true
                                });
                            }

                            if (_.isFunction(cb)) {
                                cb();
                            }
                        },
                        error: function(model, response) {
                            that.pubsub.trigger('user:logout');
                        }
                    });
                });
                login.fail(function(response, status, error) {
                    that.pubsub.trigger('system:notify', that.convertError(response));
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
                    //csrf = response.csrf;
                    $.removeCookie('A');
                    that.initialize();
                    //pubsub
                    that.pubsub.trigger('user:logout');
                    if (_.isFunction(cb)) {
                        cb();
                    }
                });
            },
            hasRole: function(role) {
                var userInfo = this.get('userInfo');
                if (userInfo.roles) {
                    return _.contains(userInfo.roles, role);
                } else {
                    return false;
                }
            },
            addRole: function(role) {
                var userInfo = this.get('userInfo');
                if (userInfo.roles) {
                    userInfo.roles.push(role);
                    this.set('userInfo', JSON.stringify(userInfo));
                }
                return this;
            }
        });

        // Returns the Model class
        return Model;

    }

);