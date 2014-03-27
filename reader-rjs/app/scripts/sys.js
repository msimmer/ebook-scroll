define([
    'jquery',
    'reader',
    'settings',
    'layout'
], function($, Reader, Settings, Layout) {
    'use strict';

    return function Sys() {

        var reader = Reader,
            settings = Settings,
            layout = Layout,
            self = this;

        this.updatedReaderData = function(prop, attr) {

            reader[prop] = attr;

        },

        this.updateLocalStorage = function(obj, prop, attr, nestedAttr) {

            if (localStorage.getItem(obj) === null) return; // localstorage was not added on page load or was removed

            if (prop === undefined || attr === undefined) {
                throw 'Error: App.updateLocalStorage() undefined argument';
            }

            var parsedObj = JSON.parse(localStorage.getItem(obj));

            if (nestedAttr !== undefined) {
                parsedObj[prop][attr] = nestedAttr;
            } else if (nestedAttr === undefined) {
                parsedObj[prop] = attr;
            }

            localStorage.setItem(obj, JSON.stringify(parsedObj));

            // refactor ->
            //
            // function foo(obj) {
            //     var a = arguments,
            //         o = {};
            //     for (var i in a[0]) {
            //         o[i] = obj[i];
            //     }
            //     return o;
            // }

        },

        this.saveLocation = function() {

            if (settings.debug) console.log('Saving current location');

            self.updatedReaderData(
                'clientBook',
                'scrollPosition',
                reader.currentPage,
                reader.scrollPosition[reader.currentPage]
            );

            reader.scrollPosition[reader.currentPage] = settings.el.scrollTop();

            self.updateLocalStorage(
                'clientBook',
                'scrollPosition',
                reader.currentPage,
                reader.scrollPosition[reader.currentPage]
            );

        },

        this.getFromLocalStorage = function(obj, prop, attr) {

            var parsedObj = JSON.parse(localStorage.getItem(obj));

            if (attr !== undefined) {
                return parsedObj[prop][attr];
            }

            return parsedObj[prop];

            // refactor ->
            //
            // function foo(obj) {
            //     var a = arguments,
            //         o = {};
            //     for (var i in a[0]) {
            //         o[i] = obj[i];
            //     }
            //     return o;
            // }

        },

        this.updateUserPreferences = function() {

            // if (settings.debug) console.log('Updating user preferences');

            var userPreferences = {
                fSize: reader.fSize,
                contrast: reader.contrast,
                scrollSpeed: reader.scrollSpeed
            };

            localStorage.setItem('userPreferences', JSON.stringify(userPreferences));

        },

        this.getUserPreferences = function() {

            if (localStorage.getItem('userPreferences') !== null) {

                var obj = JSON.parse(localStorage.getItem('userPreferences'));

                $.extend(reader, obj);

            } else {

                var userPreferences = {
                    fSize: reader.fSize,
                    contrast: reader.contrast,
                    scrollSpeed: reader.scrollSpeed
                };

                localStorage.setItem('userPreferences', JSON.stringify(userPreferences));

            }
        },

        this.getLocation = function() {

            if (localStorage.getItem('clientBook') !== null) {

                var obj = JSON.parse(localStorage.getItem('clientBook'));
                reader.currentPage = obj.currentPage;

                $.extend(reader.scrollPosition, obj.scrollPosition);

            } else {

                var clientBook = {
                    currentPage: reader.firstPage,
                    scrollPosition: {}
                };

                reader.currentPage = reader.firstPage;
                reader.scrollPosition[reader.firstPage] = 0;
                clientBook.scrollPosition[reader.firstPage] = 0;

                localStorage.setItem('clientBook', JSON.stringify(clientBook));

            }
        },

        this.countPages = function() {

            if (settings.debug) console.log('Counting pages');

            var main = settings.el,
                frameH = main.height(),
                page = main.find('#page'),
                pageH = page.height(),
                totalPageIndicator = $('.total-page-count'),
                currentPageIndicator = $('.current-page-count');

            function getCurrentPage() {
                return Math.round((-(page.offset().top - main.offset().top) / frameH) + 1);
            }

            totalPageIndicator.html(Math.round(pageH / frameH));
            currentPageIndicator.html(getCurrentPage());

            if (main.height() - page.height() >= -main.scrollTop()) {
                if (reader.currentPage === reader.lastPage) {
                    self.isBookEnd();
                } else if (reader.currentPage !== reader.lastPage) {
                    self.isChapterEnd();
                }
            }

        }

        this.goToPreviousLocation = function() {

            var pos = self.getFromLocalStorage('clientBook', 'scrollPosition', reader.currentPage);
            setTimeout(function() {
                settings.el.scrollTop(pos);
            }, 50);
        },

        this.loadChapter = function(url) {

            if (settings.debug) console.log('Current page is ' + url);

            self.updatedReaderData('currentPage', url);

            var promisePageLoad = $.get(url);

            return $.when(promisePageLoad).done(function(data) {

                var content = $('<section/>', {
                    id: 'page',
                    css: {
                        margin: 0,
                        padding: 0,
                        border: 0
                    }
                }).html(data);

                settings.el.html(content);

                reader.currentPage = url;

                self.updateLocalStorage('clientBook', 'currentPage', url);

                if (App.debug) console.log('Local storage updated');

            }).then(function() {

                layout.adjustFramePosition();

                self.countPages();
                self.goToPreviousLocation();

            });
        },

        this.goToNextChapter = function() {
            return;
        }

    }

});
