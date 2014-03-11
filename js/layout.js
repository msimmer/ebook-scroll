App = App || {};
$.extend(App, {

    layout: {

        countPages: function() {},
        counterIncrement: function() {},
        counterDecrement: function() {},

        resizeStopped: function() {},

        targetContainerWidth: function() {
            var that = App;
            var w = parseInt(that.el.css('font-size'), 10) * 25;
            return w;
        },
        targetContainerHeight: function() {
            var that = App;
            var h = parseInt(that.el.css('line-height'), 10) * 7;
            return h;
        },
        setFrameHeight: function() {
            var that = App;
            var targetHeight = that.layout.targetContainerHeight();

            that.el.css({
                'height': targetHeight,
                'max-height': targetHeight
            });

            return that;

        },
        setFrameWidth: function() {
            var that = App;
            var targetWidth = that.layout.targetContainerWidth();

            that.el.css({
                'width': targetWidth,
                'max-width': targetWidth
            });

            return that;
        },
        adjustFramePosition: function() {

            var that = App;

            var h = $(window).height() / 2,
                w = $(window).width() / 2,
                frame = that.el,
                frameMidH = frame.height() / 2,
                frameMidW = frame.width() / 2;

            frame.css({
                top: h - frameMidH - 30,
                left: w - frameMidW
            });

            that.layout.adjustBracketPosition();

            return that;

        },
        adjustBracketPosition: function() {

            var that = App;

            var el = that.el,
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

            return that;

        }

    }

});
