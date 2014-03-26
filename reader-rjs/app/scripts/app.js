define([
    'jquery',
    'env',
    'reader',
    'settings',
    'sys',
    'layout',
    'styles',
    'vents'
], function($, Env, Reader, Settings, Sys, Layout, Styles, Vents) {
    'use strict';

    return function App() {

        var self = this; // keep logical scope

        this.reader = Reader,
        this.settings = Settings,
        this.sys = new Sys(),
        this.layout = new Layout(),
        this.env = Env,
        this.styles = Styles
        this.vents = new Vents(),

        this.init = function() {

            self.vents.bindEventHandlers();

            window.addEventListener('orientationchange', self.vents.orientationHasChanged);

            $(window).on('resize', function() {

                var intrvl;

                intrvl = setInterval(function() {
                    clearInterval(intrvl);
                    self.env.resizeStopped();
                }, 50);

            });

            window.onunload = window.onbeforeunload = (function() {

                var writeComplete = false;

                return function() {

                    if (writeComplete) return;

                    writeComplete = true;
                    // self.sys.saveLocation();
                    // self.sys.updateUserPreferences();

                }

            }());

            $(document).on('touchmove', function(e) {

                if (!$(e.target).parents().is(self.settings.el)) {

                    e.preventDefault();

                }

            });

        }

    };

});
