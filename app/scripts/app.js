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
                        layout: 'adjustFramePosition',
                        chapterNav: 'bindChapters'
                    });
                }, 200);

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
                                // load new chapter fn
                                _this.sys.goToPreviousLocation();
                            }
                        })
                    }).appendTo(_this.settings.chapters);

                });

                if (_this.settings.debug) {
                    console.log('JSON data added to DOM');
                }

            }

            // Bootstrap
            var globalStore = {};
            var pathArray = window.location.href.split('/'),
                protocol = pathArray[0],
                host = pathArray[2],
                siteUrl = protocol + '//' + host,
                JSONUrl = _this.settings.jsonPath

            $.when( // get json data, update settings

                $.get(JSONUrl, function (data) {
                    $.each(data, function (i) {
                        if (this.uuid === window.ebookAppData.uuid) {
                            var components = this.components;
                            _this.settings.bookId = this.uuid;
                            _this.sys.updatedReaderData('components', components);
                            _this.sys.updatedReaderData('currentPage', components[0].src);
                            _this.sys.updatedReaderData('firstPage', components[0].src);
                            _this.sys.updatedReaderData('lastPage', components[components.length - 1].src);
                        }
                    });

                    if (_this.reader.currentPage === null) {
                        if (localStorage && !localStorage.refreshed) {
                            window.onunload = window.onbeforeunload = function () {
                                return;
                            };
                            localStorage.clear();
                            localStorage.setItem('refreshed', true);
                            window.location.href = window.location.href;
                        } else if (localStorage && localStorage.refreshed) {
                            localStorage.removeItem('refreshed');
                            window.location.href = '/404';
                            return false;
                        }
                    }

                    _this.sys.updateLocalStorage(_this.settings.bookId, 'currentPage', _this.reader.currentPage);

                })

            ).then(function () {

                $.when( // get pages from updated settings

                    $.get(_this.reader.currentPage, function (html) {
                        globalStore.html = html;
                    }),

                    $.get(window.ebookAppData.bookPath + '/Styles/online.css', function (css) {
                        globalStore.css = css;
                    })

                ).then(function () { // append html to page

                    addJsonDataToDom(_this.reader.components);

                    $('<style />').html(globalStore.css).appendTo('head');

                    _this.settings.el.html(
                        $('<section/>', {
                            id: 'page',
                            css: {
                                margin: 0,
                                padding: 0,
                                border: 0
                            },
                            html: globalStore.html
                        })
                    );

                    _this.sys.getLocation();
                    _this.sys.getUserPreferences();
                    _this.sys.goToPreviousLocation();
                    _this.layout.removeElementStyles();
                    _this.layout.setStyles();

                    // requires elements in DOM
                    _this.vents.countPages();
                    _this.vents.cursorListener();

                    $('.controls, .runner-help, .runner-page-count, #page, .search-wrapper').animate({
                        opacity: 1
                    }, 200);
                    $('.spinner').fadeOut(200, function () {
                        setTimeout(function () {
                            _this.vents.startScrolling();
                        }, 50);
                    });

                    if ($([]).pushStack($('h1,h2,h3,h4,h5,h6')).length > 0) {
                        _this.chapterNav.bindChapters();
                        _this.chapterNav.appendNav();

                        $('.chapter-nav').animate({
                            opacity: 1
                        }, 200);
                    }

                    _this.layout.adjustFramePosition();
                    _this.vents.contrastToggle(_this.settings.contrast);

                    var shadows = _this.layout.renderShadows(_this);

                    _this.settings.el.append(shadows.shadowTop);
                    _this.settings.el.append(shadows.shadowBottom);

                });

            });

        };

    };

    return App;

});
