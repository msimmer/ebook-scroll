require([
    'jquery',
    'reader',
    'settings',
    'sys',
    'chapter',
    'ajax/ajaxBookData'
], function($, Reader, Settings, Sys, Chapter, AjaxBookData) {
    'use strict';

    var ajaxBookData = AjaxBookData,
        sys = new Sys(),
        reader = Reader,
        settings = Settings;

    function addJsonDataToDom(data) {

        new Chapter(reader.currentPage);

        $.each(data, function(i, o) {

            $('<li/>', {
                html: $('<a/>', {
                    text: o.title,
                    href: o.src,
                    click: function(e) {
                        e.preventDefault();
                        sys.saveLocation();
                        new Chapter(o.src);
                        sys.goToPreviousLocation();
                    }
                })
            }).appendTo(settings.chapters);

        });

        if (settings.debug) {
            console.log('JSON data added to DOM');
        }

    }

    $.when(ajaxBookData).done(
        addJsonDataToDom(reader.components)
    );

});
