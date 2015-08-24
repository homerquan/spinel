/**
 * BaseView
 * For sharing common properties and methods among views
 */
define(['jquery', 'backbone', 'handlebars', 'mixins/CommonMixin'],

    function($, Backbone, Handlebars, CommonMixin) {

        // Base View
        var View = Backbone.View.extend({

            initialize: function(context) {
                _.extend(this, context);
            },

            inlineMessage: function(target, message) {
                if (target.next().hasClass('inline-message')) {
                    target.next().remove();
                }
                target.after('<span class="inline-message">' + message + '</span>');
                return this;
            },

            highlightValidation: function(att, target) {
                if (this.model.isValid(att)) {
                    target.removeClass('invalid');
                } else {
                    target.addClass('invalid');
                }
                return this;
            },

            renderAt: function(el) {
                this.el = el;
                this.render();
                return this;
            },

            /**
             * Load a webcomponent
             * @param  {string} component name in 'comp'
             * @return {this}   keep chainable
             */
            loadComponent: function(name) {
                this.$el.append('<link rel="import" href="comp/' + name + '/' + name + '.html">');
                return this;
            },

            /**
             * Destroy view but keep container
             * @return {this} keep chainable
             */
            clear: function() {
                // Safe unbind events to avoid events memory leading 
                this.undelegateEvents();
                this.$el.removeData().unbind();
                $.pnotify_remove_all();
                // Remove view from DOM
                this.$el.empty();
                return this;
            }
        });

        _.extend(View.prototype, CommonMixin);

        // Returns the Model class
        return View;
    }

);