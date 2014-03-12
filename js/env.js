App = {
    el: $('main'),
    readerData: {
        currentPage: null, // (string) url
        firstPage: null, // (string) url
        lastPage: null, // (string) url
        scrollPosition: {}, // (obj) containing src: (str) url, pos: (int) main.scrollTop()
        isScrolling: false, // (bool) true/false
        defaultFontSize: 18, // (int) default body font-size in px
        fSize: 100, // (int) percent of main's font-size, default 100%
        maxFontSize: 180, // (int) max font size in %
        minFontSize: 70, // (int) min font size in %
        contrast: 'light', // (str) light or dark
        speed: 0, // (int) scroll speed
        components: [] // (array) ordered list of ebook chapters pulled from <spine>
    },

    // fns
    updatedReaderData: function(prop, attr) {
        var that = this;
        that.readerData[prop] = attr;
    },

    debug: function() {
        //
    },

    getFromLocalStorage: function(obj, prop, attr) {

        var that = this;

        var parsedObj = JSON.parse(localStorage.getItem(obj));

        if (attr !== 'null' && typeof attr !== 'undefined') {
            return parsedObj[prop][attr];
        }
        return parsedObj[prop];
    },

    updateLocalStorage: function(obj, prop, attr, nestedAttr) {

        if (localStorage.getItem(obj) === null) return this; // localstorage was not added on page load or was removed
        if (prop === null || attr === null) {
            throw 'updateLocalStorage() null argument';
        }

        var that = this;

        var parsedObj = JSON.parse(localStorage.getItem(obj));

        if (typeof nestedAttr !== 'undefined') {
            parsedObj[prop][attr] = nestedAttr;
        } else if (typeof nestedAttr === 'undefined') {
            parsedObj[prop] = attr;
        }

        localStorage.setItem(obj, JSON.stringify(parsedObj));

        return that;

    },

    setDomElements: function() {

        var that = this;

        var currentContrast = that.readerData.contrast,
            nextContrast = $('.contrast-toggle').attr('data-contrast');

        if (currentContrast === nextContrast) {
            that.events.contrastToggle();
        }

        var bracket = $('<div/>', {
            class: 'bracket',
            css: {
                top: that.el.offset().top - 25,
                left: that.el.offset().left - 25,
                width: 60,
                height: that.el.height() + 50,
                borderTop: '15px solid black',
                borderLeft: '15px solid black',
                borderBottom: '15px solid black',
                position: 'absolute'
            }
        }).appendTo('body');

    },

    loadChapter: function(url) {

        var that = this;

        that.updatedReaderData('currentPage', url);

        var promisePageLoad = $.get(url).success(function(data) {
            // console.log('success');
        }).error(function(x, s, r) {
            console.log('Error: ' + ' ' + r);
        });

        $.when(promisePageLoad).then(function(data) {
            that.el.empty();
            that.el.html(data);
            that.readerData.currentPage = url;
            that.updateLocalStorage('clientBook', 'currentPage', url);
        });

        return that;

    },
    saveLocation: function() {

        var that = this;

        that.updatedReaderData(
            'clientBook',
            'scrollPosition',
            that.readerData.currentPage,
            that.readerData.scrollPosition[that.readerData.currentPage]
        );

        that.readerData.scrollPosition[that.readerData.currentPage] = that.el.scrollTop();

        that.updateLocalStorage(
            'clientBook',
            'scrollPosition',
            that.readerData.currentPage,
            that.readerData.scrollPosition[that.readerData.currentPage]
        );

        return that;

    },

    getUserPreferences: function() {

        var that = this;

        if (localStorage.getItem('userPreferences') !== null) {
            var obj = JSON.parse(localStorage.getItem('userPreferences'));
            $.extend(that.readerData, obj);
        } else {
            var userPreferences = {
                fSize: that.readerData.fSize,
                contrast: that.readerData.contrast,
                speed: that.readerData.speed
            };
            localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
        }

        return that;

    },

    updateUserPreferences: function() {

        var that = this;

        var userPreferences = {
            fSize: that.readerData.fSize,
            contrast: that.readerData.contrast,
            speed: that.readerData.speed
        };

        localStorage.setItem('userPreferences', JSON.stringify(userPreferences));

        return that;

    },

    goToPreviousLocation: function() {

        var that = this;

        var pos = that.getFromLocalStorage('clientBook', 'scrollPosition', that.readerData.currentPage);

        setTimeout(function() {
            that.el.scrollTop(pos);
        }, 50);

        return that;

    },

    getLocation: function() {

        var that = this;

        if (localStorage.getItem('clientBook') !== null) {
            var obj = JSON.parse(localStorage.getItem('clientBook'));
            that.readerData.currentPage = obj.currentPage;
            $.extend(that.readerData.scrollPosition, obj.scrollPosition);
        } else {
            var clientBook = {
                currentPage: that.readerData.firstPage,
                scrollPosition: {}
            };

            that.readerData.currentPage = that.readerData.firstPage;
            that.readerData.scrollPosition[that.readerData.firstPage] = 0;

            clientBook.scrollPosition[that.readerData.firstPage] = 0;
            localStorage.setItem('clientBook', JSON.stringify(clientBook));
        }

        return that;

    },

    goToNextChapter: function() {
        return this;
    }

}
