define([
    'jquery',
    'reader',
    'settings'
], function($, Reader, Settings) {
    'use strict';

    return function Sys() {

        var reader = Reader,
            settings = Settings,
            self = this;

        this.updatedReaderData = function(prop, attr) {

            reader[prop] = attr;

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

            if (settings.debug) console.log('Updating user preferences');

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

        this.goToPreviousLocation = function() {

            var pos = self.getFromLocalStorage('clientBook', 'scrollPosition', reader.currentPage);
            setTimeout(function() {
                settings.el.scrollTop(pos);
            }, 50);
        },

        this.goToNextChapter = function() {
            return;
        }

    }

});
