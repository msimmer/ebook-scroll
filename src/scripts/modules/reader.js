define(function() {
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
