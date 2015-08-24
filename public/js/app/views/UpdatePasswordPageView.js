//ResetPasswordPageView.js
// -------
define(['jquery', 'backbone', 'handlebars',
        './BaseView', 'text!../../../tpl/update_password_page.hbr',
        'ladda'
    ],

    function($, Backbone, Handlebars, BaseView, template, Ladda) {

        var View = BaseView.extend({

            el: '#page-container',
            template: Handlebars.compile(template),

            events: {
                'click #btn-change': 'updatePassword',
                'keypress input[name=confirm-password]': 'updateOnEnter'
            },

            /**
             * Talk to server directly to check token
             * @return {promise}
             */
            checkToken: function(token) {
                var options = {
                    url: this.apiUrl + '/user/status?action=check_vtoken',
                    data: JSON.stringify({
                        token: token
                    }),
                    method: 'POST'
                };
                return this.talkToServer(options);
            },

            /**
             * Talk to server directly to check token
             * @return {promise}
             */
            setPassword: function(token, password, confirmPassword) {
                var options = {
                    url: this.apiUrl + '/user/status?action=update_password',
                    data: JSON.stringify({
                        token: token,
                        password: password,
                        confirmPassword: confirmPassword
                    }),
                    method: 'POST'
                };
                return this.talkToServer(options);
            },

            render: function() {
                var that = this;
                this.checkToken(this.token).then(function(res) {
                    that.$el.html(that.template());
                    Ladda.bind('#btn-change', {
                        timeout: 3000
                    });
                }, function(res) {
                    Backbone.history.navigate('reset-password', {
                        trigger: true,
                        replace: true
                    });
                    that.pubsub.trigger('system:notify', that.convertError(res));
                });
                // Maintains chainability
                return this;
            },

            updatePassword: function(e) {
                e.preventDefault();
                var that = this;
                var password = this.$('input[name=password]').val();
                var confirmPassword = this.$('input[name=confirm-password]').val();
                this.setPassword(this.token, password, confirmPassword).then(function(res) {
                    Backbone.history.navigate('login', {
                        trigger: true
                    });
                    var notice = {
                        title: 'The password is updated',
                        text: 'Please login with your new password.',
                        hide: false,
                    };
                    that.pubsub.trigger('system:notify', notice);
                }, function(res) {
                    that.pubsub.trigger('system:notify', that.convertError(res));
                });
            },

            updateOnEnter: function(e) {
                if (e.keyCode != 13) return;
                this.updatePassword(e);
            }
        });

        // Returns the View class
        return View;

    }

);