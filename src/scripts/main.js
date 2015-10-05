require.config({
  baseUrl: './'
});

require(['modules/app'], function(App) {

  var options = {
    dev: false,
    jsonPath: window.location.href.match(/^http:\/\/local/) !== null ? 'http://localhost:8080/data/bookData.json' : '/wp-content/themes/Fiktion/data/bookData.json',
    debug: false,
    clearStorage: false,
    scrollSpeed: 10
  };
  var globalOptions = window.ebookAppData || {};
  var settings = $.extend({}, options, globalOptions)
  var app = new App(settings);

  $('html').removeClass('no-js').addClass('cursor js');

  app.init();

});
