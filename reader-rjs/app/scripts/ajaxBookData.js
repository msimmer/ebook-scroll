require(['jquery', 'ajaxCall', 'reader'], function($, AjaxCall, Reader) { // not declared in app, data retrieved via ajaxCall

    var ajaxCall = AjaxCall,
        reader = Reader;

    $.when(ajaxCall).then(

        ajaxCall.getData({

            apiURL: 'data/bookData.json',
            dataType: 'json',
            method: 'get',
            successCallback: function(data) {
                reader.components = data;
            }

        })
    );


});
