require.config({
  baseUrl: './'
});

require(['modules/app'], function(App) {

  var app = new App({
    dev: false,
    jsonPath: window.location.href.match(/^http:\/\/local/) !== null ? 'http://localhost:8080/data/bookData.json' : '/wp-content/themes/Fiktion/data/bookData.json',
    debug: false,
    clearStorage: false,
    scrollSpeed: 10
  });

  $('html').removeClass('no-js').addClass('cursor js');

  app.init();

});
