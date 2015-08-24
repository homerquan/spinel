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
        d3: 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min',
        vis: '../libs/plugins/vis.min',
        ace: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace',
        marked: 'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min',
        backbone: '../libs/plugins/backbone',
        'jasmine-jquery': '../libs/plugins/jasmine-jquery',
        'backbone.validation': '../libs/plugins/backbone-validation-amd',
        text: '../libs/plugins/text',
        'jquery.easy-pie-chart': '../libs/plugins/jquery.easypiechart',
        requirejs: '../libs/plugins/require',
        jasmine: '../libs/plugins/jasmine',
        'bootstrap-markdown': '../libs/plugins/bootstrap-markdown',
        etch: '../libs/custom/etch',
        select2: '../libs/plugins/select2',
        'jquery.postmessage-transport': '../libs/plugins/jquery.postmessage-transport',
        'jquery.xdr-transport': '../libs/plugins/jquery.xdr-transport',
        'jquery.ui.widget': '../libs/plugins/jquery.ui.widget',
        'jquery.fileupload': '../libs/plugins/jquery.fileupload',
        'jquery.fileupload-process': '../libs/plugins/jquery.fileupload-process',
        'jquery.fileupload-validate': '../libs/plugins/jquery.fileupload-validate',
        'jquery.fileupload-image': '../libs/plugins/jquery.fileupload-image',
        'jquery.fileupload-audio': '../libs/plugins/jquery.fileupload-audio',
        'jquery.fileupload-video': '../libs/plugins/jquery.fileupload-video',
        'jquery.fileupload-ui': '../libs/plugins/jquery.fileupload-ui',
        'jquery.fileupload-jquery-ui': '../libs/plugins/jquery.fileupload-jquery-ui',
        'jquery.fileupload-angular': '../libs/plugins/jquery.fileupload-angular',
        'jquery.iframe-transport': '../libs/plugins/jquery.iframe-transport',
        'blueimp-canvas-to-blob': '../libs/plugins/canvas-to-blob',
        'load-image': '../libs/plugins/load-image',
        'load-image-ios': '../libs/plugins/load-image-ios',
        'load-image-orientation': '../libs/plugins/load-image-orientation',
        'load-image-meta': '../libs/plugins/load-image-meta',
        'load-image-exif': '../libs/plugins/load-image-exif',
        'load-image-exif-map': '../libs/plugins/load-image-exif-map',
        'blueimp-tmpl': '../libs/plugins/tmpl',
        backbone_component: '../libs/plugins/backbone-component',
        fullpage: '../libs/plugins/jquery.fullPage',
        'jquery.slimscroll': '../libs/plugins/jquery.slimscroll.min',
        'bootstrap-switch': '../libs/plugins/bootstrap-switch',
        'require-lazy': '../libs/plugins/lazy',
        'html5-image-loader': '../libs/custom/html5imageupload',
        rv: '../libs/custom/rv',
        promise: '../libs/custom/promise',
        spin: '../libs/plugins/spin',
        ladda: '../libs/plugins/ladda.min',
        'backbone.epoxy': '../libs/plugins/backbone.epoxy',
        ractive: '../libs/plugins/ractive',
        'ractive-adaptors-backbone': '../libs/plugins/ractive-adaptors-backbone',
        webcomponentsjs: '../libs/plugins/webcomponents',
        polymer: '../libs/plugins/polymer',
        platform: '../libs/plugins/platform',
        bootbox: '../libs/plugins/bootbox',
        'backbone-forms': '../libs/plugins/backbone-forms',
        'jquery-mobile-bower': '../libs/plugins/jquery.mobile-1.4.5',
        'moment-timezone': '../libs/plugins/moment-timezone-with-data-2010-2020'
    },
    shim: {
        jquerymobile: [
            'jquery'
        ],
        bootstrap: [
            'jquery'
        ],
        jqueryui: [
            'jquery'
        ],
        fullpage: [
            'jquery',
            'jqueryui',
            'jquery.slimscroll'
        ],
        'html5-image-loader': [
            'jquery'
        ],
        'jquery.easy-pie-chart': [
            'jquery'
        ],
        pnotify: [
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
        arbor: {
            deps: [
                'jquery'
            ],
            exports: 'arbor'
        },
        etch: {
            deps: [
                'jquery',
                'backbone',
                'underscore'
            ],
            exports: 'etch'
        },
        select2: {
            exports: 'select2'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        promise: {
            exports: 'Promise'
        },
        ace: {
            exports: 'ace'
        },
        marked: {
            exports: 'marked'
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