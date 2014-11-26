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

            dev: false,
            jsonPath: 'http://fiktion.cc/wp-content/themes/Fiktion/data/bookData.json',
            debug: false,
            clearStorage: false,
            scrollSpeed: 10

        });

        app.init();

    });
});
