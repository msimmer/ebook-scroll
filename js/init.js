App = App || {};
$.extend(App, {
    init: function() {

        var that = this;

        that.bindEventHandlers();

        var jsonUrl = 'data/bookData.json',
            chapters = $('.chapters');

        var promiseJSON = $.getJSON(jsonUrl).success(function(data) {

            $.each(data, function(i, o) {
                if (i === 0) {
                    that.readerData.firstPage = o.src;
                }
                if (i === data.length - 1) {
                    that.readerData.lastPage = o.src;
                }
                $('<a/>', {
                    text: o.title,
                    href: o.src,
                    click: function(e) {
                        e.preventDefault();
                        that.saveLocation();
                        that.loadChapter(o.src);
                        that.goToPreviousLocation();
                    }
                }).appendTo($('<li/>').appendTo('.chapters'));
            })
        }).error(function(x, s, r) {
            console.log('Error: ' + ' ' + r);
        });

        $.when(promiseJSON).then(function() {

            // get local storage or set it if it's === null
            that.getLocation();
            that.getUserPreferences();

            // build DOM
            that.removeElementStyles();
            that.setDomElements();
            that.setStyles();
            that.layout.adjustFramePosition();

            // load the last page read, or the first page if local storage wasn't set
            that.loadChapter(that.readerData.currentPage);

            // if local storage already existed, return to last reading position
            that.goToPreviousLocation();

            // // set reader elements
            // that.layout.countPages();

            // var interval = that.scrollSpeed * 4999; // abstract
            // that.events.listenForPageMove(interval);

            // // start scrolling!
            // that.events.startScrolling();

        });

    }
});

// DOM ready
$(function() {

    var app = App;

    app.init();

    // dev

    //    $.debounce = function(func, wait, immediate) {
    //     var timeout;
    //     return function() {
    //         var context = this, args = arguments;
    //         var later = function() {
    //             timeout = null;
    //             if (!immediate) func.apply(context, args);
    //         };
    //         var callNow = immediate && !timeout;
    //         clearTimeout(timeout);
    //         timeout = setTimeout(later, wait);
    //         if (callNow) func.apply(context, args);
    //     };
    // };


    setTimeout(function() {
        // set reader elements
        app.layout.countPages();

        var interval = app.readerData.scrollSpeed * 60; // abstract

        console.log(interval);
        app.events.listenForPageMove(interval);

        // start scrolling!
        app.events.startScrolling();
    }, 500);

    // app.readerData.scroollPosition = {};

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
