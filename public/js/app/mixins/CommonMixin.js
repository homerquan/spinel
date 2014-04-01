// CommonMixin.js
// --------
define(["jquery", "backbone"],

    function($, Backbone) {

        // common setting and functions  
        // such as global event-bus for pubsub
        var Mixin = {
            apiUrl: "api/v1",
            pubsub: _.extend({}, Backbone.Events)
        };

        return Mixin;

    }

);