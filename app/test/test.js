$(function () {

    var ids = $([]).pushStack($('h1,h2,h3,h4,h4'));
    var scrollTop = $(window).scrollTop();
    var currentPos = false;
    var pagination = {
        currentPos: false,
        chapters: $.map(ids, function (obj, i) {
            $(obj).data({
                chapter: i,
                posTop: ids[i].offsetTop,
                firstEl: i === 0 ? true : false,
                lastEl: i === ids.length - 1 ? true : false,
                prevEl: i - 1 > -1 ? ids[i - 1] : null,
                nextEl: i + 1 <= ids.length - 1 ? ids[i + 1] : null,
                prevPos: i - 1 > -1 ? ids[i - 1].offsetTop : 0,
                nextPos: i + 1 <= ids.length - 1 ? ids[i + 1].offsetTop : ids[i].offsetTop,
                currentEl: false
            });

            if ($(obj).context.offsetTop >= scrollTop && !currentPos) {
                $(obj).data().currentEl = true;
                currentPos = $(obj).context.offsetTop;
            }

            for (var i in $(obj).data()) {
                if (typeof $(obj).data()[i] !== 'object') {
                    $(obj).attr('data-' + i, $(obj).data()[i]);
                }
            }

            return $(obj);
        })
    };

    pagination.currentPos = currentPos;
    // console.log(pagination);

    var navPrev = function(){

    };

    var navNext = function(){

    };

    var $prev = $('<div/>', {
        id: 'chapter-prev',
        css: {
            position: 'fixed',
            height: 30,
            width: 30,
            backgroundColor: 'coral',
            top: 0,
            left: 0,
            cursor: 'pointer'
        }
    }).on({
        click: function (e) {
            navPrev();
        }
    });
    var $next = $('<div/>', {
        id: 'chapter-next',
        css: {
            position: 'fixed',
            height: 30,
            width: 30,
            backgroundColor: 'blue',
            top: 0,
            right: 0,
            cursor: 'pointer'
        }
    }).on({
        click: function (e) {
            navNext();
        }
    });

    $prev.appendTo('body');
    $next.appendTo('body');

});
