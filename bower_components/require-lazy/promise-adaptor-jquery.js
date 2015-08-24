define(["jquery"],function($) {
	"use strict";

	return {
		makeDeferred: function() {
			return $.Deferred();
		},
		makePromise: function(deferred) {
			return deferred.promise();
		},
		all: function(promises) {
			return $.when.apply($, promises)
		}
	};
});
