App = {
    el: $('main'),
    debug: true,
    isMobile: function() {
        return navigator.userAgent.match(/(Mobile|iPad|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i) ? true : false;
    },
    readerData: {
        // App data
        components: [], // (array) ordered list of ebook chapters pulled from <spine>
        currentPage: null, // (string) url
        firstPage: null, // (string) url
        lastPage: null, // (string) url
        scrollPosition: {}, // (obj) containing src: (str) url, pos: (int) main.scrollTop()
        endPosition: null,

        // User data
        defaultFontSize: 18, // (int) default body font-size in px
        fSize: 100, // (int) percent of main's font-size, default 100%
        maxFontSize: function() {
            return App.isMobile() ? 120 : 160; // (int) max font size in %
        },
        minFontSize: function() {
            return App.isMobile() ? 40 : 80; // (int) min font size in %
        },
        contrast: 'light', // (str) light or dark

        // Reader data
        scrollSpeed: 60, // (int) scroll speed
        isScrolling: false, // (bool) true/false
        scrollInt: null //(function) stores current scrollInterval
    },
    // fns
    updatedReaderData: function(prop, attr) {
        var that = this;
        that.readerData[prop] = attr;
    },
    getFromLocalStorage: function(obj, prop, attr) {
        var that = this;
        var parsedObj = JSON.parse(localStorage.getItem(obj));
        if (attr !== undefined) {
            return parsedObj[prop][attr];
        }
        return parsedObj[prop];
    },
    updateLocalStorage: function(obj, prop, attr, nestedAttr) {
        if (localStorage.getItem(obj) === null) return this; // localstorage was not added on page load or was removed
        if (prop === undefined || attr === undefined) {
            throw 'Error: App.updateLocalStorage() undefined argument';
        }
        var that = this;
        var parsedObj = JSON.parse(localStorage.getItem(obj));
        if (nestedAttr !== undefined) {
            parsedObj[prop][attr] = nestedAttr;
        } else if (nestedAttr === undefined) {
            parsedObj[prop] = attr;
        }
        localStorage.setItem(obj, JSON.stringify(parsedObj));
    },
    setDomElements: function() {
        var that = this;
        that.events.contrastToggle(that.readerData.contrast);
    },
    saveLocation: function() {
        if (App.debug) console.log('Saving current location');
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
                scrollSpeed: that.readerData.scrollSpeed
            };
            localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
        }
    },
    updateUserPreferences: function() {
        if (App.debug) console.log('Updating user preferences');
        var that = this;
        var userPreferences = {
            fSize: that.readerData.fSize,
            contrast: that.readerData.contrast,
            scrollSpeed: that.readerData.scrollSpeed
        };
        localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    },
    goToPreviousLocation: function() {
        var that = this;
        var pos = that.getFromLocalStorage('clientBook', 'scrollPosition', that.readerData.currentPage);
        setTimeout(function() {
            that.el.scrollTop(pos);
        }, 50);
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
    },
    loadChapter: function(url) {
        if (App.debug) console.log('Current page is ' + url);
        var that = this;
        that.updatedReaderData('currentPage', url);
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
            that.el.html(content);
            that.readerData.currentPage = url;
            that.updateLocalStorage('clientBook', 'currentPage', url);
            if (App.debug) console.log('Local storage updated');
        }).then(function() {
            that.layout.adjustFramePosition();
            that.layout.countPages();
            that.goToPreviousLocation();
        });
    },
    goToNextChapter: function() {
        return;
    }
}
