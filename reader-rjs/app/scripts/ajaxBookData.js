define(['jquery', 'reader', 'ajaxCall'], function($, Reader, AjaxCall) {

    var
    ajaxCall = AjaxCall,
        reader = Reader;

    ajaxCall.getData({

        url: 'data/bookData.json',
        dataType: 'json',
        method: 'get',
        successCallback: function(data) {
            reader.components = data;
        }

    });

});
