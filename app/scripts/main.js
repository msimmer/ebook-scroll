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
        },
        'plugins/searchField': {
            deps: ['jquery']
        }
    }
});

require([
    'jquery',
    'app',
    'shims/storage'
], function ($, App) {
    'use strict';

    $(function () {

        var app = new App({

            dev: true,
            debug: true,
            clearStorage: true,
            scrollSpeed: 10

        });

        app.init();

    });
});
