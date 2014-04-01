var noCacheArgs = window.app.dev ? "cache=" + Math.round(Math.random() * 100000) : "";

require.config({
    urlArgs: noCacheArgs,
    baseUrl:'scripts/',
    paths: {
        jquery: '../bower_components/jquery/jquery'
    },
    shim: {
        jquery: {
            exports: '$'
        }
    }
});

require([
    'jquery',
    'app',
    'chapter'
], function($, App, Chapter) {
    'use strict';

    $(document).ready(function() {

        var app = new App();

        app.init();

        new Chapter(app.reader.currentPage);

    });

});
