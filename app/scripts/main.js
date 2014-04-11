// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function() {
    log.history = log.history || []; // store logs to an array for reference
    log.history.push(arguments);
    if (this.console) {
        console.log(Array.prototype.slice.call(arguments));
    }
};

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
        'plugins/touchSwipe.js': {
            deps: ['jquery']
        }
    }
});

require([
    'jquery',
    'app',
    'env',
    'shims/storage'
], function($, App, Env, ShimStorage) {
    'use strict';

    $(document).ready(function() {

        var app = new App({

            // dev
            debug: window.ebs && window.ebs.debug ? window.ebs.debug : false,
            clearStorage: window.ebs && window.ebs.clearStorage ? window.ebs.clearStorage : false,

            // elements
            el: $('main'),
            chapters: $('.chapters'),

            // syncs with localstorage user data
            defaultFontSize: 18, // (int) default body font-size in px
            fSize: 100, // (int) percent of main's font-size, default 100%

            maxFontSize: function() {
                return Env.isMobile() ? 120 : 160; // (int) max font size in %
            },

            minFontSize: function() {
                return Env.isMobile() ? 40 : 80; // (int) min font size in %
            },

            contrast: 'light', // (str) light or dark

            // syncs with localstorage reader data
            scrollSpeed: 30, // (int) scroll speed
            scrollInt: null, // (fn) stores current scrollInterval
            scrollTimeout: null // (fn) stores current rFA setTimeout

        });

        app.init();

    });

});
