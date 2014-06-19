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
    'plugins/hoverIntent',
    'plugins/searchField'
], function ($, Env, Reader, Settings, Styles, Layout, Sys, Vents, Hammer) {
    'use strict';

    return function App(options) {

        var self = this,
            opts = options;

        this.layout = new Layout(),
        this.sys = new Sys(),
        this.vents = new Vents(),

        this.reader = Reader,
        this.settings = Settings,
        this.env = Env,
        this.styles = Styles,

        this.init = function () {

            self.vents.bindEventHandlers();

            if (opts) {
                console.log(opts);
                $.extend(this.settings, opts);
            }

            if (self.settings.clearStorage && !localStorage.refreshed) {
                localStorage.clear();
                localStorage.setItem('refreshed', true);
                window.location.href = window.location.href;
            } else if (self.settings.clearStorage && localStorage.refreshed) {
                localStorage.removeItem('refreshed');
            }

            window.addEventListener('orientationchange', self.vents.orientationHasChanged);

            window.onunload = window.onbeforeunload = (function () {

                $('html, body').scrollTop(0);

                var writeComplete = false;

                return function () {

                    if (writeComplete) {
                        return;
                    }

                    writeComplete = true;

                    if (!self.settings.clearStorage) {
                        self.sys.saveLocation();
                        self.sys.updateUserPreferences();
                    }

                };

            }());

            $(window).on('resize', function () {
                var intrvl;
                intrvl = setInterval(function () {
                    clearInterval(intrvl);
                    self.vents.resizeStopped();
                }, 200);

            });

            console.log('is mobile: ' + self.env.isMobile());

            // hoverIntent methods
            if (!self.env.isMobile()) {

                var wasScrolling,
                    isManuallyScrolling;

                self.settings.el.hoverIntent({
                    over: function () {
                        wasScrolling = self.reader.isScrolling;
                        if (!$('show-scroll-bar').length) {
                            self.settings.el.addClass('show-scroll-bar');
                        }
                        if (wasScrolling) {
                            self.vents.stopScrolling();
                        }
                        var ct = 0;
                        isManuallyScrolling = clearInterval(isManuallyScrolling);
                        isManuallyScrolling = setInterval(function () {
                            ct += 1;
                            if (ct < 500) {
                                self.vents.countPages();
                            } else {
                                clearInterval(isManuallyScrolling);
                            }
                        }, this.interval * 4);
                    },
                    out: function () {
                        if ($('.show-scroll-bar').length && !$('#userInput').is(':focus')) {
                            self.settings.el.removeClass('show-scroll-bar');
                        }
                        if (wasScrolling) {
                            self.vents.startScrolling();
                        }
                        isManuallyScrolling = clearInterval(isManuallyScrolling);
                    },
                    interval: 200,
                    sensitivity: 1,
                    timeout: 0
                });

            }

            // mobile listeners
            if (self.env.isMobile()) {

                self.settings.el.css('overflow-y', 'scroll');

                var el = document.getElementsByTagName('body')[0],
                    frame = document.getElementById('main'),
                    controls = document.getElementsByClassName('controls')[0],
                    wasScrolling = self.reader.isScrolling,
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

                    if (!target.is('.control-btn') && !target.is(frame) && !target.parents().is(frame)) {

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

                            wasScrolling = self.reader.isScrolling;

                            if (wasScrolling) {
                                self.vents.stopScrolling();
                            } else {
                                self.vents.startScrolling();
                            }

                        } else if (e.type == 'touch' && e.gesture.touches.length < 2) {

                            touchTimer = setTimeout(function () {
                                e.stopPropagation();
                                e.gesture.stopPropagation();

                                wasScrolling = self.reader.isScrolling;
                                wasHolding = true;

                                if (wasScrolling && !doubleTapped) {
                                    self.vents.stopScrolling();
                                }
                            }, 150);

                        } else if (e.type == 'release') {

                            if (wasHolding) {
                                e.gesture.stopPropagation();
                                self.vents.countPages();

                                if (wasScrolling && wasHolding) {
                                    setTimeout(function () {
                                        wasHolding = false;
                                        self.vents.startScrolling();
                                    }, 200);

                                }
                            }

                        } else if (e.type == 'pinchin') {

                            e.stopPropagation();
                            e.gesture.stopPropagation();

                            self.vents.fontDecrement();
                            if (wasScrolling) {
                                self.vents.startScrolling();
                            }

                            e.gesture.stopDetect();

                        } else if (e.type == 'pinchout') {

                            e.stopPropagation();
                            e.gesture.stopPropagation();

                            self.vents.fontIncrement();
                            if (wasScrolling) {
                                self.vents.startScrolling();
                            }

                            e.gesture.stopDetect();

                        } else if (e.type == 'dragend' && e.gesture.touches.length < 2) {

                            e.preventDefault();
                            e.stopPropagation();
                            e.gesture.preventDefault();
                            e.gesture.stopPropagation();

                            if (e.gesture.distance >= 70 && e.gesture.direction == 'right') {

                                e.gesture.stopDetect();
                                self.vents.speedIncrement();

                            } else if (e.gesture.distance >= 70 && e.gesture.direction == 'left') {

                                e.gesture.stopDetect();
                                self.vents.speedDecrement();

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
                JSONUrl = (self.settings.dev) ? 'data/bookData.json' : siteUrl + '/wp-content/themes/Fiktion/data/bookData.json';

            var retrieveJsonData = $.ajax({
                url: JSONUrl,
                dataType: 'json',
                method: 'get',
                success: function (data) {
                    $.each(data, function (i) {
                        if (this.uuid === window.ebookAppData.uuid) {
                            self.settings.bookId = this.uuid;
                            var components = this.components;
                            self.sys.updatedReaderData('components', components);
                            self.sys.updatedReaderData('currentPage', components[0].src);
                            self.sys.updatedReaderData('firstPage', components[0].src);
                            self.sys.updatedReaderData('lastPage', components[components.length - 1].src);
                        }
                    });
                },
                error: function (x, t, s) {
                    if (self.settings.debug) {
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
                                self.sys.saveLocation();
                                loadChapter(o.src);
                                self.sys.goToPreviousLocation();
                            }
                        })
                    }).appendTo(self.settings.chapters);

                });

                if (self.settings.debug) {
                    console.log('JSON data added to DOM');
                }

            }

            function loadChapter(pageUrl) {

                if (pageUrl === null) {
                    var notFound = siteUrl + '/404';
                    window.location.href = notFound;
                    return false;
                }

                return $.ajax({
                        type: 'get',
                        url: pageUrl,
                        async: false
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

                        self.settings.el.html(content);

                        self.sys.updatedReaderData('currentPage', pageUrl);
                        self.sys.updateLocalStorage(self.settings.bookId, 'currentPage', pageUrl);

                        if (self.settings.debug) {
                            console.log('Current page is ' + pageUrl);
                        }
                    });

            }

            $.when(retrieveJsonData)
                .then(function (data) {
                    addJsonDataToDom(self.reader.components);
                })
                .then(function () {
                    self.sys.getLocation();
                    self.sys.getUserPreferences();
                })
                .then(function () {
                    loadChapter(self.reader.currentPage);
                    self.sys.goToPreviousLocation();
                    self.layout.removeElementStyles();
                    self.layout.setStyles();
                })
                .then(function () {
                    self.layout.adjustFramePosition();
                    self.vents.contrastToggle(self.settings.contrast);

                    var shadowHeight = 50,
                        shadowTop = $('<div/>', {
                            id: 'shadow-top',
                            class: 'shadow-' + self.settings.contrast,
                            css: {
                                'position': 'fixed',
                                'height': shadowHeight,
                                'width': self.settings.el.width(),
                                'left': self.settings.el.offset().left,
                                'top': self.settings.el.offset().top,
                            }
                        }),
                        shadowBottom = $('<div/>', {
                            id: 'shadow-bottom',
                            class: 'shadow-' + self.settings.contrast,
                            css: {
                                'position': 'fixed',
                                'height': shadowHeight,
                                'width': self.settings.el.width(),
                                'left': self.settings.el.offset().left,
                                'top': self.settings.el.offset().top + self.settings.el.height() - shadowHeight,
                            }
                        });

                    self.settings.el.append(shadowTop);
                    self.settings.el.append(shadowBottom);

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
                                        self.vents.countPages();
                                        $('.controls, .runner-help, .runner-page-count, #page, .search-wrapper').animate({
                                            opacity: 1
                                        }, 200);
                                        $('.spinner').fadeOut(200, function () {
                                            setTimeout(function () {
                                                self.vents.startScrolling();
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

});
