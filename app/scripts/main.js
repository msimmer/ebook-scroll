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

            el: $('main'),
            chapters: $('.chapters'),
            debug: window.ebs && window.ebs.debug ? window.ebs.debug : false,

            // syncs with localstorage user data
            //
            defaultFontSize: 18, // (int) default body font-size in px
            fSize: 100, // (int) percent of main's font-size, default 100%

            maxFontSize: function() {
                return Env.isMobile() ? 120 : 160; // (int) max font size in %
            },

            minFontSize: function() {
                return Env.isMobile() ? 40 : 80; // (int) min font size in %
            },

            contrast: 'dark', // (str) light or dark

            // syncs with localstorage reader data
            //
            scrollSpeed: 30, // (int) scroll speed
            scrollInt: null, // (fn) stores current scrollInterval
            scrollTimeout: null // (fn) stores current rFA setTimeout

        });

        // var retrieveJsonData = $.ajax({

        //     url: 'data/bookData.json',
        //     dataType: 'json',
        //     method: 'get',
        //     success: function(data) {
        //         app.sys.updatedReaderData('components', data);
        //         app.sys.updatedReaderData('currentPage', data[0].src);
        //         app.sys.updatedReaderData('firstPage', data[0].src);
        //         app.sys.updatedReaderData('lastPage', data[data.length - 1].src);
        //     },
        //     error: function(x, t, s) {
        //         console.log(x + ' ' + t);
        //     }

        // });

        // function addJsonDataToDom(data) {

        //     $.each(data, function(i, o) {

        //         $('<li/>', {
        //             html: $('<a/>', {
        //                 text: o.title,
        //                 href: o.src,
        //                 click: function(e) {
        //                     e.preventDefault();
        //                     app.sys.saveLocation();
        //                     loadChapter(o.src);
        //                     app.sys.goToPreviousLocation();
        //                 }
        //             })
        //         }).appendTo(app.settings.chapters);

        //     });

        //     if (app.settings.debug) {
        //         console.log('JSON data added to DOM');
        //     }

        // }

        // function loadChapter(pageUrl) {

        //     return $.ajax({
        //         type: 'get',
        //         url: pageUrl,
        //         async: false,
        //         success: function(response) {
        //             console.log('got');
        //         }
        //     })
        //         .then(function(data) {
        //             var content = $('<section/>', {
        //                 id: 'page',
        //                 css: {
        //                     margin: 0,
        //                     padding: 0,
        //                     border: 0
        //                 }
        //             }).html(data);

        //             app.settings.el.html(content);

        //             app.sys.updatedReaderData('currentPage', pageUrl);
        //             app.sys.updateLocalStorage('clientBook', 'currentPage', pageUrl);

        //             if (app.settings.debug) {
        //                 console.log('Current page is ' + pageUrl);
        //             }
        //         });

        // }

        // $.when(retrieveJsonData)
        //     .then(function(data) {
        //         app.sys.getLocation();
        //         app.sys.getUserPreferences();
        //         addJsonDataToDom(app.reader.components);
        //     })
        //     .then(function() {
        //         loadChapter(app.reader.currentPage);
        //     })
        //     .done(function() {
        //         app.layout.adjustFramePosition();
        //         app.sys.goToPreviousLocation();
        //         app.vents.countPages();
        //         app.layout.removeElementStyles();
        //         app.vents.contrastToggle(app.settings.contrast);
        //         app.layout.setStyles();
        //         app.vents.startScrolling();
        //     });

        app.init();

    });

});
