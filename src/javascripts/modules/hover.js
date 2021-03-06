define([
  'jquery',
  'hover-intent',
  'modules/environment',
  'modules/reader',
  'modules/events',
  'modules/settings',
], function (
  $,
  hoverIntent,
  environment,
  reader,
  events,
  settings
) {

  var Hover = function () {

    if (environment.isMobile()) {
      return;
    }

    var wasScrolling;
    var isManuallyScrolling;
    var scrollCheckInterval = 200;

    settings.el.hoverIntent({
      over: function () {
        wasScrolling = reader.isScrolling;
        if (!$('show-scroll-bar').length) {
          settings.el.addClass('show-scroll-bar');
        }
        if (wasScrolling) {
          events.stopScrolling();
        }
        window.clearInterval(isManuallyScrolling);
        isManuallyScrolling = setInterval(function () {
          $(document).trigger('updateNavIndicators');
        }, scrollCheckInterval);
      },
      out: function () {
        if ($('.show-scroll-bar').length && !$('#userInput').is(':focus')) {
          settings.el.removeClass('show-scroll-bar');
        }
        if (wasScrolling) {
          events.startScrolling();
        }
        window.clearInterval(isManuallyScrolling);
      },
      interval: 200,
      sensitivity: 1,
      timeout: 0
    });

  };

  return new Hover();

});
