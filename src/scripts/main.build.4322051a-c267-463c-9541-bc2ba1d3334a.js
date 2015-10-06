
define('modules/environment',[],function() {

  return {

    tablet: [
      'ipad',
      'android',
      'android 3.0',
      'xoom',
      'sch-i800',
      'playbook',
      'tablet',
      'kindle',
    ],
    handheld: [
      'iphone',
      'ipod',
      'android',
      'blackberry',
      'opera',
      'mini',
      'windows\sce',
      'palm',
      'smartphone',
      'iemobile',
    ],
    epicMobile: [
      'android',
      'iphone',
      'ipod',
      'acs',
      'alav',
      'alca',
      'amoi',
      'audi',
      'aste',
      'avan',
      'benq',
      'bird',
      'blac',
      'blaz',
      'brew',
      'cell',
      'cldc',
      'cmd-',
      'dang',
      'doco',
      'eric',
      'hipt',
      'inno',
      'ipaq',
      'java',
      'jigs',
      'kddi',
      'keji',
      'leno',
      'lg-c',
      'lg-d',
      'lg-g',
      'lge-',
      'maui',
      'maxo',
      'midp',
      'mits',
      'mmef',
      'mobi',
      'mot-',
      'moto',
      'mwbp',
      'nec-',
      'newt',
      'noki',
      'opwv',
      'palm',
      'pana',
      'pant',
      'pdxg',
      'phil',
      'play',
      'pluc',
      'port',
      'prox',
      'qtek',
      'qwap',
      'sage',
      'sams',
      'sany',
      'sch-',
      'sec-',
      'send',
      'seri',
      'sgh-',
      'shar',
      'sie-',
      'siem',
      'smal',
      'smar',
      'sony',
      'sph-',
      'symb',
      't-mo',
      'teli',
      'tim-',
      'tosh',
      'tsm-',
      'upg1',
      'upsi',
      'vk-v',
      'voda',
      'w3cs',
      'wap-',
      'wapa',
      'wapi',
      'wapp',
      'wapr',
      'webc',
      'winw',
      'winw',
      'xda',
      'xda-',
      'up.browser',
      'up.link',
      'windowssce',
      'iemobile',
      'mini',
      'mmp',
      'symbian',
      'midp',
      'wap',
      'phone',
      'pocket',
      'mobile',
      'pda',
      'psp'
    ],
    isMobile: function() {
      var reasonableNumberofDevices = this.tablet.concat(this.handheld),
        deviceStr = reasonableNumberofDevices.join('|'),
        regex = new RegExp(deviceStr, 'i');
      return (regex.test(navigator.userAgent.toLowerCase()) && !(/macintosh/i.test(navigator.userAgent.toLowerCase())));
    },
    prefix: function() {
      var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
      };
    },
    orientation: function() {
      switch (window.orientation) {
        case 0:
        case 180:
          return 'portrait';
        case 90:
        case -90:
          return 'landscape';
        default:
          return null;
      }
    }
  };

});

define('modules/reader',[],function() {
  return {
    components: [], // (array) ordered list of ebook chapters pulled from <spine>
    currentPage: null, // (string) url
    firstPage: null, // (string) url
    lastPage: null, // (string) url
    scrollPosition: {}, // (obj) containing src: (str) url, pos: (int) main.scrollTop()
    endPosition: null, // (int) bottom of #reader scroll container
    isScrolling: false // (bool) true/false
  };

});

define('modules/settings',['require','modules/environment'],function(require) {

  var environment = require('modules/environment');
  return {
    dev: false,
    jsonPath: '/wp-content/themes/Fiktion/data/bookData.json',
    debug: false,
    version: 1.0,
    clearStorage: false,
    local: false,
    bookId: null,
    el: $('main'),
    container: $('#book-content'),
    chapters: $('.chapters'),
    defaultFontSize: 30,
    fSize: 100,
    fSizeIncrement: 5,
    maxFontSize: function() {
      return environment.isMobile() ? 130 : 150;
    },
    minFontSize: function() {
      return environment.isMobile() ? 50 : 70;
    },
    contrast: 'light',
    scrollSpeed: 10,
    currentChapterIndex: null,
    chapterSelector: '[data-chapter]',
    chapterData: [],
    documentTitle: 'Fiktion',
    bookSlug: ''
  };
});

