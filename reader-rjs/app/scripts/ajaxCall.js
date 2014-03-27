define(['jquery'], function($) {

    function getData(options) {

        $.ajax({
            url: options.apiURL,
            dataType: options.format,
            method: options.method,
            jsonpCallback: options.jsonpCallback,
            success: options.successCallback,
            error: function(x, t, s) {
                console.log(s);
            },
            timeout: options.timeout
        });

    }

    return {

        getData: getData

    }

});
