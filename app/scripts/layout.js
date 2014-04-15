define([
    'jquery',
    'settings',
    'env',
    'styles'
], function($, Settings, Env, Styles) {
    'use strict';

    return function Layout() {

        var settings = Settings,
            env = Env,
            styles = Styles,
            self = this;

        this.targetContainerWidth = function() {
            var w = parseInt(settings.el.css('font-size'), 10) * 25;
            return w;
        },

        this.targetContainerHeight = function() {
            var h = parseInt(settings.el.css('line-height'), 10) * 9;
            return h;
        },

        this.setFrameHeight = function() {

            var targetHeight = self.targetContainerHeight();

            settings.el.css({
                'height': targetHeight,
                'max-height': targetHeight
            });

        },

        this.setFrameWidth = function() {

            if (env.isMobile()) {
                return;
            }

            var targetWidth = self.targetContainerWidth();

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
                targetLeft = env.isMobile() ? 0 : w - frameMidW,
                cssObj = {
                    top: h - frameMidH - 30,
                    left: targetLeft
                };

            frame.css(cssObj);
            self.adjustNavPosition();

        },

        this.adjustNavPosition = function() {

            var frame = settings.el,
                nav = $('nav'),
                ctrlH = 180, // .controls height before mobile layout abstract
                overlap = frame.position().left <= 115, // initial sidebar width + margin
                orientation = env.orientation();

            if (overlap) {
                nav.addClass('mobile');
                nav.css({
                    top: 0,
                    width: frame.width()
                });
            }

            if (!overlap) {
                nav.removeClass('mobile');
                nav.css({
                    top: ($(window).height() / 2) - (ctrlH / 2) - 30,
                    width: 66
                });
            }

            if (orientation === 'portrait') {
                nav.addClass('mobile');
                nav.css({
                    top: 0,
                    width: 300
                });

            }

            if (orientation === 'landscape') {

                log('landscape');
                nav.removeClass('mobile');
                nav.css({
                    top: ($(window).height() / 2) - (ctrlH / 2) - 30,
                    width: 66
                });

            }

        },

        this.removeElementStyles = function() {

            var textCss = {
                fontSize: '',
                lineHeight: '',
                color: '',
                textDecoration: '',
                backgroundColor: 'transparent'
            };

            $.each(styles.textElements, function(i, o) {
                // settings.el.find(o).css(textCss);
            });

        },

        this.setStyles = function() {

            $.each(styles.baseStyles, function(i, o) {
                // settings.el.find(i).css('font-size', o.fSize);
            });

            var mainCss = {
                'font-size': settings.fSize + '%',
                'line-height': '1.3'
            };

            settings.el.css(mainCss);

            $('html,body,main').css({
                '-webkit-transition': 'background-color 150ms ease-out', // contrast toggle
                '-moz-transition': 'background-color 150ms ease-out',
                '-o-transition': 'background-color 150ms ease-out',
                'transition': 'background-color 150ms ease-out'
            });

        };

    };

});
