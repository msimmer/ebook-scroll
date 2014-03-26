define(['jquery'], function($) {
    'use strict';

    return function Env() {

        this.isMobile = function() {
            return navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i) ? true : false;
        },
        this.resizeStopped = function() {
            // var that = App;
            // that.layout.countPages();
            // that.layout.adjustFramePosition();
        }

    };

});
