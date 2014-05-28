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
    // 'use strict';

    $(function () {

        // window.uuid = 'fiktion.' + localStorage.getItem('fiktion.referrer');
        window.uuid = 'fiktion.' + '21a7619e-ec78-4694-97c9-88a173795996';

        var app = new App({

            debug: false,
            clearStorage: true,
            scrollSpeed: 50,

        });

        app.init();

    });
});
