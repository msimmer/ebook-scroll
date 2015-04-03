var gulp = require('gulp'),
    browserify = require('browserify'),
    transform = require('vinyl-transform'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    // imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    requirejs = require('gulp-requirejs'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect');

var revision = '94c2378a-7d61-4c82-adb3-03cdd83967bd';

// var stylish = require('jshint-stylish');

gulp.task('browserify', function () {
    var browserified = transform(function (filename) {
        var b = browserify(filename);
        return b.bundle();
    });

    return gulp.src(['./app/scripts/main.js'])
        .pipe(plumber(function (error) {
            gutil.log(gutil.colors.red('Error: ' + error.message));
            this.emit('end');
        }))
        .pipe(browserified)
        // .pipe(uglify())
        .pipe(rename({
            suffix: '.' + revision
        }))
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe(sass({
            style: 'expanded',
            sourcemap: false
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(rename({
            suffix: '.' + revision
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('scripts', function () {
    return;
    // return gulp.src('app/scripts/*.js')
    //     .pipe(jshint('.jshintrc'))
    //     .pipe(jshint.reporter('jshint-stylish'));
    // .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function (cb) {
    del([
        // './dist/styles',
        './dist/scripts'
        // './dist/images',
        // './dist/data',
        // './dist/components'
    ], cb)
});

gulp.task('default', ['clean'], function () {
    gulp.start('styles', 'scripts');
});

gulp.task('watch', ['server'], function () {
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['browserify']);
    gulp.watch('app/images/**/*', ['images']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['./dist/**']).on('change', livereload.changed);
});

var filesToMove = [
    // './app/data/**/*.*',
    // './app/images/**/*.*',
    // './app/components/**/*.*',
    // './app/styles/fonts/**/*.*',
    // './app/*.png',
    // './app/*.html'
];

gulp.task('move', ['clean'], function () {
    gulp.src(filesToMove, {
            base: './app'
        })
        .pipe(gulp.dest('./dist'));
});

gulp.task('server', function () {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('build', ['clean', 'scripts', 'move'], function () {
    gulp.start('styles', 'browserify', 'server', 'watch');
});
