require(['app'], function (App) {

    var app = new App({

        dev: true,
        jsonPath: 'data/bookData.json',
        // jsonPath: 'http://local.fiktion.cc/wp-content/themes/Fiktion/data/bookData.json',
        debug: true,
        clearStorage: true,
        scrollSpeed: 10,
        shebang:'#/',
        hashDest: '#/8'
        // hashDest: window.location.hash

    });

    $('html').removeClass('no-js').addClass('cursor js');

    app.init();

});
