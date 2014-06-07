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

        // window.ebookAppData = {
        //     uuid: 'fiktion.' + localStorage.getItem('fiktion.referrer')
        // };

        // window.ebookAppData = {
        //     uuid: 'fiktion.' + '21a7619e-ec78-4694-97c9-88a173795996' // test book
        // };

        window.ebookAppData = {
            uuid: 'fiktion.' + 'fdbeeb28-6e83-4d3d-b96b-3bbd8c2d49c4' // about the reader
        };

        // window.ebookAppData = {
        //     uuid: 'fiktion.' + 'c343c5e3-728f-44c5-915d-5146abc97097' // alff
        // };

        var app = new App({

            debug: false,
            clearStorage: false,
            scrollSpeed: 10,

        });

        app.init();

    });
});
