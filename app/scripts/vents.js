define([
    'jquery',
    'settings',
    'reader',
    'layout',
    'sys',
    'animateScroll'
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
                    if (e && typeof e.originalEvent !== 'undefined') {
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

        this.getSkipInterval = function () {
            var v = 100 - settings.scrollSpeed,
                n = v.toString().slice(-2),
                r = parseInt(n, 10),
                x = r * 5 / 50;

            self.skip = x;

        },

        this.readScroll = function () {

            self.ct++;
            if (self.ct < self.skip) { // skip the animation every `self.skip` frame
                self.requestAnim = window.animateScroll(self.readScroll);
                return;
            }
            self.ct = 0;
            settings.el.scrollTop(settings.el.scrollTop() + 1); // run the animation
            self.requestAnim = window.animateScroll(self.readScroll);

        },

        this.startScrolling = function () {

            if (!reader.isScrolling) {
                $('.controls').find('.play-btn').attr('data-state', 'pause');

                if (self.skip == null) {
                    self.getSkipInterval();
                }

                self.readScroll();
                self.listenForPageChange();

                reader.isScrolling = true;
            }

        },

        this.stopScrolling = function () {

            if (reader.isScrolling) {
                $('.controls').find('.play-btn').attr('data-state', 'play');

                if (settings.debug) {
                    console.log('Stopped');
                }

                window.cancelScroll(self.requestAnim);
                window.clearInterval(self.listenForPageChangeInterval);

                reader.isScrolling = false;
            }

        },

        this.speedIncrement = function () {

            if (settings.scrollSpeed >= 100) {
                console.log('at 100% --');
                return;
            } else {
                self.stopScrolling();
                settings.scrollSpeed += 10;
                self.getSkipInterval();
                self.startScrolling();

                if (settings.debug) {
                    console.log('Reading speed incremented to ' + settings.scrollSpeed);
                }

                sys.updateUserPreferences();
            }

        },

        this.speedDecrement = function () {

            if (settings.scrollSpeed <= 10) {
                console.log('at 0% --');
                return;
            } else {
                self.stopScrolling();
                settings.scrollSpeed -= 10;
                self.getSkipInterval();
                self.startScrolling();

                if (settings.debug) {
                    console.log('Reading speed decremented to ' + settings.scrollSpeed);
                }

                sys.updateUserPreferences();
            }

        },

        this.isChapterEnd = function () {

            self.stopScrolling();

            if (settings.debug) {
                console.log('Chapter end');
            }

        },

        this.hasEnded = false,

        this.isBookEnd = function () {

            self.stopScrolling();
            self.hasEnded = true;

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
                $('#shadow-top, #shadow-bottom')
                    .addClass('shadow-dark')
                    .removeClass('shadow-light');
            } else if (contrast === 'light') {
                html.addClass('lightCss');
                html.removeClass('darkCss');
                $('#shadow-top, #shadow-bottom')
                    .addClass('shadow-light')
                    .removeClass('shadow-dark');
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
            var main = settings.el,
                frameH = main.height(),
                page = main.find('#page'),
                pageH = page.height(),
                totalPageIndicator = $('.total-page-count'),
                currentPageIndicator = $('.current-page-count');

            function getCurrentPage() {
                return Math.round((-(page.offset().top - main.offset().top) / frameH) + 1);
            }

            totalPageIndicator.html(Math.round(pageH / frameH));
            currentPageIndicator.html(getCurrentPage());

            if (getCurrentPage() >= Math.round(pageH / frameH)) {
                if (reader.currentPage === reader.lastPage) {
                    self.isBookEnd();
                } else if (reader.currentPage !== reader.lastPage) {
                    self.isChapterEnd();
                }
            } else {
                self.hasEnded = false;
            }

            if (settings.debug) {
                var intrvl,
                    ct;
                intrvl = setInterval(function () {
                    ct++;
                    if (page.length) {
                        clearInterval(intrvl);
                        console.log('Reading location is -- ' + getCurrentPage());
                    }
                    if (ct >= 1000) {
                        clearInterval(intrvl);
                        console.log('Reading location timed out.');
                    }
                }, 10);
            }

        };

    };

});
