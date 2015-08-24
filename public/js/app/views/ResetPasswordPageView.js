//ResetPasswordPageView.js
// -------
define(['jquery', 'backbone', 'handlebars',
        './BaseView', 'text!../../../tpl/reset_password_page.hbr',
        'ladda'
    ],

    function($, Backbone, Handlebars, BaseView, template, Ladda) {

        var View = BaseView.extend({

            el: '#page-container',
            template: Handlebars.compile(template),

            events: {
                'click #btn-next': 'next',
                'keypress input[name=email]': 'nextOnEnter'
            },

            /**
             * Talk to server directly to resetEmail
             * @return {promise}
             */
            resetEmail: function(email) {
                var options = {
                    url: this.apiUrl + '/user/status?action=reset_password',
                    data: JSON.stringify({
                        email: email
                    }),
                    method: 'POST'
                };
                return this.talkToServer(options);
            },

            render: function() {
                this.$el.html(this.template());
                Ladda.bind('#btn-next', {
                    timeout: 3000
                });
                // Maintains chainability
                return this;
            },

            next: function(e) {
                e.preventDefault();
                var that = this;
                var email = this.$('input[name=email]').val();
                this.resetEmail(email).then(function(res) {
                    Backbone.history.navigate('login', {
                        trigger: true
                    });
                    var notice = {
                        title: 'The email is sent',
                        text: 'Please open the link in the email to reset the password.',
                        hide: false,
                    };
                    that.pubsub.trigger('system:notify', notice);
                }, function(res) {
                    that.pubsub.trigger('system:notify', that.convertError(res));
                });
            },

            nextOnEnter: function(e) {
                if (e.keyCode != 13) return;
                this.next(e);
            }
        });

        // Returns the View class
        return View;

    }

);