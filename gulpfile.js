var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var requirejs = require('gulp-requirejs');
var del = require('del');
var plumber = require('gulp-plumber');
var inject = require('gulp-inject');
var express = require('express');
var path = require('path');

var production = false;
var rev = '4322051a-c267-463c-9541-bc2ba1d3334a';

var serverport = 3000;
var server = express();
// Map asset paths to `assets/`, e.g.,
// ../bower_components/requirejs/require.js -> /assets/requirejs/require.js
//
server.use(express.static(path.join(__dirname, 'src/')));
server.use('/data', express.static(path.join(__dirname, 'data/')));
server.use('/assets', express.static(path.join(__dirname, 'resources/')));
server.use('/assets', express.static(path.join(__dirname, 'bower_components/')));
server.use('/assets', express.static(path.join(__dirname, 'src/')));

gulp.task('styles', function () {
  var sassStyle = production === true ? 'compressed' : 'expanded';
  return gulp.src('src/stylesheets/scss/main.scss')
    .pipe(sass({
      outputStyle: sassStyle,
      sourcemap: false
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({
      suffix: '.' + rev
    }))
    .pipe(gulp.dest('src/stylesheets'));
});

gulp.task('jshint', function () {
  return gulp.src('src/javascripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function () {
  del(['dist/', '.tmp/']);
});

gulp.task('watch', function () {
  gulp.watch([
    'src/javascripts/**/*.js',
    '!src/javascripts/main.build.' + rev + '.js'
  ], ['scripts']);
  gulp.watch('src/stylesheets/**/*.scss', ['styles']);
});

gulp.task('copy', ['scripts', 'styles'], function () {
  // main.build.js is copied by `uglify` task
  // main.build.css is copied by `styles` task
  //
  var files = [
    'src/javascripts/require.js',
    'src/data/**/*.*',
    'src/images/**/*.*',
    'src/components/**/*.*',
    'src/stylesheets/fonts/**/*.*',
    'src/*.png',
    'src/*.html'
  ];
  gulp.src(files, {
      base: 'src'
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('envProduction', function () {
  production = true;
  return production;
});

gulp.task('inject', function () {
  gulp.src('./src/index.html')
    .pipe(inject(gulp.src([
      'src/stylesheets/main.css',
      'src/stylesheets/**/*.css'
    ], {
      read: false
    }), {
      ignorePath: [
        '..',
        'src'
      ],
      relative: false,
      transform: function (filepath, file, i, length) {
        return '<link rel="stylesheet" type="text/css" href="/assets' + filepath + '">';
      }
    }))
    .pipe(gulp.dest('src'));
});

gulp.task('connect', function () {
  server.listen(serverport);
  gutil.log(gutil.colors.green('Listening on http://localhost:' + serverport));
});

gulp.task('scripts', function () {
  return gulp.src('./src/javascripts/main.build.js')
    .pipe(plumber(function (error) {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      this.emit('end');
    }))
    .pipe(requirejs({
      name: 'main',
      baseUrl: './src/javascripts',
      out: './main.build.js'
    }))
    .pipe(rename({
      suffix: '.' + rev
    }))
    .pipe(gulp.dest('./src/javascripts'));
});

gulp.task('uglify', ['copy'], function () {
  return gulp.src('src/javascripts/main.build.' + rev + '.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/javascripts'));
});

gulp.task('depends', function () {
  // madge --circular ./src/javascripts/
  // madge --format amd --image map.png --require-config ./src/javascripts/config.js ./src/javascripts/
});

gulp.task('serve', [
  'scripts',
  'styles',
  'inject',
  'connect',
  'watch'
], function () {});

gulp.task('build', [
  'envProduction',
  'clean',
  'styles',
  'scripts',
  'inject',
  'copy',
  'uglify'
], function () {});
