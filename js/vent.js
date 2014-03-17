App = App || {};
$.extend(App, {
    eventHandlers: {
        '.play-btn, click': 'playPause',
        '.speed-inc, click': 'speedIncrement',
        '.speed-dec, click': 'speedDecrement',
        '.font-inc, click': 'fontIncrement',
        '.font-dec, click': 'fontDecrement',
        '.contrast-toggle, click': 'contrastToggle',
        '.full-screen, click': 'toggleFullScreen',
        'main a, click': 'embeddedLinkClick',
        'main, mouseenter': 'listenFaster',
        'main, mouseleave': 'listenSlower'
    },
    bindEventHandlers: function() {

        var that = this;

        $.each(that.eventHandlers, function(k, v) {
            var split = k.split(","),
                el = $.trim(split[0]),
                trigger = $.trim(split[1]);
            $(document).delegate(el, trigger, that.events[v]);
        });

    },
    events: {
        toggleFullScreen: function() {
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
        listenForPageMove: function(intrvl) {

            var that = App;

            // console.log(intrvl);
            clearInterval(that.readerData.scrollInt);
            that.readerData.scrollInt = setInterval(that.layout.countPages, intrvl); // adjust to ~ speed-1

        },
        listenSlower: function() {
            // console.log('listen slow');

            var that = App;

            var intrvl = that.readerData.scrollSpeed * 60; // abstract
            that.events.listenForPageMove(intrvl);

        },
        listenFaster: function(e) {
            // console.log('listen fast');

            var that = App;

            var intrvl = that.readerData.scrollSpeed * 2.5; // abstract
            that.events.listenForPageMove(intrvl);

            // var timer;
            // timer = setTimeout(function(e){
            //     that.events.listenSlower();
            //     clearTimeout(timer);
            // }, 2000); // abstract for page speed

        },
        playPause: function(callback) {

            var that = App,
                isScrolling = that.readerData.isScrolling,
                playBtn = $('.controls').find('.play-btn'),
                state = (isScrolling ? 'pause' : 'play');

            playBtn.attr('data-state', state);

            if (isScrolling) {
                that.readerData.isScrolling = false;
                that.events.startScrolling();
            } else {
                that.readerData.isScrolling = true;
                that.events.stopScrolling();
            }

            if (typeof callback === 'function') {
                callback();
            }

            return that;
        },
        startScrolling: function() {

            var that = App;

            if (that.readerData.scrollInterval !== null) {
                clearTimeout(that.readerData.scrollInterval);
            }

            that.readerData.scrollInterval = setInterval(function() {
                that.el.scrollTop(that.el.scrollTop() + 1);
            }, that.readerData.scrollSpeed);

        },
        stopScrolling: function() {
            //
        },
        speedIncrement: function() {

            var that = App;

            var speed = that.readerData.scrollSpeed;
            that.readerData.scrollSpeed -= 15;
            that.events.startScrolling();
            console.log(that.readerData.scrollSpeed);
        },
        speedDecrement: function() {

            var that = App;

            var speed = that.readerData.scrollSpeed;
            that.readerData.scrollSpeed += 15;
            that.events.startScrolling();
            console.log(that.readerData.scrollSpeed);
        },
        getEndPosition: function() {
            //
        },
        isChapterEnd: function() {
            //
        },
        isBookEnd: function() {
            //
        },
        fontIncrement: function() {
            var that = App;
            var size = (that.readerData.fSize <= that.readerData.maxFontSize ? that.readerData.fSize + 10 : that.readerData.fSize);
            that.updatedReaderData('fSize', size);
            that.el.css('font-size', that.readerData.fSize + '%');
            that.layout.adjustFramePosition();
            return that;
        },
        fontDecrement: function() {
            var that = App;
            var size = (that.readerData.fSize >= that.readerData.minFontSize ? that.readerData.fSize - 10 : that.readerData.fSize);
            that.updatedReaderData('fSize', size);
            that.el.css('font-size', that.readerData.fSize + '%');
            that.layout.adjustFramePosition();
            return that;
        },
        contrastToggle: function(e) {

            var that = App;

            // if (contrast === that.readerData.contrast) {
            //     return;
            // }

            var contrast = e && e.target ? $(e.target).attr('data-contrast') : e,
                lightCss = {},
                darkCss = {};

            if (contrast === 'dark') {
                $('html,body,main').css({
                    backgroundColor: '#333'
                });
                $.each(that.textElements, function(i, o) {
                    $(o).removeClass('lightCss').addClass('darkCss');
                });
            } else if (contrast === 'light') {
                $('html,body,main').css({
                    backgroundColor: '#FFF'
                });
                $.each(that.textElements, function(i, o) {
                    $(o).removeClass('darkCss').addClass('lightCss');
                });
            }

            that.updatedReaderData('contrast', contrast);

            return that;

        },
        embeddedLinkClick: function(e) {

            var that = App;
            var target = $(e.target),
                href = target.attr('href'),
                ext = href.match(/^http/);

            if (ext) {
                routeExternalLink(href);
            } else {
                e.preventDefault();
                routeInternalLink(href);
            }

            function routeInternalLink(url) {
                that.loadChapter(url);
            }

            function routeExternalLink(url) {
                e.stopPropagation();
                target.attr('target', '_blank');
            }

        }
    }
});
