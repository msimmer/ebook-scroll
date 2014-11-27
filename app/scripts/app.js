define([
    'jquery',
    'env',
    'reader',
    'settings',
    'styles',
    'layout',
    'sys',
    'vents',
    'plugins/hammer',
    'chapter-nav',
    'plugins/hoverIntent',
    'plugins/searchField',
], function ($, Env, Reader, Settings, Styles, Layout, Sys, Vents, Hammer, ChapterNav, HoverIntent, SearchField) {
    'use strict';

    var App = function (options) {

        var _this = this,
            opts = options;

            this.layout = new Layout(),
            this.sys = new Sys(),
            this.vents = new Vents(),
            this.chapterNav = new ChapterNav(),

            this.reader = Reader,
            this.settings = Settings,
            this.env = Env,
            this.styles = Styles,

            this.init = function () {

                _this.vents.bindEventHandlers();

                if (opts) {
                    $.extend(this.settings, opts);
                }

                if (_this.settings.clearStorage && !localStorage.refreshed) {
                    localStorage.clear();
                    localStorage.setItem('refreshed', true);
                    window.location.href = window.location.href;
                } else if (_this.settings.clearStorage && localStorage.refreshed) {
                    localStorage.removeItem('refreshed');
                }

                window.addEventListener('orientationchange', _this.vents.orientationHasChanged);

                window.onunload = window.onbeforeunload = (function () {

                    $('html, body').scrollTop(0);

                    var writeComplete = false;

                    return function () {

                        if (writeComplete) {
                            return;
                        }

                        writeComplete = true;

                        if (!_this.settings.clearStorage) {
                            _this.sys.saveLocation();
                            _this.sys.updateUserPreferences();
                        }

                    };

                }());

                $(window).on('resize', function () {
                    var intrvl;
                    intrvl = setInterval(function () {
                        clearInterval(intrvl);
                        _this.vents.countPages();
                        _this.layout.adjustFramePosition();
                    }, 200);

                });

                // hoverIntent methods
                if (!_this.env.isMobile()) {

                    var wasScrolling,
                        isManuallyScrolling;

                    _this.settings.el.hoverIntent({
                        over: function () {
                            wasScrolling = _this.reader.isScrolling;
                            if (!$('show-scroll-bar').length) {
                                _this.settings.el.addClass('show-scroll-bar');
                            }
                            if (wasScrolling) {
                                _this.vents.stopScrolling();
                            }
                            var ct = 0;
                            isManuallyScrolling = clearInterval(isManuallyScrolling);
                            isManuallyScrolling = setInterval(function () {
                                ct += 1;
                                if (ct < 500) {
                                    _this.vents.countPages();
                                } else {
                                    clearInterval(isManuallyScrolling);
                                }
                            }, this.interval * 4);
                        },
                        out: function () {
                            if ($('.show-scroll-bar').length && !$('#userInput').is(':focus')) {
                                _this.settings.el.removeClass('show-scroll-bar');
                            }
                            if (wasScrolling) {
                                _this.vents.startScrolling();
                            }
                            isManuallyScrolling = clearInterval(isManuallyScrolling);
                        },
                        interval: 200,
                        sensitivity: 1,
                        timeout: 0
                    });

                }

                // mobile listeners
                if (_this.env.isMobile()) {

                    _this.settings.el.css('overflow-y', 'scroll');

                    var el = document.getElementsByTagName('body')[0],
                        frame = document.getElementById('main'),
                        controls = document.getElementsByClassName('controls')[0],
                        wasScrolling = _this.reader.isScrolling,
                        doubleTapped = false,
                        wasHolding = false,
                        touchTimer,
                        dist,
                        dir,
                        options = {
                            behavior: {
                                doubleTapInterval: 200,
                                contentZooming: 'none',
                                touchAction: 'none',
                                touchCallout: 'none',
                                userDrag: 'none'
                            },
                            dragLockToAxis: true,
                            dragBlockHorizontal: true
                        },
                        hammer = new Hammer(el, options);

                    hammer.on('touch release pinchin pinchout dragend doubletap', function (e) {

                        var target = $(e.target);

                        doubleTapped = false;
                        clearTimeout(touchTimer);

                        if (!target.is('.control-btn') && !target.is('.chapter-nav') && !target.is(frame) && !target.parents().is(frame)) {

                            console.log('-- target not control of frame or frame children');

                            e.preventDefault();
                            e.stopPropagation();
                            e.gesture.preventDefault();
                            e.gesture.stopPropagation();
                            e.gesture.stopDetect();

                        } else if (target.is(frame) || target.parents().is(frame)) {

                            if (e.type == 'doubletap') {

                                doubleTapped = true;

                                e.stopPropagation();
                                e.gesture.stopPropagation();

                                wasScrolling = _this.reader.isScrolling;

                                if (wasScrolling) {
                                    _this.vents.stopScrolling();
                                } else {
                                    _this.vents.startScrolling();
                                }

                            } else if (e.type == 'touch' && e.gesture.touches.length < 2) {

                                touchTimer = setTimeout(function () {
                                    e.stopPropagation();
                                    e.gesture.stopPropagation();

                                    wasScrolling = _this.reader.isScrolling;
                                    wasHolding = true;

                                    if (wasScrolling && !doubleTapped) {
                                        _this.vents.stopScrolling();
                                    }
                                }, 150);

                            } else if (e.type == 'release') {

                                if (wasHolding) {
                                    e.gesture.stopPropagation();
                                    _this.vents.countPages();

                                    if (wasScrolling && wasHolding) {
                                        setTimeout(function () {
                                            wasHolding = false;
                                            _this.vents.startScrolling();
                                        }, 200);

                                    }
                                }

                            } else if (e.type == 'pinchin') {

                                e.stopPropagation();
                                e.gesture.stopPropagation();

                                _this.vents.fontDecrement();
                                if (wasScrolling) {
                                    _this.vents.startScrolling();
                                }

                                e.gesture.stopDetect();

                            } else if (e.type == 'pinchout') {

                                e.stopPropagation();
                                e.gesture.stopPropagation();

                                _this.vents.fontIncrement();
                                if (wasScrolling) {
                                    _this.vents.startScrolling();
                                }

                                e.gesture.stopDetect();

                            } else if (e.type == 'dragend' && e.gesture.touches.length < 2) {

                                e.preventDefault();
                                e.stopPropagation();
                                e.gesture.preventDefault();
                                e.gesture.stopPropagation();

                                if (e.gesture.distance >= 70 && e.gesture.direction == 'right') {

                                    e.gesture.stopDetect();
                                    _this.vents.speedIncrement();

                                } else if (e.gesture.distance >= 70 && e.gesture.direction == 'left') {

                                    e.gesture.stopDetect();
                                    _this.vents.speedDecrement();

                                }

                            }

                        } else if (target.parents().is(controls)) {
                            e.stopPropagation();
                            e.gesture.stopPropagation();
                        }

                    });

                }

                // bootstrap
                var pathArray = window.location.href.split('/'),
                    protocol = pathArray[0],
                    host = pathArray[2],
                    siteUrl = protocol + '//' + host,
                    JSONUrl = _this.settings.jsonPath

                var retrieveJsonData = $.ajax({
                    url: JSONUrl,
                    cache: false,
                    headers: {
                        'If-Modified-Since': 'Sat, 01 Jan 2000 00:00:01 GMT'
                    },
                    dataType: 'json',
                    method: 'get',
                    success: function (data) {
                        $.each(data, function (i) {
                            if (this.uuid === window.ebookAppData.uuid) {
                                _this.settings.bookId = this.uuid;
                                var components = this.components;
                                _this.sys.updatedReaderData('components', components);
                                _this.sys.updatedReaderData('currentPage', components[0].src);
                                _this.sys.updatedReaderData('firstPage', components[0].src);
                                _this.sys.updatedReaderData('lastPage', components[components.length - 1].src);
                            }
                        });
                    },
                    error: function (x, t, s) {
                        if (_this.settings.debug) {
                            console.log(t + ': ' + s);
                        }
                    }

                });

                function addJsonDataToDom(data) {

                    $.each(data, function (i, o) {

                        $('<li/>', {
                            html: $('<a/>', {
                                text: o.title,
                                href: o.src,
                                click: function (e) {
                                    e.preventDefault();
                                    _this.sys.saveLocation();
                                    loadChapter(o.src);
                                    _this.sys.goToPreviousLocation();
                                }
                            })
                        }).appendTo(_this.settings.chapters);

                    });

                    if (_this.settings.debug) {
                        console.log('JSON data added to DOM');
                    }

                }

                function loadChapter(pageUrl) {

                    if (pageUrl === null) {
                        if (localStorage && !localStorage.refreshed) {
                            window.onunload = window.onbeforeunload = function () {
                                return;
                            };
                            localStorage.clear();
                            localStorage.setItem('refreshed', true);
                            window.location.href = window.location.href;
                        } else if (localStorage && localStorage.refreshed) {
                            localStorage.removeItem('refreshed');
                            var notFound = siteUrl + '/404';
                            window.location.href = notFound;
                            return false;
                        }
                    }

                    return $.ajax({
                            type: 'get',
                            url: pageUrl,
                            async: false,
                            cache: false,
                            headers: {
                                'If-Modified-Since': 'Sat, 01 Jan 2000 00:00:01 GMT'
                            },
                        })
                        .then(function (data) {
                            var content = $('<section/>', {
                                id: 'page',
                                css: {
                                    margin: 0,
                                    padding: 0,
                                    border: 0
                                }
                            }).html(data);

                            _this.settings.el.html(content);

                            _this.sys.updatedReaderData('currentPage', pageUrl);
                            _this.sys.updateLocalStorage(_this.settings.bookId, 'currentPage', pageUrl);

                            if (_this.settings.debug) {
                                console.log('Current page is ' + pageUrl);
                            }
                        });

                }

                $.when(retrieveJsonData)
                    .then(function (data) {
                        addJsonDataToDom(_this.reader.components);
                    })
                    .then(function () {
                        _this.sys.getLocation();
                        _this.sys.getUserPreferences();
                    })
                    .then(function () {
                        loadChapter(_this.reader.currentPage);
                        _this.sys.goToPreviousLocation();
                        _this.layout.removeElementStyles();
                        _this.layout.setStyles();
                    })
                    .then(function () {
                        _this.layout.adjustFramePosition();
                        _this.vents.contrastToggle(_this.settings.contrast);

                        var shadowHeight = 50,
                            topDist = _this.env.isMobile() ? 0 : _this.settings.el.offset().top,
                            shadowTop = $('<div/>', {
                                id: 'shadow-top',
                            }),
                            shadowBottom = $('<div/>', {
                                id: 'shadow-bottom',
                                css: {
                                    'top': parseInt(_this.settings.el.offset().top + _this.settings.el.height() - 49, 10)
                                }
                            });

                        _this.settings.el.append(shadowTop);
                        _this.settings.el.append(shadowBottom);

                    })
                    .then(function () {

                        var limit = 60000,
                            ct = 0,
                            pageCountTimeout,
                            intrvl;

                        (function () {
                            intrvl = setInterval(function () {
                                ct += 1;
                                if ($('#page').length) {
                                    pageCountTimeout = setTimeout(function () {
                                        var pages = $('#page').find('p').length; // fix this
                                        if (pages == $('#page').find('p').length && ct < limit || pages != $('#page').find('p').length && ct >= limit) {
                                            clearInterval(intrvl);
                                            clearTimeout(pageCountTimeout);
                                            _this.vents.countPages();
                                            _this.vents.cursorListener();

                                            var ids = $([]).pushStack($('h1,h2,h3,h4,h4'));
                                            if (ids.length) {
                                                _this.chapterNav.bindChapters();
                                                _this.chapterNav.appendNav();
                                            }

                                            $('.controls, .runner-help, .runner-page-count, #page, .search-wrapper, .chapter-nav').animate({
                                                opacity: 1
                                            }, 200);
                                            $('.spinner').fadeOut(200, function () {
                                                setTimeout(function () {
                                                    _this.vents.startScrolling();
                                                }, 50);
                                            });
                                        } else if (pages != $('#page').find('p').length && ct < limit) {
                                            // continue counting
                                            clearTimeout(pageCountTimeout);
                                        }
                                    }, 10);
                                }
                            }, 50);
                        })();
                    });

            };

    };

    return App;

});
