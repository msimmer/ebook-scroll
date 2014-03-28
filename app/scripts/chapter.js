define([
    'jquery',
    'settings',
    'reader',
    'sys',
    'layout'
], function($, Settings, Reader, Sys, Layout) {

    var
        sys = new Sys(),
        layout = new Layout();
        settings = Settings,
        reader = Reader;

        // sys = Sys,
        // layout = Layout;
        // settings = Settings,
        // reader = Reader;

    return function LoadChapter(url) {

        // if (settings.debug) console.log('Current page is ' + url);

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

        })
            .then(function() {

            layout.adjustFramePosition();

            sys.countPages();
            sys.goToPreviousLocation();

        });

    }

});
