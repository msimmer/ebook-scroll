define(function(require) {

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
