define(function (require) {
    var reader   = require('modules/reader');
    var settings = require('modules/settings');

    return {

        updatedReaderData: function () {
            reader[arguments[0]] = arguments[1];
        },

        updateUserData: function () {
            settings[arguments[0]] = arguments[1];
        },

        updateLocalStorage: function (obj, prop, attr, nestedAttr) {

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

        saveLocation: function () {

            if (settings.debug) {
                console.log('Saving current location');
            }

            this.updatedReaderData(
                settings.bookId,
                'scrollPosition',
                reader.currentPage,
                reader.scrollPosition[reader.currentPage]
            );

            reader.scrollPosition[reader.currentPage] = settings.el.scrollTop();

            this.updateLocalStorage(
                settings.bookId,
                'scrollPosition',
                reader.currentPage,
                reader.scrollPosition[reader.currentPage]
            );

        },

        getFromLocalStorage: function (obj, prop, attr) {

            var parsedObj = JSON.parse(localStorage.getItem(obj));

            if (typeof attr !== 'undefined') {
                return parsedObj[prop][attr];
            }

            return parsedObj[prop];

        },

        updateUserPreferences: function () {

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

        getUserPreferences: function () {
            if (settings.debug) {
                console.log('Getting User Preferences');
            }
            if (localStorage.getItem('userPreferences') !== null) {
                var obj = JSON.parse(localStorage.getItem('userPreferences'));
                $.extend(settings, obj);
            } else {
                this.updateUserPreferences();
            }
        },

        getLocation: function () {

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

        goToPreviousLocation: function () {

            if (settings.debug) {
                console.log('Going to previous location');
            }

            var pos = this.getFromLocalStorage(settings.bookId, 'scrollPosition', reader.currentPage);
            setTimeout(function () {
                settings.el.scrollTop(pos);
            }, 50);
        },

        goToNextChapter: function () {
            return;
        }

    };
});
