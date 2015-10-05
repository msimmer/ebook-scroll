var gulp = require('gulp');
var transform = require('vinyl-transform');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var livereload = require('gulp-livereload');
var requirejs = require('gulp-requirejs');
var del = require('del');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var argv = require('yargs').argv;
var inject = require('gulp-inject');

var production = false;
var rev = '94c2378a-7d61-4c82-adb3-03cdd83967bd';

gulp.task('styles', function() {
  return gulp.src('src/styles/scss/main.scss')
    .pipe(sass({
      style: 'expanded',
      sourcemap: false
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifycss())
    .pipe(rename({
      suffix: '.' + rev
    }))
    .pipe(gulp.dest('src/styles'));
});

gulp.task('jslint', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function(cb) {
  del([
    'src/styles',
    'src/scripts',
    'src/images',
    'src/data',
    'src/components'
  ], cb)
});

gulp.task('watch', function() {
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch([
    'src/scripts/**/*.js',
    '!src/scripts/main.build.'+ rev +'.js'
  ], ['scripts']);
  gulp.watch('src/images/**/*', ['images']);
  // gulp.watch(['src/*.html', 'src/*.php'], ['index']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  var dir = production === true ? 'dist' : 'src';
  gulp.watch(dir + '/**').on('change', livereload.changed);
});

gulp.task('move', function() {
  var files = [
    './src/scripts/require.js',
    './src/data/**/*.*',
    './src/images/**/*.*',
    './src/components/**/*.*',
    './src/styles/fonts/**/*.*',
    './src/*.png',
    './src/*.html'
  ];
  gulp.src(files, {
      base: './src'
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('envProduction', function(){
  return production = true;
});

gulp.task('inject', function() {

  gulp.src('./src/index.html')
    .pipe(inject(gulp.src([
      'src/bower_components/jquery/jquery.min.js',
      'src/bower_components/requirejs/require.js',
      'src/scripts/main.build.'+rev+'.js',
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
          el = '<link rel="stylesheet" type="text/css" href="'+relpath+filepath+'">';
        } else if (type === 'js'){
          el = '<script type="text/javascript" src="'+relpath+filepath+'"></script>';
        }
        return el;
      }
    }))
    .pipe(gulp.dest('src'));
});

gulp.task('server', function() {
  connect.server({
    root: production === true ? './dist' : './src',
    livereload: true
  });
});

gulp.task('scripts', function() {
  return gulp.src(['./src/scripts/main.build.js'])
    .pipe(plumber(function(error) {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      this.emit('end');
    }))
    .pipe(requirejs({
      name: 'main',
      baseUrl: './src/scripts',
      out: './main.build.js',
      shim: {
        // standard require.js shim options
      },
      // ... more require.js options
    }))
    // .pipe(uglify())
    .pipe(rename({
      suffix: '.' + rev
    }))
    .pipe(gulp.dest('./src/scripts'));
});

gulp.task('serve', [
  'scripts',
  'styles',
  'inject',
  'server',
  'watch'
], function() {
  //
});

