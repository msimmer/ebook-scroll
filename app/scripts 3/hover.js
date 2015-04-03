define([
    'jquery',
    'env',
    'reader',
    'settings',
    'plugins/hoverIntent'
], function ($, Env, Reader, Settings) {
    'use strict';

    var Hover = function () {

        var env = Env,
            reader = Reader,
            settings = Settings;

        if (env.isMobile()) {
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
                    $(document).trigger('updateUI', {
                        vents: 'stopScrolling'
                    });
                }
                var ct = 0;
                isManuallyScrolling = clearInterval(isManuallyScrolling);
                isManuallyScrolling = setInterval(function () {
                    ct += 1;
                    if (ct < 500) {
                        $(document).trigger('updateUI', {
                            vents: 'countPages'
                        });
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
                    $(document).trigger('updateUI', {
                        vents: 'startScrolling'
                    });
                }
                isManuallyScrolling = clearInterval(isManuallyScrolling);
            },
            interval: 200,
            sensitivity: 1,
            timeout: 0
        });

    };

    return Hover;

});
