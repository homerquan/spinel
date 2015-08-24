// LoginModalView.js
// -------
define(['jquery', 'backbone', 'handlebars',
        './BaseView', 'text!../../../tpl/login_modal.hbr'
    ],

    function($, Backbone, Handlebars, BaseView, template) {

        var View = BaseView.extend({

            // The DOM Element associated with this view
            el: '#overlay-container',
            template: Handlebars.compile(template),

            // View Event Handlers
            events: {
                'click #btn-signin': 'signin',
                'click #btn-signup': 'signup',
                'click button.close': 'close'
            },

            // Renders the view's template to the UI
            render: function() {
                this.$el.html(this.template());
                // Maintains chainability
                return this;
            },

            signin: function(e) {
                e.preventDefault();
                var name = this.$('#username').val();
                var pass = this.$('#password').val();
                this.session.set('redirectFrom', Backbone.history.fragment);
                this.session.login(name, pass, function() {
                    this.clear();
                }.bind(this));
            },

            close: function() {
                this.clear();
            }

        });

        // Returns the View class
        return View;

    }

);