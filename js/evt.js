App = App || {};
$.extend(App, {
    eventHandlers: {
        '.play-btn, click': 'playPause',
        '.speed-inc, click': 'speedIncrement',
        '.speed-dec, click': 'speedDecrement',
        '.font-inc, click': 'fontIncrement',
        '.font-dec, click': 'fontDecrement',
        '.contrast-inc, click': 'contrastIncrement',
        '.contrast-de, click': 'contrastDecrement'
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
        playPause: function() {
            console.log('event');
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
            app.updatedReaderData('fSize', size)
            app.el.css('font-size', app.readerData.fSize + '%');
        },
        fontDecrement: function() {
            var app = App;
            var size = (app.readerData.fSize >= app.readerData.minFontSize ? app.readerData.fSize - 10 : app.readerData.fSize);
            app.updatedReaderData('fSize', size)
            app.el.css('font-size', app.readerData.fSize + '%');
        },
        contrastIncrement: function() {
            console.log('event');
        },
        contrastDecrement: function() {
            console.log('event');
        }
    }
});
