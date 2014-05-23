require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'plugins/hoverIntent': {
            deps: ['jquery']
        }
    }
});

require([
    'jquery',
    'app',
    'env',
    'shims/storage'
], function ($, App) {
    'use strict';

    $(function () {

        var app = new App({

            debug: false,
            clearStorage: true,
            scrollSpeed: 50,

        });

        app.init();

        // search box

        var $searchWrapper = $('.search-wrapper'),
            $input = $('#userInput'),
            $searchBtn = $('#search');

        function addRemoveSearchBar(){
            if (app.env.isMobile() || $('.mobile').length) {
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
                // window.find(aString, aCaseSensitive, aBackwards, aWrapAround, aWholeWord, aSearchInFrames, aShowDialog);
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
            },
            mouseleave: function () {
                if ($input.text() == '') {
                    setTimeout(function () {
                        $input.css({
                            opacity: 0
                        });
                    }, 500);
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
                    }
                });
            },
            blur: function () {
                if ($input.text() == '') {
                    setTimeout(function () {
                        $input.css({
                            opacity: 0
                        });
                    }, 500);
                }
            }
        });

        $('#search').on({
            mouseenter: function () {
                $input.css({
                    opacity: 1
                });
            },
            click: function (e) {
                e.preventDefault();
                var term = $input.text();
                doSearch(term);
            }
        });

        $(window).resize(function(){
            addRemoveSearchBar();
        });

        addRemoveSearchBar();

    });

});
