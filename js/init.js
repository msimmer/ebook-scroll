App = App || {};
$.extend(App, {
    init: function() {

        this.bindEventHandlers();
        this.getJsonData();

        // styles
        this.removeElementStyles();
        this.getUserPreferences();
        this.setDomElements();
        this.setStyles();

        // local storage->readerData
        this.getLocation();

        // if localstorage exists, it's already readerData.currentPage, if not it's readerData.firstPage
        var page = this.readerData.currentPage;
        this.loadChapter(page);

        // readerData page location->DOM
        this.goToPreviousLocation();

    }
});

// DOM ready
$(function() {

    var app = App;

    app.init();

    // events
    $(window).on('beforeunload', function() {
        app.saveLocation();
        app.updateUserPreferences();
    });

});
