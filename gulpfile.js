/* global __dirname */

'use strict';

var rootDir         = process.env.PWD,
    settings        = require('./gulpsettings.js'),
    path            = require('path'),
    gulp            = require('gulp'),
    gutil           = require('gulp-util'),
    less            = require('gulp-less-sourcemap'),
    clean           = require('gulp-clean'),
    jshint          = require('gulp-jshint'),
    jscs            = require('gulp-jscs'),
    inject          = require('gulp-inject'),
    expect          = require('gulp-expect-file'),
    freeze          = require('gulp-freeze'),
    annotate        = require('gulp-ng-annotate'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    templateCache   = require('gulp-angular-templatecache'),
    minifyCss       = require('gulp-minify-css'),
    rename          = require('gulp-rename'),
    shell           = require('gulp-shell'),
    green           = gutil.colors.green,
    cyan            = gutil.colors.cyan,
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
    .pipe(less())
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
    .pipe(minifyCss({keepSpecialComments: 0}))
    .pipe(freeze())
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
 * Compile templates to Angular templates in the build dir.
 */
gulp.task('_compileTemplates', ['_clean'], function () {
  startLog(':: Build templates');
  return gulp
    .src('./www/templates/**/*.html')
    .pipe(templateCache({
      module: 'templates',
      standalone: true
    }))
    .pipe(annotate())
    .pipe(uglify())
    .pipe(freeze())
    .pipe(gulp.dest(settings.buildDir + '/js'));
});

/**
 * Build JS files.
 */
gulp.task('_buildJS',
  ['clean', '_lintServer', '_lintPublic', '_buildTemplates'], function () {
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
 * Copy vendors files.
 */
gulp.task('_copyVendors', ['clean'], function () {
  startLog(':: Copy vendors files');

  gulp
    .src(settings.vendorFiles)
    .pipe(expect(settings.vendorFiles));

  return gulp
    .src(settings.vendorFiles)
    .pipe(concat('vendors.js'))
    .pipe(annotate())
    .pipe(uglify())
    .pipe(freeze())
    .pipe(gulp.dest(settings.buildDir + '/js'));
});

/**
 * Compile JS files.
 */
gulp.task('_compileJS', ['clean', '_compileTemplates'], function () {
  startLog(':: Compile public JS');

  return gulp
    .src('./www/js/**/*.js')
    .pipe(concat('mockify.js'))
    .pipe(annotate())
    .pipe(uglify())
    .pipe(freeze())
    .pipe(gulp.dest(settings.buildDir + '/js'));
});

/**
 * Inject the builded assets in the main layout.
 */
gulp.task('_buildAssets', ['clean', '_buildCSS', '_buildJS'], function () {
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
 * Inject the compiled assets in the main layout.
 */
gulp.task('_compileAssets',
  ['clean', '_compileCSS', '_compileJS'], function () {
  startLog(':: Inject assets in the layout');

  return gulp
    .src(rootDir + '/http/views/_layout.html')
    .pipe(
      inject(gulp
        .src([].concat(
          settings.buildDir + '/css/**/*.css',
          settings.buildDir + '/js/vendors*.js',
          settings.buildDir + '/js/templates*.js',
          settings.buildDir + '/js/mockify*.js',
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
 * Start mockify.
 */
gulp.task('_start', shell.task([
  'nodemon -L --watch daemon --debug daemon/mockify.js'
]));

/**
 * Start mockify with a breakpoint at loading.
 */
gulp.task('_debug', shell.task([
  'nodemon -L --watch daemon --debug --debug-brk daemon/mockify.js'
]));

/**
 * Start the node-inspector.
 */
gulp.task('_inspector', shell.task(['node-inspector --web-port=8081']));

/**
 * Display some help.
 */
gulp.task('help', function() {
  gutil.log('');
  gutil.log(cyan('To install:') + ':');
  gutil.log(' - npm install');
  gutil.log(' - bower install');
  gutil.log(' - ./gulp build');
  gutil.log(' - ./gulp compile');
  gutil.log(' - ./gulp serve');

  gutil.log('');

  gutil.log(cyan('Available tasks') + ':');
  // gutil.log(' - ' + green('test') + ': launch Karma unittests');
  gutil.log(' - ' + green('watch') + ': watch JS and less files and trigger' +
    ' the build task on modifications');
  gutil.log(' - ' + green('build') + ': build less and JS files.');
  gutil.log(' - ' + green('compile') + ': minify less and JS files.');
  gutil.log(' - ' + green('start') + ': start mockify.');
  gutil.log(' - ' + green('debug') + ': start mockify with a breakpoint at ' +
    'loading.');
  gutil.log(' - ' + green('inspector') + ': start node-inspector.');
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
  '_compileCSS', '_compileJS', '_copyVendors',
  '_copyImages', '_copyFonts',
  '_compileAssets']);
gulp.task('watch', ['build', '_watch']);
gulp.task('start', ['_start']);
gulp.task('debug', ['_debug']);
gulp.task('inspector', ['_inspector']);
