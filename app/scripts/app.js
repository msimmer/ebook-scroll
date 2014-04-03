define([
    'jquery',
    'env',
    'reader',
    'settings',
    'styles',
    'layout',
    'sys',
    'vents',
    'plugins/hoverIntent'
], function($, Env, Reader, Settings, Styles, Layout, Sys, Vents) {
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

        this.init = function() {

            self.vents.bindEventHandlers();

            if (options) {
                $.extend(this.settings, options);
            }

            window.addEventListener('orientationchange', self.vents.orientationHasChanged);

            window.onunload = window.onbeforeunload = (function() {

                var writeComplete = false;

                return function() {

                    if (writeComplete) {
                        return;
                    }

                    writeComplete = true;

                    if (!self.settings.debug) {
                        self.sys.saveLocation();
                        self.sys.updateUserPreferences();
                    } else {
                        localStorage.clear();
                    }

                };

            }());

            $(window).on('resize', function() {

                var intrvl;

                intrvl = setInterval(function() {
                    clearInterval(intrvl);
                    self.vents.resizeStopped();
                }, 200);

            });

            $(document).on('touchmove', function(e) {

                if (!$(e.target).parents().is(self.settings.el)) {
                    e.preventDefault();
                }

            });

            var wasScrolling,
                isManuallyScrolling;

            self.settings.el.hoverIntent({
                over: function() {
                    wasScrolling = self.reader.isScrolling;
                    if (wasScrolling) {
                        self.vents.stopScrolling();
                    }
                    isManuallyScrolling = clearInterval(isManuallyScrolling);
                    isManuallyScrolling = setInterval(function() {
                        self.vents.countPages();
                    }, 80);
                },
                out: function() {
                    if (wasScrolling) {
                        self.vents.startScrolling();
                    }
                    isManuallyScrolling = clearInterval(isManuallyScrolling);
                },
                interval: 200,
                sensitivity: 1,
                timeout: 0
            });

            // bootstrap
            var retrieveJsonData = $.ajax({

                url: 'data/bookData.json',
                dataType: 'json',
                method: 'get',
                success: function(data) {
                    self.sys.updatedReaderData('components', data);
                    self.sys.updatedReaderData('currentPage', data[0].src);
                    self.sys.updatedReaderData('firstPage', data[0].src);
                    self.sys.updatedReaderData('lastPage', data[data.length - 1].src);
                },
                error: function(x, t, s) {
                    console.log(x + ' ' + t);
                }

            });

            function addJsonDataToDom(data) {

                $.each(data, function(i, o) {

                    $('<li/>', {
                        html: $('<a/>', {
                            text: o.title,
                            href: o.src,
                            click: function(e) {
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
                    .then(function(data) {
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
                .then(function(data) {
                    self.sys.getLocation();
                    self.sys.getUserPreferences();
                    addJsonDataToDom(self.reader.components);
                })
                .then(function() {
                    loadChapter(self.reader.currentPage);
                })
                .done(function() {
                    self.layout.adjustFramePosition();
                    self.sys.goToPreviousLocation();
                    self.vents.countPages();
                    self.layout.removeElementStyles();
                    self.vents.contrastToggle(self.settings.contrast);
                    self.layout.setStyles();
                    self.vents.startScrolling();
                });

        };

    };

});
