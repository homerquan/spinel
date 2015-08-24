// GenericCollection.js
// -------------
define(['jquery', 'backbone', './BaseCollection', 'models/GenericItemModel'],

    function($, Backbone, BaseCollection, GenericItemModel) {

        // Creates a new Backbone Collection class object
        var Collection = BaseCollection.extend({

            url: function() {
                return this.apiUrl + '/' + this.query;
            },

            model: GenericItemModel

        });

        // Returns the Model class
        return Collection;

    }

);