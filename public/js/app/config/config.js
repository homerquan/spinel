// Require.js Configurations
// Use CDN as many as possilbe
// -------------------------
require.config({
    baseUrl: '/js/app',
    paths: {
        arbor: 'https://cdnjs.cloudflare.com/ajax/libs/arbor/0.91.0/arbor.min',
        pnotify: 'https://cdnjs.cloudflare.com/ajax/libs/pnotify/1.3.1/jquery.pnotify.min',
        jquery: '../libs/plugins/jquery',
        jqueryui: '../libs/plugins/jquery-ui',
        handlebars: '../libs/plugins/handlebars',
        'jquery.cookie': '../libs/plugins/jquery.cookie',
        bootstrap: '../libs/plugins/bootstrap',
        underscore: '../libs/plugins/underscore',
        moment: '../libs/plugins/moment',
        'jquery-mobile': 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mobile/1.4.1/jquery.mobile.min',
        'backbone.localStorage': '../libs/plugins/backbone.localStorage',
        backbone: '../libs/plugins/backbone',
        'backbone.validation': '../libs/plugins/backbone-validation',
        text: '../libs/plugins/text',
        promise: '../libs/plugins/promise',
        backbone_component: '../libs/plugins/backbone-component',
        'require-lazy': '../libs/plugins/lazy',
        spin: '../libs/plugins/spin',
        ladda: '../libs/plugins/ladda.min',
        webcomponentsjs: '../libs/plugins/webcomponents',
        polymer: '../libs/plugins/polymer',
        requirejs: '../libs/plugins/require'
    },
    shim: {
        jquerymobile: [
            'jquery'
        ],
        bootstrap: [
            'jquery'
        ],
        'jquery.cookie': [
            'jquery'
        ],
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        ladda: {
            deps: [
                'spin'
            ]
        }
    },
    packages: [

    ]
});