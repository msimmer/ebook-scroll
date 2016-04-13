define([
  'jquery',
  'modules/environment',
  'modules/settings',
  'modules/reader',
  'modules/user-settings',
  'modules/events',
  'modules/chapters',
  'modules/search',
  'modules/mobile',
  'modules/layout'
], function (
  $,
  environment,
  settings,
  reader,
  userSettings,
  events,
  chapters,
  search,
  mobile,
  layout
) {

  return function App(options) {

    var opts = options;
    var uiHasInit = false;

    this.bindDocumentEvents = function () {

      $.event.trigger({
        type: 'udpateUi'
      }, {
        type: 'uiReady'
      }, {
        type: 'updateNavIndicators'
      }, {
        type: 'updateState'
      });


      $(document).on('updateUi', function () {
        layout.adjustFramePosition();
        userSettings.updateUserPreferences();
        events.countPages();
      });

      $(document).on('uiReady', function () {
        uiHasInit = true;
        var slug = window.location.hash.split('/')[2];
        var jumpTimer;
        clearTimeout(jumpTimer);
        jumpTimer = setTimeout(function () {
          if (slug) {
            chapters.jumpToChapter(slug);
          }
        }, 0);
      });

      $(document).on('updateNavIndicators', function () {
        events.countPages();
        if (uiHasInit) {
          chapters.updateState();
        }
      });

      $(document).on('updateState', function () {
        chapters.updateState();
      });
    };
    this.bindWindowEvents = function () {
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
        if (!uiHasInit) {
          return;
        }
        var intrvl;
        intrvl = setInterval(function () {
          clearInterval(intrvl);
          $(document).trigger('updateUi');
        }, 200);
      });
    };

    this.bind = function () {
      this.bindDocumentEvents();
      this.bindWindowEvents();
    };

    this.init = function () {

      events.bindEventHandlers();
      this.bind();

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



      function addJsonDataToDom(data) {

        $.each(data, function (i, o) {

          $('<li/>', {
            html: $('<a/>', {
              text: o.title,
              href: o.src,
              click: function (e) {
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
        }, function (data) {

          $.each(data, function () {
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
              window.onunload = window.onbeforeunload = function () {
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

      ).then(function () {

        $.when( // get pages from updated settings

          $.get(reader.currentPage, {
            'bust': window.ebookAppData.urlArgs
          }, function (html) {
            globalStore.html = html;
          }),

          $.get('/assets/style/global-style.css', {
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

        }).then(function () { // html is added to dom, styles have been applied

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
          $('.spinner').fadeOut(200, function () {
            setTimeout(function () {
              events.startScrolling();
            }, 50);
          });

          if ($('h1,h2,h3,h4,h5,h6').length) {
            chapters.appendNav();
            $('.chapter-nav').animate({
              opacity: 1
            }, 200);
          }

          $.when(chapters.bindChapters()).done(function () {
            $(document).trigger('uiReady');
          });

        });

      });

    };

  };

});
