// ProjectModel.js
// --------
define(["jquery", "backbone", "./BaseModel"],

    function($, Backbone, BaseModel) {

        var Model = BaseModel.extend({

            schema: {
                title: {
                    validators: ['required', 'Text']
                },
                description: {
                    validators: ['required', 'Text']
                }
            },

            url: function() {
                return this.apiUrl + '/' + this.query;
            }

        });

        return Model;

    }

);