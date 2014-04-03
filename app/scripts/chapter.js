define([
    'jquery',
    'settings',
    'sys',
    'layout',
    'vents'
], function($, Settings, Sys, Layout, Vents) {
    'use strict';

    var sys = new Sys(),
        layout = new Layout(),
        settings = Settings,
        vents = new Vents();

    return function LoadChapter(url) {

        var promisePageLoad = $.get(url);

        return $.when(promisePageLoad)

        .then(function(data) {

            var content = $('<section/>', {
                id: 'page',
                css: {
                    margin: 0,
                    padding: 0,
                    border: 0
                }
            }).html(data);

            settings.el.html(content);

            sys.updatedReaderData('currentPage', url);
            sys.updateLocalStorage('clientBook', 'currentPage', url);

            if (settings.debug) {
                console.log('Current page is ' + url);
            }

        })
            .then(function() {

                layout.adjustFramePosition();
                vents.countPages();
                sys.goToPreviousLocation();

            });

    };

});
