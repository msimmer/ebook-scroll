define(['jquery', 'modules/reader', 'modules/settings'], function ($, reader, settings) {

  var UserSettings = function () {

    this.updatedReaderData = function (key, val) {
      reader[key] = val;
    };

    this.updateUserData = function (key, val) {
      settings[key] = val;
    };

    this.updateLocalStorage = function (obj, prop, attr, nestedAttr) {

      if (localStorage.getItem(obj) === null) { // localstorage was not added on page load or was removed
        return;
      }

      if (typeof prop === 'undefined' || typeof attr === 'undefined') {
        throw new Error('sys.updateLocalStorage() undefined argument');
      }

      var parsedObj = JSON.parse(localStorage.getItem(obj));

      if (typeof nestedAttr !== 'undefined') {
        parsedObj[prop][attr] = nestedAttr;
      } else if (typeof nestedAttr === 'undefined') {
        parsedObj[prop] = attr;
      }

      localStorage.setItem(obj, JSON.stringify(parsedObj));

    };

    this.saveLocation = function () {

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

    };

    this.getFromLocalStorage = function (obj, prop, attr) {

      var parsedObj = JSON.parse(localStorage.getItem(obj));

      if (typeof attr !== 'undefined') {
        return parsedObj[prop][attr];
      }

      return parsedObj[prop];

    };

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

    };

    this.getUserPreferences = function () {
      if (settings.debug) {
        console.log('Getting User Preferences');
      }
      if (localStorage.getItem('userPreferences') !== null) {
        var obj = JSON.parse(localStorage.getItem('userPreferences'));
        $.extend(settings, obj);
      } else {
        this.updateUserPreferences();
      }
    };

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

    };

    this.goToPreviousLocation = function () {

      if (settings.debug) {
        console.log('Going to previous location');
      }

      var pos = this.getFromLocalStorage(settings.bookId, 'scrollPosition', reader.currentPage);
      setTimeout(function () {
        settings.el.scrollTop(pos);
      }, 50);
    };

  };

  return new UserSettings();

});
