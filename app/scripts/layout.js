define([
    'jquery',
    'settings',
    'env',
    'styles'
], function ($, Settings, Env, Styles) {
    'use strict';

    var Layout = function () {

        var settings = Settings,
            env = Env,
            styles = Styles,
            self = this;

        this.targetContainerWidth = function () {
            var w = parseInt(settings.el.css('font-size'), 10) * 25,
                isMobile = env.isMobile(),
                orientation = env.orientation();

            if (isMobile && w > window.screen.width && window.screen.width <= 768 && orientation === 'portrait') {
                return window.screen.width;
            }
            if (isMobile && w > window.screen.width && window.screen.width < 768 && orientation === 'landscape') {
                return window.screen.height;
            }
            if (!isMobile && w > $(window).width()) {
                return $(window).width();
            }

            return w;
        };

        this.targetContainerHeight = function () {
            var orientation = env.orientation();
            if (env.isMobile() && $(window).width() <= 568 && orientation === 'landscape') {
                return 300;
            }
            if (env.isMobile() && $(window).width() <= 568 && orientation === 'portrait'){
                return window.screen.height / 2.2;
            }
            var h = parseInt(settings.el.css('line-height'), 10) * 9;
            return h;
        };

        this.setFrameHeight = function () {

            var targetHeight = self.targetContainerHeight();

            settings.el.css({
                height: targetHeight,
                maxHeight: targetHeight
            });

        };

        this.setFrameWidth = function () {

            var targetWidth = self.targetContainerWidth();

            settings.el.css({
                width: targetWidth,
                maxWidth: targetWidth
            });

        };

        this.adjustFramePosition = function () {

            self.setFrameHeight();
            self.setFrameWidth();

            var frame = settings.el;

            if (env.isMobile() && $(window).width() <= 568 && env.orientation() === 'landscape') { // size for iPhone 5 and smaller
                frame.css({
                    top: 10,
                    left: 0
                });
            } else {
                var h = ($(window).width() <= 480) ? $(window).height() / 2 - 30 : $(window).height() / 2,
                    w = $(window).width() / 2,
                    frameMidH = frame.height() / 2,
                    frameMidW = frame.width() / 2,
                    targetLeft = $(window).width() <= 480 ? 0 : w - frameMidW,
                    cssObj = {
                        top: h - frameMidH,
                        left: targetLeft
                    };

                frame.css(cssObj);
            }

            self.adjustNavPosition();

            var dist = parseInt(settings.el.offset().top + settings.el.height() - 49, 10);
            $('#shadow-bottom').css({top:dist});

        };

        this.adjustNavPosition = function () {

            var frame = settings.el,
                nav = $('nav'),
                ctrlH = $('.controls').height(), // .controls height before mobile layout abstract
                overlap = frame.position().left <= 115, // initial sidebar width + margin
                orientation = env.orientation();

            if (overlap && $(window).width() > 480) {
                nav.addClass('mobile');
                nav.css({
                    top: 0,
                    width: frame.width()
                });
            }

            if (!overlap && $(window).width() > 480) {
                nav.removeClass('mobile');
                nav.css({
                    top: ($(window).height() / 2) - (ctrlH / 2),
                    width: 75
                });
            }

            if (orientation === 'portrait' && $(window).width() <= 480) {
                nav.addClass('mobile');
                nav.css({
                    top: 0,
                    width: 'auto'
                });
            }

            if (orientation === 'landscape' && $(window).width() <= 480) {
                nav.removeClass('mobile');
            }

        };

        this.removeElementStyles = function () {
            //
        };

        this.setStyles = function () {

            var mainCss = {
                fontSize: settings.fSize + '%',
                lineHeight: '1.3'
            };

            settings.el.css(mainCss);

        };

    };

    return Layout;

});
