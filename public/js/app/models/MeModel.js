// MeModel.js
// A special model for user's own data
// --------
define(['jquery', 'backbone', './BaseModel'],

	function($, Backbone, BaseModel) {

		var Model = BaseModel.extend({
			defaults: {
				firstname: '',
				lastname: '',
				username: '',
				email: '',
				password: '',
				profile: {
					avatar: '../img/default-avatar.png'
				}
			},

			validation: {
				firstname: {
					required: true,
					minLength: 3
				},
				lastname: {
					required: true,
					minLength: 3
				},
				username: {
					required: true,
					minLength: 3
				},
				email: {
					required: true,
					pattern: 'email'
				},
				password: {
					required: true,
					minLength: 6
				}
			},

			url: function() {
				var path = '/me';
				return this.apiUrl + path;
			}
		});

		return Model;

	}

);