define('modules/layout',['require','modules/environment','modules/settings'],function(require) {

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

define('modules/user-settings',['require','modules/reader','modules/settings'],function(require) {
  var reader = require('modules/reader');
  var settings = require('modules/settings');

  return {

    updatedReaderData: function() {
      reader[arguments[0]] = arguments[1];
    },

    updateUserData: function() {
      settings[arguments[0]] = arguments[1];
    },

    updateLocalStorage: function(obj, prop, attr, nestedAttr) {

      if (localStorage.getItem(obj) === null) { // localstorage was not added on page load or was removed
        return;
      }

      if (typeof prop === 'undefined' || typeof attr === 'undefined') {
        throw 'Error: sys.updateLocalStorage() undefined argument';
      }

      var parsedObj = JSON.parse(localStorage.getItem(obj));

      if (typeof nestedAttr !== 'undefined') {
        parsedObj[prop][attr] = nestedAttr;
      } else if (typeof nestedAttr === 'undefined') {
        parsedObj[prop] = attr;
      }

      localStorage.setItem(obj, JSON.stringify(parsedObj));

    },

    saveLocation: function() {

      if (settings.debug) {
        console.log('Saving current location');
      }

      this.updatedReaderData(
        settings.bookId,
        'scrollPosition',
        reader.currentPage,
        reader.scrollPosition[reader.currentPage]
      );

      reader.scrollPosition[reader.currentPage] = settings.el.scrollTop();

      this.updateLocalStorage(
        settings.bookId,
        'scrollPosition',
        reader.currentPage,
        reader.scrollPosition[reader.currentPage]
      );

    },

    getFromLocalStorage: function(obj, prop, attr) {

      var parsedObj = JSON.parse(localStorage.getItem(obj));

      if (typeof attr !== 'undefined') {
        return parsedObj[prop][attr];
      }

      return parsedObj[prop];

    },

    updateUserPreferences: function() {

      if (settings.debug) {
        console.log('Updating user preferences');
      }

      var userPreferences = {
        fSize: settings.fSize,
        contrast: settings.contrast,
        scrollSpeed: settings.scrollSpeed
      };

      localStorage.setItem('userPreferences', JSON.stringify(userPreferences));

    },

    getUserPreferences: function() {
      if (settings.debug) {
        console.log('Getting User Preferences');
      }
      if (localStorage.getItem('userPreferences') !== null) {
        var obj = JSON.parse(localStorage.getItem('userPreferences'));
        $.extend(settings, obj);
      } else {
        this.updateUserPreferences();
      }
    },

    getLocation: function() {

      var bookId = settings.bookId;

      if (localStorage.getItem(bookId) !== null) {

        var obj = JSON.parse(localStorage.getItem(bookId));

        reader.currentPage = obj.currentPage;

        $.extend(reader.scrollPosition, obj.scrollPosition);

      } else {

        var clientBook = {
          bookId: window.ebookAppData.uuid,
          currentPage: reader.firstPage,
          scrollPosition: {}
        };

        reader.currentPage = reader.firstPage;
        reader.scrollPosition[reader.firstPage] = 0;
        clientBook.scrollPosition[reader.firstPage] = 0;

        localStorage.setItem(window.ebookAppData.uuid, JSON.stringify(clientBook));

      }

    },

    goToPreviousLocation: function() {

      if (settings.debug) {
        console.log('Going to previous location');
      }

      var pos = this.getFromLocalStorage(settings.bookId, 'scrollPosition', reader.currentPage);
      setTimeout(function() {
        settings.el.scrollTop(pos);
      }, 50);
    },

    goToNextChapter: function() {
      return;
    }

  };
});

define('modules/events',['require','modules/settings','modules/reader','modules/user-settings','modules/layout'],function(require) {
  var settings = require('modules/settings');
  var reader = require('modules/reader');
  var userSettings = require('modules/user-settings');
  var layout = require('modules/layout');

  var Events = function() {

    var _this = this;

    this.eventHandlers = {

      '.play-btn, click': 'playPause',
      '.speed-inc, click': 'speedIncrement',
      '.speed-dec, click': 'speedDecrement',
      '.font-inc, click': 'fontIncrement',
      '.font-dec, click': 'fontDecrement',
      '.contrast-dark, click': 'contrastToggle',
      '.contrast-light, click': 'contrastToggle',
      '.full-screen, click': 'toggleFullScreen',
      'main a, click': 'embeddedLinkClick'

    };

    this.bindEventHandlers = function() {

      $.each(_this.eventHandlers, function(k, v) {

        var eArr = k.split(','),
          fArr = v.split(','),
          elem = $.trim(eArr[0]),
          trig = $.trim(eArr[1]),
          func = $.trim(fArr[0]),
          args = fArr.slice(1);

        $(elem).on(trig, function(e) {
          if (e && typeof e.originalEvent !== 'undefined') {
            args.push(e);
            e.preventDefault();
          }
          _this[func].apply(_this, args);
        });

      });

    };

    this.toggleFullScreen = function() {

      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }

    };

    this.listenForPageChangeInterval = null;

    this.listenForPageChange = function() {

      var intervalCallback = function() {
        $(document).trigger('updateNavIndicators');
      };

      if (_this.listenForPageChangeInterval === null) { // kick off by counting pages and setting chapter url
        intervalCallback();
      }

      var lineHeight = Math.floor(parseInt($(settings.el.first('p')).css('line-height'), 10)),
        containerH = Math.floor(settings.el.height()),
        intrvl = Math.floor((lineHeight * containerH) / settings.scrollSpeed + 1) * 100;

      window.clearInterval(_this.listenForPageChangeInterval);

      _this.listenForPageChangeInterval = setInterval(function() {
        intervalCallback();
      }, intrvl);

    };

    this.playPause = function() {

      var playBtn = $('.controls').find('.play-btn'),
        isScrolling = reader.isScrolling;

      if (isScrolling) {
        _this.stopScrolling();
      } else {
        _this.startScrolling();
      }
      playBtn.attr('data-state', isScrolling ? 'play' : 'pause');

    };

    this.requestAnim = null;

    this.ct = 0;

    this.skip = null;

    this.getSkipInterval = function() {
      var v = 100 - settings.scrollSpeed,
        n = v.toString().slice(-2),
        r = parseInt(n, 10),
        x = r * 6 / 30;

      _this.skip = x;

    };

    this.animateScroll = function(context, callback) {
      return setTimeout(function() {
        context[callback].apply(context);
      }, 0);
    };

    this.readScroll = function() {

      _this.ct++;
      if (_this.ct < _this.skip) { // skip the animation every `this.skip` frame
        _this.requestAnim = _this.animateScroll(_this, 'readScroll');
        return;
      }
      _this.ct = 0;
      settings.el.scrollTop(settings.el.scrollTop() + 1); // run the animation
      _this.requestAnim = _this.animateScroll(_this, 'readScroll');

    };

    this.cursorTimer = null;

    this.cursorListener = function() {
      var $this = $('html');
      var showCursor = function() {
        $this.removeClass('cursor-hidden');
      };
      var hideCursor = function() {
        $this.addClass('cursor-hidden');
      };
      var setTimer = function() {
        if (reader.isScrolling) {
          _this.cursorTimer = setTimeout(function() {
            hideCursor();
          }, 2000);
        }
      };
      $this.on({
        mousemove: function() {
          showCursor();
          window.clearTimeout(_this.cursorTimer);
          setTimer();
        }
      });
      $('a').on({
        mouseenter: function() {
          window.clearTimeout(_this.cursorTimer);
        },
        mouseleave: function() {
          setTimer();
        }
      });
      $this.addClass('cursor-hidden');
    };

    this.startScrolling = function() {

      // console.log('start');

      if (!reader.isScrolling) {
        $('.controls').find('.play-btn').attr('data-state', 'pause');

        if (_this.skip === null) {
          _this.getSkipInterval();
        }

        _this.readScroll();
        _this.listenForPageChange();

        reader.isScrolling = true;
      }

    };

    this.stopScrolling = function() {
      // console.log('stop');
      if (reader.isScrolling) {
        $('.controls').find('.play-btn').attr('data-state', 'play');
        if (settings.debug) {
          console.log('Stopped');
        }
        window.clearTimeout(_this.requestAnim);
        window.clearInterval(_this.listenForPageChangeInterval);
        reader.isScrolling = false;
      }

    };

    this.speedIncrement = function() {

      _this.stopScrolling();

      if (settings.scrollSpeed < 100) {
        settings.scrollSpeed += 10;

        if (settings.debug) {
          console.log('Reading speed incremented to ' + settings.scrollSpeed);
        }

        userSettings.updateUserPreferences();
      }

      _this.getSkipInterval();
      _this.startScrolling();

    };

    this.speedDecrement = function() {

      _this.stopScrolling();

      if (settings.scrollSpeed > 10) {
        settings.scrollSpeed -= 10;

        if (settings.debug) {
          console.log('Reading speed decremented to ' + settings.scrollSpeed);
        }

        userSettings.updateUserPreferences();
      }

      _this.getSkipInterval();
      _this.startScrolling();

    };

    this.isChapterEnd = function() {

      _this.stopScrolling();

      if (settings.debug) {
        console.log('Chapter end');
      }

    };

    this.hasEnded = false;

    this.isBookEnd = function() {

      // _this.stopScrolling();
      // _this.hasEnded = true;

      // if (settings.debug) {
      //     console.log('Book end');
      // }

    };

    this.fontIncrement = function() {

      if (settings.fSize === settings.maxFontSize()) {
        return;
      }
      var size = settings.fSize < settings.maxFontSize() ? settings.fSize + settings.fSizeIncrement : settings.fSize;

      settings.el.css('font-size', size + '%');
      userSettings.updateUserData('fSize', size);

      $(document).trigger('updateUi');

    };

    this.fontDecrement = function() {

      if (settings.fSize === settings.minFontSize()) {
        return;
      }

      var size = settings.fSize > settings.minFontSize() ? settings.fSize - settings.fSizeIncrement : settings.fSize;

      settings.el.css('font-size', size + '%');
      userSettings.updateUserData('fSize', size);

      $(document).trigger('updateUi');

    };

    this.contrastToggle = function(e) {

      var contrast = e && e.currentTarget ? $(e.currentTarget).attr('data-contrast') : e,
        html = $('html');

      if (contrast === 'dark') {
        html.addClass('darkCss');
        html.removeClass('lightCss');
      } else if (contrast === 'light') {
        html.addClass('lightCss');
        html.removeClass('darkCss');
      }

      userSettings.updateUserData('contrast', contrast);
      userSettings.updateUserPreferences();

    };

    this.embeddedLinkClick = function(e) {

      var target = $(e.currentTarget),
        href = target.attr('href'),
        external = function(href) {
          return href.match('^http') !== null;
        };

      if (external(href)) {
        e.stopPropagation();
        _this.stopScrolling();
        target.attr('target', '_blank');
      } else {
        userSettings.loadChapter(href);
        userSettings.saveLocation();
      }

    };

    this.orientationHasChanged = function() {

      if (settings.debug) {
        switch (window.orientation) {
          case -90:
          case 90:
            console.log('Orientation has changed to landscape');
            break;
          default:
            console.log('Orientation has changed to portrait');
            break;
        }
      }

      setTimeout(function() {
        layout.adjustFramePosition();
        if (window.pageYOffset) {
          window.scrollTo(0, 0, 1);
        }
      }, 1);

      if (reader.isScrolling) {
        _this.stopScrolling();
        setTimeout(function() {
          _this.startScrolling();
        }, 500);
      }

    };

    this.countPages = function() {

      var main = settings.el,
        frameH = main.height(),
        page = main.find('#page'),
        pageH = page.height(),
        totalPageIndicator = $('.total-page-count'),
        currentPageIndicator = $('.current-page-count');

      function getCurrentPage() {
        return Math.round((-(page.offset().top - main.offset().top) / frameH) + 1);
      }

      totalPageIndicator.html(Math.round(pageH / frameH));
      currentPageIndicator.html(getCurrentPage());

      if (getCurrentPage() >= Math.round(pageH / frameH)) {
        if (reader.currentPage === reader.lastPage) {
          _this.isBookEnd();
        } else if (reader.currentPage !== reader.lastPage) {
          _this.isChapterEnd();
        }
      } else {
        _this.hasEnded = false;
      }

      // if (settings.debug) {
      //     // var intrvl,
      //     //     ct;
      //     // intrvl = setInterval(function () {
      //     //     ct++;
      //     //     if (page.length) {
      //     //         clearInterval(intrvl);
      //     //         console.log('Reading location is -- ' + getCurrentPage());
      //     //     }
      //     //     if (ct >= 1000) {
      //     //         clearInterval(intrvl);
      //     //         console.log('Reading location timed out.');
      //     //     }
      //     // }, 10);
      // }

    };

  };

  return new Events();
});

define('modules/chapters',['require','modules/settings','modules/reader','modules/events'],function(require) {
  var settings = require('modules/settings');
  var reader = require('modules/reader');
  var events = require('modules/events');

  return new function Chapters() {

    this.wasScrolling;
    this.panels = settings.chapterSelector;
    this.currentPos = false;
    this.articles = [];

    this.updateState = function() {
      var _this = this;
      var currentChapter = _this.getCurrentChapter();
      if (currentChapter && currentChapter.slug) {
        var hashUrl = '#/' + settings.bookSlug + '/' + currentChapter.slug
        window.history.replaceState(null, 'Fiktion', hashUrl);
      };
    };

    this.bindChapters = function() {

      this.wasScrolling = reader.isScrolling;
      if (this.wasScrolling) {
        events.stopScrolling();
      }

      var dfr = $.Deferred();
      var _this = this;
      var ids = $([]).pushStack($('h1,h2,h3,h4,h5,h6'));
      var scrollTop = $(window).scrollTop();
      var timer;
      _this.currentPos = false;
      _this.articles = [];
      $.map(ids, function(obj, i) {
        var $obj = $(obj);
        var articleData = {
          chapter: i,
          index: i,
          name: $obj.text(),
          slug: $obj.text()
            .replace(/\s+/g, '-')
            .replace(/[.,\/!@#$%^&*()+=?<>~`]/g, '_').toLowerCase(),
          posTop: ids[i].offsetTop,
          firstEl: i === 0 ? true : false,
          lastEl: i === ids.length - 1 ? true : false,
          prevEl: i - 1 > -1 ? ids[i - 1] : ids[0],
          nextEl: i + 1 <= ids.length - 1 ? ids[i + 1] : ids[ids.length - 1],
          prevPos: i - 1 > -1 ? ids[i - 1].offsetTop : 0,
          nextPos: i + 1 <= ids.length - 1 ? ids[i + 1].offsetTop : ids[i].offsetTop,
          currentEl: false
        };
        $obj.data(articleData);
        _this.articles.push(articleData);

        if ($obj.context.offsetTop >= scrollTop && _this.currentPos === false) {
          $obj.data().currentEl = true;
          _this.currentPos = $obj.context.offsetTop;
        }

        for (var p in $obj.data()) {
          if (typeof $obj.data()[p] !== 'object') {
            $obj.attr('data-' + p, $obj.data()[p]);
          }
        }
        if (i === ids.length - 1) {
          clearTimeout(timer);
          timer = setTimeout(function() {
            dfr.resolve();
          }, 0);
        }
      });

      return dfr.promise();

    };

    this.getCurrentChapter = function() {

      var scrollTop = settings.el.scrollTop();
      var buffer = 200;
      var currentChapterData;

      var $chs = $(settings.chapterSelector);
      $chs.each(function() {
        var $this = $(this);
        var data = $this.data();
        var newData = {
          posTop: data.posTop,
          nextPos: data.nextPos,
          index: data.index,
          name: data.name,
          slug: data.slug
        };
        settings.chapterData.push(newData);
      });

      for (var a = settings.chapterData.length - 1; a >= 0; a--) {
        var ch = settings.chapterData[a];
        if (scrollTop >= ch.posTop - buffer && scrollTop < ch.nextPos) { // found current el
          return ch;
        }
      }

    };

    this.getChapterBySlug = function(slug) {
      var _this = this;
      for (var i = 0; i < _this.articles.length; i++) {
        if (_this.articles[i].slug === slug) {
          return _this.articles[i];
        };
      }
      return false;
    };

    this.jumpToChapter = function(slug, callback) {
      var _this = this;
      $.when(_this.bindChapters()).done(function() {
        var chapter = _this.getChapterBySlug(slug.toString());
        var jumpTimer;
        if (chapter) {
          settings.el.scrollTop($('[data-slug="' + slug + '"]').attr('data-postop'));
          if (_this.wasScrolling && !reader.isScrolling) {
            events.startScrolling();
          }
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
      });
    };

    this.scrollToChapter = function(dir, callback) {

      var _this = this;
      $.when(_this.bindChapters()).done(function() {
        var currentPos = false,
          scrollTop = settings.el.scrollTop(),
          firstArticle = false,
          lastArticle = false,
          hasScrolled,
          state;

        var getPromise = function() {

          var dfr = $.Deferred();
          var len = $(_this.panels).length - 1;
          $(_this.panels).each(function(i) { // set current el
            var $this = $(this);
            var buffer = 200;
            var thisTop = $this.data().posTop;
            var chapEnd = $this.data().nextPos;

            $this.attr('data-currentel', false).data({
              currentEl: false
            });

            if (scrollTop >= thisTop - buffer && scrollTop < chapEnd && currentPos === false) { // found current el
              $this.attr('data-currentel', true).data({
                currentEl: true
              });
              currentPos = thisTop;
            }

            if (i === len) {
              if (currentPos === false) {
                if (scrollTop <= thisTop) {
                  $('[data-firstel="true"]').attr('data-currentel', true).data({
                    currentEl: true
                  });
                  firstArticle = true;
                } else {
                  $this.attr('data-currentel', true).data({
                    currentEl: true
                  });
                  lastArticle = true;
                }
              }
              dfr.resolve();
            }
          });
          return dfr.promise();
        };

        $.when(getPromise()).done(function() {
          hasScrolled = false;
          var scrollAnim = function(pos) {
            settings.el.animate({
              scrollTop: pos
            }, {
              complete: function() {
                if (!hasScrolled) {
                  hasScrolled = true;
                  if (_this.wasScrolling && !reader.isScrolling) {
                    events.startScrolling();
                  }
                  if (typeof callback === 'function') {
                    callback();
                  }
                  return;
                }
              }
            });
          };

          if (firstArticle === true && dir === 'prev') {
            scrollAnim(0);
          } else if (firstArticle === true && dir === 'next') {
            scrollAnim($('[data-firstel="true"]').data().posTop);
          } else if (firstArticle !== true && !dir) {
            scrollAnim($('[data-currentel="true"]').data().posTop);
          } else if (firstArticle !== true) {
            scrollAnim($('[data-currentel="true"]').data()[dir + 'Pos']);
          }

        });
      });

    };

    this.appendNav = function() {

      var _this = this;

      var $prev = $('<a/>', {
        id: 'chapter-prev',
        'class': 'chapter-nav',
        'data-dir': 'prev'
      }).on({
        click: function(e) {
          e.preventDefault();
          _this.scrollToChapter($(this).data().dir, function() {
            $(document).trigger('updateNavIndicators');
          });
        }
      }).appendTo('body');
      var $next = $('<a/>', {
        id: 'chapter-next',
        'class': 'chapter-nav',
        'data-dir': 'next'
      }).on({
        click: function(e) {
          e.preventDefault();
          _this.scrollToChapter($(this).data().dir, function() {
            $(document).trigger('updateNavIndicators');
          });
        }
      });

      $('body').append($prev);
      $('body').append($next);

    };

  };
});

/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2013 Brian Cherne
 */

/* hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 */

// var $ = require('../vendor/jquery');

$.fn.hoverIntent = function(handlerIn, handlerOut, selector) {

    // default configuration values
    var cfg = {
        interval: 100,
        sensitivity: 7,
        timeout: 0
    };

    if (typeof handlerIn === "object") {
        cfg = $.extend(cfg, handlerIn);
    } else if ($.isFunction(handlerOut)) {
        cfg = $.extend(cfg, {
            over: handlerIn,
            out: handlerOut,
            selector: selector
        });
    } else {
        cfg = $.extend(cfg, {
            over: handlerIn,
            out: handlerIn,
            selector: handlerOut
        });
    }

    // instantiate variables
    // cX, cY = current X and Y position of mouse, updated by mousemove event
    // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
    var cX, cY, pX, pY;

    // A private function for getting mouse position
    var track = function(ev) {
        cX = ev.pageX;
        cY = ev.pageY;
    };

    // A private function for comparing current and previous mouse position
    var compare = function(ev, ob) {
        ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
        // compare mouse positions to see if they've crossed the threshold
        if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) {
            $(ob).off("mousemove.hoverIntent", track);
            // set hoverIntent state to true (so mouseOut can be called)
            ob.hoverIntent_s = 1;
            return cfg.over.apply(ob, [ev]);
        } else {
            // set previous coordinates for next time
            pX = cX;
            pY = cY;
            // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
            ob.hoverIntent_t = setTimeout(function() {
                compare(ev, ob);
            }, cfg.interval);
        }
    };

    // A private function for delaying the mouseOut function
    var delay = function(ev, ob) {
        ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
        ob.hoverIntent_s = 0;
        return cfg.out.apply(ob, [ev]);
    };

    // A private function for handling mouse 'hovering'
    var handleHover = function(e) {
        // copy objects to be passed into t (required for event object to be passed in IE)
        var ev = jQuery.extend({}, e);
        var ob = this;

        // cancel hoverIntent timer if it exists
        if (ob.hoverIntent_t) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
        }

        // if e.type == "mouseenter"
        if (e.type == "mouseenter") {
            // set "previous" X and Y position based on initial entry point
            pX = ev.pageX;
            pY = ev.pageY;
            // update "current" X and Y position based on mousemove
            $(ob).on("mousemove.hoverIntent", track);
            // start polling interval (self-calling timeout) to compare mouse coordinates over time
            if (ob.hoverIntent_s != 1) {
                ob.hoverIntent_t = setTimeout(function() {
                    compare(ev, ob);
                }, cfg.interval);
            }

            // else e.type == "mouseleave"
        } else {
            // unbind expensive mousemove event
            $(ob).off("mousemove.hoverIntent", track);
            // if hoverIntent state is true, then call the mouseOut function after the specified delay
            if (ob.hoverIntent_s == 1) {
                ob.hoverIntent_t = setTimeout(function() {
                    delay(ev, ob);
                }, cfg.timeout);
            }
        }
    };

    // listen for mouseenter and mouseleave
    return this.on({
        'mouseenter.hoverIntent': handleHover,
        'mouseleave.hoverIntent': handleHover
    }, cfg.selector);
};

define("modules/../../vendor/hover-intent", function(){});

define('modules/hover',['require','modules/environment','modules/reader','modules/events','modules/settings','../../vendor/hover-intent'],function(require) {
  var environment = require('modules/environment');
  var reader = require('modules/reader');
  var events = require('modules/events');
  var settings = require('modules/settings');
  var hoverIntent = require('../../vendor/hover-intent');

  var Hover = function() {

    if (environment.isMobile()) {
      return;
    }

    var wasScrolling;
    var isManuallyScrolling;
    var scrollCheckInterval = 200;

    settings.el.hoverIntent({
      over: function() {
        wasScrolling = reader.isScrolling;
        if (!$('show-scroll-bar').length) {
          settings.el.addClass('show-scroll-bar');
        }
        if (wasScrolling) {
          events.stopScrolling();
        }
        window.clearInterval(isManuallyScrolling);
        isManuallyScrolling = setInterval(function() {
          $(document).trigger('updateNavIndicators');
        }, scrollCheckInterval);
      },
      out: function() {
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

define('modules/search',['require','modules/environment','modules/settings'],function(require) {

  var environment = require('modules/environment');
  var settings = require('modules/settings');

  return (function Search() {
    var $searchWrapper = $('.search-wrapper'),
      $input = $('#userInput'),
      $searchBtn = $('#search'),
      $closeBtn = $('#search-close');

    function addRemoveSearchBar() {
      if (environment.isMobile() || $('.mobile').length) {
        $searchWrapper.hide();
      } else {
        $searchWrapper.show();
      }
    }

    function doSearch(text) {
      var sel;
      if (window.find && window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount > 0) {
          sel.collapseToEnd();
        }
        window.find(text, 0, 0, 1);
      } else if (document.selection && document.body.createTextRange) {
        sel = document.selection;
        var textRange;
        if (sel.type === 'Text') {
          textRange = sel.createRange();
          textRange.collapse(false);
        } else {
          textRange = document.body.createTextRange();
          textRange.collapse(true);
        }
        if (textRange.findText(text)) {
          textRange.select();
        }
      }
      if (!$(sel.anchorNode.parentElement).is($input)) {
        settings.el.scrollTop(sel.anchorNode.parentElement.offsetTop);
      }
    }

    $input.on({
      mouseenter: function() {
        $input
          .focus()
          .css({
            opacity: 1
          });
        $closeBtn.css({
          opacity: 1
        });
      },
      focus: function() {
        if (!$('.show-scroll-bar').length) {
          settings.el.addClass('show-scroll-bar');
        }
      },
      blur: function() {
        if ($input.text() === '') {
          setTimeout(function() {
            $input.css({
              opacity: 0
            });
            $closeBtn.css({
              opacity: 0
            });
            if ($('.show-scroll-bar').length) {
              settings.el.removeClass('show-scroll-bar');
            }
          }, 1000);
        }
      }
    });

    $searchBtn.on({
      mouseenter: function() {
        $input
          .focus()
          .css({
            opacity: 1
          });
        $closeBtn.css({
          opacity: 1
        });
      },
      click: function(e) {
        e.preventDefault();
        var term = $input.text();
        doSearch(term);
      }
    });

    $closeBtn.on('click', function(e) {
      e.preventDefault();
      $input
        .blur()
        .css({
          opacity: 0
        });
      $closeBtn.css({
        opacity: 0
      });
      $input.text('');
    });

    $(window).resize(function() {
      addRemoveSearchBar();
    });

    $(document).on('keydown', function(e) {
      if (e.which === 13) {
        e.preventDefault();
        $searchBtn.triggerHandler('click');
      } else if (e.which === 27) {
        e.preventDefault();
        $closeBtn.triggerHandler('click');
      }
    });
    addRemoveSearchBar();

  })();
});

/*! Hammer.JS - v1.1.0dev - 2014-04-14
 * http://eightmedia.github.io/hammer.js
 *
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(window, undefined) {
  

/**
 * @main
 * @module hammer
 *
 * @class Hammer
 * @static
 */

/**
 * Hammer, use this to create instances
 * ````
 * var hammertime = new Hammer(myElement);
 * ````
 *
 * @method Hammer
 * @param {HTMLElement} element
 * @param {Object} [options={}]
 * @return {Hammer.Instance}
 */
var Hammer = function Hammer(element, options) {
  return new Hammer.Instance(element, options || {});
};


/**
 * version, as defined in package.json
 * the value will be set at each build
 * @property VERSION
 * @final
 * @type {String}
 */
Hammer.VERSION = '1.1.0dev';


/**
 * default settings.
 * more settings are defined per gesture at `/gestures`. Each gesture can be disabled/enabled
 * by setting it's name (like `swipe`) to false.
 * You can set the defaults for all instances by changing this object before creating an instance.
 * @example
 * ````
 *  Hammer.defaults.drag = false;
 *  Hammer.defaults.behavior.touchAction = 'pan-y';
 *  delete Hammer.defaults.behavior.userSelect;
 * ````
 * @property defaults
 * @type {Object}
 */
Hammer.defaults = {
  /**
   * this setting object adds styles and attributes to the element to prevent the browser from doing
   * its native behavior. The css properties are auto prefixed for the browsers when needed.
   * @property defaults.behavior
   * @type {Object}
   */
  behavior: {
    /**
     * Disables text selection to improve the dragging gesture. When the value is `none` it also sets
     * `onselectstart=false` for IE on the element. Mainly for desktop browsers.
     * @property defaults.behavior.userSelect
     * @type {String}
     * @default 'none'
     */
    userSelect: 'none',

    /**
     * Specifies whether and how a given region can be manipulated by the user (for instance, by panning or zooming).
     * Used by IE10>. By default this makes the element blocking any touch event.
     * @property defaults.behavior.touchAction
     * @type {String}
     * @default: 'none'
     */
    touchAction: 'none',

    /**
     * Disables the default callout shown when you touch and hold a touch target.
     * On iOS, when you touch and hold a touch target such as a link, Safari displays
     * a callout containing information about the link. This property allows you to disable that callout.
     * @property defaults.behavior.touchCallout
     * @type {String}
     * @default 'none'
     */
    touchCallout: 'none',

    /**
     * Specifies whether zooming is enabled. Used by IE10>
     * @property defaults.behavior.contentZooming
     * @type {String}
     * @default 'none'
     */
    contentZooming: 'none',

    /**
     * Specifies that an entire element should be draggable instead of its contents.
     * Mainly for desktop browsers.
     * @property defaults.behavior.userDrag
     * @type {String}
     * @default 'none'
     */
    userDrag: 'none',

    /**
     * Overrides the highlight color shown when the user taps a link or a JavaScript
     * clickable element in Safari on iPhone. This property obeys the alpha value, if specified.
     *
     * If you don't specify an alpha value, Safari on iPhone applies a default alpha value
     * to the color. To disable tap highlighting, set the alpha value to 0 (invisible).
     * If you set the alpha value to 1.0 (opaque), the element is not visible when tapped.
     * @property defaults.behavior.tapHighlightColor
     * @type {String}
     * @default 'rgba(0,0,0,0)'
     */
    tapHighlightColor: 'rgba(0,0,0,0)'
  }
};


/**
 * hammer document where the base events are added at
 * @property DOCUMENT
 * @type {HTMLElement}
 * @default window.document
 */
Hammer.DOCUMENT = window.document;


/**
 * detect support for pointer events
 * @property HAS_POINTEREVENTS
 * @type {Boolean}
 */
Hammer.HAS_POINTEREVENTS = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;


/**
 * detect support for touch events
 * @property HAS_TOUCHEVENTS
 * @type {Boolean}
 */
Hammer.HAS_TOUCHEVENTS = ('ontouchstart' in window);


/**
 * interval in which Hammer recalculates current velocity/direction/angle in ms
 * @property CALCULATE_INTERVAL
 * @type {Number}
 * @default 50
 */
Hammer.CALCULATE_INTERVAL = 50;


/**
 * eventtypes per touchevent (start, move, end) are filled by `Event.determineEventTypes` on `setup`
 * the object contains the DOM event names per type (`EVENT_START`, `EVENT_MOVE`, `EVENT_END`)
 * @property EVENT_TYPES
 * @private
 * @writeOnce
 * @type {Object}
 */
var EVENT_TYPES = {};


/**
 * direction strings, for safe comparisons
 * @property DIRECTION_DOWN|LEFT|UP|RIGHT
 * @final
 * @type {String}
 * @default 'down' 'left' 'up' 'right'
 */
var DIRECTION_DOWN = Hammer.DIRECTION_DOWN = 'down';
var DIRECTION_LEFT = Hammer.DIRECTION_LEFT = 'left';
var DIRECTION_UP = Hammer.DIRECTION_UP = 'up';
var DIRECTION_RIGHT = Hammer.DIRECTION_RIGHT = 'right';


/**
 * pointertype strings, for safe comparisons
 * @property POINTER_MOUSE|TOUCH|PEN
 * @final
 * @type {String}
 * @default 'mouse' 'touch' 'pen'
 */
var POINTER_MOUSE = Hammer.POINTER_MOUSE = 'mouse';
var POINTER_TOUCH = Hammer.POINTER_TOUCH = 'touch';
var POINTER_PEN = Hammer.POINTER_PEN = 'pen';


/**
 * eventtypes
 * @property EVENT_START|MOVE|END|RELEASE|TOUCH
 * @final
 * @type {String}
 * @default 'start' 'change' 'move' 'end' 'release' 'touch'
 */
var EVENT_START = Hammer.EVENT_START = 'start';
var EVENT_MOVE = Hammer.EVENT_MOVE = 'move';
var EVENT_END = Hammer.EVENT_END = 'end';
var EVENT_RELEASE = Hammer.EVENT_RELEASE = 'release';
var EVENT_TOUCH = Hammer.EVENT_TOUCH = 'touch';


/**
 * if the window events are set...
 * @property READY
 * @writeOnce
 * @type {Boolean}
 * @default false
 */
Hammer.READY = false;


/**
 * plugins namespace
 * @property plugins
 * @type {Object}
 */
Hammer.plugins = Hammer.plugins || {};


/**
 * gestures namespace
 * see `/gestures` for the definitions
 * @property gestures
 * @type {Object}
 */
Hammer.gestures = Hammer.gestures || {};


/**
 * setup events to detect gestures on the document
 * this function is called when creating an new instance
 * @private
 */
function setup() {
  if(Hammer.READY) {
    return;
  }

  // find what eventtypes we add listeners to
  Event.determineEventTypes();

  // Register all gestures inside Hammer.gestures
  Utils.each(Hammer.gestures, function(gesture){
    Detection.register(gesture);
  });

  // Add touch events on the document
  Event.onTouch(Hammer.DOCUMENT, EVENT_MOVE, Detection.detect);
  Event.onTouch(Hammer.DOCUMENT, EVENT_END, Detection.detect);

  // Hammer is ready...!
  Hammer.READY = true;
}

/**
 * @module hammer
 *
 * @class Utils
 * @static
 */
var Utils = Hammer.utils = {
  /**
   * extend method, could also be used for cloning when `dest` is an empty object.
   * changes the dest object
   * @method extend
   * @param {Object} dest
   * @param {Object} src
   * @param {Boolean} [merge=false]  do a merge
   * @return {Object} dest
   */
  extend: function extend(dest, src, merge) {
    for(var key in src) {
      if(dest[key] !== undefined && merge || key == 'returnValue') {
        continue;
      }
      dest[key] = src[key];
    }
    return dest;
  },


  /**
   * simple addEventListener wrapper
   * @method on
   * @param {HTMLElement} element
   * @param {String} type
   * @param {Function} handler
   */
  on: function on(element, type, handler) {
    element.addEventListener(type, handler, false);
  },


  /**
   * simple removeEventListener wrapper
   * @method off
   * @param {HTMLElement} element
   * @param {String} type
   * @param {Function} handler
   */
  off: function off(element, type, handler) {
    element.removeEventListener(type, handler, false);
  },


  /**
   * forEach over arrays and objects
   * @method each
   * @param {Object|Array} obj
   * @param {Function} iterator
   * @param {any} iterator.item
   * @param {Number} iterator.index
   * @param {Object|Array} iterator.obj the source object
   * @param {Object} context value to use as `this` in the iterator
   */
  each: function each(obj, iterator, context) {
    var i, len;
    // native forEach on arrays
    if ('forEach' in obj) {
      obj.forEach(iterator, context);
    }
    // arrays
    else if(obj.length !== undefined) {
      for(i=0,len=obj.length; i<len; i++) {
        if (iterator.call(context, obj[i], i, obj) === false) {
          return;
        }
      }
    }
    // objects
    else {
      for(i in obj) {
        if(obj.hasOwnProperty(i) &&
            iterator.call(context, obj[i], i, obj) === false) {
          return;
        }
      }
    }
  },


  /**
   * find if a string contains the string using indexOf
   * @method inStr
   * @param {String} src
   * @param {String} find
   * @return {Boolean} found
   */
  inStr: function inStr(src, find) {
    return src.indexOf(find) > -1;
  },


  /**
   * find if a array contains the object using indexOf or a simple polyfill
   * @method inArray
   * @param {String} src
   * @param {String} find
   * @return {Boolean|Number} false when not found, or the index
   */
  inArray: function inArray(src, find) {
    if(src.indexOf) {
      var index = src.indexOf(find);
      return (index === -1) ? false : index;
    }
    else {
      for(var i= 0,len=src.length;i<len; i++) {
        if(src[i] === find) {
          return i;
        }
      }
      return false;
    }
  },


  /**
   * convert an array-like object (`arguments`, `touchlist`) to an array
   * @method toArray
   * @param {Object} obj
   * @return {Array}
   */
  toArray: function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
  },


  /**
   * find if a node is in the given parent
   * @method hasParent
   * @param {HTMLElement} node
   * @param {HTMLElement} parent
   * @return {Boolean} found
   */
  hasParent: function hasParent(node, parent) {
    while(node) {
      if(node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  },


  /**
   * get the center of all the touches
   * @method getCenter
   * @param {Array} touches
   * @return {Object} center contains `pageX`, `pageY`, `clientX` and `clientY` properties
   */
  getCenter: function getCenter(touches) {
    var pageX = []
      , pageY = []
      , clientX = []
      , clientY = []
      , min = Math.min
      , max = Math.max;

    // no need to loop when only one touch
    if(touches.length === 1) {
      return {
        pageX: touches[0].pageX,
        pageY: touches[0].pageY,
        clientX: touches[0].clientX,
        clientY: touches[0].clientY
      };
    }

    Utils.each(touches, function(touch) {
      pageX.push(touch.pageX);
      pageY.push(touch.pageY);
      clientX.push(touch.clientX);
      clientY.push(touch.clientY);
    });

    return {
      pageX: (min.apply(Math, pageX) + max.apply(Math, pageX)) / 2,
      pageY: (min.apply(Math, pageY) + max.apply(Math, pageY)) / 2,
      clientX: (min.apply(Math, clientX) + max.apply(Math, clientX)) / 2,
      clientY: (min.apply(Math, clientY) + max.apply(Math, clientY)) / 2
    };
  },


  /**
   * calculate the velocity between two points. unit is in px per ms.
   * @method getVelocity
   * @param {Number} delta_time
   * @param {Number} delta_x
   * @param {Number} delta_y
   * @return {Object} velocity `x` and `y`
   */
  getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
    return {
      x: Math.abs(delta_x / delta_time) || 0,
      y: Math.abs(delta_y / delta_time) || 0
    };
  },


  /**
   * calculate the angle between two coordinates
   * @method getAngle
   * @param {Touch} touch1
   * @param {Touch} touch2
   * @return {Number} angle
   */
  getAngle: function getAngle(touch1, touch2) {
    var x = touch2.clientX - touch1.clientX,
      y = touch2.clientY - touch1.clientY;
    return Math.atan2(y, x) * 180 / Math.PI;
  },


  /**
   * do a small comparision to get the direction between two touches.
   * @method getDirection
   * @param {Touch} touch1
   * @param {Touch} touch2
   * @return {String} direction matches `DIRECTION_LEFT|RIGHT|UP|DOWN`
   */
  getDirection: function getDirection(touch1, touch2) {
    var x = Math.abs(touch1.clientX - touch2.clientX),
      y = Math.abs(touch1.clientY - touch2.clientY);

    if(x >= y) {
      return touch1.clientX - touch2.clientX > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return touch1.clientY - touch2.clientY > 0 ? DIRECTION_UP : DIRECTION_DOWN;
  },


  /**
   * calculate the distance between two touches
   * @method getDistance
   * @param {Touch}touch1
   * @param {Touch} touch2
   * @return {Number} distance
   */
  getDistance: function getDistance(touch1, touch2) {
    var x = touch2.clientX - touch1.clientX
      , y = touch2.clientY - touch1.clientY;
    return Math.sqrt((x * x) + (y * y));
  },


  /**
   * calculate the scale factor between two touchLists
   * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
   * @method getScale
   * @param {Array} start array of touches
   * @param {Array} end array of touches
   * @return {Number} scale
   */
  getScale: function getScale(start, end) {
    // need two fingers...
    if(start.length >= 2 && end.length >= 2) {
      return this.getDistance(end[0], end[1]) / this.getDistance(start[0], start[1]);
    }
    return 1;
  },


  /**
   * calculate the rotation degrees between two touchLists
   * @method getRotation
   * @param {Array} start array of touches
   * @param {Array} end array of touches
   * @return {Number} rotation
   */
  getRotation: function getRotation(start, end) {
    // need two fingers
    if(start.length >= 2 && end.length >= 2) {
      return this.getAngle(end[1], end[0]) - this.getAngle(start[1], start[0]);
    }
    return 0;
  },


  /**
   * find out if the direction is vertical   *
   * @method isVertical
   * @param {String} direction matches `DIRECTION_UP|DOWN`
   * @return {Boolean} is_vertical
   */
  isVertical: function isVertical(direction) {
    return direction == DIRECTION_UP || direction == DIRECTION_DOWN;
  },


  /**
   * toggle browser default behavior by setting css properties.
   * `userSelect='none'` also sets `element.onselectstart` to false
   * `userDrag='none'` also sets `element.ondragstart` to false
   *
   * @method toggleBehavior
   * @param {HtmlElement} element
   * @param {Object} css_props
   * @param {Boolean} [toggle=false]
   */
  toggleBehavior: function toggleBehavior(element, css_props, toggle) {
    if(!css_props || !element || !element.style) {
      return;
    }

    // with css properties for modern browsers
    Utils.each(['webkit', 'moz', 'Moz', 'ms', 'o', ''], function setStyle(vendor) {
      Utils.each(css_props, function(value, prop) {
        // vender prefix at the property
        if(vendor) {
          prop = vendor + prop.substring(0, 1).toUpperCase() + prop.substring(1);
        }
        // set the style
        if(prop in element.style) {
          element.style[prop] = !toggle && value;
        }
      });
    });

    var false_fn = function(){ return false; };

    // also the disable onselectstart
    if(css_props.userSelect == 'none') {
      element.onselectstart = !toggle && false_fn;
    }
    // and disable ondragstart
    if(css_props.userDrag == 'none') {
      element.ondragstart = !toggle && false_fn;
    }
  }
};


/**
 * @module hammer
 */
/**
 * @class Event
 * @static
 */
var Event = Hammer.event = {
  /**
   * when touch events have been fired, this is true
   * this is used to stop mouse events
   * @property prevent_mouseevents
   * @private
   * @type {Boolean}
   */
  prevent_mouseevents: false,


  /**
   * if EVENT_START has been fired
   * @property started
   * @private
   * @type {Boolean}
   */
  started: false,


  /**
   * when the mouse is hold down, this is true
   * @property should_detect
   * @private
   * @type {Boolean}
   */
  should_detect: false,


  /**
   * simple event binder with a hook and support for multiple types
   * @method on
   * @param {HTMLElement} element
   * @param {String} type
   * @param {Function} handler
   * @param {Function} [hook]
   * @param {Object} hook.type
   */
  on: function on(element, type, handler, hook) {
    var types = type.split(' ');
    Utils.each(types, function(type){
      Utils.on(element, type, handler);
      hook && hook(type);
    });
  },


  /**
   * simple event unbinder with a hook and support for multiple types
   * @method off
   * @param {HTMLElement} element
   * @param {String} type
   * @param {Function} handler
   * @param {Function} [hook]
   * @param {Object} hook.type
   */
  off: function off(element, type, handler, hook) {
    var types = type.split(' ');
    Utils.each(types, function(type){
      Utils.off(element, type, handler);
      hook && hook(type);
    });
  },


  /**
   * the core touch event handler.
   * this finds out if we should to detect gestures
   * @method onTouch
   * @param {HTMLElement} element
   * @param {String} eventType matches `EVENT_START|MOVE|END`
   * @param {Function} handler
   * @return onTouchHandler {Function} the core event handler
   */
  onTouch: function onTouch(element, eventType, handler) {
    var self = this;

    var onTouchHandler = function onTouchHandler(ev) {
      var src_type = ev.type.toLowerCase()
        , has_pointerevents = Hammer.HAS_POINTEREVENTS
        , trigger_type
        , is_mouse = Utils.inStr(src_type, 'mouse');

      // if we are in a mouseevent, but there has been a touchevent triggered in this session
      // we want to do nothing. simply break out of the event.
      if(is_mouse && self.prevent_mouseevents) {
        return;
      }
      // mousebutton must be down
      else if(is_mouse && eventType == EVENT_START) {
        self.prevent_mouseevents = false;
        self.should_detect = true;
      }
      // just a valid start event, but no mouse
      else if(eventType == EVENT_START && !is_mouse) {
        self.prevent_mouseevents = true;
        self.should_detect = true;
      }

      // update the pointer event before entering the detection
      if(has_pointerevents && eventType != EVENT_END) {
        PointerEvent.updatePointer(eventType, ev);
      }

      // we are in a touch/down state, so allowed detection of gestures
      if(self.should_detect) {
        trigger_type = self.doDetect.call(self, ev, eventType, element, handler);
      }

      // ...and we are done with the detection
      // so reset everything to start each detection totally fresh
      if(trigger_type == EVENT_END) {
        self.prevent_mouseevents = false;
        self.should_detect = false;
        PointerEvent.reset();
      }
      // update the pointerevent object after the detection
      else if(has_pointerevents && eventType == EVENT_END) {
        PointerEvent.updatePointer(eventType, ev);
      }
    };

    this.on(element, EVENT_TYPES[eventType], onTouchHandler);
    return onTouchHandler;
  },


  /**
   * the core detection method
   * this finds out what hammer-touch-events to trigger
   * @method doDetect
   * @param {Object} ev
   * @param {String} eventType matches `EVENT_START|MOVE|END`
   * @param {HTMLElement} element
   * @param {Function} handler
   * @return {String} triggerType matches `EVENT_START|MOVE|END`
   */
  doDetect: function doDetect(ev, eventType, element, handler) {
    var touchList = this.getTouchList(ev, eventType);
    var touchList_length = touchList.length;
    var trigger_type = eventType;
    var trigger_change = touchList.trigger; // used by fakeMultitouch plugin
    var change_length = touchList_length;

    // at each touchstart-like event we want also want to trigger a TOUCH event...
    if(eventType == EVENT_START) {
      trigger_change = EVENT_TOUCH;
    }
    // ...the same for a touchend-like event
    else if(eventType == EVENT_END) {
      trigger_change = EVENT_RELEASE;

      // keep track of how many touches have been removed
      change_length = touchList.length - ((ev.changedTouches) ? ev.changedTouches.length : 1);
    }

    // after there are still touches on the screen,
    // we just want to trigger a MOVE event. so change the START or END to a MOVE
    // but only after detection has been started, the first time we actualy want a START
    if(change_length > 0 && this.started) {
      trigger_type = EVENT_MOVE;
    }

    // detection has been started, we keep track of this, see above
    this.started = true;

    // generate some event data, some basic information
    var ev_data = this.collectEventData(element, trigger_type, touchList, ev);

    // trigger the trigger_type event before the change (TOUCH, RELEASE) events
    // but the END event should be at last
    if(eventType != EVENT_END) {
      handler.call(Detection, ev_data);
    }

    // trigger a change (TOUCH, RELEASE) event, this means the length of the touches changed
    if(trigger_change) {
      ev_data.changedLength = change_length;
      ev_data.eventType = trigger_change;

      handler.call(Detection, ev_data);

      ev_data.eventType = trigger_type;
      delete ev_data.changedLength;
    }

    // trigger the END event
    if(trigger_type == EVENT_END) {
      handler.call(Detection, ev_data);

      // ...and we are done with the detection
      // so reset everything to start each detection totally fresh
      this.started = false;
    }

    return trigger_type;
  },


  /**
   * we have different events for each device/browser
   * determine what we need and set them in the EVENT_TYPES constant
   * the `onTouch` method is bind to these properties.
   * @method determineEventTypes
   * @return {Object} events
   */
  determineEventTypes: function determineEventTypes() {
    var types;
    if(Hammer.HAS_POINTEREVENTS) {
      // prefixed or full support?
      if(window.PointerEvent) {
        types = [
          'pointerdown',
          'pointermove',
          'pointerup pointercancel'
        ];
      }
      // only IE has prefixed
      else {
        types = [
          'MSPointerDown',
          'MSPointerMove',
          'MSPointerUp MSPointerCancel'
        ];
      }
    }
    else {
      types = [
        'touchstart mousedown',
        'touchmove mousemove',
        'touchend touchcancel mouseup'];
    }

    EVENT_TYPES[EVENT_START] = types[0];
    EVENT_TYPES[EVENT_MOVE] = types[1];
    EVENT_TYPES[EVENT_END] = types[2];
    return EVENT_TYPES;
  },


  /**
   * create touchlist depending on the event
   * @method getTouchList
   * @param {Object} ev
   * @param {String} eventType
   * @return {Array} touches
   */
  getTouchList: function getTouchList(ev, eventType) {
    // get the fake pointerEvent touchlist
    if(Hammer.HAS_POINTEREVENTS) {
      return PointerEvent.getTouchList();
    }

    // get the touchlist
    if(ev.touches) {
      if(eventType == EVENT_MOVE) {
        return ev.touches;
      }

      var identifiers = [];
      var concat_touches = [].concat(Utils.toArray(ev.touches), Utils.toArray(ev.changedTouches));
      var touchlist = [];

      Utils.each(concat_touches, function(touch) {
        if(Utils.inArray(identifiers, touch.identifier) === false) {
          touchlist.push(touch);
        }
        identifiers.push(touch.identifier);
      });

      return touchlist;
    }

    // make fake touchlist from mouse position
    ev.identifier = 1;
    return [ev];
  },


  /**
   * collect basic event data
   * @method collectEventData
   * @param {HTMLElement} element
   * @param {String} eventType matches `EVENT_START|MOVE|END`
   * @param {Array} touches
   * @param {Object} ev
   * @return {Object} ev
   */
  collectEventData: function collectEventData(element, eventType, touches, ev) {
    // find out pointerType
    var pointerType = POINTER_TOUCH;
    if(Utils.inStr(ev.type, 'mouse') || PointerEvent.matchType(POINTER_MOUSE, ev)) {
      pointerType = POINTER_MOUSE;
    }

    return {
      center     : Utils.getCenter(touches),
      timeStamp  : Date.now(),
      target     : ev.target,
      touches    : touches,
      eventType  : eventType,
      pointerType: pointerType,
      srcEvent   : ev,

      /**
       * prevent the browser default actions
       * mostly used to disable scrolling of the browser
       */
      preventDefault: function() {
        var srcEvent = this.srcEvent;
        srcEvent.preventManipulation && srcEvent.preventManipulation();
        srcEvent.preventDefault && srcEvent.preventDefault();
      },

      /**
       * stop bubbling the event up to its parents
       */
      stopPropagation: function() {
        this.srcEvent.stopPropagation();
      },

      /**
       * immediately stop gesture detection
       * might be useful after a swipe was detected
       * @return {*}
       */
      stopDetect: function() {
        return Detection.stopDetect();
      }
    };
  }
};

/**
 * @module hammer
 *
 * @class PointerEvent
 * @static
 */
var PointerEvent = Hammer.PointerEvent = {
  /**
   * holds all pointers, by `identifier`
   * @property pointers
   * @type {Object}
   */
  pointers: {},


  /**
   * get the pointers as an array
   * @method getTouchList
   * @return {Array} touchlist
   */
  getTouchList: function getTouchList() {
    var touchlist = [];
    // we can use forEach since pointerEvents only is in IE10
    Utils.each(this.pointers, function(pointer){
      touchlist.push(pointer);
    });
    return touchlist;
  },


  /**
   * update the position of a pointer
   * @method updatePointer
   * @param {String} eventType matches `EVENT_START|MOVE|END`
   * @param {Object} pointerEvent
   */
  updatePointer: function updatePointer(eventType, pointerEvent) {
    if(eventType == EVENT_END) {
      delete this.pointers[pointerEvent.pointerId];
    }
    else {
      pointerEvent.identifier = pointerEvent.pointerId;
      this.pointers[pointerEvent.pointerId] = pointerEvent;
    }
  },


  /**
   * check if ev matches pointertype
   * @method matchType
   * @param {String} pointerType matches `POINTER_MOUSE|TOUCH|PEN`
   * @param {PointerEvent} ev
   */
  matchType: function matchType(pointerType, ev) {
    if(!ev.pointerType) {
      return false;
    }

    var pt = ev.pointerType
      , types = {};

    types[POINTER_MOUSE] = (pt === (ev.MSPOINTER_TYPE_MOUSE || POINTER_MOUSE));
    types[POINTER_TOUCH] = (pt === (ev.MSPOINTER_TYPE_TOUCH || POINTER_TOUCH));
    types[POINTER_PEN] = (pt === (ev.MSPOINTER_TYPE_PEN || POINTER_PEN));
    return types[pointerType];
  },


  /**
   * reset the stored pointers
   * @method reset
   */
  reset: function resetList() {
    this.pointers = {};
  }
};


/**
 * @module hammer
 *
 * @class Detection
 * @static
 */
var Detection = Hammer.detection = {
  // contains all registred Hammer.gestures in the correct order
  gestures: [],

  // data of the current Hammer.gesture detection session
  current : null,

  // the previous Hammer.gesture session data
  // is a full clone of the previous gesture.current object
  previous: null,

  // when this becomes true, no gestures are fired
  stopped : false,


  /**
   * start Hammer.gesture detection
   * @method startDetect
   * @param {Hammer.Instance} inst
   * @param {Object} eventData
   */
  startDetect: function startDetect(inst, eventData) {
    // already busy with a Hammer.gesture detection on an element
    if(this.current) {
      return;
    }

    this.stopped = false;

    // holds current session
    this.current = {
      inst: inst, // reference to HammerInstance we're working for
      startEvent: Utils.extend({}, eventData), // start eventData for distances, timing etc
      lastEvent: false, // last eventData
      lastCalcEvent: false, // last eventData for calculations.
      futureCalcEvent: false, // last eventData for calculations.
      lastCalcData: {}, // last lastCalcData
      name: '' // current gesture we're in/detected, can be 'tap', 'hold' etc
    };

    this.detect(eventData);
  },


  /**
   * Hammer.gesture detection
   * @method detect
   * @param {Object} eventData
   * @return {any}
   */
  detect: function detect(eventData) {
    if(!this.current || this.stopped) {
      return;
    }

    // extend event data with calculations about scale, distance etc
    eventData = this.extendEventData(eventData);

    // hammer instance and instance options
    var inst = this.current.inst,
        inst_options = inst.options;

    // call Hammer.gesture handlers
    Utils.each(this.gestures, function triggerGesture(gesture) {
      // only when the instance options have enabled this gesture
      if(!this.stopped && inst.enabled && inst_options[gesture.name]) {
        // if a handler returns false, we stop with the detection
        if(gesture.handler.call(gesture, eventData, inst) === false) {
          this.stopDetect();
          return false;
        }
      }
    }, this);

    // store as previous event event
    if(this.current) {
      this.current.lastEvent = eventData;
    }

    if(eventData.eventType == EVENT_END) {
      this.stopDetect();
    }

    return eventData;
  },


  /**
   * clear the Hammer.gesture vars
   * this is called on endDetect, but can also be used when a final Hammer.gesture has been detected
   * to stop other Hammer.gestures from being fired
   * @method stopDetect
   */
  stopDetect: function stopDetect() {
    // clone current data to the store as the previous gesture
    // used for the double tap gesture, since this is an other gesture detect session
    this.previous = Utils.extend({}, this.current);

    // reset the current
    this.current = null;

    // stopped!
    this.stopped = true;
  },


  /**
   * calculate velocity, angle and direction
   * @method getVelocityData
   * @param {Object} ev
   * @param {Number} delta_time
   * @param {Number} delta_x
   * @param {Number} delta_y
   */
  getCalculatedData: function getCalculatedData(ev, center, delta_time, delta_x, delta_y) {
    var cur = this.current
      , recalc = false
      , calcEv = cur.lastCalcEvent
      , calcData = cur.lastCalcData;

    if(calcEv && ev.timeStamp - calcEv.timeStamp > Hammer.CALCULATE_INTERVAL) {
      center = calcEv.center;
      delta_time = ev.timeStamp - calcEv.timeStamp;
      delta_x = ev.center.clientX - calcEv.center.clientX;
      delta_y = ev.center.clientY - calcEv.center.clientY;
      recalc = true;
    }

    if(ev.eventType == EVENT_TOUCH || ev.eventType == EVENT_RELEASE) {
      cur.futureCalcEvent = ev;
    }

    if(!cur.lastCalcEvent || recalc) {
      calcData.velocity = Utils.getVelocity(delta_time, delta_x, delta_y);
      calcData.angle = Utils.getAngle(center, ev.center);
      calcData.direction = Utils.getDirection(center, ev.center);

      cur.lastCalcEvent = cur.futureCalcEvent || ev;
      cur.futureCalcEvent = ev;
    }

    ev.velocityX = calcData.velocity.x;
    ev.velocityY = calcData.velocity.y;
    ev.angle = calcData.angle;
    ev.direction = calcData.direction;
  },


  /**
   * extend eventData for Hammer.gestures
   * @method extendEventData
   * @param {Object} ev
   * @return {Object} ev
   */
  extendEventData: function extendEventData(ev) {
    var cur = this.current
      , startEv = cur.startEvent
      , lastEv = cur.lastEvent || startEv;

    // update the start touchlist to calculate the scale/rotation
    if(ev.eventType == EVENT_TOUCH || ev.eventType == EVENT_RELEASE) {
      startEv.touches = [];
      Utils.each(ev.touches, function(touch) {
        startEv.touches.push(Utils.extend({}, touch));
      });
    }

    var delta_time = ev.timeStamp - startEv.timeStamp
      , delta_x = ev.center.clientX - startEv.center.clientX
      , delta_y = ev.center.clientY - startEv.center.clientY;

    this.getCalculatedData(ev, lastEv.center, delta_time, delta_x, delta_y);

    Utils.extend(ev, {
      startEvent: startEv,

      deltaTime : delta_time,
      deltaX    : delta_x,
      deltaY    : delta_y,

      distance  : Utils.getDistance(startEv.center, ev.center),

      scale     : Utils.getScale(startEv.touches, ev.touches),
      rotation  : Utils.getRotation(startEv.touches, ev.touches)
    });

    return ev;
  },


  /**
   * register new gesture
   * @method register
   * @param {Object} gesture object, see `gestures/` for documentation
   * @return {Array} gestures
   */
  register: function register(gesture) {
    // add an enable gesture options if there is no given
    var options = gesture.defaults || {};
    if(options[gesture.name] === undefined) {
      options[gesture.name] = true;
    }

    // extend Hammer default options with the Hammer.gesture options
    Utils.extend(Hammer.defaults, options, true);

    // set its index
    gesture.index = gesture.index || 1000;

    // add Hammer.gesture to the list
    this.gestures.push(gesture);

    // sort the list by index
    this.gestures.sort(function(a, b) {
      if(a.index < b.index) { return -1; }
      if(a.index > b.index) { return 1; }
      return 0;
    });

    return this.gestures;
  }
};


/**
 * @module hammer
 */

/**
 * create new hammer instance
 * all methods should return the instance itself, so it is chainable.
 *
 * @class Instance
 * @constructor
 * @param {HTMLElement} element
 * @param {Object} [options={}] options are merged with `Hammer.defaults`
 * @return {Hammer.Instance}
 */
Hammer.Instance = function(element, options) {
  var self = this;

  // setup HammerJS window events and register all gestures
  // this also sets up the default options
  setup();

  /**
   * @property element
   * @type {HTMLElement}
   */
  this.element = element;

  /**
   * @property enabled
   * @type {Boolean}
   * @protected
   */
  this.enabled = true;

  /**
   * options, merged with the defaults
   * @property options
   * @type {Object}
   */
  this.options = Utils.extend(
    Utils.extend({}, Hammer.defaults),
    options || {});

  // add some css to the element to prevent the browser from doing its native behavoir
  if(this.options.behavior) {
    Utils.toggleBehavior(this.element, this.options.behavior, false);
  }

  /**
   * event start handler on the element to start the detection
   * @property eventStartHandler
   * @type {Object}
   */
  this.eventStartHandler = Event.onTouch(element, EVENT_START, function(ev) {
    if(self.enabled && ev.eventType == EVENT_START) {
      Detection.startDetect(self, ev);
    }
    else if(ev.eventType == EVENT_TOUCH) {
      Detection.detect(ev);
    }
  });

  /**
   * keep a list of user event handlers which needs to be removed when calling 'dispose'
   * @property eventHandlers
   * @type {Array}
   */
  this.eventHandlers = [];
};


Hammer.Instance.prototype = {
  /**
   * bind events to the instance
   * @method on
   * @chainable
   * @param {String} gestures multiple gestures by splitting with a space
   * @param {Function} handler
   * @param {Object} handler.ev event object
   */
  on: function onEvent(gestures, handler) {
    var self = this;
    Event.on(self.element, gestures, handler, function(type) {
      self.eventHandlers.push({ gesture: type, handler: handler });
    });
    return self;
  },


  /**
   * unbind events to the instance
   * @method off
   * @chainable
   * @param {String} gestures
   * @param {Function} handler
   */
  off: function offEvent(gestures, handler) {
    var self = this;

    Event.off(self.element, gestures, handler, function(type) {
      var index = Utils.inArray({ gesture: type, handler: handler });
      if(index !== false) {
        self.eventHandlers.splice(index, 1);
      }
    });
    return self;
  },


  /**
   * trigger gesture event
   * @method trigger
   * @chainable
   * @param {String} gesture
   * @param {Object} [eventData]
   */
  trigger: function triggerEvent(gesture, eventData) {
    // optional
    if(!eventData) {
      eventData = {};
    }

    // create DOM event
    var event = Hammer.DOCUMENT.createEvent('Event');
    event.initEvent(gesture, true, true);
    event.gesture = eventData;

    // trigger on the target if it is in the instance element,
    // this is for event delegation tricks
    var element = this.element;
    if(Utils.hasParent(eventData.target, element)) {
      element = eventData.target;
    }

    element.dispatchEvent(event);
    return this;
  },


  /**
   * enable of disable hammer.js detection
   * @method enable
   * @chainable
   * @param {Boolean} state
   */
  enable: function enable(state) {
    this.enabled = state;
    return this;
  },


  /**
   * dispose this hammer instance
   * @method dispose
   * @return {Null}
   */
  dispose: function dispose() {
    var i, eh;

    // undo all changes made by stop_browser_behavior
    if(this.options.behavior) {
      Utils.toggleBehavior(this.element, this.options.behavior, true);
    }

    // unbind all custom event handlers
    for(i=-1; (eh=this.eventHandlers[++i]);) {
      Utils.off(this.element, eh.gesture, eh.handler);
    }
    this.eventHandlers = [];

    // unbind the start event listener
    Event.off(this.element, EVENT_TYPES[EVENT_START], this.eventStartHandler);

    return null;
  }
};


/**
 * @module gestures
 */
/**
 * Move with x fingers (default 1) around on the page.
 * Preventing the default browser behavior is a good way to improve feel and working.
 * ````
 *  hammertime.on("drag", function(ev) {
 *    console.log(ev);
 *    ev.gesture.preventDefault();
 *  });
 * ````
 *
 * @class Drag
 * @static
 */
/**
 * @event drag
 * @param {Object} ev
 */
/**
 * @event dragstart
 * @param {Object} ev
 */
/**
 * @event dragend
 * @param {Object} ev
 */
/**
 * @event drapleft
 * @param {Object} ev
 */
/**
 * @event dragright
 * @param {Object} ev
 */
/**
 * @event dragup
 * @param {Object} ev
 */
/**
 * @event dragdown
 * @param {Object} ev
 */
(function(name) {
  var triggered = false;

  function dragGesture(ev, inst) {
    var cur = Detection.current;

    // max touches
    if(inst.options.drag_max_touches > 0 &&
      ev.touches.length > inst.options.drag_max_touches) {
      return;
    }

    switch(ev.eventType) {
      case EVENT_START:
        triggered = false;
        break;

      case EVENT_MOVE:
        // when the distance we moved is too small we skip this gesture
        // or we can be already in dragging
        if(ev.distance < inst.options.drag_min_distance &&
          cur.name != name) {
          return;
        }

        var startCenter = cur.startEvent.center;

        // we are dragging!
        if(cur.name != name) {
          cur.name = name;
          if(inst.options.correct_for_drag_min_distance && ev.distance > 0) {
            // When a drag is triggered, set the event center to drag_min_distance pixels from the original event center.
            // Without this correction, the dragged distance would jumpstart at drag_min_distance pixels instead of at 0.
            // It might be useful to save the original start point somewhere
            var factor = Math.abs(inst.options.drag_min_distance / ev.distance);
            startCenter.pageX += ev.deltaX * factor;
            startCenter.pageY += ev.deltaY * factor;
            startCenter.clientX += ev.deltaX * factor;
            startCenter.clientY += ev.deltaY * factor;

            // recalculate event data using new start point
            ev = Detection.extendEventData(ev);
          }
        }

        // lock drag to axis?
        if(cur.lastEvent.drag_locked_to_axis ||
            ( inst.options.drag_lock_to_axis &&
              inst.options.drag_lock_min_distance <= ev.distance
            )) {
          ev.drag_locked_to_axis = true;
        }
        var last_direction = cur.lastEvent.direction;
        if(ev.drag_locked_to_axis && last_direction !== ev.direction) {
          // keep direction on the axis that the drag gesture started on
          if(Utils.isVertical(last_direction)) {
            ev.direction = (ev.deltaY < 0) ? DIRECTION_UP : DIRECTION_DOWN;
          }
          else {
            ev.direction = (ev.deltaX < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
          }
        }

        // first time, trigger dragstart event
        if(!triggered) {
          inst.trigger(name + 'start', ev);
          triggered = true;
        }

        // trigger events
        inst.trigger(name, ev);
        inst.trigger(name + ev.direction, ev);

        var is_vertical = Utils.isVertical(ev.direction);

        // block the browser events
        if((inst.options.drag_block_vertical && is_vertical) ||
          (inst.options.drag_block_horizontal && !is_vertical)) {
          ev.preventDefault();
        }
        break;

      case EVENT_RELEASE:
        if(triggered && ev.changedLength <= inst.options.drag_max_touches) {
          inst.trigger(name + 'end', ev);
          triggered = false;
        }
        break;

      case EVENT_END:
        triggered = false;
        break;
    }
  }


  Hammer.gestures.Drag = {
    name: name,
    index: 50,
    handler: dragGesture,
    defaults: {
      /**
       * minimal movement that have to be made before the drag event gets triggered
       * @property drag_min_distance
       * @type {Number}
       * @default 10
       */
      drag_min_distance: 10,

      /**
       * Set correct_for_drag_min_distance to true to make the starting point of the drag
       * be calculated from where the drag was triggered, not from where the touch started.
       * Useful to avoid a jerk-starting drag, which can make fine-adjustments
       * through dragging difficult, and be visually unappealing.
       * @property correct_for_drag_min_distance
       * @type {Boolean}
       * @default true
       */
      correct_for_drag_min_distance: true,

      /**
       * set 0 for unlimited, but this can conflict with transform
       * @property drag_max_touches
       * @type {Number}
       * @default 1
       */
      drag_max_touches: 1,

      /**
       * prevent default browser behavior when dragging occurs
       * be careful with it, it makes the element a blocking element
       * when you are using the drag gesture, it is a good practice to set this true
       * @property drag_block_horizontal
       * @type {Boolean}
       * @default false
       */
      drag_block_horizontal: false,

      /**
       * same as `drag_block_horizontal`, but for vertical movement
       * @property drag_block_vertical
       * @type {Boolean}
       * @default false
       */
      drag_block_vertical: false,

      /**
       * drag_lock_to_axis keeps the drag gesture on the axis that it started on,
       * It disallows vertical directions if the initial direction was horizontal, and vice versa.
       * @property drag_lock_to_axis
       * @type {Boolean}
       * @default false
       */
      drag_lock_to_axis: false,

      /**
       *  drag lock only kicks in when distance > drag_lock_min_distance
       * This way, locking occurs only when the distance has become large enough to reliably determine the direction
       * @property drag_lock_min_distance
       * @type {Number}
       * @default 25
       */
      drag_lock_min_distance: 25
    }
  };
})('drag');

/**
 * @module gestures
 */
/**
 * trigger a simple gesture event, so you can do anything in your handler.
 * only usable if you know what your doing...
 *
 * @class Gesture
 * @static
 */
/**
 * @event gesture
 * @param {Object} ev
 */
Hammer.gestures.Gesture = {
  name   : 'gesture',
  index  : 1337,
  handler: function releaseGesture(ev, inst) {
    inst.trigger(this.name, ev);
  }
};

/**
 * @module gestures
 */
/**
 * Touch stays at the same place for x time
 *
 * @class Hold
 * @static
 */
/**
 * @event hold
 * @param {Object} ev
 */
(function(name) {
  var timer;

  function holdGesture(ev, inst) {
    var options = inst.options
      , current = Detection.current;

    switch(ev.eventType) {
      case EVENT_START:
        clearTimeout(timer);

        // set the gesture so we can check in the timeout if it still is
        current.name = name;

        // set timer and if after the timeout it still is hold,
        // we trigger the hold event
        timer = setTimeout(function() {
          if(current && current.name == name) {
            inst.trigger(name, ev);
          }
        }, options.hold_timeout);
        break;

      case EVENT_MOVE:
        if(ev.distance > options.hold_threshold) {
          clearTimeout(timer);
        }
        break;

      case EVENT_RELEASE:
        clearTimeout(timer);
        break;
    }
  }

  Hammer.gestures.Hold = {
    name: name,
    index: 10,
    defaults: {
      /**
       * @property hold_timeout
       * @type {Number}
       * @default 500
       */
      hold_timeout: 500,

      /**
       * movement allowed while holding
       * @property hold_threshold
       * @type {Number}
       * @default 2
       */
      hold_threshold: 2
    },
    handler: holdGesture
  };
})('hold');

/**
 * @module gestures
 */
/**
 * when a touch is being released from the page
 *
 * @class Release
 * @static
 */
/**
 * @event release
 * @param {Object} ev
 */
Hammer.gestures.Release = {
  name   : 'release',
  index  : Infinity,
  handler: function releaseGesture(ev, inst) {
    if(ev.eventType == EVENT_RELEASE) {
      inst.trigger(this.name, ev);
    }
  }
};

/**
 * @module gestures
 */
/**
 * triggers swipe events when the end velocity is above the threshold
 * for best usage, set `prevent_default` (on the drag gesture) to `true`
 * ````
 *  hammertime.on("dragleft swipeleft", function(ev) {
 *    console.log(ev);
 *    ev.gesture.preventDefault();
 *  });
 * ````
 *
 * @class Swipe
 * @static
 */
/**
 * @event swipe
 * @param {Object} ev
 */
/**
 * @event swipeleft
 * @param {Object} ev
 */
/**
 * @event swiperight
 * @param {Object} ev
 */
/**
 * @event swipeup
 * @param {Object} ev
 */
/**
 * @event swipedown
 * @param {Object} ev
 */
Hammer.gestures.Swipe = {
  name: 'swipe',
  index: 40,
  defaults: {
    /**
     * @property swipe_min_touches
     * @type {Number}
     * @default 1
     */
    swipe_min_touches: 1,

    /**
     * @property swipe_max_touches
     * @type {Number}
     * @default 1
     */
    swipe_max_touches: 1,

    /**
     * horizontal swipe velocity
     * @property swipe_velocity_x
     * @type {Number}
     * @default 0.7
     */
    swipe_velocity_x: 0.7,

    /**
     * vertical swipe velocity
     * @property swipe_velocity_y
     * @type {Number}
     * @default 0.6
     */
    swipe_velocity_y: 0.6
  },

  handler: function swipeGesture(ev, inst) {
    if(ev.eventType == EVENT_RELEASE) {
      var touches = ev.touches.length
        , options = inst.options;

      // max touches
      if(touches < options.swipe_min_touches ||
        touches > options.swipe_max_touches) {
        return;
      }

      // when the distance we moved is too small we skip this gesture
      // or we can be already in dragging
      if(ev.velocityX > options.swipe_velocity_x ||
        ev.velocityY > options.swipe_velocity_y) {
        // trigger swipe events
        inst.trigger(this.name, ev);
        inst.trigger(this.name + ev.direction, ev);
      }
    }
  }
};

/**
 * @module gestures
 */
/**
 * Single tap and a double tap on a place
 *
 * @class Tap
 * @static
 */
/**
 * @event tap
 * @param {Object} ev
 */
/**
 * @event doubletap
 * @param {Object} ev
 */
(function(name) {
  var has_moved = false;

  function tapGesture(ev, inst) {
    var options = inst.options
      , current = Detection.current
      , prev = Detection.previous
      , since_prev
      , did_doubletap;

    switch(ev.eventType) {
      case EVENT_START:
        has_moved = false;
        break;

      case EVENT_MOVE:
        has_moved = has_moved || (ev.distance > options.tap_max_distance);
        break;

      case EVENT_END:
        if(ev.srcEvent.type != 'touchcancel' && ev.deltaTime < options.tap_max_touchtime && !has_moved) {
          // previous gesture, for the double tap since these are two different gesture detections
          since_prev = prev && prev.lastEvent && ev.timeStamp - prev.lastEvent.timeStamp;
          did_doubletap = false;

          // check if double tap
          if(prev && prev.name == name &&
              (since_prev && since_prev < options.doubletap_interval) &&
              ev.distance < options.doubletap_distance) {
            inst.trigger('doubletap', ev);
            did_doubletap = true;
          }

          // do a single tap
          if(!did_doubletap || options.tap_always) {
            current.name = name;
            inst.trigger(current.name, ev);
          }
        }
    }
  }

  Hammer.gestures.Tap = {
    name: name,
    index: 100,
    handler: tapGesture,
    defaults: {
      /**
       * max time of a tap, this is for the slow tappers
       * @property tap_max_touchtime
       * @type {Number}
       * @default 250
       */
      tap_max_touchtime: 250,

      /**
       * max distance of movement of a tap, this is for the slow tappers
       * @property tap_max_distance
       * @type {Number}
       * @default 10
       */
      tap_max_distance: 10,

      /**
       * always trigger the `tap` event, even while double-tapping
       * @property tap_always
       * @type {Boolean}
       * @default true
       */
      tap_always: true,

      /**
       * max distance between two taps
       * @property doubletap_distance
       * @type {Number}
       * @default 20
       */
      doubletap_distance: 20,

      /**
       * max time between two taps
       * @property doubletap_interval
       * @type {Number}
       * @default 300
       */
      doubletap_interval: 300
    }
  };
})('tap');

/**
 * @module gestures
 */
/**
 * when a touch is being touched at the page
 *
 * @class Touch
 * @static
 */
/**
 * @event touch
 * @param {Object} ev
 */
Hammer.gestures.Touch = {
  name: 'touch',
  index: -Infinity,
  defaults: {
    /**
     * call preventDefault at touchstart, and makes the element blocking by disabling the scrolling of the page,
     * but it improves gestures like transforming and dragging.
     * be careful with using this, it can be very annoying for users to be stuck on the page
     * @property prevent_default
     * @type {Boolean}
     * @default false
     */
    prevent_default: false,

    /**
     * disable mouse events, so only touch (or pen!) input triggers events
     * @property prevent_mouseevents
     * @type {Boolean}
     * @default false
     */
    prevent_mouseevents: false
  },
  handler: function touchGesture(ev, inst) {
    if(inst.options.prevent_mouseevents && ev.pointerType == POINTER_MOUSE) {
      ev.stopDetect();
      return;
    }

    if(inst.options.prevent_default) {
      ev.preventDefault();
    }

    if(ev.eventType == EVENT_TOUCH) {
      inst.trigger('touch', ev);
    }
  }
};

/**
 * @module gestures
 */
/**
 * User want to scale or rotate with 2 fingers
 * Preventing the default browser behavior is a good way to improve feel and working. This can be done with the
 * `transform_always_block` option.
 *
 * @class Transform
 * @static
 */
/**
 * @event transform
 * @param {Object} ev
 */
/**
 * @event transformstart
 * @param {Object} ev
 */
/**
 * @event transformend
 * @param {Object} ev
 */
/**
 * @event pinchin
 * @param {Object} ev
 */
/**
 * @event pinchout
 * @param {Object} ev
 */
/**
 * @event rotate
 * @param {Object} ev
 */
(function(name) {
  var triggered = false;

  function transformGesture(ev, inst) {
    switch(ev.eventType) {
      case EVENT_START:
        triggered = false;
        break;

      case EVENT_MOVE:
          // at least multitouch
        if(ev.touches.length < 2) {
          return;
        }

        var scale_threshold = Math.abs(1 - ev.scale);
        var rotation_threshold = Math.abs(ev.rotation);

        // when the distance we moved is too small we skip this gesture
        // or we can be already in dragging
        if(scale_threshold < inst.options.transform_min_scale &&
          rotation_threshold < inst.options.transform_min_rotation) {
          return;
        }

        // we are transforming!
        Detection.current.name = name;

        // first time, trigger dragstart event
        if(!triggered) {
          inst.trigger(name + 'start', ev);
          triggered = true;
        }

        inst.trigger(name, ev); // basic transform event

        // trigger rotate event
        if(rotation_threshold > inst.options.transform_min_rotation) {
          inst.trigger('rotate', ev);
        }

        // trigger pinch event
        if(scale_threshold > inst.options.transform_min_scale) {
          inst.trigger('pinch', ev);
          inst.trigger('pinch' + (ev.scale<1 ? 'in' : 'out'), ev);
        }
        break;

      case EVENT_RELEASE:
        if(triggered && ev.changedLength < 2) {
          inst.trigger(name + 'end', ev);
          triggered = false;
        }
        break;
    }
  }

  Hammer.gestures.Transform = {
    name     : name,
    index    : 45,
    defaults : {
      /**
       * minimal scale factor, no scale is 1, zoomin is to 0 and zoomout until higher then 1
       * @property transform_min_scale
       * @type {Number}
       * @default 0.01
       */
      transform_min_scale: 0.01,

      /**
       * rotation in degrees
       * @property transform_min_rotation
       * @type {Number}
       * @default 1
       */
      transform_min_rotation: 1
    },

    handler: transformGesture
  };
})('transform');

/**
 * @module hammer
 */
// AMD export
if(typeof define == 'function' && define.amd) {
  define('modules/../../vendor/hammer',[],function(){
    return Hammer;
  });
}
// commonjs export
else if(typeof module !== 'undefined' && module.exports) {
  module.exports = Hammer;
}
// browser export
else {
  window.Hammer = Hammer;
}

})(window);

define('modules/mobile',['require','modules/reader','modules/settings','modules/events','../../vendor/hammer'],function(require) {
  var reader = require('modules/reader');
  var settings = require('modules/settings');
  var events = require('modules/events');
  var Hammer = require('../../vendor/hammer');

  return function Mobile() {

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

    hammer.on('touch release pinchin pinchout dragend doubletap tap', function(e) {

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

          touchTimer = setTimeout(function() {
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
              setTimeout(function() {
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

})
;
define('modules/app',['require','modules/environment','modules/reader','modules/settings','modules/layout','modules/user-settings','modules/events','modules/chapters','modules/hover','modules/search','modules/mobile'],function(require) {

  var environment = require('modules/environment');
  var reader = require('modules/reader');
  var settings = require('modules/settings');
  var layout = require('modules/layout');
  var userSettings = require('modules/user-settings');
  var events = require('modules/events');
  var chapters = require('modules/chapters');
  var hover = require('modules/hover');
  var search = require('modules/search');
  var mobile = require('modules/mobile');

  return function App(options) {

    var opts = options;
    var uiHasInit = false;

    this.init = function() {

      if (environment.isMobile()) {
        new mobile();
      }
      events.bindEventHandlers();

      if (opts) {
        $.extend(settings, opts);
      }

      if (settings.clearStorage && !localStorage.refreshed) {
        localStorage.clear();
        localStorage.setItem('refreshed', true);
        window.location.href = window.location.href;
      } else if (settings.clearStorage && localStorage.refreshed) {
        localStorage.removeItem('refreshed');
      }

      window.addEventListener('orientationchange', events.orientationHasChanged);
      window.onunload = window.onbeforeunload = (function() {
        $('html, body').scrollTop(0);

        var writeComplete = false;

        return function() {

          if (writeComplete) {
            return;
          }

          writeComplete = true;
          if (!settings.clearStorage) {
            userSettings.saveLocation();
            userSettings.updateUserPreferences();
          }

        };

      }());

      $(window).on('resize', function() {
        console.log(uiHasInit);
        if (!uiHasInit) {
          return;
        }
        var intrvl;
        intrvl = setInterval(function() {
          clearInterval(intrvl);
          $(document).trigger('updateUi');
        }, 200);
      });

      $.event.trigger({
        type: 'udpateUi'
      }, {
        type: 'uiReady'
      }, {
        type: 'updateNavIndicators'
      }, {
        type: 'updateState'
      });

      $(document).on('updateUi', function() {
        // chapters.bindChapters();
        layout.adjustFramePosition();
        userSettings.updateUserPreferences();
        events.countPages();
      });

      $(document).on('uiReady', function() {
        uiHasInit = true;
        var slug = window.location.hash.split('/')[2];
        var jumpTimer;
        clearTimeout(jumpTimer);
        jumpTimer = setTimeout(function() {
          if (slug) {
            chapters.jumpToChapter(slug);
          }
        }, 0);
      });

      $(document).on('updateNavIndicators', function() {
        events.countPages();
        if (uiHasInit) {
          chapters.updateState();
        }
      });

      $(document).on('updateState', function() {
        chapters.updateState();
      });

      function addJsonDataToDom(data) {

        $.each(data, function(i, o) {

          $('<li/>', {
            html: $('<a/>', {
              text: o.title,
              href: o.src,
              click: function(e) {
                e.preventDefault();
                userSettings.saveLocation();
                userSettings.goToPreviousLocation();
              }
            })
          }).appendTo(settings.chapters);

        });

        if (settings.debug) {
          console.log('JSON data added to DOM');
        }

      }

      // Bootstrap
      var globalStore = {};
      var JSONUrl = settings.jsonPath;

      $.when( // get json data, update settings

        $.get(JSONUrl, {
          'bust': window.ebookAppData.urlArgs
        }, function(data) {

          $.each(data, function() {
            if (this.uuid === window.ebookAppData.uuid) {
              var components = this.components[0];
              settings.bookId = this.uuid;
              userSettings.updatedReaderData('components', components);
              userSettings.updatedReaderData('currentPage', components.src);
              userSettings.updatedReaderData('firstPage', components.src);
              userSettings.updatedReaderData('lastPage', components.src);
            }
          });

          if (reader.currentPage === null) {
            if (localStorage && !localStorage.refreshed) {
              window.onunload = window.onbeforeunload = function() {
                return;
              };
              localStorage.clear();
              localStorage.setItem('refreshed', true);
              window.location.href = window.location.href;
            } else if (localStorage && localStorage.refreshed) {
              localStorage.removeItem('refreshed');
              window.location.href = '/404';
              return false;
            }
          }

          userSettings.updateLocalStorage(settings.bookId, 'currentPage', reader.currentPage);

        })

      ).then(function() {

        $.when( // get pages from updated settings

          $.get(reader.currentPage, {
            'bust': window.ebookAppData.urlArgs
          }, function(html) {
            globalStore.html = html;
          }),

          $.get(window.ebookAppData.relPath + '/components/style/global-style.css', {
            'bust': window.ebookAppData.urlArgs
          }, function(css) {
            globalStore.css = css;
          })

        ).then(function() { // append html to page

          addJsonDataToDom(reader.components);

          $('<style />').html(globalStore.css).appendTo('head');

          settings.el.html(
            $('<section/>', {
              id: 'page',
              css: {
                margin: 0,
                padding: 0,
                border: 0
              },
              html: globalStore.html
            })
          );

        }).then(function() { // html is added to dom, styles have been applied

          userSettings.getLocation();
          userSettings.getUserPreferences();
          userSettings.goToPreviousLocation();
          layout.setStyles();
          layout.adjustFramePosition();
          events.contrastToggle(settings.contrast);
          events.countPages();
          events.cursorListener();

          var shadows = layout.renderShadows();

          settings.el.append(shadows.shadowTop);
          settings.el.append(shadows.shadowBottom);


          $('.controls, .runner-help, .runner-page-count, #page, .search-wrapper').animate({
            opacity: 1
          }, 200);
          $('.spinner').fadeOut(200, function() {
            setTimeout(function() {
              events.startScrolling();
            }, 50);
          });

          if ($('h1,h2,h3,h4,h5,h6').length) {
            chapters.appendNav();
            $('.chapter-nav').animate({
              opacity: 1
            }, 200);
          }

          $.when(chapters.bindChapters()).done(function() {
            $(document).trigger('uiReady');
          });

        });

      });

    };

  };

});

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

define("main", function(){});
