App = App || {};
$.extend(App, {
    init: function() {

        var that = this;
        that.bindEventHandlers();

        var jsonUrl = 'data/bookData.json',
            chapters = $('.chapters');

        // run the deferred processes
        // function getDataAndInsertIntoDOM() {

        if (App.debug) console.log('Init');

        // var dataRetrieved = getJsonData();
        // deferred processes

        // function getJsonData() {
        //     if (App.debug) console.log('Retrieved JSON data');
        //     return $.getJSON(jsonUrl);
        // }

        var getJsonData = $.getJSON(jsonUrl);

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

            // dfr.resolve();
            return dfr.promise();

        }

        function jsonAddedToDom(data) {
            var dfr = $.Deferred();

            // get local storage or set it if it's === null
            that.getLocation();
            that.getUserPreferences();

            // build DOM
            that.removeElementStyles(); // remove initial colors, background
            that.setDomElements(); // add reader styles
            that.setStyles(); // add fontsize, line-height

            // dfr.resolve();
            return dfr.promise();

        }

        // function loadReader() {


        //     console.log('calling loadReader');


        //     // var dfr = $.Deferred();

        //     // //
        //     // that.loadChapter = function(url) {
        //     //     if (App.debug) console.log('Current page is ' + url);
        //     //     var that = this;
        //     //     that.updatedReaderData('currentPage', url);
        //     //     var promisePageLoad = $.get(url);
        //     //     return $.when(promisePageLoad).done(function(data) {
        //     //         var content = $('<section/>', {
        //     //             id: 'page',
        //     //             css: {
        //     //                 margin: 0,
        //     //                 padding: 0,
        //     //                 border: 0
        //     //             }
        //     //         }).html(data);
        //     //         that.el.html(content);
        //     //         that.readerData.currentPage = url;
        //     //         that.updateLocalStorage('clientBook', 'currentPage', url);
        //     //         if (App.debug) console.log('Local storage updated');
        //     //     }).then(function() {
        //     //         that.layout.adjustFramePosition();
        //     //         that.layout.countPages();
        //     //         that.goToPreviousLocation();
        //     //     });
        //     // };
        //     // //

        //     that.loadChapter(that.readerData.currentPage);

        //     // dfr.resolve();
        //     // return dfr.promise();

        // }

        function showUI() {
            var dfr = $.Deferred();
            if (App.debug) console.log('Instantiating reader');
            $('ul.controls, nav.mobile ul.controls, .runner-help, .runner-page-count').fadeIn(400);
            setTimeout(function() {
                that.events.startScrolling();
            }, 1200);
            return dfr.promise();
        }

        // bootstrap

        function go() {
            console.log('go');

            // var d = $.Deferred();
            // var p = d.promise();

            // p.then(getJsonData).done(addJsonDataToDom).then(loadReader).then(showUI);

            $.when(getJsonData).done(addJsonDataToDom).then(jsonAddedToDom);

            $.when(foo).done(that.loadChapter(that.readerData.currentPage));

        }

        go();









        // var jsonAddedToDom = dataRetrieved.done(function(data) {
        //     addJsonDataToDom(data);
        // });

        // var readerEnvironment = jsonAddedToDom.done(function() {

        //     var dfr = $.Deferred();

        //     // get local storage or set it if it's === null
        //     that.getLocation();
        //     that.getUserPreferences();

        //     // build DOM
        //     that.removeElementStyles(); // remove initial colors, background
        //     that.setDomElements(); // add reader styles
        //     that.setStyles(); // add fontsize, line-height

        //     return dfr.promise();

        // });

        // var loadReader = readerEnvironment.done(function() {

        //     var dfr = $.Deferred();

        //     //
        //     that.loadChapter = function(url) {
        //         if (App.debug) console.log('Current page is ' + url);
        //         var that = this;
        //         that.updatedReaderData('currentPage', url);
        //         var promisePageLoad = $.get(url);
        //         return $.when(promisePageLoad).done(function(data) {
        //             var content = $('<section/>', {
        //                 id: 'page',
        //                 css: {
        //                     margin: 0,
        //                     padding: 0,
        //                     border: 0
        //                 }
        //             }).html(data);
        //             that.el.html(content);
        //             that.readerData.currentPage = url;
        //             that.updateLocalStorage('clientBook', 'currentPage', url);
        //             if (App.debug) console.log('Local storage updated');
        //         }).then(function() {
        //             that.layout.adjustFramePosition();
        //             that.layout.countPages();
        //             that.goToPreviousLocation();
        //         });
        //     };
        //     //

        //     that.loadChapter(that.readerData.currentPage);

        //     return dfr.promise();

        // });

        // loadReader.done(function() {
        //     if (App.debug) console.log('Instantiating reader');
        //     $('ul.controls, nav.mobile ul.controls, .runner-help, .runner-page-count').fadeIn(400);
        //     setTimeout(function() {
        //         that.events.startScrolling();
        //     }, 1200);
        // });

        // }


        // // deferred processes

        // function getJsonData() {
        //     if (App.debug) console.log('Retrieved JSON data');
        //     return $.getJSON(jsonUrl);
        // }

        // function addJsonDataToDom(data) {
        //     var dfr = $.Deferred();
        //     $.each(data, function(i, o) {
        //         if (i === 0) {
        //             that.readerData.firstPage = o.src;
        //         }
        //         if (i === data.length - 1) {
        //             that.readerData.lastPage = o.src;
        //         }
        //         $('<a/>', {
        //             text: o.title,
        //             href: o.src,
        //             click: function(e) {
        //                 e.preventDefault();
        //                 that.saveLocation();
        //                 that.loadChapter(o.src);
        //                 that.goToPreviousLocation();
        //             }
        //         }).appendTo($('<li/>').appendTo('.chapters'));
        //     });

        //     if (App.debug) console.log('JSON data added to DOM');
        //     return dfr.promise();

        // }

        // function instantiateReader() {

        //     if (App.debug) console.log('Instantiating reader');

        //     var dfr = $.Deferred();

        //     // load the last page read, or the first page if local storage wasn't set
        //     that.loadChapter(that.readerData.currentPage);

        //     // if local storage already existed, return to last reading position
        //     that.goToPreviousLocation();

        //     setTimeout(function() {
        //         $('ul.controls, nav.mobile ul.controls, .runner-help, .runner-page-count').fadeIn(400);
        //     }, 10); // set computed delay

        //     that.events.startScrolling();

        //     return dfr.promise();

        // }

    }
});
