var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var requirejs = require('gulp-requirejs');
var del = require('del');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var inject = require('gulp-inject');

var production = false;
var rev = '4322051a-c267-463c-9541-bc2ba1d3334a';
var dirName = function() {
  return production === true ? 'dist' : 'src';
};

gulp.task('styles', function() {
  var sassStyle = production === true ? 'compressed' : 'expanded';
  var dir = dirName();
  return gulp.src('src/styles/scss/main.scss')
    .pipe(sass({
      outputStyle: sassStyle,
      sourcemap: false
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({
      suffix: '.' + rev
    }))
    .pipe(gulp.dest(dir + '/styles'));
});

gulp.task('jslint', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function() {
  del('dist/')
});

gulp.task('watch', function() {
  var dir = dirName();
  gulp.watch(dir + '/styles/**/*.scss', ['styles']);
  gulp.watch([
    dir + '/scripts/**/*.js',
    '!' + dir + '/scripts/main.build.' + rev + '.js'
  ], ['scripts']);
  gulp.watch(dir + '/images/**/*', ['images']);

  livereload.listen();
  gulp.watch(dir + '/**').on('change', livereload.changed);
});

gulp.task('copy', ['scripts', 'styles'], function() {
  // main.build.js is copied by `uglify` task
  // main.build.css is copied by `styles` task
  //
  var files = [
    'src/scripts/require.js',
    'src/data/**/*.*',
    'src/images/**/*.*',
    'src/components/**/*.*',
    'src/styles/fonts/**/*.*',
    'src/*.png',
    'src/*.html'
  ];
  gulp.src(files, {
      base: 'src'
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('envProduction', function() {
  return production = true;
});

gulp.task('inject', function() {
  gulp.src('./src/index.html')
    .pipe(inject(gulp.src([
      'src/bower_components/jquery/jquery.min.js',
      'src/bower_components/requirejs/require.js',
      'src/scripts/main.build.' + rev + '.js',
      'src/styles/main.css',
      'src/styles/**/*.css'
    ], {
      read: false
    }), {
      ignorePath: [
        '..',
        'src'
      ],
      relative: false,
      transform: function(filepath, file, i, length) {
        var relpath = production === true ? '/wp-content/themes/Fiktion' : '';
        var type = null !== filepath.match(/\.js$/) ? 'js' : 'css';
        var el;
        if (type === 'css') {
          el = '<link rel="stylesheet" type="text/css" href="' + relpath + filepath + '">';
        } else if (type === 'js') {
          el = '<script type="text/javascript" src="' + relpath + filepath + '"></script>';
        }
        return el;
      }
    }))
    .pipe(gulp.dest('src'));
});

gulp.task('server', function() {
  var dir = dirName();
  connect.server({
    root: dir,
    livereload: true
  });
});

gulp.task('scripts', function() {
  return gulp.src('./src/scripts/main.build.js')
    .pipe(plumber(function(error) {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      this.emit('end');
    }))
    .pipe(requirejs({
      name: 'main',
      baseUrl: './src/scripts',
      out: './main.build.js'
    }))
    .pipe(rename({
      suffix: '.' + rev
    }))
    .pipe(gulp.dest('./src/scripts'));
});

gulp.task('uglify', ['copy'], function() {
  return gulp.src('src/scripts/main.build.' + rev + '.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('serve', [
  'scripts',
  'styles',
  'inject',
  'server',
  'watch'
], function() {});

gulp.task('build', [
  'envProduction',
  'clean',
  'styles',
  'scripts',
  'inject',
  'copy',
  'uglify'
], function() {});
