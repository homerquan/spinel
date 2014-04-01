// BaseView.js
// --------
define(["jquery", "backbone", "../mixins/CommonMixin"],

    function($, Backbone, CommonMixin) {

        // Base View
        var View = Backbone.View.extend({

            initialize: function(context) {
                _.extend(this, context);
            },


            //destroy view but keep container
            clear: function() {
                // Safe unbind events to avoid events memory leading 
                this.undelegateEvents();
                this.$el.removeData().unbind();

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