App = App || {};
$.extend(App, {
    eventHandlers: {
        '.play-btn, click': 'playPause',
        '.speed-inc, click': 'speedIncrement',
        '.speed-dec, click': 'speedDecrement',
        '.font-inc, click': 'fontIncrement',
        '.font-dec, click': 'fontDecrement',
        '.contrast-toggle, click': 'contrastToggle',
        'main a, click':'embeddedLinkClick'
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
            var app = App,
                isScrolling = app.readerData.isScrolling,
                playBtn = $('.controls').find('.play-btn'),
                state = (isScrolling ? 'pause' : 'play');

            playBtn.attr('data-state', state);

            if (isScrolling) {
                app.readerData.isScrolling = false;
                app.events.startScrolling();
            } else {
                app.readerData.isScrolling = true;
                app.events.stopScrolling();
            }

            if (typeof callback === 'function') {
                callback();
            }

            // dev
            playBtn.html(state === 'pause' ? '&#9654;' : '&mid; &mid;');

            return app;
        },
        startScrolling: function() {
            //
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
        fontIncrement: function() {
            var app = App;
            var size = (app.readerData.fSize <= app.readerData.maxFontSize ? app.readerData.fSize + 10 : app.readerData.fSize);
            app.updatedReaderData('fSize', size);
            app.el.css('font-size', app.readerData.fSize + '%');
            return app;
        },
        fontDecrement: function() {
            var app = App;
            var size = (app.readerData.fSize >= app.readerData.minFontSize ? app.readerData.fSize - 10 : app.readerData.fSize);
            app.updatedReaderData('fSize', size);
            app.el.css('font-size', app.readerData.fSize + '%');
            return app;
        },
        contrastToggle: function() {
            var app = App;
            var lightCss = {},
                darkCss = {},
                contrastBtn = $('.controls').find('.contrast-toggle'),
                prevContrast = (contrastBtn.attr('data-contrast') === 'light' ? 'dark' : 'light'),
                nextContrast = contrastBtn.attr('data-contrast');

            var darkCss = {
                'background-color': '#333',
                'color': '#FEFEFE'
            };

            var lightCss = {
                'background-color': '#FFF',
                'color': '#000'
            };

            if (nextContrast === 'dark') {
                $('html *').css(darkCss);
                app.el.css(darkCss);
            } else {
                $('html *').css(lightCss);
                app.el.css(lightCss);
            }

            contrastBtn.attr('data-contrast', prevContrast);
            app.updatedReaderData('contrast', nextContrast);

            // dev
            contrastBtn.text(prevContrast);

            return app;

        },
        embeddedLinkClick:function(e){

            e.preventDefault();

            var app = App;
            var target = $(e.target),
                href = target.attr('href'),
                ext = href.match(/^http/);

            if (ext) {
                routeInternalLink(href);
            } else{
                routeInternalLink(href);
            }

            function routeInternalLink(url){
                app.loadChapter(url);
            }
            function routeExternalLink(url){
                target.attr('target', '_blank');
                target.trigger('click');
            }

        }
    }
});
