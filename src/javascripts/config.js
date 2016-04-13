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
