var $            = require('./vendor/jquery');
var settings     = require('./settings');
var reader       = require('./reader');
var userSettings = require('./user-settings');
var layout       = require('./layout');

module.exports = {

    eventHandlers: {

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

    bindEventHandlers: function () {

        var _this = this;

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

    },

    toggleFullScreen: function () {

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

    listenForPageChangeInterval: null,

    listenForPageChange: function () {

        var _this = this;

        var lineHeight = Math.floor(parseInt($(settings.el.first('p')).css('line-height'), 10)),
            containerH = Math.floor(settings.el.height()),
            intrvl = Math.floor((lineHeight * containerH) / settings.scrollSpeed + 1) * 100;

        window.clearInterval(_this.listenForPageChangeInterval);

        _this.listenForPageChangeInterval = setInterval(function () {
            _this.countPages();
        }, intrvl);

    },

    playPause: function () {

        var playBtn = $('.controls').find('.play-btn'),
            isScrolling = reader.isScrolling;

        if (isScrolling) {
            this.stopScrolling()
        } else {
            this.startScrolling();
        }
        playBtn.attr('data-state', isScrolling ? 'play' : 'pause');

    },

    requestAnim: null,

    ct: 0,

    skip: null,

    getSkipInterval: function () {
        var v = 100 - settings.scrollSpeed,
            n = v.toString().slice(-2),
            r = parseInt(n, 10),
            x = r * 6 / 30;

        this.skip = x;

    },

    animateScroll: function (context, callback) {
        return setTimeout(function () {
            context[callback].apply(context);
        }, 0);
    },

    readScroll: function () {

        this.ct++;
        if (this.ct < this.skip) { // skip the animation every `this.skip` frame
            this.requestAnim = this.animateScroll(this, 'readScroll');
            return;
        }
        this.ct = 0;
        settings.el.scrollTop(settings.el.scrollTop() + 1); // run the animation
        this.requestAnim = this.animateScroll(this, 'readScroll');

    },

    cursorTimer: null,

    cursorListener: function () {
        var _this = this;
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
    },

    startScrolling: function () {

        if (!reader.isScrolling) {
            $('.controls').find('.play-btn').attr('data-state', 'pause');

            if (this.skip === null) {
                this.getSkipInterval();
            }

            this.readScroll();
            this.listenForPageChange();

            reader.isScrolling = true;
        }

    },

    stopScrolling: function () {
        if (reader.isScrolling) {
            $('.controls').find('.play-btn').attr('data-state', 'play');

            if (settings.debug) {
                console.log('Stopped');
            }
            clearTimeout(this.requestAnim);
            clearInterval(this.listenForPageChangeInterval);
            reader.isScrolling = false;
        }

    },

    speedIncrement: function () {

        this.stopScrolling();

        if (settings.scrollSpeed < 100) {
            settings.scrollSpeed += 10;

            if (settings.debug) {
                console.log('Reading speed incremented to ' + settings.scrollSpeed);
            }

            userSettings.updateUserPreferences();
        }

        this.getSkipInterval();
        this.startScrolling();

    },

    speedDecrement: function () {

        this.stopScrolling();

        if (settings.scrollSpeed > 10) {
            settings.scrollSpeed -= 10;

            if (settings.debug) {
                console.log('Reading speed decremented to ' + settings.scrollSpeed);
            }

            userSettings.updateUserPreferences();
        }

        this.getSkipInterval();
        this.startScrolling();

    },

    isChapterEnd: function () {

        this.stopScrolling();

        if (settings.debug) {
            console.log('Chapter end');
        }

    },

    hasEnded: false,

    isBookEnd: function () {

        this.stopScrolling();
        this.hasEnded = true;

        if (settings.debug) {
            console.log('Book end');
        }

    },

    fontIncrement: function () {

        if (settings.fSize === settings.maxFontSize()) {
            return;
        }
        var size = settings.fSize < settings.maxFontSize() ? settings.fSize + settings.fSizeIncrement : settings.fSize;

        settings.el.css('font-size', size + '%');
        userSettings.updateUserData('fSize', size);

        $(document).trigger('updateUi', {});

    },

    fontDecrement: function () {

        if (settings.fSize === settings.minFontSize()) {
            return;
        }

        var size = settings.fSize > settings.minFontSize() ? settings.fSize - settings.fSizeIncrement : settings.fSize;

        settings.el.css('font-size', size + '%');
        userSettings.updateUserData('fSize', size);

    },

    contrastToggle: function (e) {

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

    },

    embeddedLinkClick: function (e) {

        var target = $(e.currentTarget),
            href = target.attr('href'),
            ext = href.match(/^http/);

        if (ext) {
            e.stopPropagation();
            this.stopScrolling();
            target.attr('target', '_blank');
        } else {
            userSettings.loadChapter(href);
            userSettings.saveLocation();
        }

    },

    orientationHasChanged: function () {

        var _this = this;

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

    },

    countPages: function () {
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
                this.isBookEnd();
            } else if (reader.currentPage !== reader.lastPage) {
                this.isChapterEnd();
            }
        } else {
            this.hasEnded = false;
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

    }

};
