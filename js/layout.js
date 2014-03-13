App = App || {};
$.extend(App, {

    layout: {

        countPages: function() {

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

            var scrollInt;

            function restInterval() {
                console.log('rest called');
                clearInterval(scrollInt);
                scrollInt = setInterval(updatePageCount, 4999); // adjust to ~ speed-1
            }

            function quickInterval() {
                console.log('quick called');
                clearInterval(scrollInt);
                scrollInt = setInterval(updatePageCount, 60);
            }

            var isActive;

            that.el.on({
                mouseenter: function(e) {

                    quickInterval();
                    var pastOffset = page.offset().top;

                    isActive = setInterval(function() {
                        var offset = page.offset().top;

                        if (Math.abs(offset) < Math.abs(pastOffset) + 35 || Math.abs(offset) > Math.abs(pastOffset) - 35) {
                            clearInterval(isActive);
                            restInterval();
                        }

                    }, 1000);

                },
                mousemove: function(e) {
                    //
                },
                mouseleave: function() {
                    clearInterval(isActive);
                    restInterval();
                }
            });

            function updatePageCount() {
                console.log('update called');
                currentPageIndicator.html(getCurrentPage());
            }

            return that;

        },

        resizeStopped: function() {
            //
        },

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

            this.setFrameHeight();
            this.setFrameWidth();

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
                top: el.offset().top - 45,
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
