define([
    'jquery',
    'env',
    'reader',
    'settings',
    'styles',
    'layout',
    'sys',
    'vents',
    'ajax/ajaxCall',
    'chapter',
    'ajax/ajaxBookData',
    'ajax/ajaxChapterLoad',
    'plugins/hoverIntent'
], function($, Env, Reader, Settings, Styles, Layout, Sys, Vents, AjaxCall) {
    'use strict';

    return function App(options) {

        var self = this;

        this.layout = new Layout(),
        this.sys = new Sys(),
        this.vents = new Vents(),

        this.ajaxCall = AjaxCall,
        this.reader = Reader,
        this.settings = Settings,
        this.env = Env,
        this.styles = Styles,

        this.init = function() {

            self.vents.bindEventHandlers();

            if (options) {
                $.extend(this.settings, options);
            }

            this.sys.getLocation();
            this.sys.getUserPreferences();

            this.layout.removeElementStyles();
            this.vents.contrastToggle(self.settings.contrast);
            this.layout.setStyles();

            this.vents.startScrolling();

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

        };

    };

});
