define([
    'jquery',
    'env',
    'reader',
    'settings',
    'styles',
    'layout',
    'sys',
    'vents',
    'ajaxCall',
    'chapter',
    'ajaxBookData',
    'ajaxChapterLoad'
], function($, Env, Reader, Settings, Styles, Layout, Sys, Vents, AjaxCall, Chapter, AjaxBookData, AjaxChapterLoad) {
    'use strict';

    return function App() {

        var self = this;

        this.layout     = new Layout(),
        this.sys        = new Sys(),
        this.vents      = new Vents(),

        this.ajaxCall   = AjaxCall,
        this.reader     = Reader,
        this.settings   = Settings,
        this.env        = Env,
        this.styles     = Styles,

        this.init = function() {

            self.vents.bindEventHandlers();

            // get local storage or set it if it's null
            this.sys.getLocation();
            this.sys.getUserPreferences();

            // set/reset DOM
            this.layout.removeElementStyles();
            this.vents.contrastToggle(self.settings.contrast);
            this.layout.setStyles();

            window.addEventListener('orientationchange', self.vents.orientationHasChanged);

            window.onunload = window.onbeforeunload = (function() {

                var writeComplete = false;

                return function() {

                    if (writeComplete) return;

                    writeComplete = true;

                    self.sys.saveLocation();
                    self.sys.updateUserPreferences();

                }

            }());

            $(window).on('resize', function() {

                var intrvl;

                intrvl = setInterval(function() {
                    clearInterval(intrvl);
                    self.vents.resizeStopped();
                }, 50);

            });

            $(document).on('touchmove', function(e) {

                if (!$(e.target).parents().is(self.settings.el)) {

                    e.preventDefault();

                }

            });

        }

    };

});
