require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'plugins/hoverIntent': {
            deps: ['jquery']
        }
    }
});

require([
    'jquery',
    'app',
    'env',
    'shims/storage'
], function ($, App, Env) {
    'use strict';

    $(document).ready(function () {

        var app = new App({

            debug: false
            clearStorage: true
            scrollSpeed: 50,

        });

        app.init();

    });

});
