define(['jquery'], function($) {
    'use strict';

    var Settings = {

        el: $('main'),
        debug: true,

        // User data
        defaultFontSize: 18,                            // (int) default body font-size in px
        fSize: 100,                                     // (int) percent of main's font-size, default 100%
        maxFontSize: function() {
            return this.env.isMobile() ? 120 : 160;     // (int) max font size in %
        },
        minFontSize: function() {
            return this.env.isMobile() ? 40 : 80;       // (int) min font size in %
        },
        contrast: 'light',                              // (str) light or dark

        // Reader data
        scrollSpeed: 60,                                // (int) scroll speed
        isScrolling: false,                             // (bool) true/false
        scrollInt: null                                 //(function) stores current scrollInterval


    };

    return Settings;

});
