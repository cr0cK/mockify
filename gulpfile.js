var settings = require('./gulpsettings.js'),
    async = require('async'),
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
 * Lint the JS server files.
 */
var lint = function (next) {
  startLog('Lint server files');
  gulp
    .src([
      'controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js',
      'app.js', 'config.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));

  next();
};

/**
 * Lint the JS client files.
 */
// gulp.task('lintclient', function () {
//   gulp
//     .src(paths.client)
//     .pipe(jshint('.jshintrc'))
//     .pipe(jshint.reporter('jshint-stylish'));
// });

// Uglify the client/frontend javascript files
// gulp.task('uglify', function () {
//   gulp
//     .src(paths.client)
//     .pipe(uglify())
//     .pipe(rename({suffix: '.min'}))
//     .pipe(gulp.dest('./public/js'));
// });


/**
 * Build CSS files.
 */
var buildCSS = function (next) {
  startLog('Build CSS');
  gulp
    .src('./public/less/**/main.less')
    .pipe(less())
    .pipe(gulp.dest('./build/static/css'));

  next();
};

/**
 * Buils JS files.
 */
var buildJS = function (next) {
  startLog('Build public JS');
  gulp
    .src((settings.vendorFiles).concat(
      './public/js/**/*.js'
    ))
    .pipe(gulp.dest('./build/static/js'));

  next();
};

/**
 * Build the base HTML template.
 */
var buildAssets = function () {
  startLog('Create base.html');
  gulp.src('./views/_base.html')
    .pipe(
      inject(
        gulp.src([
          settings.buildDir + '/static/**/*.css',
          settings.buildDir + '/static/**/*.js'
        ], { read: false }),
        { ignorePath: '/build' }
      )
    )
    .pipe(rename('base.html'))
    .pipe(gulp.dest('./views'));
};

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

gulp.task('clean', ['_cleanBuild']);
// gulp.task('lint', ['_lintServer']);
// gulp.task('build', ['_build'], function () {
//   gulp.start('_buildAssets');
// });

gulp.task('build', function () {
  gulp.start('clean', function () {
    console.log('test');

    async.parallel([lint, buildCSS, buildJS], buildAssets);
  });
});

// gulp.task('buildJs', ['concatJs', 'uglify']);
// gulp.task('default', ['lint', 'buildCss', 'buildJs', 'watch']);

gulp.task('serve', ['_serve']);
