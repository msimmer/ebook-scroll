App = App || {};
$.extend(App, {
    init: function() {

        this.bindEventHandlers();
        this.getJsonData();

    }
});

// DOM ready
$(function() {

    var app = App;

    app.init();

    // events
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
