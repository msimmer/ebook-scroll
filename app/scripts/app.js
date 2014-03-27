define([
    'jquery',
    'env',
    'reader',
    'settings',
    'sys',
    'layout',
    'styles',
    'vents',
    'ajaxCall',
    'chapter',
    'ajaxBookData',     // no need to pass as var
    'ajaxChapterLoad'   // no need to pass as var
], function($, Env, Reader, Settings, Sys, Layout, Styles, Vents, AjaxCall, Chapter, AjaxBookData, AjaxChapterLoad) {
    'use strict';

    return function App() {

        var self = this; // keep logical scope

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

            // get local storage or set it if it's === null
            this.sys.getLocation();
            // this.sys.getUserPreferences();

            // build DOM
            this.layout.removeElementStyles(); // remove initial colors, background
            this.layout.setDomElements(); // add reader styles
            this.layout.setStyles(); // add fontsize, line-height

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
