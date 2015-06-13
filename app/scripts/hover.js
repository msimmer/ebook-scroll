var $           = require('./vendor/jquery');
var environment = require('./environment');
var reader      = require('./reader');
var settings    = require('./settings');
var hoverIntent = require('./vendor/hover-intent');

module.exports = function () {

    if (environment.isMobile()) {
        return;
    }

    var wasScrolling,
        isManuallyScrolling;

    settings.el.hoverIntent({
        over: function () {
            wasScrolling = reader.isScrolling;
            if (!$('show-scroll-bar').length) {
                settings.el.addClass('show-scroll-bar');
            }
            if (wasScrolling) {
                events.stopScrolling();
                // $(document).trigger('updateUI', {
                //     vents: 'stopScrolling'
                // });
            }
            var ct = 0;
            isManuallyScrolling = clearInterval(isManuallyScrolling);
            isManuallyScrolling = setInterval(function () {
                ct += 1;
                if (ct < 500) {
                    // $(document).trigger('updateUI', {
                    //     vents: 'countPages'
                    // });
                    events.countPages();
                } else {
                    clearInterval(isManuallyScrolling);
                }
            }, this.interval * 4);
        },
        out: function () {
            if ($('.show-scroll-bar').length && !$('#userInput').is(':focus')) {
                settings.el.removeClass('show-scroll-bar');
            }
            if (wasScrolling) {
                // $(document).trigger('updateUI', {
                //     vents: 'startScrolling'
                // });
                events.startScrolling();
            }
            isManuallyScrolling = clearInterval(isManuallyScrolling);
        },
        interval: 200,
        sensitivity: 1,
        timeout: 0
    });

};
