// Collection.js
// -------------
define(["jquery", "backbone", "models/SearchCardModel"],

  function($, Backbone, SearchCardModel) {

    // Creates a new Backbone Collection class object
    var Collection = Backbone.Collection.extend({

      initialize: function(options) {
        _.extend(this, options);
      },

      parse: function(response) {
        return response.data;
      },

      url: function() {
        return '/api/search';
      },

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: SearchCardModel

    });

    // Returns the Model class
    return Collection;

  }

);