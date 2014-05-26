(function (window, $, undefined) {

    var $searchWrapper = $('.search-wrapper'),
        $input = $('#userInput'),
        $searchBtn = $('#search'),
        $closeBtn = $('#search-close');

    function addRemoveSearchBar() {
        if ($('.mobile').length) {
        // if (app.env.isMobile() || $('.mobile').length) {
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
            if (sel.type == "Text") {
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
    }

    $input.on({
        mouseenter: function () {
            $input
                .focus()
                .css({
                    opacity: 1
                });
            $closeBtn.css({
                opacity: 1
            });
        },
        mouseleave: function () {
            if ($input.text() == '') {
                setTimeout(function () {
                    $input.css({
                        opacity: 0
                    });
                    $closeBtn.css({
                        opacity: 0
                    });
                }, 1000);
            }
        },
        focus: function () {
            $(document).on('keydown', function (e) {
                if (e.which == 13) {
                    $searchBtn.click();
                    e.preventDefault();
                } else if (e.which == 27) {
                    $input.css({
                        opacity: 0
                    });
                    $closeBtn.css({
                        opacity: 0
                    });
                }
            });
        },
        blur: function () {
            if ($input.text() == '') {
                setTimeout(function () {
                    $input.css({
                        opacity: 0
                    });
                    $closeBtn.css({
                        opacity: 0
                    });
                }, 1000);
            }
        }
    });

    $searchBtn.on({
        mouseenter: function () {
            $input.css({
                opacity: 1
            });
            $closeBtn.css({
                opacity: 1
            });
        },
        click: function (e) {
            e.preventDefault();
            var term = $input.text();
            doSearch(term);
        }
    });

    $closeBtn.on('click', function (e) {
        e.preventDefault();
        $input.css({
            opacity: 0
        });
        $closeBtn.css({
            opacity: 0
        });
        $input
            .text('')
            .css({
                height: 0
            });
        setTimeout(function () {
            $input.css({
                height: 'auto'
            })
        }, 1000);
    });

    $(window).resize(function () {
        addRemoveSearchBar();
    });

    addRemoveSearchBar();

})(window, jQuery);
