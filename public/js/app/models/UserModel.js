// UserModel.js
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
				roles: ['student'],
				skills: [],
				avatar: '../img/default-avatar.png'
			},

			validation: {
				firstname: {
					required: true,
					minLength: 2
				},
				lastname: {
					required: true,
					minLength: 2
				},
				username: {
					required: true,
					minLength: 3,
					pattern: /^[a-z0-9_-]{3,16}$/,
					msg: 'Please enter a username with 3-16 chars'
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

			name: 'user'
		});

		return Model;

	}

);