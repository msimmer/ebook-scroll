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
    'use strict';

    $(function () {

        var app = new App({

            dev: false,
            jsonPath: 'http://fiktion.cc/wp-content/themes/Fiktion/data/bookData.json',
            debug: false,
            clearStorage: false,
            scrollSpeed: 10

        });

        app.init();

        $('html').removeClass('no-js').addClass('cursor js');

        $.event.trigger({
            type: 'updateUI',
            data: {},
            context: null
        });

        $(document).on('updateUI', function (ev, data) {
            for (var i in data) {
                app[i][data[i]]();
            };
        });

        var gotJson = false;
        var chaptersLoaded = false;
        // var stylesLoaded = false;

        $(document).ajaxComplete(function (event, xhr, settings) {
            if (settings.headers.bookLoadProgress && settings.headers.bookLoadProgress === 'retrieveJsonData') {
                gotJson = true;
            }
            if (settings.headers.bookLoadProgress && settings.headers.bookLoadProgress === 'chaptersLoaded') {
                chaptersLoaded = true;
            }

            // if (settings.headers.bookLoadProgress && settings.headers.bookLoadProgress === 'stylesLoaded') {
            //     stylesLoaded = true;
            // }

            if (gotJson && chaptersLoaded) {
                app.bookLoadedCallback();
            }
        });
    });

});
