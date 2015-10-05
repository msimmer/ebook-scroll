require.config({
  baseUrl: './'
});

require(['modules/app'], function(App) {

  var app = new App({
    dev: false,
    jsonPath: 'http://localhost:8080/data/bookData.json',
    // jsonPath: '/wp-content/themes/Fiktion/data/bookData.json',
    debug: true,
    clearStorage: false,
    scrollSpeed: 10,
    bookSlug: 'test-book'
  });

  $('html').removeClass('no-js').addClass('cursor js');

  app.init();

});
