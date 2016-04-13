
require.config({
  baseUrl: 'javascripts',
  paths: {
    // All asset paths are set by Express in Gulpfile.js
    'jquery': '/assets/jquery/dist/jquery.min',
    'history': '/assets/history/scripts/compressed/history',
    'history-adaptor': '/assets/history/scripts/compressed/history.adaptor.jquery',
    'hammer': '/assets/hammerjs/hammer.min',
    'hover-intent': '/assets/hoverintent-jquery2/jquery.hoverintent',
    'modernizr': '/assets/modernizr/modernizr',
  },
  shim: {
    'jquery': {
      deps: [],
      exports: '$'
    },
    'history': {
      deps: ['jquery']
    },
    'history-adaptor': {
      deps: ['jquery', 'history']
    },
    'hover-intent': {
      deps: ['jquery']
    }
  }
});

define("config", function(){});

require(['config'], function () {
  require(['modules/app'], function (App) {
    var options = {
      dev: true,
      jsonPath: '/data/books.json',
      debug: true,
      clearStorage: false,
      scrollSpeed: 10
    };
    var globalOptions = window.ebookAppData || {};
    var settings = $.extend({}, options, globalOptions);
    var app = new App(settings);

    $('html').removeClass('no-js').addClass('cursor js');
    app = new App();
    app.init();

  });
});

define("main", function(){});
