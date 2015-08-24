// RegisterPageView.js
// -------
define(['jquery', 'backbone', 'handlebars',
        './BaseView', 'models/UserModel', 'text!../../../tpl/register_page.hbr',
        'ladda'
    ],

    function($, Backbone, Handlebars, BaseView, UserModel, template, Ladda) {

        var View = BaseView.extend({

            // The DOM Element associated with this view
            el: '#page-container',
            template: Handlebars.compile(template),

            // View Event Handlers
            events: {
                'click #btn-signup': 'signup'
            },

            initialize: function() {
                this.model = new UserModel();
            },

            // monitor changes in fields
            bindChange: function() {
                var that = this;
                this.firstname = $('input[name=firstname]');
                this.lastname = $('input[name=lastname]');
                this.email = $('input[name=email]');
                this.username = $('input[name=username]');
                this.password = $('input[name=password]');

                this.firstname.keyup(function(e) {
                    that.model.set({
                        firstname: $(e.currentTarget).val()
                    });
                    that.model.validate();
                    that.highlightValidation('firstname', $(e.currentTarget));
                });
                this.lastname.keyup(function(e) {
                    that.model.set({
                        lastname: $(e.currentTarget).val()
                    });
                    that.model.validate();
                    that.highlightValidation('lastname', $(e.currentTarget));
                });

                this.username.keyup(function(e) {
                    that.model.set({
                        username: $(e.currentTarget).val()
                    });
                    that.model.validate();
                    that.highlightValidation('username', $(e.currentTarget));
                });

                this.email.keyup(function(e) {
                    that.model.set({
                        email: $(e.currentTarget).val()
                    });
                    that.model.validate();
                    that.highlightValidation('email', $(e.currentTarget));
                });

                this.password.keyup(function(e) {
                    that.model.set({
                        password: $(e.currentTarget).val()
                    });
                    that.model.validate();
                    that.highlightValidation('password', $(e.currentTarget));
                });
            },

            // Renders the view's template to the UI
            render: function() {
                var that = this;
                this.$el.html(this.template());
                Ladda.bind('#btn-signup', {
                    timeout: 3000
                });
                this.bindChange();
                Backbone.Validation.bind(this, {
                    valid: function(view, attr, selector) {
                        var target = $('input[name=' + attr + ']');
                        if (target.next().hasClass('inline-message')) {
                            target.next().remove();
                        }
                    },
                    invalid: function(view, attr, error) {
                        var target = $('input[name=' + attr + ']');
                        that.inlineMessage(target, error);
                    }
                });
                // Maintains chainability
                return this;
            },

            attributesChanged: function() {
                var valid = false;
                if (this.get('username') && this.get('password'))
                    valid = true;
                this.trigger('validated', valid);
            },

            signup: function() {
                var that = this;
                this.model.validate();
                this.model.save({}, {
                    success: function(model, response) {
                        Backbone.history.navigate('goals', {
                            trigger: true
                        });
                    },
                    error: function(model, response) {
                        that.pubsub.trigger('system:notify', that.convertError(response));
                    }
                });
            }
        });

        // Returns the View class
        return View;

    }

);