// GenericItemModel.js
// --------
define(["jquery", "backbone", "./BaseModel"],

    function($, Backbone, BaseModel) {

        var Model = BaseModel.extend({
            // data from each item of collection
            parse: function(data) {
                return data;
            }
        });

        // Returns the Model class
        return Model;

    }

);