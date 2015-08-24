// BaseCollection.js
// -------------
define(['jquery', 'backbone', 'mixins/CommonMixin'],

    function($, Backbone, CommonMixin) {

        var Collection = Backbone.Collection.extend({

            initialize: function(options) {
                _.extend(this, options);
            },

            url: function() {
                var query = '';
                if (this.extents) {
                    query += (this.extents instanceof Array && this.extents.length > 0) ? '?extent=' + this.extents.join(',') : '';
                }
                if (this.filters) {
                    query += (this.filters instanceof Array && this.filters.length > 0) ? '&' + this.filters.join('&') : '';
                }
                return this.apiUrl + '/' + this.name + query;
            },

            parse: function(response) {
                if (response.meta) {
                    this.set('_meta', response.meta);
                }
                return response.data;
            }
        });

        // Add mixins
        _.extend(Collection.prototype, CommonMixin);

        // Returns the Model class
        return Collection;

    }

);