define([
    'jquery',
    'env'
], function($, Env) {
    'use strict';

    var env = Env;

    var Settings = {

        el: $('main'),
        debug: true,

        // synchs with localstorage user data
        defaultFontSize: 18,                        // (int) default body font-size in px
        fSize: 100,                                 // (int) percent of main's font-size, default 100%

        maxFontSize: function() {
            return env.isMobile() ? 120 : 160;      // (int) max font size in %
        },

        minFontSize: function() {
            return env.isMobile() ? 40 : 80;        // (int) min font size in %
        },

        contrast: 'light',                          // (str) light or dark

        // synchs with localstorage reader data
        scrollSpeed: 60,                            // (int) scroll speed
        scrollInt: null                             //(function) stores current scrollInterval


    };

    return Settings;

});
