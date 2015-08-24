// BaseModel.js
// --------
define(['jquery', 'backbone', 'mixins/CommonMixin', 'backbone.validation'],

    function($, Backbone, CommonMixin) {

        // Base Model
        var Model = Backbone.Model.extend({

            isRemote: false,

            idAttribute: "_id",

            setRemote: function(val) {
                this.isRemote = val;
                return this;
            },

            url: function() {
                var query = '';
                if (this.get('extents')) {
                    query += (this.get('extents') instanceof Array && this.get('extents').length > 0) ? '?extent=' + this.get('extents').join(',') : '';
                }
                var path = this.id ? '/' + this.name + '/' + this.id : '/' + this.name;
                return this.apiUrl + path + query;
            },

            // default parse for API standard
            parse: function(response) {
                if (response.meta) {
                    this.set('_meta', response.meta);
                }
                if (this.isRemote) {
                    return response.data;
                } else {
                    return response;
                }
            },
            // Remove this model from *localStorage*.
            clear: function() {
                this.destroy();
            }
        });

        // add validation
        _.extend(Model.prototype, Backbone.Validation.mixin);
        // and mixins
        _.extend(Model.prototype, CommonMixin);

        // Returns the Model class
        return Model;
    }

);