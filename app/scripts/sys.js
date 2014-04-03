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

        this.updatedReaderData = function() {
            return reader[arguments[0]] = arguments[1];
        },

        this.updateUserData = function() {
            return settings[arguments[0]] = arguments[1];
        },

        this.updateLocalStorage = function(obj, prop, attr, nestedAttr) {
            // this.updateLocalStorage = function() {

            // var obj = arguments[0];

            // if (localStorage.getItem(obj) === null) {
            //     console.log('localstorage obj null');
            //     return;
            // }

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

            if (localStorage.getItem(obj) === null) { // localstorage was not added on page load or was removed
                return;
            }

            if (prop === undefined || attr === undefined) {
                throw 'Error: sys.updateLocalStorage() undefined argument';
            }

            var parsedObj = JSON.parse(localStorage.getItem(obj));

            if (nestedAttr !== undefined) {
                parsedObj[prop][attr] = nestedAttr;
            } else if (nestedAttr === undefined) {
                parsedObj[prop] = attr;
            }

            localStorage.setItem(obj, JSON.stringify(parsedObj));

        },

        this.saveLocation = function() {

            if (settings.debug) {
                console.log('Saving current location');
            }

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

            if (settings.debug) {
                console.log('Updating user preferences');
            }

            var userPreferences = {
                fSize: settings.fSize,
                contrast: settings.contrast,
                scrollSpeed: settings.scrollSpeed
            };

            localStorage.setItem('userPreferences', JSON.stringify(userPreferences));

        },

        this.getUserPreferences = function() {

            if (settings.debug) {
                console.log('Getting User Preferences');
            }

            if (localStorage.getItem('userPreferences') !== null) {

                var obj = JSON.parse(localStorage.getItem('userPreferences'));

                $.extend(settings, obj);

            } else {

                self.updateUserPreferences();

            }
        },

        this.getLocation = function() {

            console.log('get location');

            if (localStorage.getItem('clientBook') !== null) {

                console.log('not null');

                var obj = JSON.parse(localStorage.getItem('clientBook'));
                reader.currentPage = obj.currentPage;

                $.extend(reader.scrollPosition, obj.scrollPosition);

            } else {

                console.log('is null');

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

            if (settings.debug) {
                console.log('Going to previous location');
            }

            var pos = self.getFromLocalStorage('clientBook', 'scrollPosition', reader.currentPage);
            setTimeout(function() {
                settings.el.scrollTop(pos);
            }, 50);
        },

        this.goToNextChapter = function() {
            // return;
        };

    };

});
