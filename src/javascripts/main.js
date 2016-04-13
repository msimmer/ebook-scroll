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
