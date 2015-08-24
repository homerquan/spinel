// CommonMixin.js
// Shared by model, collection and view
// --------
define(['jquery', 'backbone', 'promise'],

	function($, Backbone, Promise) {

		var convertError = function(response) {
			var notice = {
				title: "Error",
				text: "Something wrong",
				type: "info"
			};
			if ('responseJSON' in response) {
				var data = response.responseJSON;
				notice = {
					title: data.error || 'Notice',
					text: data.message || '',
					type: data.type || 'info'
				};
			}
			return notice;
		};

		/**
		 * Talk to API directly without Backbone model
		 * For example: logout, and verify email by token
		 * @param  {object} options
		 * @return {Promise}
		 */
		var talkToServer = function(options) {
			var call = $.ajax({
				url: options.url || '',
				data: options.data || {},
				contentType: options.contentType || 'application/json',
				method: options.method || 'GET'
			});
			// convert jquery promise into standard one
			return Promise.resolve(call);
		};

		// common setting and functions  
		// such as global event-bus for pubsub
		var mixin = {
			apiUrl: '/api/v1',
			pubsub: _.extend({}, Backbone.Events),
			convertError: convertError,
			talkToServer: talkToServer
		};

		return mixin;

	}

);