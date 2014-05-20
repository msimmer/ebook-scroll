define([
    'jquery',
    'settings',
    'reader',
    'layout',
    'sys',
    'shims/requestAnimationFrame'
], function ($, Settings, Reader, Layout, Sys) {
    'use strict';

    return function Vents() {

        var settings = Settings,
            reader = Reader,
            layout = new Layout(),
            sys = new Sys(),
            self = this;

        this.eventHandlers = {

            '.play-btn, click': 'playPause',
            '.speed-inc, click': 'speedIncrement',
            '.speed-dec, click': 'speedDecrement',
            '.font-inc, click': 'fontIncrement',
            '.font-dec, click': 'fontDecrement',
            '.contrast-dark, click': 'contrastToggle',
            '.contrast-light, click': 'contrastToggle',
            '.full-screen, click': 'toggleFullScreen',
            'main a, click': 'embeddedLinkClick'

        },

        this.bindEventHandlers = function () {

            var that = this;

            $.each(that.eventHandlers, function (k, v) {

                var eArr = k.split(','),
                    fArr = v.split(','),
                    elem = $.trim(eArr[0]),
                    trig = $.trim(eArr[1]),
                    func = $.trim(fArr[0]),
                    args = fArr.slice(1);

                $(elem).on(trig, function (e) {
                    if (e && e.originalEvent !== undefined) {
                        args.push(e);
                        e.preventDefault();
                    }
                    that[func].apply(that, args);
                });

            });

        },

        this.toggleFullScreen = function () {

            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }

        },

        this.listenForPageChangeInterval = null,

        this.listenForPageChange = function () {

            if (!reader.isScrolling) {
                return;
            }

            var lineHeight = Math.floor(parseInt($(settings.el.first('p')).css('line-height'), 10)),
                containerH = Math.floor(settings.el.height()),
                intrvl = Math.floor((lineHeight * containerH) / settings.scrollSpeed + 1) * 100;

            window.clearInterval(self.listenForPageChangeInterval);

            self.listenForPageChangeInterval = setInterval(function () {
                self.countPages();
            }, intrvl);

        },

        this.playPause = function () {

            var playBtn = $('.controls').find('.play-btn'),
                isScrolling = reader.isScrolling;

            isScrolling ? self.stopScrolling() : self.startScrolling();
            playBtn.attr('data-state', isScrolling ? 'play' : 'pause');

        },

        this.requestAnim = null,
        this.ct = 0,
        this.skip = null,

        this.readScroll = function () {

            self.ct++;
            if (self.ct < self.skip) {
                self.requestAnim = window.requestAnimationFrame(self.readScroll);
                return;
            }
            settings.el.scrollTop(settings.el.scrollTop() + 1);
            self.ct = 0;
            self.requestAnim = window.requestAnimationFrame(self.readScroll);

        },

        this.startScrolling = function () {

            $('.controls').find('.play-btn').attr('data-state', 'pause');

            self.readScroll();
            reader.isScrolling = true;
            self.listenForPageChange();

        },

        this.stopScrolling = function () {

            $('.controls').find('.play-btn').attr('data-state', 'play');

            if (settings.debug) {
                console.log('Stopped');
            }

            window.cancelAnimationFrame(self.requestAnim);
            window.clearInterval(self.listenForPageChangeInterval);

            reader.isScrolling = false;

        },

        this.speedIncrement = function () {

            if (settings.scrollSpeed >= 110) {
                return;
            }

            var s = function () {
                var v = 100 - settings.scrollSpeed,
                    n = v.toString().slice(-2),
                    r = parseInt(n, 10),
                    x = r * 6 / 60;
                console.log('x --- ' + x);
                return x;
            }

            self.skip = s();

            self.stopScrolling();
            settings.scrollSpeed += 10;
            self.startScrolling();

            if (settings.debug) {
                console.log('Reading speed incremented to ' + settings.scrollSpeed + 10);
            }

            sys.updateUserPreferences();

        },

        this.speedDecrement = function () {

             // console.log('decrement speed: ' + settings.scrollSpeed);

             // if (settings.scrollSpeed <= 10) {
             //    console.log('at 0 --');
             //     return;
             // }

             // var s = function () {
             //     var v = 100 - settings.scrollSpeed,
             //         n = v.toString().slice(-2),
             //         r = parseInt(n, 10),
             //         x = r * 6 / 60;
             //    console.log('x --- ' + x);
             //     return x;
             // }

             // self.skip = s();

             // self.stopScrolling();
             // settings.scrollSpeed -= 10;
             // self.startScrolling();

             // if (settings.debug) {
             //    console.log('Reading speed decremented to ' + settings.scrollSpeed);
             // }

             // sys.updateUserPreferences();

        },

        this.isChapterEnd = function () {

            self.stopScrolling();

            if (settings.debug) {
                console.log('Chapter end');
            }

        },

        this.isBookEnd = function () {

            self.stopScrolling();

            if (settings.debug) {
                console.log('Book end');
            }

        },

        this.fontIncrement = function () {

            if (settings.fSize === settings.maxFontSize()) {
                return;
            }

            var size = settings.fSize < settings.maxFontSize() ? settings.fSize + settings.fSizeIncrement : settings.fSize;

            settings.el.css('font-size', size + '%');

            layout.adjustFramePosition();

            sys.updateUserData('fSize', size);
            sys.updateUserPreferences();

        },

        this.fontDecrement = function () {

            if (settings.fSize === settings.minFontSize()) {
                return;
            }

            var size = settings.fSize > settings.minFontSize() ? settings.fSize - settings.fSizeIncrement : settings.fSize;

            settings.el.css('font-size', size + '%');

            layout.adjustFramePosition();

            sys.updateUserData('fSize', size);
            sys.updateUserPreferences();

        },

        this.contrastToggle = function (e) {

            var contrast = e && e.currentTarget ? $(e.currentTarget).attr('data-contrast') : e,
                html = $('html');

            if (contrast === 'dark') {
                html.addClass('darkCss');
                html.removeClass('lightCss');
            } else if (contrast === 'light') {
                html.addClass('lightCss');
                html.removeClass('darkCss');
            }

            sys.updateUserData('contrast', contrast);
            sys.updateUserPreferences();

        },

        this.embeddedLinkClick = function (e) {

            var target = $(e.currentTarget),
                href = target.attr('href'),
                ext = href.match(/^http/);

            if (ext) {
                e.stopPropagation();
                self.stopScrolling();
                target.attr('target', '_blank');
            } else {
                sys.loadChapter(href);
                sys.saveLocation();
            }

        },

        this.orientationHasChanged = function () {

            if (settings.debug) {
                switch (window.orientation) {
                case -90:
                case 90:
                    console.log('Orientation has changed to landscape');
                    break;
                default:
                    console.log('Orientation has changed to portrait');
                    break;
                }
            }

            setTimeout(function () {
                layout.adjustFramePosition();
                if (pageYOffset) {
                    window.scrollTo(0, 0, 1);
                }
            }, 1);

            if (reader.isScrolling) {
                self.stopScrolling();
                setTimeout(function () {
                    self.startScrolling();
                }, 500);
            }

        },

        this.resizeStopped = function () {

            self.countPages();
            layout.adjustFramePosition();

        },

        this.countPages = function () {

            if (settings.debug) {
                console.log('Counting pages');
            }

            var main = settings.el,
                frameH = main.height(),
                page = main.find('#page'),
                pageH = page.height(),
                totalPageIndicator = $('.total-page-count'),
                currentPageIndicator = $('.current-page-count');

            function getCurrentPage() {
                return Math.round((-(page.offset().top - main.offset().top) / frameH) + 1);
            }

            console.log('countPages -- ' + getCurrentPage());

            totalPageIndicator.html(Math.round(pageH / frameH));
            currentPageIndicator.html(getCurrentPage());

            if (main.height() - page.height() >= -main.scrollTop()) {
                if (reader.currentPage === reader.lastPage) {
                    self.isBookEnd();
                } else if (reader.currentPage !== reader.lastPage) {
                    self.isChapterEnd();
                }
            }

        };

    };

});
