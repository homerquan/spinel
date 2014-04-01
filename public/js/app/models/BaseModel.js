// BaseModel.js
// --------
define(["jquery", "backbone", "../mixins/CommonMixin"],

    function($, Backbone, CommonMixin) {

        // Base Model
        var Model = Backbone.Model.extend({

            initialize: function(options) {
                _.extend(this, options);
            },

            // default parse for API standard
            parse: function(response) {
                return response.data;
            },

            defaults: {

            },

            validate: function(attrs) {

            },

            // Remove this model from *localStorage*.
            clear: function() {
                this.destroy();
            }
        });

        _.extend(Model.prototype, CommonMixin);

        // Returns the Model class
        return Model;
    }

);