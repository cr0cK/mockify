var settings = require('./gulpsettings.js'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    inject = require('gulp-inject'),
    ngmin = require('gulp-ngmin'),
    uglify = require('gulp-uglify'),
    // watch = require('gulp-watch'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat =  require('gulp-concat'),
    shell  = require('gulp-shell'),
    startLog = function (log) {
      return gutil.log(':: ' + gutil.colors.bold(log));
    };

/**
 * Clean the build dir.
 */
gulp.task('_cleanBuild', function () {
  startLog('Cleaning the build directory');
  return gulp
    .src(settings.buildDir, {read: false})
    .pipe(clean());
});

/**
 * Clean the bin dir.
 */
gulp.task('_cleanBin', function () {
  startLog('Cleaning the bin directory');
  return gulp
    .src(settings.binDir, {read: false})
    .pipe(clean());
});

/**
 * Build CSS files.
 */
gulp.task('_buildCSS', ['clean'], function () {
  startLog('Build CSS files');
  return gulp
    .src('./public/less/**/main.less')
    .pipe(less())
    .pipe(gulp.dest(settings.buildDir + '/static/css'));
});

/**
 * Compile CSS files.
 */
gulp.task('_compileCSS', ['clean'], function () {
  startLog('Compile CSS files');
  return gulp
    .src('./public/less/**/main.less')
    .pipe(less())
    .pipe(minifyCss())
    .pipe(gulp.dest(settings.binDir + '/static/css'));
});

/**
 * Lint the server JS files.
 */
gulp.task('_lintServer', function () {
  startLog('Lint server files');
  return gulp
    .src(settings.serverFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Lint the public JS files.
 */
gulp.task('_lintPublic', function () {
  startLog('Lint public files');
  return gulp
    .src('./public/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Build JS files.
 */
gulp.task('_buildJS', ['clean', '_lintPublic'], function () {
  startLog('Build public JS');
  return gulp
    .src((settings.vendorFiles).concat(
      './public/js/**/*.js'
    ))
    .pipe(gulp.dest(settings.buildDir + '/static/js'));
});

/**
 * Compile JS files.
 */
gulp.task('_compileJS', ['clean', '_lintPublic'], function () {
  startLog('Compile public JS');
  return gulp
    .src((settings.vendorFiles).concat(
      './public/js/**/*.js'
    ))
    .pipe(ngmin())
    .pipe(uglify())
    .pipe(concat(settings.appName + '.js'))
    .pipe(gulp.dest(settings.binDir + '/static/js'));
});

var injectAssets = function (dir) {
  return gulp.src('./views/_layout.html')
    .pipe(
      inject(
        gulp.src([
          dir + '/static/**/*.css',
          dir + '/static/**/*.js'
        ], { read: false }),
        { ignorePath: dir.substr(1) }
      )
    )
    .pipe(rename('layout.html'))
    .pipe(gulp.dest('./views'));
};

/**
 * Inject the builded assets in the main layout.
 */
gulp.task(
  '_buildAssets',
  ['clean', '_buildCSS', '_lintPublic', '_buildJS'],
  function () {

  startLog('Inject assets in the layout');
  return injectAssets(settings.buildDir);
});

/**
 * Inject the compiled assets in the main layout.
 */
gulp.task(
  '_compileAssets',
  ['clean', '_compileCSS', '_lintPublic', '_compileJS'],
  function () {

  startLog('Inject assets in the layout');
  return injectAssets(settings.binDir);
});

// Watch the various files and runs their respective tasks
gulp.task('_watch', function () {
  gulp.watch(settings.serverFiles, ['_lintServer']);
  gulp.watch([
    'public/less/**/*.less',
    'public/js/**/*.js'
  ], ['build']);

  // gulp
  //   .src([
  //     './views/**/*.html',
  //     './public/css/**/*.min.css',
  //     './public/js/**/*.min.js'
  //   ])
  //   .pipe(watch());
});

/**
 * Start a local server.
 */
gulp.task('_serve', shell.task([
  'nodemon -L --watch . --debug app.js'
]));

/**
 * Public tasks.
 */
gulp.task('clean', ['_cleanBuild', '_cleanBin']);
gulp.task('build', ['_buildAssets']);
gulp.task('compile', ['_compileAssets']);
gulp.task('watch', ['build', '_watch']);
gulp.task('serve', ['_serve']);
