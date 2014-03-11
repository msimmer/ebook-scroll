App = App || {};
$.extend(App, {

    layout: {

        countPages: function() {},
        counterIncrement: function() {},
        counterDecrement: function() {},

        resizeStopped: function() {},

        targetContainerWidth: function() {
            var app = App;
            var w = parseInt(app.el.css('font-size'), 10) * 25;
            return w;
        },
        targetContainerHeight: function() {
            var app = App;
            var h = parseInt(app.el.css('line-height'), 10) * 7;
            return h;
        },
        setFrameHeight: function() {
            var app = App;
            var targetHeight = app.layout.targetContainerHeight();

            app.el.css({
                'height': targetHeight,
                'max-height': targetHeight
            });

            return app;

        },
        setFrameWidth: function() {
            var app = App;
            var targetWidth = app.layout.targetContainerWidth();

            app.el.css({
                'width': targetWidth,
                'max-width': targetWidth
            });

            return app;
        },
        adjustFramePosition: function() {

            var app = App;

            var h = $(window).height() / 2,
                w = $(window).width() / 2,
                frame = app.el,
                frameMidH = frame.height() / 2,
                frameMidW = frame.width() / 2;

            frame.css({
                top: h - frameMidH - 30,
                left: w - frameMidW
            });

            app.layout.adjustBracketPosition();

            return app;

        },
        adjustBracketPosition: function() {

            var app = App;

            var el = app.el,
                bracket = $('.bracket');

            bracket.css({
                top: el.offset().top - 30,
                left: el.offset().left - 80,
                width: 40,
                height: el.height() + 60,
                borderTop: '15px solid black',
                borderLeft: '15px solid black',
                borderBottom: '15px solid black',
                position: 'absolute'
            });

            return app;

        }

    }

});
