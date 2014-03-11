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
        speed: 0 // (int) scroll speed
    },

    // fns
    updatedReaderData: function(prop, attr) {
        this.readerData[prop] = attr;
    },

    setDomElements: function() {

        var currentContrast = this.readerData.contrast,
            nextContrast = $('.contrast-toggle').attr('data-contrast');

        if (currentContrast === nextContrast) {
            this.events.contrastToggle();
        }

    },

    loadChapter: function(url) {
        this.el.load(url);
        this.updatedReaderData('currentPage', url);
    },

    saveLocation: function() {

        var that = this;

        var page = this.readerData.currentPage;
        this.readerData.scrollPosition[page] = this.el.scrollTop();

        var clientBook = {
            currentPage: page,
            scrollPosition: that.readerData.scrollPosition
        };

        localStorage.setItem('clientBook', JSON.stringify(clientBook));
    },

    getUserPreferences: function() {
        if (localStorage.getItem('userPreferences') !== null) {
            var obj = JSON.parse(localStorage.getItem('userPreferences'));
            $.extend(this.readerData, obj);
        } else {
            var userPreferences = {
                fSize: this.readerData.fSize,
                contrast: this.readerData.contrast,
                speed: this.readerData.speed
            };
        }
    },

    updateUserPreferences: function() {

        var that = this;

        var userPreferences = {
            fSize: this.readerData.fSize,
            contrast: this.readerData.contrast,
            speed: this.readerData.speed
        };

        localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    },

    goToPreviousLocation: function() {

        var that = this;

        var pos = function() {
            var localStorageBook = JSON.parse(localStorage.getItem('clientBook')),
                lastPos = localStorageBook.scrollPosition[that.readerData.currentPage];

            var pos = (lastPos !== that.el.scrollTop() ? lastPos : 0);

            return pos;
        };

        setTimeout(function() {
            that.el.scrollTop(pos);
        }, 10)

    },

    getLocation: function() {
        if (localStorage.getItem('clientBook') !== null) {
            var obj = JSON.parse(localStorage.getItem('clientBook'));
            this.readerData.currentPage = obj.currentPage;
            $.extend(this.readerData.scrollPosition, obj.scrollPosition);
        } else {
            var clientBook = {
                currentPage: this.readerData.firstPage,
                scrollPosition: {}
            };
            clientBook.scrollPosition[this.readerData.firstPage] = 0;

            localStorage.setItem('clientBook', JSON.stringify(clientBook));
        }
    },

    getJsonData: function() {

        // get data, build dom
        var that = this;

        var jsonUrl = 'data/bookData.json',
            chapters = $('.chapters');

        $.getJSON(jsonUrl, {
            format: 'json'
        })
            .success(function(data) {
                $.each(data, function(i, o) {
                    if (i === 0) {
                        that.updatedReaderData('firstPage', o.src);
                    }
                    if (i === data.length - 1) {
                        that.updatedReaderData('lastPage', o.src);
                    }
                    $('<a/>', {
                        text: o.title,
                        href: o.src,
                        click: function(e) {
                            e.preventDefault();
                            that.saveLocation();
                            that.loadChapter(o.src);
                            that.goToPreviousLocation();
                        }
                    }).appendTo($('<li/>').appendTo('.chapters'));
                })
            })
            .fail(function() {
                console.log(arguments);
            })
            .done(function() {
                // console.log('json loaded');
            });
    }

}
