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
    },

    updateUserPreferences: function() {

        var that = this;

        var userPreferences = {
            fSize: that.readerData.fSize,
            contrast: that.readerData.contrast,
            speed: that.readerData.speed
        };

        localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
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
        }, 50)

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
            clientBook.scrollPosition[that.readerData.firstPage] = 0;
            localStorage.setItem('clientBook', JSON.stringify(clientBook));
        }
    },

    goToNextChapter: function() {
        //
    },

    getJsonData: function() {

        // get book data and insert into DOM
        var that = this;

        var jsonUrl = 'data/bookData.json',
            chapters = $('.chapters');

        var jsonData = $.getJSON(jsonUrl, {
            format: 'json'
        })
            .success(function(data) {

                $.each(data, function(i, o) {
                    if (i === 0) {
                        that.readerData.firstPage = o.src;
                        // var page = (localStorage.getItem('clientBook') === null ? that.readerData.firstPage : that.readerData.currentPage);
                        // that.readerData.currentPage = page;
                    }
                    if (i === data.length - 1) {
                        that.readerData.lastPage = o.src;
                    }
                    $('<a/>', {
                        text: o.title,
                        href: o.src,
                        click: function(e) {
                            e.preventDefault();
                            that.loadChapter(o.src);
                            that.goToPreviousLocation();
                        }
                    }).appendTo($('<li/>').appendTo('.chapters'));
                })
            })
            .fail(function() {
                console.log(arguments);
            });

        jsonData.complete(function() {

            // styles
            that.removeElementStyles();
            that.getUserPreferences();
            that.setDomElements();
            that.setStyles();
            that.layout.adjustFramePosition();

            that.getLocation();

            // var page = (localStorage.getItem('clientBook') === null ? that.readerData.firstPage : that.readerData.currentPage);
            // that.readerData.currentPage = page;
            that.loadChapter(that.readerData.currentPage);

            // readerData page location->DOM
            that.goToPreviousLocation();
        });

    }

}
