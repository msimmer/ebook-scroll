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
                currentPageIndicator = $('.current-page-count'),
                q = Math.round(pageH / frameH);

            function getCurrentPage() {
                return Math.round((-(page.offset().top - that.el.offset().top) / frameH) + 1);
            }

            totalPageIndicator.html(q);
            currentPageIndicator.html(getCurrentPage());

            var main = that.el,
                page = main.find('#page');

            if (main.height() - page.height() >= -main.scrollTop()) {
                if (that.readerData.currentPage === that.readerData.lastPage) {
                    that.events.isBookEnd();
                } else if (that.readerData.currentPage !== that.readerData.lastPage) {
                    that.events.isChapterEnd();
                }
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
                frameMidW = frame.width() / 2,
                ctrl = nav.find('.controls'),
                ctrlH = ctrl.height();

            var overlap = frame.position().left <= 115; // initial sidebar width + margin

            if (overlap) {
                nav.addClass('mobile').css({
                    width: frame.width()
                });
            } else {
                nav.removeClass('mobile').css({
                    top: (nav.height() / 2) - (ctrlH / 2) - 30,
                    width: 66
                });
            }

            var targetWidth = that.layout.targetContainerWidth(),
                smallScreen = targetWidth >= $(window).width(),
                mobileCss = {},
                mobileCss = {
                    top: h - frameMidH - 30,
                    left: 0,
                    marginTop: 0,
                    marginRight: 25,
                    marginBottom: 0,
                    marginLeft: 25
                },
                desktopCss = {},
                desktopCss = {
                    top: h - frameMidH - 30,
                    left: w - frameMidW,
                    marginTop: 0,
                    marginRight: 0,
                    marginBottom: 0,
                    marginLeft: 0
                };


            if (smallScreen) {
                frame.css(mobileCss);
            } else {
                frame.css(desktopCss);
            }

            return that;
        }
    }
});
