App = App || {};
$.extend(App, {
    init: function() {

        var that = this;
        that.bindEventHandlers();

        var jsonUrl = 'data/bookData.json',
            chapters = $('.chapters');


        process();


        function process() {

            if (App.debug) console.log('Init');

            var dataRetrieved = getJsonData();

            var jsonAddedToDom = dataRetrieved.done(function(data) {
                addJsonDataToDom(data);
            });

            var readerEnvironment = jsonAddedToDom.done(function() {

                var dfr = $.Deferred();

                // get local storage or set it if it's === null
                that.getLocation();
                that.getUserPreferences();

                // build DOM
                that.removeElementStyles(); // remove contrast color
                that.setDomElements(); // add contrast color
                that.setStyles(); // add fontsize, line-height

                return dfr.promise();

            });

            var loadReader = readerEnvironment.done(function() {

                var dfr = $.Deferred();

                that.loadChapter(that.readerData.currentPage);
                that.goToPreviousLocation();

                return dfr.promise();

            });

            loadReader.done(function() {
                if (App.debug) console.log('Instantiating reader');
                $('ul.controls, nav.mobile ul.controls, .runner-help, .runner-page-count').fadeIn(400);
                setTimeout(function(){
                    that.events.startScrolling();
                }, 1200);
            });

        }


        function getJsonData() {
            if (App.debug) console.log('Retrieved JSON data');
            return $.getJSON(jsonUrl);
        }

        function addJsonDataToDom(data) {
            var dfr = $.Deferred();
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

            if (App.debug) console.log('JSON data added to DOM');
            return dfr.promise();

        }

        function instantiateReader() {

            if (App.debug) console.log('Instantiating reader');

            var dfr = $.Deferred();

            // load the last page read, or the first page if local storage wasn't set
            that.loadChapter(that.readerData.currentPage);

            // if local storage already existed, return to last reading position
            that.goToPreviousLocation();

            setTimeout(function() {
                $('ul.controls, nav.mobile ul.controls, .runner-help, .runner-page-count').fadeIn(400);
            }, 10); // set computed delay

            that.events.startScrolling();

            return dfr.promise();

        }



        // var promiseJSON = $.getJSON(jsonUrl).success(function(data) {
        // $.each(data, function(i, o) {
        //     if (i === 0) {
        //         that.readerData.firstPage = o.src;
        //     }
        //     if (i === data.length - 1) {
        //         that.readerData.lastPage = o.src;
        //     }
        //     $('<a/>', {
        //         text: o.title,
        //         href: o.src,
        //         click: function(e) {
        //             e.preventDefault();
        //             that.saveLocation();
        //             that.loadChapter(o.src);
        //             that.goToPreviousLocation();
        //         }
        //     }).appendTo($('<li/>').appendTo('.chapters'));
        // });
        // }).error(function(x, s, r) {
        //     if (App.debug) console.log('Error: ' + ' ' + r);
        // });


        // $.when(promiseJSON).then(function(data) {

        // // load the last page read, or the first page if local storage wasn't set
        // that.loadChapter(that.readerData.currentPage);

        // // if local storage already existed, return to last reading position
        // that.goToPreviousLocation();

        // setTimeout(function() {
        //     $('ul.controls, nav.mobile ul.controls, .runner-help, .runner-page-count').fadeIn(400);
        // }, 10); // set computed delay

        // // that.events.startScrolling();

        // });

    }
});
