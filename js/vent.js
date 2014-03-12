App = App || {};
$.extend(App, {
    eventHandlers: {
        '.play-btn, click': 'playPause',
        '.speed-inc, click': 'speedIncrement',
        '.speed-dec, click': 'speedDecrement',
        '.font-inc, click': 'fontIncrement',
        '.font-dec, click': 'fontDecrement',
        '.contrast-toggle, click': 'contrastToggle',
        'main a, click': 'embeddedLinkClick'
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

            // dev
            playBtn.html(state === 'pause' ? '&#9654;' : '&mid; &mid;');

            return that;
        },
        startScrolling: function() {

            var that = App;

            // scrollInterval = setInterval(function() {
                // that.el.scrollTop(that.el.scrollTop() + 1);
                // if (scrollData.stopPos[1] === true) {
                // clearInterval(scrollInterval);
                // removeHandlers();
                // console.log('document end');
                // console.log('finished: ' + scrollData.stopPos[1]);
                // }
            // }, 60);


            /**
             *
             * refactor to include following rFA
             *
             */
            // var elem = document.getElementById('animatedElem'),
            //     startTime = null,
            //     endPos = 500, // in pixels
            //     duration = 2000; // in milliseconds

            // function render(time) {
            //     if (time === undefined) {
            //         time = new Date().getTime();
            //     }
            //     if (startTime === null) {
            //         startTime = time;
            //     }

            //     elem.style.left = ((time - startTime) / duration * endPos % endPos) + 'px';
            // }

            // var globalID;

            // function repeatOften() {
            //     render();
            //     globalID = requestAnimationFrame(repeatOften);
            // }

            // $("#start").on("click", function() {
            //     globalID = requestAnimationFrame(repeatOften);
            // });

            // $("#stop").on("click", function() {
            //     cancelAnimationFrame(globalID);
            // });

            // elem.onclick = function() {
            //     (function animationLoop() {
            //         render();
            //         requestAnimationFrame(animationLoop, elem);
            //     })();
            // };

        },
        stopScrolling: function() {
            //
        },
        speedIncrement: function() {
            console.log('event');
        },
        speedDecrement: function() {
            console.log('event');
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
        contrastToggle: function() {
            var that = App;
            var lightCss = {},
                darkCss = {},
                contrastBtn = $('.controls').find('.contrast-toggle'),
                prevContrast = (contrastBtn.attr('data-contrast') === 'light' ? 'dark' : 'light'),
                nextContrast = contrastBtn.attr('data-contrast');

            if (nextContrast === 'dark') {
                $('html,body,main').css({
                    backgroundColor: '#333'
                });
                $.each(that.textElements, function(i, o) {
                    $(o).removeClass('lightCss').addClass('darkCss');
                });
            } else {
                $('html,body,main').css({
                    backgroundColor: '#FFF'
                });
                $.each(that.textElements, function(i, o) {
                    $(o).removeClass('darkCss').addClass('lightCss');
                });
            }

            contrastBtn.attr('data-contrast', prevContrast);
            that.updatedReaderData('contrast', nextContrast);

            // dev
            contrastBtn.text(prevContrast);

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
