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

        that.el.load(url);
        that.updatedReaderData('currentPage', url);

        return that;

    },

    saveLocation: function() {

        var that = this;

        var page = that.readerData.currentPage,
            scrollPos = {};

        that.readerData.scrollPosition[page] = that.el.scrollTop();
        var scrollPos = that.readerData.scrollPosition;

        var clientBook = {
            currentPage: page,
            scrollPosition: scrollPos
        };

        localStorage.setItem('clientBook', JSON.stringify(clientBook));

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

        var pos = function() {
            var localStorageBook = JSON.parse(localStorage.getItem('clientBook')),
                lastPos = localStorageBook.scrollPosition[that.readerData.currentPage];

            return lastPos;
        };

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
