App = App || {};
$.extend(App, {
    init: function() {

        var that = this;
        that.bindEventHandlers();

        // get local storage or set it if it's === null
        that.getLocation();
        that.getUserPreferences();

        // build DOM
        that.removeElementStyles(); // remove contrast color
        that.setDomElements(); // add contrast color
        that.setStyles(); // add fontsize, line-height

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
            });
        }).error(function(x, s, r) {
            if (App.debug) console.log('Error: ' + ' ' + r);
        });
        $.when(promiseJSON).then(function(data) {

            // load the last page read, or the first page if local storage wasn't set
            that.loadChapter(that.readerData.currentPage);

            // if local storage already existed, return to last reading position
            that.goToPreviousLocation();

            setTimeout(function() {
                $('ul.controls, nav.mobile ul.controls, .runner-help, .runner-page-count').fadeIn(400);
            }, 10); // set computed delay

            // that.events.startScrolling();

        });

    }
});
