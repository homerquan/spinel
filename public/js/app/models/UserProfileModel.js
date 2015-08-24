// UserProfileModel.js
// Share the same end point with user
// --------
define(['jquery', 'backbone', './BaseModel'],

	function($, Backbone, BaseModel) {

		var Model = BaseModel.extend({

			defaults: {},

			validation: {},

			parse: function(data) {
				var result = {};
				if (data.profile)
					result = result.profile;
				return result;
			},

			url: function() {
				var path = '/user/' + this.id + '?extent=profile';
				return this.apiUrl + path;
			}

		});
		return Model;
	}

);