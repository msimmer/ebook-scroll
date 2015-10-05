define(function(require) {
  var settings = require('modules/settings');

  return new function Chapters() {

    this.panels = settings.chapterSelector;
    this.currentPos = false;
    this.articles = [];

    this.updateState = function() {
      var _this = this;
      var currentChapter = _this.getCurrentChapter();
      if (currentChapter && currentChapter.slug) {
        var hashUrl = '#/' + settings.bookSlug + '/' + currentChapter.slug
        window.location.hash = hashUrl;
      };
    };

    this.bindChapters = function() {
      var dfr = $.Deferred();
      var _this = this;
      var ids = $([]).pushStack($('h1,h2,h3,h4,h5,h6'));
      var scrollTop = $(window).scrollTop();
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
          dfr.resolve();
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
          currentChapterData = ch;
        }
      }

      return currentChapterData;

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
        var buffer, pos, jumpTimer;
        if (chapter) {
          buffer = 200;
          pos = parseInt($('[data-slug="' + slug + '"]').attr('data-postop'), 10);
          settings.el.scrollTop(pos);
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
      });
    };

    this.scrollToChapter = function(dir, callback) {

      var _this = this;
      _this.bindChapters();

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
