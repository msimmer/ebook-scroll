define([
    'jquery',
    'settings',
    'env',
    'styles'
], function ($, Settings, Env, Styles) {
    'use strict';

    return function Layout() {

        var settings = Settings,
            env = Env,
            styles = Styles,
            self = this;

        this.targetContainerWidth = function () {
            var w = parseInt(settings.el.css('font-size'), 10) * 25;
            return w;
        },

        this.targetContainerHeight = function () {
            var h = parseInt(settings.el.css('line-height'), 10) * 9;
            return h;
        },

        this.setFrameHeight = function () {

            if (env.orientation() === 'landscape' && env.isMobile()) {
                var targetHeight = 250;
            } else if (env.orientation() !== 'landscape' && !env.isMobile() && $(window).width >= 480) {
                var targetHeight = self.targetContainerHeight();
            } else {
                return;
            }

            settings.el.css({
                height: targetHeight,
                maxHeight: targetHeight
            });

        },

        this.setFrameWidth = function () {

            if ($(window).width() <= 480) {
                return;
            }

            var targetWidth = self.targetContainerWidth();

            settings.el.css({
                maxWidth: targetWidth
            });

        },

        this.adjustFramePosition = function () {

            self.setFrameHeight();
            self.setFrameWidth();

            var frame = settings.el;

            if (env.orientation() === 'landscape' && env.isMobile()) {
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

            if ($('#shadow-top').length && $('#shadow-bottom').length) {
                $('#shadow-top').css({
                    'width': frame.width(),
                    'left': frame.offset().left,
                    'top': frame.offset().top
                });
                $('#shadow-bottom').css({
                    'width': frame.width(),
                    'left': frame.offset().left,
                    'top': frame.offset().top + frame.height() - $('#shadow-bottom').height()
                });
            }

            if (env.isMobile()) {
                setTimeout(function () {
                    $('body,html').scrollTop(0);
                }, 0);
            }

        },

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
                    width: 300
                });
            }

            if (orientation === 'landscape' && $(window).width() <= 480) {
                nav.removeClass('mobile');
            }

        },

        this.removeElementStyles = function () {
            //
        },

        this.setStyles = function () {

            var mainCss = {
                fontSize: settings.fSize + '%',
                lineHeight: '1.3'
            };

            settings.el.css(mainCss);

        };

    };

});
