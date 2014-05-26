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

            // hoverIntent methods
            if (!self.env.isMobile()) {

                var wasScrolling,
                    isManuallyScrolling;

                self.settings.el.hoverIntent({
                    over: function () {
                        wasScrolling = self.reader.isScrolling;
                        self.settings.el.toggleClass('show-scroll-bar', wasScrolling);
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
                        self.settings.el.toggleClass('show-scroll-bar', !wasScrolling);
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
                    wasScrolling,
                    dist,
                    dir,
                    options = {
                        behavior: {
                            contentZooming: 'none',
                            touchAction: 'none',
                            touchCallout: 'none',
                            userDrag: 'none'
                        },
                        dragLockToAxis: true,
                        dragBlockHorizontal: true
                    },
                    hammer = new Hammer(el, options);

                hammer.on('touch release pinchin pinchout dragright dragleft dragend', function (e) {

                    var target = $(e.target);

                    if (!target.parents().is(controls) && !target.is(frame) && !target.parents().is(frame)) {

                        e.preventDefault();
                        e.stopPropagation();
                        e.gesture.preventDefault();
                        e.gesture.stopPropagation();
                        e.gesture.stopDetect();

                    } else if (target.is(frame) || target.parents().is(frame)) {

                        if (e.type == 'touch') {
                            e.stopPropagation();
                            e.gesture.stopPropagation();

                            wasScrolling = self.reader.isScrolling;

                            console.log('touch -- ' + wasScrolling);

                            if (wasScrolling) {
                                self.vents.stopScrolling();
                            }
                        } else if (e.type == 'release') {

                            e.gesture.stopPropagation();
                            self.vents.countPages();

                            console.log('release -- ' + wasScrolling);

                            if (wasScrolling) {
                                setTimeout(function () {
                                    self.vents.startScrolling();
                                }, 400);
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

                        } else if (e.type == 'dragend'){

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
            var retrieveJsonData = $.ajax({

                url: 'data/bookData.json',
                dataType: 'json',
                method: 'get',
                success: function (data) {
                    self.sys.updatedReaderData('components', data);
                    self.sys.updatedReaderData('currentPage', data[0].src);
                    self.sys.updatedReaderData('firstPage', data[0].src);
                    self.sys.updatedReaderData('lastPage', data[data.length - 1].src);
                },
                error: function (x, t, s) {
                    console.log(t + ': ' + s);
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
                        self.sys.updateLocalStorage('clientBook', 'currentPage', pageUrl);

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
                })
                .then(function () {

                    var pages = 0,
                        ct = 0,
                        pageCountTimeout,
                        intrvl;

                    (function () {
                        intrvl = setInterval(function () {
                            ct += 1;
                            if ($('#page').length) {
                                pages += 1;
                                pageCountTimeout = setTimeout(function () {
                                    if (pages == $('#page').find('p').length && ct < 1000 || pages != $('#page').find('p').length && ct >= 1000) {
                                        clearInterval(intrvl);
                                        clearTimeout(pageCountTimeout);
                                        self.vents.countPages();
                                        $('.controls, .runner-help, .runner-page-count, #page, .search-wrapper').animate({
                                            opacity:1
                                        }, 200);
                                        $('.spinner').fadeOut(200, function(){
                                            setTimeout(function(){
                                                // self.vents.startScrolling();
                                            }, 50);
                                        });
                                    } else if (pages != $('#page').find('p').length && ct < 1000) {
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
