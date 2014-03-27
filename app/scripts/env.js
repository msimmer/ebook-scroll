define(function() {
    'use strict';

    var Env = {

        isMobile: function() {
            return navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i) ? true : false;
        }

    };

    return Env;

});
