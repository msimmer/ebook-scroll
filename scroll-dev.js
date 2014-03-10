$(function() {

    window.readerData = {
        currentPage: '', // (string), url
        firstPage: '', // (string), url
        lastPage: '', // (string), url
        scrollPosition: 0 // (int), main's vertical scroll position (scrollTop())
    };

    // fns
    // var url = (readerData.currentPage !== '' ? readerData.currentPage : readerData.firstPage);
    var main = $('main');

    function updatedReaderData(prop, attr) {
        readerData[prop] = attr;
    }

    function loadChapter(url) {
        main.load(url);
        updatedReaderData('currentPage', url);
        main.scrollTop(readerData.scrollPosition);
        setLocation();
    }

    function setLocation() {
        updatedReaderData('scrollPosition', $('main').scrollTop());
        alert($('main').scrollTop());
        var clientBook = {
            'currentPage': (readerData.currentPage !== '' ? readerData.currentPage : readerData.firstPage),
            'scrollPosition': readerData.scrollPosition
        };
        localStorage.setItem('clientBook', JSON.stringify(clientBook));
    }

    function getLocation() {
        if (localStorage.getItem('clientBook') === null) {
            setLocation();
        }
        var obj = JSON.parse(localStorage.getItem('clientBook'));
        readerData.currentPage = obj.currentPage;
        readerData.scrollPosition = obj.scrollPosition;
    }

    function initialPosition() {
        main.scrollTop(0);
    }

    function goToLastPosition() {
        // main.scrollTo(readerData.scrollPosition);
    }

    // events
    $(window).on('beforeunload', 'setLocation');

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
                        setLocation();
                        loadChapter(o.src);
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


    // init

    function init() {

        // check local storage for location
        getLocation();

        // if localstorage exists, it's already readerData.currentPage, if not it's readerData.firstPage
        var page = readerData.currentPage;
        loadChapter(page);
        // goToLastPosition();

    }


});
