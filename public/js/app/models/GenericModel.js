// GenericModel.js
// --------
define(['jquery', 'backbone', './BaseModel'],

	function($, Backbone, BaseModel) {

		var Model = BaseModel.extend({
			// "_query" is reserved for
			url: function() {
				return this.apiUrl + '/' + this.get('_query');
			}
		});

		return Model;

	}

);