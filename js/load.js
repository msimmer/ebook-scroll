var app = window.App;

// DOM ready
$(function() {

    app.init();

    // window events
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
            app.saveLocation();
            app.updateUserPreferences();
        }
    }());

});
