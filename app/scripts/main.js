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
    'chapter',
    'env',
    'shims/storage'
], function($, App, Chapter, Env, ShimStorage) {
    'use strict';

    $(document).ready(function() {

        var app = new App({

            el: $('main'),
            chapters: $('.chapters'),
            debug: window.ebs && window.ebs.debug ? window.ebs.debug : false,

            // syncs with localstorage user data
            //
            defaultFontSize: 18,                        // (int) default body font-size in px
            fSize: 100,                                 // (int) percent of main's font-size, default 100%

            maxFontSize: function() {
                return Env.isMobile() ? 120 : 160;      // (int) max font size in %
            },

            minFontSize: function() {
                return Env.isMobile() ? 40 : 80;        // (int) min font size in %
            },

            contrast: 'dark',                           // (str) light or dark

            // syncs with localstorage reader data
            //
            scrollSpeed: 30,                            // (int) scroll speed
            scrollInt: null,                            // (fn) stores current scrollInterval
            scrollTimeout: null                         // (fn) stores current rFA setTimeout

        });

        app.init();

        new Chapter(app.reader.currentPage);

    });

});
