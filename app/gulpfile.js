/* global __dirname */

var rootDir = process.env.PWD,
    settings = require('./gulpsettings.js'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    inject = require('gulp-inject'),
    templateCache = require('gulp-angular-templatecache'),
    // ngmin = require('gulp-ngmin'),
    // uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    // concat =  require('gulp-concat'),
    shell  = require('gulp-shell'),
    green = gutil.colors.green,
    cyan = gutil.colors.cyan,
    startLog = function (log) {
      return gutil.log(gutil.colors.bold(log));
    };

/**
 * Clean the build dir.
 */
gulp.task('_clean', function () {
  startLog(':: Cleaning the build directory');

  return gulp
    .src(settings.buildDir, {read: false})
    .pipe(clean());
});

/**
 * Build CSS files.
 */
gulp.task('_buildCSS', ['clean'], function () {
  startLog(':: Build CSS files');

  return gulp
    .src('./public/less/**/main.less')
    .pipe(less())
    .pipe(gulp.dest(settings.buildDir + '/css'));
});

/**
 * Compile CSS files.
 */
gulp.task('_compileCSS', ['clean'], function () {
  startLog(':: Compile CSS files');

  return gulp
    .src('./public/less/**/main.less')
    .pipe(less())
    .pipe(minifyCss())
    .pipe(gulp.dest(settings.buildDir + '/css'));
});

/**
 * Copy images to the build dir.
 */
gulp.task('_copyImages', ['clean'], function () {
  startLog(':: Copy images');

  return gulp
    .src('./public/images/**/*')
    .pipe(gulp.dest(settings.buildDir + '/images'));
});

/**
 * Copy fonts to the build dir.
 */
gulp.task('_copyFonts', ['clean'], function () {
  startLog(':: Copy fonts');

  return gulp
    .src('./public/fonts/**/*')
    .pipe(gulp.dest(settings.buildDir + '/fonts'));
});

/**
 * Lint the server JS files.
 */
gulp.task('_lintServer', function () {
  startLog(':: Lint server files');

  return gulp
    .src(settings.serverFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Lint the public JS files.
 */
gulp.task('_lintPublic', function () {
  startLog(':: Lint public files');

  return gulp
    .src('./public/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Build templates to Angular templates in the build dir.
 */
gulp.task('_buildTemplates', ['_clean'], function () {
  startLog(':: Build templates');
  return gulp
    .src('./public/templates/**/*.html')
    .pipe(templateCache({
      module: 'templates',
      standalone: true
    }))
    .pipe(gulp.dest(settings.buildDir + '/js'));
});

/**
 * Build JS files.
 */
gulp.task('_buildJS', ['clean', '_lintPublic'], function () {
  startLog(':: Build public JS');

  return gulp
    .src((settings.vendorFiles).concat('./public/js/**/*.js'))
    .pipe(gulp.dest(function (file) {
      return file.path
        .replace(__dirname + '/public', settings.buildDir)
        .split('/').slice(0, -1).join('/');
    }));
});

/**
 * Compile JS files.
 */
// gulp.task('_compileJS', ['clean', '_lintPublic'], function () {
//   startLog(':: Compile public JS');

//   return gulp
//     .src((settings.vendorFiles).concat(
//       './public/js/**/*.js'
//     ))
//     .pipe(ngmin())
//     .pipe(uglify())
//     .pipe(concat(settings.appName + '.js'))
//     .pipe(gulp.dest(settings.buildDir + '/js'));
// });
//
//

/**
 * Inject the builded assets in the main layout.
 */
gulp.task('_buildAssets',
  ['clean', '_buildCSS', '_buildTemplates', '_buildJS'], function () {
  startLog(':: Inject assets in the layout');

  return gulp
    .src(rootDir + '/app/views/_layout.html')
    .pipe(
      inject(gulp
        .src([
          settings.buildDir + '/vendor/**/*.js',
          settings.buildDir + '/js/**/*.js',
          settings.buildDir + '/css/main.css'
        ], { read: false }),
        {
          ignorePath: '/build'
        }
      )
    )
    .pipe(rename('layout.html'))
    .pipe(gulp.dest(rootDir + '/app/views'));
});

/**
 * Inject the compiled assets in the main layout.
 */
// gulp.task(
//   '_compileAssets',
//   ['clean', '_compileCSS', '_lintPublic', '_compileJS', '_compileImages'],
//   function () {

//   startLog(':: Inject assets in the layout');

//   return injectAssets(settings.binDir);
// });

/**
 * Watch the various files and runs their respective tasks.
 */
gulp.task('_watch', function () {
  gulp.watch(settings.serverFiles, ['_lintServer']);
  gulp.watch(settings.buildDir + '/../../views/_layout.html', ['build']);
  gulp.watch([
    'public/less/**/*.less',
    'public/templates/**/*.html',
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
 * Start the debugger
 */
gulp.task('_debug', shell.task(['node-inspector --web-port=8081']));

/**
 * Display some help.
 */
gulp.task('help', function() {
  gutil.log('');
  gutil.log(cyan('To install:') + ':');
  gutil.log(' - npm install');
  gutil.log(' - bower install');
  gutil.log(' - ./gulp build');
  gutil.log(' - ./gulp serve');

  gutil.log('');

  gutil.log(cyan('Available tasks') + ':');
  // gutil.log(' - ' + green('test') + ': launch Karma unittests');
  gutil.log(' - ' + green('watch') + ': watch JS and less files and trigger' +
    ' the build task on modifications');
  gutil.log(' - ' + green('build') + ': build less and JS files.');
  gutil.log(' - ' + green('compile') + ': compile (minify) less and JS files.');
  gutil.log(' - ' + green('watch') + ': watch files and build on modification.');
  gutil.log(' - ' + green('serve') + ': start the apps.');
  gutil.log(' - ' + green('debug') + ': launch node-inspector.');
  gutil.log('');
});

/**
 * Public tasks.
 */
gulp.task('default', ['help']);
gulp.task('clean', ['_clean']);
gulp.task('build', [
  '_buildCSS', '_lintPublic', '_buildJS', '_copyImages', '_copyFonts',
  '_buildAssets']);
gulp.task('compile', [
  '_compileCSS', '_lintPublic', '_compileJS', '_copyImages', '_copyFonts',
  '_compileAssets']);
gulp.task('watch', ['build', '_watch']);
gulp.task('serve', ['_serve']);
gulp.task('debug', ['_debug']);
