
define('reader',[],function () {
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

define('environment',[],function () {

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
        isMobile: function () {
            var reasonableNumberofDevices = this.tablet.concat(this.handheld),
                deviceStr = reasonableNumberofDevices.join('|'),
                regex = new RegExp(deviceStr, 'i');
            return (regex.test(navigator.userAgent.toLowerCase()) && !(/macintosh/i.test(navigator.userAgent.toLowerCase())));
        },
        prefix: function () {
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
        orientation: function () {
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

define('settings',['require','environment'],function (require) {

    var environment = require('environment');
    return {
        dev: false,
        jsonPath: 'data/bookData.json',
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
        maxFontSize: function () {
            return environment.isMobile() ? 130 : 150;
        },
        minFontSize: function () {
            return environment.isMobile() ? 50 : 70;
        },
        contrast: 'light',
        scrollSpeed: 10,
        currentChapterIndex: null,
        chapterSelector: '[data-chapter]',
        chapterData:[]
    };
});

define('layout',['require','./environment','./settings'],function (require) {

    // var $           = require('./vendor/jquery');
    var environment = require('./environment');
    var settings    = require('./settings');
    // var styles      = require('./styles');

    return {

        targetContainerWidth: function () {
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

        targetContainerHeight: function () {
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

        setFrameHeight: function () {

            var targetHeight = this.targetContainerHeight();

            settings.el.css({
                height: targetHeight,
                maxHeight: targetHeight
            });

        },

        setFrameWidth: function () {

            var targetWidth = this.targetContainerWidth();

            settings.el.css({
                width: targetWidth,
                maxWidth: targetWidth
            });

        },

        adjustFramePosition: function () {

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

            var dist = parseInt(settings.el.offset().top + settings.el.height() - 49, 10);
            $('#shadow-bottom').css({
                top: dist
            });

        },

        adjustNavPosition: function () {

            var frame = settings.el,
                nav = $('nav'),
                ctrlH = $('.controls').height(), // .controls height before mobile layout abstract
                overlap = frame.position().left <= 115, // initial sidebar width + margin
                orientation = environment.orientation();

            if (overlap && $(window).width() > 480) {
                nav.addClass('mobile');
                nav.css({
                    top: 0,
                    width: frame.width()
                });
            }

            if (!overlap && $(window).width() > 480) {
                nav.removeClass('mobile');
                nav.css({
                    top: ($(window).height() / 2) - (ctrlH / 2),
                    width: 75
                });
            }

            if (orientation === 'portrait' && $(window).width() <= 480) {
                nav.addClass('mobile');
                nav.css({
                    top: 0,
                    width: 'auto'
                });
            }

            if (orientation === 'landscape' && $(window).width() <= 480) {
                nav.removeClass('mobile');
            }

        },

        setStyles: function () {

            var mainCss = {
                fontSize: settings.fSize + '%',
                lineHeight: '1.3'
            };

            settings.el.css(mainCss);

        },

        renderShadows: function () {
            // var shadowHeight = 50;
            // topDist = context.environment.isMobile() ? 0 : context.settings.el.offset().top;
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

define('user-settings',['require','./reader','./settings'],function (require) {
    var reader   = require('./reader');
    var settings = require('./settings');

    return {

        updatedReaderData: function () {
            reader[arguments[0]] = arguments[1];
        },

        updateUserData: function () {
            settings[arguments[0]] = arguments[1];
        },

        updateLocalStorage: function (obj, prop, attr, nestedAttr) { // TODO: refactor

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

        saveLocation: function () {

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

        getFromLocalStorage: function (obj, prop, attr) { // TODO: refactor

            var parsedObj = JSON.parse(localStorage.getItem(obj));

            if (typeof attr !== 'undefined') {
                return parsedObj[prop][attr];
            }

            return parsedObj[prop];

        },

        updateUserPreferences: function () {

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

        getUserPreferences: function () {
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

        getLocation: function () {

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

        goToPreviousLocation: function () {

            if (settings.debug) {
                console.log('Going to previous location');
            }

            var pos = this.getFromLocalStorage(settings.bookId, 'scrollPosition', reader.currentPage);
            setTimeout(function () {
                settings.el.scrollTop(pos);
            }, 50);
        },

        goToNextChapter: function () {
            return;
        }

    };
});

define('events',['require','./settings','./reader','./user-settings','./layout'],function (require) {
    var settings = require('./settings');
    var reader = require('./reader');
    var userSettings = require('./user-settings');
    var layout = require('./layout');

    var Events = function () {

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

        this.bindEventHandlers = function () {

            $.each(_this.eventHandlers, function (k, v) {

                var eArr = k.split(','),
                    fArr = v.split(','),
                    elem = $.trim(eArr[0]),
                    trig = $.trim(eArr[1]),
                    func = $.trim(fArr[0]),
                    args = fArr.slice(1);

                $(elem).on(trig, function (e) {
                    if (e && typeof e.originalEvent !== 'undefined') {
                        args.push(e);
                        e.preventDefault();
                    }
                    _this[func].apply(_this, args);
                });

            });

        };

        this.toggleFullScreen = function () {

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

        this.listenForPageChange = function () {

            var intervalCallback = function(){
                $(document).trigger('updateNavIndicators');
            };

            if (_this.listenForPageChangeInterval === null) { // kick off by counting pages and setting chapter url
                intervalCallback();
            }

            var lineHeight = Math.floor(parseInt($(settings.el.first('p')).css('line-height'), 10)),
                containerH = Math.floor(settings.el.height()),
                intrvl = Math.floor((lineHeight * containerH) / settings.scrollSpeed + 1) * 100;

            window.clearInterval(_this.listenForPageChangeInterval);

            _this.listenForPageChangeInterval = setInterval(function () {
                intervalCallback();
            }, intrvl);

        };

        this.playPause = function () {

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

        this.getSkipInterval = function () {
            var v = 100 - settings.scrollSpeed,
                n = v.toString().slice(-2),
                r = parseInt(n, 10),
                x = r * 6 / 30;

            _this.skip = x;

        };

        this.animateScroll = function (context, callback) {
            return setTimeout(function () {
                context[callback].apply(context);
            }, 0);
        };

        this.readScroll = function () {

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

        this.cursorListener = function () {
            var $this = $('html');
            var showCursor = function () {
                $this.removeClass('cursor-hidden');
            };
            var hideCursor = function () {
                $this.addClass('cursor-hidden');
            };
            var setTimer = function () {
                if (reader.isScrolling) {
                    _this.cursorTimer = setTimeout(function () {
                        hideCursor();
                    }, 2000);
                }
            };
            $this.on({
                mousemove: function () {
                    showCursor();
                    window.clearTimeout(_this.cursorTimer);
                    setTimer();
                }
            });
            $('a').on({
                mouseenter: function () {
                    window.clearTimeout(_this.cursorTimer);
                },
                mouseleave: function () {
                    setTimer();
                }
            });
            $this.addClass('cursor-hidden');
        };

        this.startScrolling = function () {

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

        this.stopScrolling = function () {
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

        this.speedIncrement = function () {

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

        this.speedDecrement = function () {

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

        this.isChapterEnd = function () {

            _this.stopScrolling();

            if (settings.debug) {
                console.log('Chapter end');
            }

        };

        this.hasEnded = false;

        this.isBookEnd = function () {

            _this.stopScrolling();
            _this.hasEnded = true;

            if (settings.debug) {
                console.log('Book end');
            }

        };

        this.fontIncrement = function () {

            if (settings.fSize === settings.maxFontSize()) {
                return;
            }
            var size = settings.fSize < settings.maxFontSize() ? settings.fSize + settings.fSizeIncrement : settings.fSize;

            settings.el.css('font-size', size + '%');
            userSettings.updateUserData('fSize', size);

            $(document).trigger('updateUi', {});

        };

        this.fontDecrement = function () {

            if (settings.fSize === settings.minFontSize()) {
                return;
            }

            var size = settings.fSize > settings.minFontSize() ? settings.fSize - settings.fSizeIncrement : settings.fSize;

            settings.el.css('font-size', size + '%');
            userSettings.updateUserData('fSize', size);

        };

        this.contrastToggle = function (e) {

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

        this.embeddedLinkClick = function (e) {

            var target = $(e.currentTarget),
                href = target.attr('href'),
                external = function (href) {
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

        this.orientationHasChanged = function () {

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

            setTimeout(function () {
                layout.adjustFramePosition();
                if (window.pageYOffset) {
                    window.scrollTo(0, 0, 1);
                }
            }, 1);

            if (reader.isScrolling) {
                _this.stopScrolling();
                setTimeout(function () {
                    _this.startScrolling();
                }, 500);
            }

        };

        this.countPages = function () {

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

define('chapters',['require','settings'],function (require) {
    var settings = require('settings');
    return {

        panels: settings.chapterSelector,
        scrolledOnce: false,

        bindChapters: function () {
            var ids = $([]).pushStack($('h1,h2,h3,h4,h5,h6'));
            var scrollTop = $(window).scrollTop();
            var currentPos = false;
            var pagination = {
                currentPos: false,
                articles: $.map(ids, function (obj, i) {

                    var $obj = $(obj);

                    $obj.data({
                        chapter: i,
                        index: i,
                        name: $obj.text(),
                        slug: $obj.text().replace(/\s+/g, '-').replace(/[.]/g, '').toLowerCase(),
                        posTop: ids[i].offsetTop,
                        firstEl: i === 0 ? true : false,
                        lastEl: i === ids.length - 1 ? true : false,
                        prevEl: i - 1 > -1 ? ids[i - 1] : ids[0],
                        nextEl: i + 1 <= ids.length - 1 ? ids[i + 1] : ids[ids.length - 1],
                        prevPos: i - 1 > -1 ? ids[i - 1].offsetTop : 0,
                        nextPos: i + 1 <= ids.length - 1 ? ids[i + 1].offsetTop : ids[i].offsetTop,
                        currentEl: false
                    });

                    if ($obj.context.offsetTop >= scrollTop && currentPos === false) {
                        $obj.data().currentEl = true;
                        currentPos = $obj.context.offsetTop;
                    }

                    for (var p in $obj.data()) {
                        if (typeof $obj.data()[p] !== 'object') {
                            $obj.attr('data-' + p, $obj.data()[p]);
                        }
                    }

                    return $obj;
                })
            };

            pagination.currentPos = currentPos;
        },

        getCurrentChapter: function () {

            var scrollTop = settings.el.scrollTop();
            var buffer = 200;
            var currentChapterData;

            // if (settings.chapterData.length < 1) {
                var $chs = $(settings.chapterSelector);
                $chs.each(function () {
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
            // }

            for (var a = settings.chapterData.length - 1; a >= 0; a--) {
                var ch = settings.chapterData[a];
                if (scrollTop >= ch.posTop - buffer && scrollTop < ch.nextPos) { // found current el
                    currentChapterData = ch;
                }
            }

            return currentChapterData;

        },

        moveToChapter: function (dir, callback, jump) {

            var _this = this;

            if (_this.scrolledOnce === false) {
                _this.bindChapters();
                _this.scrolledOnce = true;
            }

            var currentPos = false,
                scrollTop = settings.el.scrollTop(),
                firstArticle = false,
                lastArticle = false,
                hasScrolled;

            var getPromise = function () {
                var dfr = $.Deferred();
                var len = $(_this.panels).length - 1;
                $(_this.panels).each(function (i) { // set current el
                    var $this = $(this);
                    var buffer = 200;
                    var thisTop = $this.data().posTop;
                    var chapEnd = $this.data().nextPos;

                    $this.attr('data-currentel', false).data({
                        currentEl: false
                    });

                    if (jump > -1 && parseInt($this.attr('data-index'), 10) === jump) {
                        $this.attr('data-currentel', true).data({
                            currentEl: true
                        });
                        currentPos = thisTop;

                    } else if (!jump && scrollTop >= thisTop - buffer && scrollTop < chapEnd && currentPos === false) { // found current el
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

            $.when(getPromise()).done(function () {

                hasScrolled = false;

                var scrollAnim = function (pos) {
                    settings.el.animate({
                        scrollTop: pos
                    }, {
                        complete: function () {
                            if (!hasScrolled) {
                                hasScrolled = true;
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
                } else if (firstArticle !== true && !dir){
                    console.log($('[data-currentel="true"]').data().posTop);
                    scrollAnim($('[data-currentel="true"]').data().posTop);
                } else if (firstArticle !== true) {
                    scrollAnim($('[data-currentel="true"]').data()[dir + 'Pos']);
                }

            });

        },

        appendNav: function () {

            var _this = this;

            var $prev = $('<a/>', {
                id: 'chapter-prev',
                'class': 'chapter-nav',
                'data-dir': 'prev'
            }).on({
                click: function (e) {
                    e.preventDefault();
                    _this.moveToChapter($(this).data().dir, function () {
                        $(document).trigger('updateNavIndicators');
                    });
                }
            }).appendTo('body');
            var $next = $('<a/>', {
                id: 'chapter-next',
                'class': 'chapter-nav',
                'data-dir': 'next'
            }).on({
                click: function (e) {
                    e.preventDefault();
                    _this.moveToChapter($(this).data().dir, function () {
                        $(document).trigger('updateNavIndicators');
                    });
                }
            });

            $('body').append($prev);
            $('body').append($next);

        }

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

define("vendor/hover-intent", function(){});

define('hover',['require','environment','reader','events','settings','vendor/hover-intent'],function (require) {
    var environment = require('environment');
    var reader = require('reader');
    var events = require('events');
    var settings = require('settings');
    var hoverIntent = require('vendor/hover-intent');

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

define('app',['require','reader','settings','layout','user-settings','events','chapters','hover'],function (require) {
    var reader       = require('reader');
    var settings     = require('settings');
    var layout       = require('layout');
    var userSettings = require('user-settings');
    var events       = require('events');
    var chapters     = require('chapters');
    var hover        = require('hover');

    return function App(options) {

        var opts = options;

        this.init = function () {

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
            window.onunload = window.onbeforeunload = (function () {
                $('html, body').scrollTop(0);

                var writeComplete = false;

                return function () {

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

            $(window).on('resize', function () {
                var intrvl;
                intrvl = setInterval(function () {
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
            });

            $(document).on('updateUi', function () {
                chapters.bindChapters();
                layout.adjustFramePosition();
                userSettings.updateUserPreferences();
                events.countPages();
            });

            $(document).on('uiReady', function () {
                // console.log('uiReady');
            });

            $(document).on('updateNavIndicators', function () {
                events.countPages();
                var chData = chapters.getCurrentChapter();
                if (chData.index !== settings.currentChapterIndex) {
                    settings.currentChapterIndex = chData.index;
                    history.pushState(null, chData.slug, opts.shebang + chData.slug);
                }
            });

            function addJsonDataToDom(data) {

                $.each(data, function (i, o) {

                    $('<li/>', {
                        html: $('<a/>', {
                            text: o.title,
                            href: o.src,
                            click: function (e) {
                                e.preventDefault();
                                userSettings.saveLocation();
                                // load new chapter fn
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
                }, function (data) {

                    $.each(data, function () {
                        if (this.uuid === window.ebookAppData.uuid) {
                            var components = this.components;
                            settings.bookId = this.uuid;
                            userSettings.updatedReaderData('components', components);
                            userSettings.updatedReaderData('currentPage', components[0].src);
                            userSettings.updatedReaderData('firstPage', components[0].src);
                            userSettings.updatedReaderData('lastPage', components[components.length - 1].src);
                        }
                    });

                    if (reader.currentPage === null) {
                        if (localStorage && !localStorage.refreshed) {
                            window.onunload = window.onbeforeunload = function () {
                                return;
                            };
                            localStorage.clear();
                            localStorage.setItem('refreshed', true);
                            window.location.href = window.location.href;
                        } else if (localStorage && localStorage.refreshed) {
                            localStorage.removeItem('refreshed');
                            console.log('404\'d');
                            window.location.href = '/404';
                            return false;
                        }
                    }

                    userSettings.updateLocalStorage(settings.bookId, 'currentPage', reader.currentPage);

                })

            ).then(function () {

                $.when( // get pages from updated settings

                    $.get(reader.currentPage, {
                        'bust': window.ebookAppData.urlArgs
                    }, function (html) {
                        globalStore.html = html;
                    }),

                    $.get(window.ebookAppData.bookPath + '/Styles/online.css', {
                        'bust': window.ebookAppData.urlArgs
                    }, function (css) {
                        globalStore.css = css;
                    })

                ).then(function () { // append html to page

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

                    userSettings.getLocation();
                    userSettings.getUserPreferences();
                    userSettings.goToPreviousLocation();
                    layout.setStyles();

                    // requires elements in DOM
                    events.countPages();
                    events.cursorListener();

                    $('.controls, .runner-help, .runner-page-count, #page, .search-wrapper').animate({
                        opacity: 1
                    }, 200);
                    $('.spinner').fadeOut(200, function () {
                        setTimeout(function () {
                            events.startScrolling();
                        }, 50);
                    });

                    if ($([]).pushStack($('h1,h2,h3,h4,h5,h6')).length > 0) {
                        chapters.bindChapters();
                        chapters.appendNav();

                        $('.chapter-nav').animate({
                            opacity: 1
                        }, 200);
                    }

                    layout.adjustFramePosition();
                    events.contrastToggle(settings.contrast);

                    var shadows = layout.renderShadows();

                    settings.el.append(shadows.shadowTop);
                    settings.el.append(shadows.shadowBottom);

                    // $(document).trigger('updateNavIndicators');


                    // settings.el.on('scroll', function(){
                    //     $(document).trigger('updateNavIndicators');
                    // });



                    // if (opts.hashDest) {
                    //     var target;
                    //     var sanitizedHash = opts.hashDest.replace(/^#\//, '');
                    //     for (var i = settings.chapterData.length - 1; i >= 0; i--) {
                    //         var ch = settings.chapterData[i];
                    //         if (ch.slug === sanitizedHash) {
                    //             target = ch.index;
                    //         }
                    //     };

                    //     setTimeout(function(){
                    //         chapters.moveToChapter(null, function(){}, target);
                    //     }, 3000);


                    // }

                });

            });

        };

    };

});

require(['app'], function (App) {

    var app = new App({

        dev: true,
        jsonPath: 'data/bookData.json',
        // jsonPath: 'http://local.fiktion.cc/wp-content/themes/Fiktion/data/bookData.json',
        debug: true,
        clearStorage: true,
        scrollSpeed: 10,
        shebang:'#/',
        hashDest: '#/8'
        // hashDest: window.location.hash

    });

    $('html').removeClass('no-js').addClass('cursor js');

    app.init();

});

define("main", function(){});
