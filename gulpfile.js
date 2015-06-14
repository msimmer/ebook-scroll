var
    gulp = require('gulp'),
    browserify = require('browserify'),
    transform = require('vinyl-transform'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    // imagemin  = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    requirejs = require('gulp-requirejs'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect'),
    argv = require('yargs').argv,
    inject = require('gulp-inject')

production = !!(argv.production), // --production flag
    dist = !!(argv.production) ? '../wp-content/themes/Fiktion' : './dist';

var rev = '94c2378a-7d61-4c82-adb3-03cdd83967bd';

gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe(sass({
            style: 'expanded',
            sourcemap: false
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        // .pipe(gulp.dest(dist + '/styles'))
        .pipe(rename({
            suffix: '.' + rev
        }))
        .pipe(gulp.dest(dist + '/styles'));
});

gulp.task('jslint', function () {
    return gulp.src('app/scripts/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function (cb) {
    del([
        dist + '/styles',
        dist + '/scripts',
        dist + '/images',
        dist + '/data',
        dist + '/components'
    ], cb)
});

gulp.task('default', ['clean'], function () {
    gulp.start('styles', 'scripts');
});

gulp.task('watch', ['localServer'], function () {
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch(['app/*.html', 'app/*.php'], ['index']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch([dist + '/**']).on('change', livereload.changed);
});

var filesToMove = [
    './app/scripts/require.js',
    './app/data/**/*.*',
    './app/images/**/*.*',
    './app/components/**/*.*',
    './app/styles/fonts/**/*.*',
    './app/*.png',
    './app/*.html'
];

gulp.task('move', function () {
    gulp.src(filesToMove, {
            base: './app'
        })
        .pipe(gulp.dest(dist));
});

gulp.task('index', function () {

    var sources = gulp.src([
        dist + '/scripts/**/*.js',
        dist + '/styles/**/*.css',
        '!' + dist + '/styles/main.css'
    ], {
        read: false
    });

    gulp.src('./app/index.html')
        .pipe(inject(sources, {
            ignorePath: ['..', 'dist']
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('localServer', function () {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('scripts', function () {
    return gulp.src(['./app/scripts/main.build.js'])
        .pipe(plumber(function (error) {
            gutil.log(gutil.colors.red('Error: ' + error.message));
            this.emit('end');
        }))
        .pipe(requirejs({
            name: 'main',
            baseUrl: './app/scripts',
            out: './main.build.js',
            shim: {
                // standard require.js shim options
            },
            // ... more require.js options
        }))
        // .pipe(gulp.dest('./app/scripts')); // pipe it to the output DIR)
        // .pipe(uglify())
        .pipe(rename({
            suffix: '.' + rev
        }))
        .pipe(gulp.dest(dist + '/scripts'));
});

// gulp.task('build', ['clean', 'jslint', 'styles'], function () {
//     gulp.start(['move', 'scripts', 'index', 'localServer', 'watch']);
// });

gulp.task('serve', ['clean', 'jslint', 'styles'], function () {
    gulp.start(['move', 'scripts', 'index', 'localServer', 'watch']);
});
