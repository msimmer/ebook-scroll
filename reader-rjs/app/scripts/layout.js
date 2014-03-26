define(['jquery', 'reader', 'settings', 'env'], function($, Reader, Settings, Env) {
    'use strict';

    return function Layout() {

        var reader = Reader,
            settings = Settings,
            env = Env,
            self = this; // keep logical scope

        this.targetContainerWidth = function() {
            var w = parseInt(settings.el.css('font-size'), 10) * 25;
            return w;
        },

        this.targetContainerHeight = function() {
            var h = parseInt(settings.el.css('line-height'), 10) * 9;
            return h;
        },

        this.setFrameHeight = function() {

            var targetHeight = that.layout.targetContainerHeight();

            settings.el.css({
                'height': targetHeight,
                'max-height': targetHeight
            });

        },

        this.setFrameWidth = function() {

            if (env.isMobile()) return;

            var targetWidth = that.layout.targetContainerWidth();

            settings.el.css({
                'max-width': targetWidth
            });

        },

        this.adjustFramePosition = function() {

            self.setFrameHeight();
            self.setFrameWidth();

            var frame = settings.el,
                h = $(window).height() / 2,
                w = $(window).width() / 2,
                frameMidH = frame.height() / 2,
                frameMidW = frame.width() / 2,
                isMobile = env.isMobile();

            var targetWidth = self.targetContainerWidth(),
                smallScreen = targetWidth >= $(window).width(),

                mobileCss = {},
                mobileCss = {
                    top: h - frameMidH,
                    left: 0,
                    marginTop: 0,
                    marginRight: 25,
                    marginBottom: 0,
                    marginLeft: 25
                },

                desktopCss = {},
                desktopCss = {
                    top: h - frameMidH - 30,
                    left: w - frameMidW,
                    marginTop: 0,
                    marginRight: 0,
                    marginBottom: 0,
                    marginLeft: 0
                };

            if (smallScreen || isMobile) {
                frame.css(mobileCss);
            } else {
                frame.css(desktopCss);
            }

            self.adjustNavPosition();

        },

        this.adjustNavPosition = function() {

            var frame = settings.el,
                nav = $('nav'),
                ctrl = nav.find('.controls'),
                ctrlH = 180, // .controls height before mobile layout abstract
                overlap = frame.position().left <= 115; // initial sidebar width + margin

            if (overlap || env.isMobile()) {
                nav.addClass('mobile');
                nav.css({
                    width: frame.width()
                });
            } else if (!overlap && !env.isMobile()) {
                nav.removeClass('mobile');
                nav.css({
                    top: ($(window).height() / 2) - (ctrlH / 2) - 30,
                    width: 66
                });
            }

        }

    };

});
