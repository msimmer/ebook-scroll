App = App || {};
$.extend(App, {

    layout: {

        countPages: function() {

            if (App.debug) console.log('Counting pages');

            var that = App;

            var frameH = that.el.height(),
                page = that.el.find('section#page'),
                pageH = page.height(),
                totalPageIndicator = $('.total-page-count'),
                currentPageIndicator = $('.current-page-count');

            var t = Math.round(pageH / frameH);

            function getCurrentPage() {
                return Math.round((-(page.offset().top - that.el.offset().top) / frameH) + 1);
            }

            totalPageIndicator.html(t);
            currentPageIndicator.html(getCurrentPage());

            var timer;
            if (t === getCurrentPage()) {
                timer = setTimeout(function(){
                    clearTimeout(timer);
                    that.events.stopScrolling();
                }, 2000);
            }

            return that;

        },

        resizeStopped: function() {
            var that = App;
            that.layout.countPages();
            that.layout.adjustFramePosition();
        },

        targetContainerWidth: function() {
            var that = App;
            var w = parseInt(that.el.css('font-size'), 10) * 25;
            return w;
        },
        targetContainerHeight: function() {
            var that = App;
            var h = parseInt(that.el.css('line-height'), 10) * 9;
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

            this.setFrameHeight();
            this.setFrameWidth();

            var frame = that.el,
                nav = $('nav'),
                h = $(window).height() / 2,
                w = $(window).width() / 2,
                frameMidH = frame.height() / 2,
                frameMidW = frame.width() / 2;

            frame.css({
                top: h - frameMidH - 30,
                left: w - frameMidW
            });

            nav.css({
                top: h - frameMidH - 30
            });

            if ((frame.width() + nav.width() * 3) >= $(window).width()) {
                nav.hide();
            } else {
                nav.show();
            }

            return that;

        }

    }

});