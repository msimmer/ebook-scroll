# Ebook Scroll

## An Auto-Scrolling Ebook Reader in Your Browser.

Built on RequireJS. Check it out in action [here](http://fiktion.cc/book/?fiktion_uuid=7e9aa2c0-327f-45b3-85f7-0bb401d1c1ce).

## Installation

Clone the repository and install dependencies:

```
$ bower install
$ npm install
```

## Development

Ebook Scroll uses [Gulp](https://github.com/gulpjs/gulp) as a task runner.

```bash
$ gulp serve # Run a server at http://localhost:3000/
$ gulp build # Build the app into the dist/ folder
```

Check out `gulpfile.js` for a full list of tasks.

Ebook Scroll uses runs an [express](https://github.com/expressjs/express) server for development, and serves most static assets from an `/assets` path. This simplifies the development process in that pretty much all resources resolve to `/assets`:

```js
// config.js
require.config({
  baseUrl: 'javascripts',
  paths: {
    'jquery': '../bower_compontents/jquery/dist/jquery.min',
    ...
```

becomes

```js
// config.js
require.config({
  baseUrl: 'javascripts',
  paths: {
    'jquery': '/assets/jquery/dist/jquery.min',
    ...
```

## Notes

Ebook Scroll was developed for ebooks, but will load any `html` files in the `resources` folder as long as they're properly mapped in `data/books.json`. A sample folder structure would be

```
resources
  ├── test-one
  │   └── Text
  │       ├── chapter-one.html
  │       ├── chapter-two.html
  │       └── chapter-three.html
  └── book-two
      └── Text
          ...
```

And in `data/books.json`

```json
[{
  "uuid": "1",
  "components": [{
    "title": "Chapter One",
    "src": "/assets\/test-book\/Text\/chapter-one.html"
  }, {
    "title": "Chapter Two",
    "src": "/assets\/test-book\/Text\/chapter-two.html"
  }, {
    "title": "Chapter Three",
    "src": "/assets\/test-book\/Text\/chapter-three.html"
  }]
}, {
  "uuid": "2",
  "components": [{

  }]
}]
```

## TODOs

- Create `gulp` task to generate JSON data in `books.json` for adding new books
- Inject scoped global styles, as well as custom page/chapter styles

## Pull Requests

Are welcome! :)

## Browser Support

The current list of tested browsers or operating systems.

### Desktop
- Safari 5.1 +
- Firefox 10.0 +
- Chrome 14.0 +
- IE 10.0 +

### iOS
- iOS 4.2 +

### Android
- 4.0 +

### Other
- Kindle Fire 2

---

This project is made possible by support from the Haus der Kulturen der Welt (Berlin), and is financed by a grant from the German Federal Cultural Foundation.

![Kulturstiftung des Bundes](gh-assets/images/ksb.jpg)

![HKW](gh-assets/images/hkw.png)
