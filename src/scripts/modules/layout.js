define(function(require) {

  var environment = require('modules/environment');
  var settings = require('modules/settings');

  return {

    targetContainerWidth: function() {
      var w = parseInt(settings.el.css('font-size'), 10) * 25,
        isMobile = environment.isMobile(),
        orientation = environment.orientation();

      if (isMobile && w > window.screen.width && window.screen.width <= 768 && orientation === 'portrait') {
        return window.screen.width;
      }
      if (isMobile && w > window.screen.width && window.screen.width < 768 && orientation === 'landscape') {
        return window.screen.height;
      }
      if (!isMobile && w > $(window).width()) {
        return $(window).width();
      }

      return w;
    },

    targetContainerHeight: function() {
      var orientation = environment.orientation();
      if (environment.isMobile() && $(window).width() <= 568 && orientation === 'landscape') {
        return 300;
      }
      if (environment.isMobile() && $(window).width() <= 568 && orientation === 'portrait') {
        return window.screen.height / 2.2;
      }
      var h = parseInt(settings.el.css('line-height'), 10) * 9;
      return h;
    },

    setFrameHeight: function() {

      var targetHeight = this.targetContainerHeight();

      settings.el.css({
        height: targetHeight,
        maxHeight: targetHeight
      });

    },

    setFrameWidth: function() {

      var targetWidth = this.targetContainerWidth();

      settings.el.css({
        width: targetWidth,
        maxWidth: targetWidth
      });

    },

    adjustFramePosition: function() {

      this.setFrameHeight();
      this.setFrameWidth();

      var frame = settings.el;

      if (environment.isMobile() && $(window).width() <= 568 && environment.orientation() === 'landscape') { // size for iPhone 5 and smaller
        frame.css({
          top: 10,
          left: 0
        });
      } else {
        var h = ($(window).width() <= 480) ? $(window).height() / 2 - 30 : $(window).height() / 2,
          w = $(window).width() / 2,
          frameMidH = frame.height() / 2,
          frameMidW = frame.width() / 2,
          targetLeft = $(window).width() <= 480 ? 0 : w - frameMidW,
          cssObj = {
            top: h - frameMidH,
            left: targetLeft
          };

        frame.css(cssObj);
      }

      this.adjustNavPosition();

      var distTop = parseInt(settings.el.css('top'), 10);
      var distBottom = parseInt(settings.el.offset().top + settings.el.height() - 49, 10);
      $('#shadow-top').css({
        top: distTop
      });
      $('#shadow-bottom').css({
        top: distBottom
      });

    },

    adjustNavPosition: function() {

      var frame = settings.el,
        nav = $('nav'),
        overlap = frame.position().left <= 115, // initial sidebar width + margin
        orientation = environment.orientation();

      if (overlap && $(window).width() > 480) {
        nav.addClass('mobile').css({
          top: 0,
          width: frame.width()
        });
      } else if (!overlap && $(window).width() > 480) {
        nav.removeClass('mobile').css({
          top: ($(window).height() / 2) - ($('.controls').height() / 2),
          width: 75
        });
      } else if (orientation === 'portrait' && $(window).width() <= 480) {
        nav.addClass('mobile').css({
          top: 0,
          width: 'auto'
        });
      } else if (orientation === 'landscape' && $(window).width() <= 480) {
        nav.removeClass('mobile');
      }

    },

    setStyles: function() {
      var mainCss = {
        fontSize: settings.fSize + '%',
        lineHeight: '1.3'
      };

      settings.el.css(mainCss);

    },

    renderShadows: function() {
      return {
        shadowTop: $('<div/>', {
          id: 'shadow-top',
        }),
        shadowBottom: $('<div/>', {
          id: 'shadow-bottom',
          css: {
            'top': parseInt(settings.el.offset().top + settings.el.height() - 49, 10)
          }
        })
      };
    }

  };

});
