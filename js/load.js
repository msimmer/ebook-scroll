var app = window.App;

$(function() {

    app.init();

    window.addEventListener('orientationchange', app.events.orientationHasChanged);

    $(window).on('resize', function() {
        var intrvl;
        intrvl = setInterval(function() {
            clearInterval(intrvl);
            app.layout.resizeStopped();
        }, 50);
    });

    window.onunload = window.onbeforeunload = (function() {
        var writeComplete = false;
        return function() {
            if (writeComplete) return;
            writeComplete = true;
            // app.saveLocation();
            // app.updateUserPreferences();
        }
    }());

    $(document).on('touchmove', function(e) {
        if (!$(e.target).parents().is(app.el)) {
            e.preventDefault();
        }
    });

});
