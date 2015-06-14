require(['app'], function (App) {

    // $(function () {

    var app = new App({

        dev: true,
        jsonPath: 'data/bookData.json',
        // jsonPath: 'http://local.fiktion.cc/wp-content/themes/Fiktion/data/bookData.json',
        debug: false,
        clearStorage: false,
        scrollSpeed: 10

    });

    $('html').removeClass('no-js').addClass('cursor js');

    app.init();

    // });

});
