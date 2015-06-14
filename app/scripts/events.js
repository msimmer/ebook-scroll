define(function (require) {
    var history      = require('vendor/history');
    var settings     = require('settings');
    var reader       = require('reader');
    var userSettings = require('user-settings');
    var layout       = require('layout');

    var Events = function () {

        var _this = this;

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

        };

        this.bindEventHandlers = function () {

            $.each(_this.eventHandlers, function (k, v) {

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
                    _this[func].apply(_this, args);
                });

            });

        };

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

        };

        this.listenForPageChangeInterval = null;

        this.listenForPageChange = function () {

            var lineHeight = Math.floor(parseInt($(settings.el.first('p')).css('line-height'), 10)),
                containerH = Math.floor(settings.el.height()),
                intrvl = Math.floor((lineHeight * containerH) / settings.scrollSpeed + 1) * 100;

            window.clearInterval(_this.listenForPageChangeInterval);

            _this.listenForPageChangeInterval = setInterval(function () {
                _this.countPages();
            }, intrvl);

        };

        this.playPause = function () {

            var playBtn = $('.controls').find('.play-btn'),
                isScrolling = reader.isScrolling;

            if (isScrolling) {
                _this.stopScrolling();
            } else {
                _this.startScrolling();
            }
            playBtn.attr('data-state', isScrolling ? 'play' : 'pause');

        };

        this.requestAnim = null;

        this.ct = 0;

        this.skip = null;

        this.getSkipInterval = function () {
            var v = 100 - settings.scrollSpeed,
                n = v.toString().slice(-2),
                r = parseInt(n, 10),
                x = r * 6 / 30;

            _this.skip = x;

        };

        this.animateScroll = function (context, callback) {
            return setTimeout(function () {
                context[callback].apply(context);
            }, 0);
        };

        this.readScroll = function () {

            _this.ct++;
            if (_this.ct < _this.skip) { // skip the animation every `this.skip` frame
                _this.requestAnim = _this.animateScroll(_this, 'readScroll');
                return;
            }
            _this.ct = 0;
            settings.el.scrollTop(settings.el.scrollTop() + 1); // run the animation
            _this.requestAnim = _this.animateScroll(_this, 'readScroll');

        };

        this.cursorTimer = null;

        this.cursorListener = function () {
            var $this = $('html');
            var showCursor = function () {
                $this.removeClass('cursor-hidden');
            };
            var hideCursor = function () {
                $this.addClass('cursor-hidden');
            };
            var setTimer = function () {
                if (reader.isScrolling) {
                    _this.cursorTimer = setTimeout(function () {
                        hideCursor();
                    }, 2000);
                }
            };
            $this.on({
                mousemove: function () {
                    showCursor();
                    window.clearTimeout(_this.cursorTimer);
                    setTimer();
                }
            });
            $('a').on({
                mouseenter: function () {
                    window.clearTimeout(_this.cursorTimer);
                },
                mouseleave: function () {
                    setTimer();
                }
            });
            $this.addClass('cursor-hidden');
        };

        this.startScrolling = function () {

            if (!reader.isScrolling) {
                $('.controls').find('.play-btn').attr('data-state', 'pause');

                if (_this.skip === null) {
                    _this.getSkipInterval();
                }

                _this.readScroll();
                _this.listenForPageChange();

                reader.isScrolling = true;
            }

        };

        this.stopScrolling = function () {
            if (reader.isScrolling) {
                $('.controls').find('.play-btn').attr('data-state', 'play');
                if (settings.debug) {
                    console.log('Stopped');
                }
                window.clearTimeout(_this.requestAnim);
                window.clearInterval(_this.listenForPageChangeInterval);
                reader.isScrolling = false;
            }

        };

        this.speedIncrement = function () {

            _this.stopScrolling();

            if (settings.scrollSpeed < 100) {
                settings.scrollSpeed += 10;

                if (settings.debug) {
                    console.log('Reading speed incremented to ' + settings.scrollSpeed);
                }

                userSettings.updateUserPreferences();
            }

            _this.getSkipInterval();
            _this.startScrolling();

        };

        this.speedDecrement = function () {

            _this.stopScrolling();

            if (settings.scrollSpeed > 10) {
                settings.scrollSpeed -= 10;

                if (settings.debug) {
                    console.log('Reading speed decremented to ' + settings.scrollSpeed);
                }

                userSettings.updateUserPreferences();
            }

            _this.getSkipInterval();
            _this.startScrolling();

        };

        this.isChapterEnd = function () {

            _this.stopScrolling();

            if (settings.debug) {
                console.log('Chapter end');
            }

        };

        this.hasEnded = false;

        this.isBookEnd = function () {

            _this.stopScrolling();
            _this.hasEnded = true;

            if (settings.debug) {
                console.log('Book end');
            }

        };

        this.fontIncrement = function () {

            if (settings.fSize === settings.maxFontSize()) {
                return;
            }
            var size = settings.fSize < settings.maxFontSize() ? settings.fSize + settings.fSizeIncrement : settings.fSize;

            settings.el.css('font-size', size + '%');
            userSettings.updateUserData('fSize', size);

            $(document).trigger('updateUi', {});

        };

        this.fontDecrement = function () {

            if (settings.fSize === settings.minFontSize()) {
                return;
            }

            var size = settings.fSize > settings.minFontSize() ? settings.fSize - settings.fSizeIncrement : settings.fSize;

            settings.el.css('font-size', size + '%');
            userSettings.updateUserData('fSize', size);

        };

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

            userSettings.updateUserData('contrast', contrast);
            userSettings.updateUserPreferences();

        };

        this.embeddedLinkClick = function (e) {

            var target = $(e.currentTarget),
                href = target.attr('href'),
                external = function (href) {
                    return href.match('^http') !== null;
                };

            if (external(href)) {
                e.stopPropagation();
                _this.stopScrolling();
                target.attr('target', '_blank');
            } else {
                userSettings.loadChapter(href);
                userSettings.saveLocation();
            }

        };

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
                if (window.pageYOffset) {
                    window.scrollTo(0, 0, 1);
                }
            }, 1);

            if (reader.isScrolling) {
                _this.stopScrolling();
                setTimeout(function () {
                    _this.startScrolling();
                }, 500);
            }

        };

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
                    _this.isBookEnd();
                } else if (reader.currentPage !== reader.lastPage) {
                    _this.isChapterEnd();
                }
            } else {
                _this.hasEnded = false;
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

    return new Events();
});
