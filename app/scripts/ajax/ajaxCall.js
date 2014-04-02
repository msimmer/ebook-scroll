define([
    'jquery',
    'settings'
], function($, Settings) {
    'use strict';

    var settings = Settings;

    function getData(opts) {

        $.ajax({
            url: opts.url,
            dataType: opts.format,
            method: opts.method,
            jsonpCallback: opts.jsonpCallback,
            success: opts.successCallback || function(data) {
                if (settings.debug) console.log(data);
            },
            error: opts.errorCallback || function(x, t, s) {
                if (settings.debug) console.log(t + ' ' + s);
            },
            timeout: opts.timeout
        });

    }

    return {
        getData: getData
    };

});
