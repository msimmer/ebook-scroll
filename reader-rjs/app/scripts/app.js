define([
    'settings',
    'reader',
    'vents',
    'env',
    'sys',
    'layout'
], function(Settings, Reader, Vents, Env, Sys, Layout) {
    'use strict';

    return function App() {

        this.settings = Settings,
        this.reader = Reader,
        this.vents = new Vents(),
        this.env = new Env(),
        this.sys = new Sys(),
        this.layout = new Layout()

    };

});
