// DOM ready
$(function() {
    var app = window.App;
    app.init();
    setTimeout(function() {

        // set reader elements
        app.layout.countPages();

        // start scrolling!
        // app.events.startScrolling();
    }, 1500);
    // events
    $(window).on('resize', function() {
        var intrvl;
        intrvl = setInterval(function() {
            clearInterval(intrvl);
            app.layout.resizeStopped();
        }, 100);
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
