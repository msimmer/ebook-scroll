define([
    'jquery',
    'env'
], function ($, Env) {
    'use strict';

    var Settings = {
        dev: false,
        jsonPath: 'data/bookData.json',
        debug: false,
        version:1.0,
        clearStorage: false,
        local:false,
        bookId: null,
        el: $('main'),
        chapters: $('.chapters'),
        defaultFontSize: 30,
        fSize: 100,
        fSizeIncrement: 5,
        maxFontSize: function () {
            return Env.isMobile() ? 130 : 150;
        },
        minFontSize: function () {
            return Env.isMobile() ? 50 : 70;
        },
        contrast: 'light',
        scrollSpeed: 10,
    };

    return Settings;

});
