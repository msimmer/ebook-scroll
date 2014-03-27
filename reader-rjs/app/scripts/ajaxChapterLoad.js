require([
    'jquery',
    'reader',
    'settings',
    'sys',
    'ajaxBookData'
], function($, Reader, Settings, Sys, AjaxBookData) {

    var
        ajaxBookData = AjaxBookData,
        sys = new Sys(),
        reader = Reader,
        settings = Settings;

    $.when(ajaxBookData).then(
        addJsonDataToDom(reader.components)
    );

    function addJsonDataToDom(data) {

        $.each(data, function(i, o) {

            switch (i) {

                case 0:
                    reader.firstPage = o.src;
                    break;

                case data.length - 1:
                    reader.lastPage = o.src;
                    break;

                default:
                    break;

            };

            $('<a/>', {
                text: o.title,
                href: o.src,
                click: function(e) {

                    e.preventDefault();

                    sys.saveLocation();

                    sys.loadChapter(o.src);

                    sys.goToPreviousLocation();

                }
            }).appendTo($('<li/>').appendTo(settings.chapters));
        });

        // if (settings.debug) console.log('JSON data added to DOM');
    }

});
