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
], function($, App, Env) {
    'use strict';

    $(document).ready(function() {

        var app = new App({

            // dev
            debug: !! window.ebs && window.ebs.debug,
            clearStorage: !! window.ebs && window.ebs.clearStorage,

            // syncs with localstorage user data
            defaultFontSize: 18, // (int) default body font-size in px
            fSize: 100, // (int) percent of main's font-size, default 100%

            contrast: 'light', // (str) light or dark

            // syncs with localstorage reader data
            scrollSpeed: 50 // (int) scroll speed 1-100%

        });

        app.init();

    });

});
