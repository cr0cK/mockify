var settings = require('./gulpsettings.js'),
    // async = require('async'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    inject = require('gulp-inject'),
    // uglify = require('gulp-uglify'),
    // watch = require('gulp-watch'),
    // minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    // concat =  require('gulp-concat'),
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
 * Build CSS files.
 */
gulp.task('_buildCSS', ['clean'], function () {
  startLog('Build CSS');
  return gulp
    .src('./public/less/**/main.less')
    .pipe(less())
    .pipe(gulp.dest('./build/static/css'));
});

/**
 * Lint the JS server files.
 */
gulp.task('_lintServer', ['clean'], function () {
  startLog('Lint server files');
  return gulp
    .src([
      'controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js',
      'app.js', 'config.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Buils JS files.
 */
gulp.task('_buildJS', ['clean', '_lintServer'], function () {
  startLog('Build public JS');
  return gulp
    .src((settings.vendorFiles).concat(
      './public/js/**/*.js'
    ))
    .pipe(gulp.dest('./build/static/js'));
});

/**
 * Build the base HTML template.
 */
gulp.task(
  '_buildAssets',
  ['clean', '_buildCSS', '_lintServer', '_buildJS'],
  function () {

  startLog('Create base.html');
  return gulp.src('./views/_layout.html')
    .pipe(
      inject(
        gulp.src([
          settings.buildDir + '/static/**/*.css',
          settings.buildDir + '/static/**/*.js'
        ], { read: false }),
        { ignorePath: '/build' }
      )
    )
    .pipe(rename('layout.html'))
    .pipe(gulp.dest('./views'));
});

// Watch the various files and runs their respective tasks
// gulp.task('watch', function () {
//   gulp.watch(paths.server, ['lintserver']);
//   gulp.watch(paths.client, ['lintclient']);
//   gulp.watch(paths.client, ['buildJs']);
//   gulp.watch('./public/less/**/*.less', ['buildCss']);
//   gulp
//     .src([
//       './views/**/*.html',
//       './public/css/**/*.min.css',
//       './public/js/**/*.min.js'
//     ])
//     .pipe(watch());
// });

gulp.task('_serve', shell.task([
  'nodemon -L --watch . --debug app.js'
]));

// gulp.task('lint', ['_lintServer']);
// gulp.task('build', ['_build'], function () {
//   gulp.start('_buildAssets');
// });

gulp.task('clean', ['_cleanBuild']);
gulp.task('build', ['_buildAssets']);

// gulp.task('buildJs', ['concatJs', 'uglify']);
// gulp.task('default', ['lint', 'buildCss', 'buildJs', 'watch']);

gulp.task('serve', ['_serve']);
