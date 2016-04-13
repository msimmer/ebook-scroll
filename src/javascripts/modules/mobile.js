define(['require', 'jquery', 'hammer'], function (require, $, Hammer) {
  var environment = require('modules/environment');
  var reader = require('modules/reader');
  var settings = require('modules/settings');
  var events = require('modules/events');

  var Mobile = function () {

    settings.el.css('overflow-y', 'scroll');

    var el = document.getElementsByTagName('body')[0],
      frame = document.getElementById('main'),
      controls = document.getElementsByClassName('controls')[0],
      wasScrolling = reader.isScrolling,
      doubleTapped = false,
      wasHolding = false,
      touchTimer,
      options = {
        behavior: {
          doubleTapInterval: 200,
          contentZooming: 'none',
          touchAction: 'none',
          touchCallout: 'none',
          userDrag: 'none'
        },
        dragLockToAxis: true,
        dragBlockHorizontal: true
      },
      hammer = new Hammer(el, options);

    hammer.on('touch release pinchin pinchout dragend doubletap tap', function (e) {

      console.log(e);

      var target = $(e.target);

      doubleTapped = false;
      clearTimeout(touchTimer);

      if (!target.is('.control-btn') && !target.is('.chapter-nav') && !target.is(frame) && !target.parents().is(frame)) {

        e.preventDefault();
        e.stopPropagation();
        e.gesture.preventDefault();
        e.gesture.stopPropagation();
        e.gesture.stopDetect();

      } else if (target.is(frame) || target.parents().is(frame)) {

        if (e.type === 'doubletap') {

          doubleTapped = true;

          e.stopPropagation();
          e.gesture.stopPropagation();

          wasScrolling = reader.isScrolling;

          if (wasScrolling) {
            events.stopScrolling();
          } else {
            events.startScrolling();
          }

        } else if (e.type === 'touch' && e.gesture.touches.length < 2) {

          touchTimer = setTimeout(function () {
            e.stopPropagation();
            e.gesture.stopPropagation();

            wasScrolling = reader.isScrolling;
            wasHolding = true;

            if (wasScrolling && !doubleTapped) {
              events.stopScrolling();
            }
          }, 150);

        } else if (e.type === 'release') {

          if (wasHolding) {
            e.gesture.stopPropagation();
            events.countPages();

            if (wasScrolling && wasHolding) {
              setTimeout(function () {
                wasHolding = false;
                events.startScrolling();
              }, 200);

            }
          }

        } else if (e.type === 'pinchin') {

          console.log('pinchin');

          e.stopPropagation();
          e.gesture.stopPropagation();

          events.fontDecrement();
          if (wasScrolling) {
            events.startScrolling();
          }

          e.gesture.stopDetect();

        } else if (e.type === 'pinchout') {

          e.stopPropagation();
          e.gesture.stopPropagation();

          events.fontIncrement();
          if (wasScrolling) {
            events.startScrolling();
          }

          e.gesture.stopDetect();

        } else if (e.type === 'dragend' && e.gesture.touches.length < 2) {

          e.preventDefault();
          e.stopPropagation();
          e.gesture.preventDefault();
          e.gesture.stopPropagation();

          if (e.gesture.distance >= 70 && e.gesture.direction === 'right') {

            e.gesture.stopDetect();
            events.speedIncrement();

          } else if (e.gesture.distance >= 70 && e.gesture.direction === 'left') {

            e.gesture.stopDetect();
            events.speedDecrement();

          }

        }

      } else if (target.parents().is(controls)) {
        e.stopPropagation();
        e.gesture.stopPropagation();
      }

    });

  };

  if (environment.isMobile()) {
    return new Mobile();
  } else {
    return Mobile;
  }

});
