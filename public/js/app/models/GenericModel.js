// GenericModel.js
// --------
define(["jquery", "backbone", "./BaseModel"],

    function($, Backbone, BaseModel) {

        var Model = BaseModel.extend({

            url: function() {
                return this.apiUrl + '/' + this.query;
            }

        });

        return Model;

    }

);