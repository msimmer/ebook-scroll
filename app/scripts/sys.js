define([
    'jquery',
    'reader',
    'settings'
], function ($, Reader, Settings) {
    'use strict';

    return function Sys() {

        var self = this,
            reader = Reader,
            settings = Settings;

        this.updatedReaderData = function () {
            return reader[arguments[0]] = arguments[1];
        },

        this.updateUserData = function () {
            return settings[arguments[0]] = arguments[1];
        },

        this.updateLocalStorage = function (obj, prop, attr, nestedAttr) { // TODO: refactor

            if (localStorage.getItem(obj) === null) { // localstorage was not added on page load or was removed
                return;
            }

            if (typeof prop === 'undefined' || typeof attr === 'undefined') {
                throw 'Error: sys.updateLocalStorage() undefined argument';
            }

            var parsedObj = JSON.parse(localStorage.getItem(obj));

            if (typeof nestedAttr !== 'undefined') {
                parsedObj[prop][attr] = nestedAttr;
            } else if (typeof nestedAttr === 'undefined') {
                parsedObj[prop] = attr;
            }

            localStorage.setItem(obj, JSON.stringify(parsedObj));

        },

        this.saveLocation = function () {

            if (settings.debug) {
                console.log('Saving current location');
            }

            self.updatedReaderData(
                settings.bookId,
                'scrollPosition',
                reader.currentPage,
                reader.scrollPosition[reader.currentPage]
            );

            reader.scrollPosition[reader.currentPage] = settings.el.scrollTop();

            self.updateLocalStorage(
                settings.bookId,
                'scrollPosition',
                reader.currentPage,
                reader.scrollPosition[reader.currentPage]
            );

        },

        this.getFromLocalStorage = function (obj, prop, attr) { // TODO: refactor

            var parsedObj = JSON.parse(localStorage.getItem(obj));

            if (typeof attr !== 'undefined') {
                return parsedObj[prop][attr];
            }

            return parsedObj[prop];

        },

        this.updateUserPreferences = function () {

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

        this.getUserPreferences = function () {

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

        this.getLocation = function () {

            var bookId = settings.bookId;

            if (localStorage.getItem(bookId) !== null) {

                var obj = JSON.parse(localStorage.getItem(bookId));

                reader.currentPage = obj.currentPage;

                $.extend(reader.scrollPosition, obj.scrollPosition);

            } else {

                var clientBook = {
                    bookId: window.ebookAppData.uuid,
                    currentPage: reader.firstPage,
                    scrollPosition: {}
                };

                reader.currentPage = reader.firstPage;
                reader.scrollPosition[reader.firstPage] = 0;
                clientBook.scrollPosition[reader.firstPage] = 0;

                localStorage.setItem(window.ebookAppData.uuid, JSON.stringify(clientBook));

            }

        },

        this.goToPreviousLocation = function () {

            if (settings.debug) {
                console.log('Going to previous location');
            }

            var pos = self.getFromLocalStorage(settings.bookId, 'scrollPosition', reader.currentPage);
            setTimeout(function () {
                settings.el.scrollTop(pos);
            }, 50);
        },

        this.goToNextChapter = function () {
            return;
        };

    };

});
