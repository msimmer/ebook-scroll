$(function() {

    var url = 'components/page-1.html',
        main = $('main');

    function loadChapter(url) {
        main.load(url);
    }

    function savePosition(){}
    function getPosition(){}

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
                        loadChapter(o.src)
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
