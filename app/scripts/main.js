var noCacheArgs = window.app.dev ? "cache=" + Math.round(Math.random() * 100000) : "";

require.config({
    urlArgs: noCacheArgs,
    baseUrl: 'scripts',
    paths: {
        jquery: '../bower_components/jquery/jquery'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'plugins/hoverIntent': {
            deps:['jquery']
        }
    }
});

require([
    'jquery',
    'app',
    'chapter',
    'shims/storage'
], function($, App, Chapter, ShimStorage) {
    'use strict';

    $(document).ready(function() {

        var app = new App();

        app.init();

        new Chapter(app.reader.currentPage);

    });

});
