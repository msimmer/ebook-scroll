$(function() {

    var readerData = readerData || {
        currentPage:'' // (string), url
    };

    // fns
    var url = 'components/page-1.html',
        main = $('main');

    function updatedReaderData(prop, attr){
        readerData[prop] = attr;
    }

    function loadChapter(url) {
        main.load(url);
        updatedReaderData(currentPage, url);
    }

    function savePosition() {
        var clientBook = {
            'lastPage': readerData.currentPage
        };
        localStorage.setItem('clientBook', JSON.stringify(clientBook));
    }

    function getPosition() {
        var retrievedObject = localStorage.getItem('clientBook');
        console.log('retrievedObject: ', JSON.parse(retrievedObject));
    }

    // events
    $(window).on('beforeunload', 'savePosition'));

    // init
    var jsonUrl = 'data/bookData.json',
        chapters = $('.chapters');

    $.getJSON(jsonUrl, {
        format: 'json'
    })
        .success(function(data) {
            console.log('success');
            $.each(data, function(i, o) {
                $('<a/>', {
                    text: o.title,
                    href: o.src,
                    click: function(e) {
                        e.preventDefault();
                        loadChapter(o.src);
                    }
                }).wrap('<li/>').appendTo('.chapters');
            })
        })
        .fail(function() {
            console.log(arguments);
        })
        .done(function() {
            // console.log('done');
        });

});
