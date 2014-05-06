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
    'plugins/hoverIntent'
], function ($, Env, Reader, Settings, Styles, Layout, Sys, Vents, Hammer) {
    'use strict';

    return function App(options) {

        var self = this;

        this.layout = new Layout(),
        this.sys = new Sys(),
        this.vents = new Vents(),

        this.reader = Reader,
        this.settings = Settings,
        this.env = Env,
        this.styles = Styles,

        this.init = function () {

            self.vents.bindEventHandlers();

            if (options) {
                $.extend(this.settings, options);
            }

            window.addEventListener('orientationchange', self.vents.orientationHasChanged);

            window.onunload = window.onbeforeunload = (function () {

                $('html, body').scrollTop(0, 0);

                var writeComplete = false;

                return function () {

                    if (writeComplete) {
                        return;
                    }

                    writeComplete = true;

                    if (!self.settings.debug) {
                        self.sys.saveLocation();
                        self.sys.updateUserPreferences();
                    } else if (self.settings.debug && self.settings.clearStorage) {
                        localStorage.clear();
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
                        isManuallyScrolling = clearInterval(isManuallyScrolling);
                        isManuallyScrolling = setInterval(function () {
                            self.vents.countPages();
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

                hammer.on('touch release pinchin pinchout', function (e) {

                    var target = $(e.target);

                    if (!target.parents().is(controls) && !target.is(frame) && !target.parents().is(frame)) {

                        console.log(target);

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
                        }

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
                    log(x + ' ' + t);
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
                    log('JSON data added to DOM');
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
                            log('Current page is ' + pageUrl);
                        }
                    });

            }

            $.when(retrieveJsonData)
                .then(function (data) {
                    self.sys.getLocation();
                    self.sys.getUserPreferences();
                    addJsonDataToDom(self.reader.components);
                })
                .then(function () {
                    loadChapter(self.reader.currentPage);
                })
                .done(function () {
                    self.sys.goToPreviousLocation();
                    self.vents.countPages();
                    self.layout.removeElementStyles();
                    self.vents.contrastToggle(self.settings.contrast);
                    self.layout.setStyles();
                    self.layout.adjustFramePosition();
                    self.vents.startScrolling();
                });

        };

    };

});
