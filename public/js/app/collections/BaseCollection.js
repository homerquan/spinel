// BaseCollection.js
// -------------
define(["jquery", "backbone", "../mixins/CommonMixin"],

    function($, Backbone, CommonMixin) {

        // Base Collection
        var Collection = Backbone.Collection.extend({
            initialize: function(options) {
                _.extend(this, options);
            },
            parse: function(response) {
                return response.data;
            },
        });

        _.extend(Collection.prototype, CommonMixin);

        // Returns the Model class
        return Collection;

    }

);