var noCacheArgs = window.app.dev ? "cache=" + Math.round(Math.random() * 100000) : "";

require.config({
    urlArgs: noCacheArgs,
    paths: {
        jquery: '../bower_components/jquery/jquery'
    },
    shim: {
        jquery: {
            exports: '$'
        }
    }
});

require(['jquery', 'app'], function($, App) {

    $(document).ready(function() {

        var app = new App();

        if (app.settings.debug) console.log(app);

    });

});
