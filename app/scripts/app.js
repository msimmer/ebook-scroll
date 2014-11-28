define([
    'jquery',
    'env',
    'reader',
    'settings',
    'styles',
    'layout',
    'sys',
    'vents',
    'mobile-evs',
    'chapter-nav',
    'plugins/searchField',
    'hover'
], function ($, Env, Reader, Settings, Styles, Layout, Sys, Vents, MobileEvs, ChapterNav, SearchField, Hover) {
    'use strict';

    var App = function (options) {

        var _this = this,
            opts = options;

        _this.layout = new Layout();
        _this.sys = new Sys();
        _this.vents = new Vents();
        _this.chapterNav = new ChapterNav();
        _this.mobileEvs = new MobileEvs();
        _this.hover = new Hover();
        _this.reader = Reader;
        _this.settings = Settings;
        _this.env = Env;
        _this.styles = Styles;

        this.init = function () {

            _this.vents.bindEventHandlers();

            if (opts) {
                $.extend(_this.settings, opts);
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
                    $(document).trigger('updateUI', {
                        vents: 'countPages',
                        layout: 'adjustFramePosition'
                    });
                }, 200);

            });

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

                                        var ids = $([]).pushStack($('h1,h2,h3,h4,h5,h6'));
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
