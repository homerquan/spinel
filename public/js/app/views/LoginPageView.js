// LoginModalView.js
// -------
define(['jquery', 'backbone', 'handlebars',
        './BaseView', 'text!../../../tpl/login_page.hbr',
        'ladda'
    ],

    function($, Backbone, Handlebars, BaseView, template, Ladda) {

        var View = BaseView.extend({

            // The DOM Element associated with this view
            el: '#page-container',
            template: Handlebars.compile(template),

            // View Event Handlers
            events: {
                'click #btn-signin': 'signin',
                'keypress input[name=password]': 'signinOnEnter'
            },

            // Renders the view's template to the UI
            // If bisic cookie exists, use it
            render: function() {
                var basicCookie = $.cookie('B') || null;
                this.$el.html(this.template(basicCookie));
                Ladda.bind('#btn-signin', {
                    timeout: 3000
                });
                // Maintains chainability
                return this;
            },

            signin: function(e) {
                e.preventDefault();
                var credentials = {
                    username: this.$('input[name=username]').val(),
                    password: this.$('input[name=password]').val(),
                    remember: this.$('input[name=remember]').prop('checked')
                };
                this.session.login(credentials, 'login');
            },

            signinOnEnter: function(e) {
                if (e.keyCode != 13) return;
                this.signin(e);
            }
        });

        // Returns the View class
        return View;

    }

);