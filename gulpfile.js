/* global __dirname */

'use strict';

var rootDir = process.env.PWD,
    settings = require('./gulpsettings.js'),
    path = require('path'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    less = require('gulp-less-sourcemap'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    inject = require('gulp-inject'),
    expect = require('gulp-expect-file'),
    templateCache = require('gulp-angular-templatecache'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    shell  = require('gulp-shell'),
    green = gutil.colors.green,
    cyan = gutil.colors.cyan,
    startLog = function (log) {
      return gutil.log(gutil.colors.bold(log));
    };

gutil.log('');
gutil.log(gutil.colors.bold('Build dir: ' + settings.buildDir));
gutil.log('');

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
    .src('./www/less/**/main.less')
    .pipe(less({
      sourceMap: true
    }))
    .pipe(gulp.dest(settings.buildDir + '/css'));
});

/**
 * Compile CSS files.
 */
gulp.task('_compileCSS', ['clean'], function () {
  startLog(':: Compile CSS files');

  return gulp
    .src('./www/less/**/main.less')
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
    .src('./www/images/**/*')
    .pipe(gulp.dest(settings.buildDir + '/images'));
});

/**
 * Copy fonts to the build dir.
 */
gulp.task('_copyFonts', ['clean'], function () {
  startLog(':: Copy fonts');

  return gulp
    .src('./www/fonts/**/*')
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
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs({
       preset: 'crockford',
       validateIndentation: 2,
       requireMultipleVarDecl: null,
       disallowDanglingUnderscores: null
     }));
});

/**
 * Lint the public JS files.
 */
gulp.task('_lintPublic', function () {
  startLog(':: Lint public files');

  return gulp
    .src('./www/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs({
       preset: 'crockford',
       validateIndentation: 2,
       requireMultipleVarDecl: null,
       disallowDanglingUnderscores: null
     }));
});

/**
 * Build templates to Angular templates in the build dir.
 */
gulp.task('_buildTemplates', ['_clean'], function () {
  startLog(':: Build templates');
  return gulp
    .src('./www/templates/**/*.html')
    .pipe(templateCache({
      module: 'templates',
      standalone: true
    }))
    .pipe(gulp.dest(settings.buildDir + '/js'));
});

/**
 * Build JS files.
 */
gulp.task('_buildJS', ['clean', '_lintServer', '_lintPublic'], function () {
  startLog(':: Build public JS');

  gulp
    .src(settings.vendorFiles)
    .pipe(expect(settings.vendorFiles));

  return gulp
    .src([].concat(
      settings.vendorFiles,
      './www/js/**/*.js'
    ))
    .pipe(gulp.dest(function (file) {
      var p = file.path
        .replace(
          path.join(__dirname, 'www'),
          path.join(__dirname, settings.buildDir)
        )
        .split('/').slice(0, -1).join('/');

      return p;
    }));
});

/**
 * Inject the builded assets in the main layout.
 */
gulp.task('_buildAssets',
  ['clean', '_buildCSS', '_buildTemplates', '_buildJS'], function () {
  startLog(':: Inject assets in the layout');

  return gulp
    .src(rootDir + '/http/views/_layout.html')
    .pipe(
      inject(gulp
        .src([].concat(
          settings.vendorFiles,
          settings.buildDir + '/js/**/*.js',
          settings.buildDir + '/css/main.css'
        ), { read: false }),
        {
          ignorePath: ['/http-build/static', '/www'],
          addPrefix: '/static'
        }
      )
    )
    .pipe(rename('layout.html'))
    .pipe(gulp.dest(rootDir + '/http/views'));
});

/**
 * Watch the various files and runs their respective tasks.
 */
gulp.task('_watch', function () {
  gulp.watch(settings.serverFiles, ['_lintServer']);
  gulp.watch(rootDir + '/http/views/_layout.html', ['build']);
  gulp.watch([
    'www/less/**/*.less',
    'www/templates/**/*.html',
    'www/js/**/*.js'
  ], ['build']);
});

/**
 * Start procKr.
 */
gulp.task('_start', shell.task([
  'nodemon -L --watch . --debug daemon/procKr.js'
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
  gutil.log(' - ' + green('watch') + ': watch files and build on updates.');
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
  '_lintServer', '_lintPublic',
  '_buildCSS', '_buildJS',
  '_copyImages', '_copyFonts',
  '_buildAssets']);
gulp.task('compile', [
  '_compileCSS', '_compileJS',
  '_copyImages', '_copyFonts',
  '_compileAssets']);
gulp.task('watch', ['build', '_watch']);
gulp.task('start', ['_start']);
gulp.task('debug', ['_debug']);
