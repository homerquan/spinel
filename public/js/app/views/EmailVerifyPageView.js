// ProfilePageView.js
// show self profile from session 
// or other's specified by id
// -------
define(['jquery', 'backbone', 'handlebars',
        './BaseView',
        'text!../../../tpl/static/email_verify_success.hbr',
        'text!../../../tpl/static/email_verify_fail.hbr'
    ],

    function($, Backbone, Handlebars, BaseView, successTemplate, failTemplate) {

        var View = BaseView.extend({

            // The DOM Element associated with this view
            el: '#page-container',

            initialize: function(context) {
                _.extend(this, context);
                this.successTemplate = Handlebars.compile(successTemplate);
                this.failTemplate = Handlebars.compile(failTemplate);
            },

            /**
             * Talk to server directly to verify token
             * @return {promise}
             */
            verifyToken: function() {
                var options = {
                    url: this.apiUrl + '/user/status?action=verify&token=' + this.token,
                    method: 'POST'
                };
                return this.talkToServer(options);
            },


            // Renders the view's template to the UI
            render: function() {
                var that = this;
                this.verifyToken().then(function(res) {
                    // Render Layout
                    that.$el.html(that.successTemplate());
                }, function(res) {
                    var errorCode = res.responseJSON ? res.responseJSON.code || 1 : 1;
                    switch (errorCode) {
                        case 2:
                            that.$el.html(that.failTemplate());
                            break;
                        default:
                            Backbone.history.navigate('page/error', {
                                trigger: true,
                                replace: true
                            });
                            break;
                    }
                });
                return this;
            }

        });

        // Returns the View class
        return View;

    }

);