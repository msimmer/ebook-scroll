$(function() {

    window.readerData = {
        currentPage: '', // (string), url
        firstPage: '', // (string), url
        lastPage: '' // (string), url
    };

    // fns
    var url = (readerData.currentPage !== '' ? readerData.currentPage : readerData.firstPage),
        main = $('main');

    function updatedReaderData(prop, attr) {
        readerData[prop] = attr;
    }

    function loadChapter(url) {
        main.load(url);
        updatedReaderData('currentPage', url);
        setPosition();
    }

    function setPosition() {
        var clientBook = {
            'currentPage': readerData.currentPage
        };
        localStorage.setItem('clientBook', JSON.stringify(clientBook));
    }

    function getPosition() {
        if (localStorage.getItem('clientBook') === null) {
            setPosition();
        }
        var obj = localStorage.getItem('clientBook');
        readerData.currentPage = JSON.parse(obj).currentPage;
    }

    // events
    $(window).on('beforeunload', 'setPosition');

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
        getPosition();

        // if localstorage exists, it's already readerData.currentPage, if not it's readerData.firstPage
        var page = (readerData.currentPage !== '' ? readerData.currentPage : readerData.firstPage);
        loadChapter(page);
    }


});
