require.config({
  baseUrl: 'scripts',
  paths: {
    'jquery': '../../bower_components/jquery/dist/jquery.min',
    'history': '../../bower_components/history/scripts/compressed/history',
    'history-adaptor': '../../bower_components/history/scripts/compressed/history.adaptor.jquery',
    'hammer': '../../bower_components/hammerjs/hammer.min',
    'hover-intent': '../../bower_components/hoverintent-jquery2/jquery.hoverintent',
    'modernizr': '../../bower_components/modernizr/modernizr',
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
