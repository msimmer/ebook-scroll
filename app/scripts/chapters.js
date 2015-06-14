define(function (require) {
    var settings = require('./settings');
    var events   = require('./events');

    return {

        panels: settings.chapterSelector,
        scrolledOnce: false,

        bindChapters: function () {
            var ids = $([]).pushStack($('h1,h2,h3,h4,h5,h6'));
            var scrollTop = $(window).scrollTop();
            var currentPos = false;
            var pagination = {
                currentPos: false,
                articles: $.map(ids, function (obj, i) {

                    var $obj = $(obj);

                    $obj.data({
                        chapter: i,
                        posTop: ids[i].offsetTop,
                        firstEl: i === 0 ? true : false,
                        lastEl: i === ids.length - 1 ? true : false,
                        prevEl: i - 1 > -1 ? ids[i - 1] : ids[0],
                        nextEl: i + 1 <= ids.length - 1 ? ids[i + 1] : ids[ids.length - 1],
                        prevPos: i - 1 > -1 ? ids[i - 1].offsetTop : 0,
                        nextPos: i + 1 <= ids.length - 1 ? ids[i + 1].offsetTop : ids[i].offsetTop,
                        currentEl: false
                    });

                    if ($obj.context.offsetTop >= scrollTop && currentPos === false) {
                        $obj.data().currentEl = true;
                        currentPos = $obj.context.offsetTop;
                    }

                    for (var p in $obj.data()) {
                        if (typeof $obj.data()[p] !== 'object') {
                            $obj.attr('data-' + p, $obj.data()[p]);
                        }
                    }

                    return $obj;
                })
            };

            pagination.currentPos = currentPos;
        },

        moveToChapter: function (dir, callback) {

            var _this = this;

            if (_this.scrolledOnce === false) {
                _this.bindChapters();
                _this.scrolledOnce = true;
            }

            var currentPos = false,
                scrollTop = settings.el.scrollTop(),
                firstArticle = false,
                lastArticle = false,
                hasScrolled;

            var getPromise = function () {
                var dfr = $.Deferred();
                var len = $(_this.panels).length - 1;
                $(_this.panels).each(function (i) { // set current el
                    var $this = $(this);
                    var buffer = 200;
                    var thisTop = $this.data().posTop;
                    var chapEnd = $this.data().nextPos;

                    $this.attr('data-currentel', false).data({
                        currentEl: false
                    });

                    if (scrollTop >= thisTop - buffer && scrollTop < chapEnd && currentPos === false) {
                        $this.attr('data-currentel', true).data({
                            currentEl: true
                        });
                        currentPos = thisTop;
                    }

                    if (i === len) {
                        if (currentPos === false) {
                            if (scrollTop <= thisTop) {
                                $('[data-firstel="true"]').attr('data-currentel', true).data({
                                    currentEl: true
                                });
                                firstArticle = true;
                            } else {
                                $this.attr('data-currentel', true).data({
                                    currentEl: true
                                });
                                lastArticle = true;
                            }
                        }
                        dfr.resolve();
                    }
                });
                return dfr.promise();
            };

            $.when(getPromise()).done(function () {

                hasScrolled = false;

                var pos = firstArticle === true && dir === 'prev' ? 0 :
                    firstArticle === true && dir === 'next' ? $('[data-firstel="true"]').data().posTop :
                    firstArticle !== true ? $('[data-currentel="true"]').data()[dir + 'Pos'] : 0;

                settings.el.animate({
                    scrollTop: pos
                }, {
                    complete: function () {
                        if (!hasScrolled) {
                            hasScrolled = true;
                            if (typeof callback === 'function') {
                                callback();
                            }
                            return;
                        }
                    }
                });
            });

        },

        appendNav: function () {

            var _this = this;

            var $prev = $('<a/>', {
                id: 'chapter-prev',
                'class': 'chapter-nav',
                'data-dir': 'prev'
            }).on({
                click: function (e) {
                    e.preventDefault();
                    _this.moveToChapter($(this).data().dir, function(){
                        events.countPages();
                    });
                }
            }).appendTo('body');
            var $next = $('<a/>', {
                id: 'chapter-next',
                'class': 'chapter-nav',
                'data-dir': 'next'
            }).on({
                click: function (e) {
                    e.preventDefault();
                    _this.moveToChapter($(this).data().dir, function(){
                        events.countPages();
                    });
                }
            });

            $('body').append($prev);
            $('body').append($next);

        }

    };
});
