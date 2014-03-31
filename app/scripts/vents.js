define([
    'jquery',
    'settings',
    'reader',
    'layout',
    'sys'
], function($, Settings, Reader, Layout, Sys) {

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
            '.contrast-toggle, click': 'contrastToggle',
            '.full-screen, click': 'toggleFullScreen',
            'main a, click': 'embeddedLinkClick'

        },

        this.bindEventHandlers = function() {

            $.each(self.eventHandlers, function(k, v) {

                var split = k.split(","),
                    el = $.trim(split[0]),
                    trigger = $.trim(split[1]);

                $(document).delegate(el, trigger, self[v]);

            });

        },

        this.toggleFullScreen = function() {

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

        this.listenForPageChangeInterval = null, // storing setInterval

        this.listenForPageChange = function() {

            if (reader.isScrolling === false) return;

            var fontSize = $(settings.el.first('p')).css('font-size');
            var lineHeight = Math.floor(parseInt(fontSize.replace('px', '')) * 1.5);

            var intrvl = (lineHeight * settings.el.height()) * (settings.scrollSpeed / 30);

            window.clearInterval(self.listenForPageChangeInterval);

            self.listenForPageChangeInterval = setInterval(function() {
                sys.countPages();
            }, intrvl);

        },

        this.playPause = function() {

            var playBtn = $('.controls').find('.play-btn'),
                isScrolling = reader.isScrolling;

            isScrolling ? self.stopScrolling() : self.startScrolling();
            playBtn.attr('data-state', isScrolling ? 'play' : 'pause');

        },

        this.startScrolling = function() {

            var playBtn = $('.controls').find('.play-btn').attr('data-state', 'pause');

            window.clearInterval(settings.scrollInt);

            settings.scrollInt = setInterval(function() {
                settings.el.scrollTop(settings.el.scrollTop() + 1);
            }, settings.scrollSpeed);

            reader.isScrolling = true;

            self.listenForPageChange();

        },

        this.stopScrolling = function() {

            var playBtn = $('.controls').find('.play-btn').attr('data-state', 'play');

            if (settings.debug) console.log('Stopped');

            window.clearInterval(settings.scrollInt);
            window.clearInterval(self.listenForPageChangeInterval);

            reader.isScrolling = false;

        },

        this.speedIncrement = function() {

            self.stopScrolling();
            settings.scrollSpeed -= 20;
            self.startScrolling();

            sys.updateUserPreferences();

        },

        this.speedDecrement = function() {

            self.stopScrolling();
            settings.scrollSpeed += 20;
            self.startScrolling();

            sys.updateUserPreferences();

        },

        this.isChapterEnd = function() {

            self.stopScrolling();

            if (settings.debug) console.log('Chapter end');

        },

        this.isBookEnd = function() {

            self.stopScrolling();

            if (settings.debug) console.log('Book end');

        },

        this.fontIncrement = function() {

            var size = settings.fSize < settings.maxFontSize() ? settings.fSize + 20 : settings.fSize;

            settings.el.css('font-size', size + '%');

            layout.adjustFramePosition();

            sys.updateUserData('fSize', size);
            sys.updateUserPreferences();

        },

        this.fontDecrement = function() {

            var size = settings.fSize > settings.minFontSize() ? settings.fSize - 20 : settings.fSize;

            settings.el.css('font-size', size + '%');

            layout.adjustFramePosition();

            sys.updateUserData('fSize', size);
            sys.updateUserPreferences();

        },

        this.contrastToggle = function(e) {

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

        this.embeddedLinkClick = function(e) {

            var target = $(e.currentTarget),
                href = target.attr('href'),
                ext = href.match(/^http/);

            if (ext) {
                routeExternalLink(href);
            } else {
                e.preventDefault();
                routeInternalLink(href);
            }

            function routeInternalLink(url) {
                sys.loadChapter(url);
                sys.saveLocation();
            }

            function routeExternalLink(url) {
                e.stopPropagation();
                target.attr('target', '_blank');
            }
        },

        this.orientationHasChanged = function() {

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

            setTimeout(function() {
                if (pageYOffset) {
                    window.scrollTo(0, 0, 1);
                }
            }, 1);

            if (reader.isScrolling) {
                self.stopScrolling();
                setTimeout(function() {
                    self.startScrolling();
                }, 500);
            }

        },

        this.resizeStopped = function() {

            sys.countPages();
            layout.adjustFramePosition();

        }

    };

});
