define([
    'jquery',
    'env'
], function($, Env) {
    'use strict';

    var Settings = {
        debug: false,
        clearStorage: false,

        el: $('main'),
        chapters: $('.chapters'),

        defaultFontSize: 18,
        fSize: 100,
        maxFontSize: function() {
            return Env.isMobile() ? 120 : 160;
        },
        minFontSize: function() {
            return Env.isMobile() ? 40 : 80;
        },

        contrast: 'light',
        scrollSpeed: 30,
        scrollInt: null,
        scrollTimeout: null
    };

    return Settings;

});
