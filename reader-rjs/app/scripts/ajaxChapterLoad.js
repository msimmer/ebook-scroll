require([
    'jquery',
    'reader',
    'settings',
    'sys',
    'ajaxBookData',
    'chapter'
], function($, Reader, Settings, Sys, AjaxBookData, Chapter) {

    var
        ajaxBookData = AjaxBookData,
        sys = new Sys(),
        reader = Reader,
        chapter = Chapter,
        settings = Settings;

    $.when(ajaxBookData).then(
        addJsonDataToDom(reader.components)
    );

    function addJsonDataToDom(data) {

        $.each(data, function(i, o) {

            $('<a/>', {
                text: o.title,
                href: o.src,
                click: function(e) {

                    e.preventDefault();

                    sys.saveLocation();

                    new chapter(o.src);

                    sys.goToPreviousLocation();

                }
            }).appendTo($('<li/>').appendTo(settings.chapters));
        });

        // if (settings.debug) console.log('JSON data added to DOM');

    }

});
