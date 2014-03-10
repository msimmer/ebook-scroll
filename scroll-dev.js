$(function() {

    var url     = 'components/page-1.html',
        main    = $('main');

    $.get({
        url: url,
        dataType: 'json',
        success: function(data) {
            console.log('success');
            main.html(data);
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' ' + errorThrown);
        }
    });


});
