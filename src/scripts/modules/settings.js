define(function (require) {

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
        chapterData:[],
        documentTitle:'Fiktion',
        bookSlug: ''
    };
});
