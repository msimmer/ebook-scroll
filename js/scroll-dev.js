$(function() {

    window.readerData = {
        currentPage: null, // (string) url
        firstPage: null, // (string) url
        lastPage: null, // (string) url
        scrollPosition: {}, // (obj) containing src: (str) url, pos: (int) main.scrollTop()
        scrollState: 'pause', // (str) pause or play
        fontSize: 100, // (int) percent of main's font-size, default 100%
        contrast: 'light', // (str) light or dark
        speed: 0 // (int) scroll speed
    };

    var readerData = window.readerData;

    // fns
    var main = $('main');

    function updatedReaderData(prop, attr) {
        readerData[prop] = attr;
    }

    function loadChapter(url) {
        main.load(url);
        updatedReaderData('currentPage', url);
    }

    function saveLocation() {
        var page = readerData.currentPage;
        readerData.scrollPosition[page] = main.scrollTop();

        var clientBook = {
            currentPage: page,
            scrollPosition: readerData.scrollPosition
        };

        localStorage.setItem('clientBook', JSON.stringify(clientBook));
    }

    function goToPreviousLocation() {

        var pos = function() {
            var localStorageBook = JSON.parse(localStorage.getItem('clientBook')),
                lastPos = localStorageBook.scrollPosition[readerData.currentPage];

            var pos = (lastPos !== main.scrollTop() ? lastPos : 0);

            return pos;
        }

        setTimeout(function(){
            main.scrollTop(pos);
        }, 10)

    }

    function getLocation() {
        if (localStorage.getItem('clientBook') !== null) {
            var obj = JSON.parse(localStorage.getItem('clientBook'));
            readerData.currentPage = obj.currentPage;
            $.extend(readerData.scrollPosition, obj.scrollPosition);
        } else {
            var clientBook = {
                currentPage: readerData.firstPage,
                scrollPosition: {}
            };
            clientBook.scrollPosition[readerData.firstPage] = 0;

            localStorage.setItem('clientBook', JSON.stringify(clientBook));
        }
    }

    // get data, build dom
    var jsonUrl = 'data/bookData.json',
        chapters = $('.chapters');

    $.getJSON(jsonUrl, {
        format: 'json'
    })
        .success(function(data) {
            $.each(data, function(i, o) {
                if (i === 0) {
                    updatedReaderData('firstPage', o.src);
                }
                if (i === data.length - 1) {
                    updatedReaderData('lastPage', o.src);
                }
                $('<a/>', {
                    text: o.title,
                    href: o.src,
                    click: function(e) {
                        e.preventDefault();
                        saveLocation();
                        loadChapter(o.src);
                        // getLocation();
                        goToPreviousLocation();
                    }
                }).appendTo($('<li/>').appendTo('.chapters'));
            })
        })
        .fail(function() {
            console.log(arguments);
        })
        .done(function() {
            init();
        });

    // events
    $(window).on('beforeunload', function() {
        saveLocation();
    });

    // init

    function init() {

        // local storage->readerData
        getLocation();

        // if localstorage exists, it's already readerData.currentPage, if not it's readerData.firstPage
        var page = readerData.currentPage;
        loadChapter(page);

        // readerData page location->DOM
        goToPreviousLocation();

    }


});
