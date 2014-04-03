define([
    'jquery',
    'reader',
    'ajax/ajaxCall'
], function($, Reader, AjaxCall) {
    'use strict';

    var ajaxCall = AjaxCall,
        reader = Reader;

    ajaxCall.getData({

        url: 'data/bookData.json',
        dataType: 'json',
        method: 'get',
        successCallback: function(data) {
            reader.components = data;
            reader.firstPage = data[0].src;
            reader.lastPage = data[data.length - 1].src;
        }

    });

});
