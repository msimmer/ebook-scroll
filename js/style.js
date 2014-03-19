App = App || {};
$.extend(App, {
    baseStyles: {
        body: {
            'fSize': App.readerData.defaultFontSize + 'px'
        },
        h1: {
            'fSize': '2.3em'
        },
        h2: {
            'fSize': '1.7em'
        },
        h3: {
            'fSize': '1.3em'
        },
        h4: {
            'fSize': '1.1em'
        },
        h5: {
            'fSize': '1em'
        },
        h6: {
            'fSize': '1em'
        },
        p: {
            'fSize': '1em'
        }
    },
    textElements: ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'plaintext', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'],
    removeElementStyles: function() {
        var that = this;
        var textCss = {};
        var textCss = {
            fontSize: '',
            lineHeight: '',
            color: '',
            textDecoration: '',
            backgroundColor: 'transparent'
        };
        $.each(that.textElements, function(i, o) {
            that.el.find(o).css(textCss);
        });
    },
    setStyles: function() {
        var that = this;
        $.each(that.baseStyles, function(i, o) {
            that.el.find(i).css('font-size', o.fSize);
        });
        var mainCss = {};
        var mainCss = {
            'font-size': this.readerData.fSize + '%',
            'line-height': '1.2'
        };
        this.el.css(mainCss);
        $('html,body,main').css({
            '-webkit-transition': 'background-color 150ms ease-out', // contrast toggle
            '-moz-transition': 'background-color 150ms ease-out',
            '-o-transition': 'background-color 150ms ease-out',
            'transition': 'background-color 150ms ease-out'
        });
    }
});
