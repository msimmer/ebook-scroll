define([
    'jquery',
    'settings'
], function ($, Settings) {
    'use strict';

    var ChapterNav = function () {

        var _this = this;
        var settings = Settings;

        _this.panels = '[data-chapter]';
        _this.scrolledOnce = false;

        this.bindChapters = function () {
            var ids = $([]).pushStack($('h1,h2,h3,h4,h5,h6'));
            var scrollTop = $(window).scrollTop();
            var currentPos = false;
            var pagination = {
                currentPos: false,
                articles: $.map(ids, function (obj, i) {
                    $(obj).data({
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

                    if ($(obj).context.offsetTop >= scrollTop && currentPos === false) {
                        $(obj).data().currentEl = true;
                        currentPos = $(obj).context.offsetTop;
                    }

                    for (var i in $(obj).data()) {
                        if (typeof $(obj).data()[i] !== 'object') {
                            $(obj).attr('data-' + i, $(obj).data()[i]);
                        }
                    }

                    return $(obj);
                })
            };

            pagination.currentPos = currentPos;
        };

        this.moveToChapter = function (dir, callback) {

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

                if (firstArticle === true) {
                    switch (dir) {
                    case 'prev':
                        var pos = 0;
                        break;
                    case 'next':
                        var pos = $('[data-firstel="true"]').data().posTop;
                        console.log(pos);
                        break;
                    }
                } else {
                    var dirPos = dir + 'Pos', // scroll to next el
                        dirEl = dir + 'El',
                        $this = $('[data-currentel="true"]'),
                        pos = $this.data()[dirPos];
                }

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
                })
            });

        };

        this.appendNav = function () {

            var $prev = $('<a/>', {
                id: 'chapter-prev',
                'class': 'chapter-nav',
                'data-dir': 'prev'
            }).on({
                click: function (e) {
                    e.preventDefault();
                    _this.moveToChapter($(this).data().dir, function () {
                        $(document).trigger('updateUI', {
                            vents: 'countPages'
                        });
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
                    _this.moveToChapter($(this).data().dir, function () {
                        $(document).trigger('updateUI', {
                            vents: 'countPages'
                        });
                    });
                }
            }).appendTo('body');

        };

    };

    return ChapterNav;

});
