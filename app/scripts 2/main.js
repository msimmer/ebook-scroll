require.config({
    paths: {
        // jquery: '../bower_components/jquery/jquery'
        jquery: 'vendor/jquery.window'
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

            dev: true,
            jsonPath: 'http://local.fiktion.cc/wp-content/themes/Fiktion/data/bookData.json',
            debug: false,
            clearStorage: false,
            scrollSpeed: 10

        });

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

        app.init();

    });

});
