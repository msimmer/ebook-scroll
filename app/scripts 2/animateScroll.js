define(function () {
    window.animateScroll = function (callback) {
        return setTimeout(function () {
            callback();
        }, 0);
    };
    window.cancelScroll = clearTimeout;
});
