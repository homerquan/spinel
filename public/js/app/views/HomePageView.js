// HomePageView.js
// -------
define(['jquery', 'backbone', 'handlebars',
        './BaseView', 'webcomponentsjs',
        'text!../../../tpl/login_home_page.hbr',
        'text!../../../tpl/anonymous_home_page.hbr'
    ],

    function($, Backbone, Handlebars, BaseView, Webcomponents,
        loginTemplate, anonymousTemplate) {

        var View = BaseView.extend({

            // The DOM Element associated with this view
            el: '#page-container',
            loginTemplate: Handlebars.compile(loginTemplate),
            anonymousTemplate: Handlebars.compile(anonymousTemplate),

            initialize: function(context) {
                _.extend(this, context);
                if (this.session) {
                    this.session.bind('change', this.render, this);
                }
            },
            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {
                var that = this;
                if (this.session && this.session.isLogin()) {
                    this.$el.html(this.loginTemplate());
                    require(['collections/Feeds', 'views/FeedCardView'], function(Collection, FeedCardView) {
                        that.itemView = FeedCardView;
                        that.collection = new Collection();
                        that.collection.on('sync', that.renderFeeds, that);
                        _.defer(function() {
                            that.collection.fetch();
                        });
                    });
                } else {
                    this.$el.html(this.anonymousTemplate());
                }
                return this;
            },

            renderFeeds: function() {
                this.collection.models.reverse().forEach(this.addItem.bind(this));
            },

            addItem: function(model) {
                $('#feeds-container').append(new this.itemView({
                    model: model,
                    parent: this
                }).render().$el);
            }

        });

        // Returns the View class
        return View;

    }

);