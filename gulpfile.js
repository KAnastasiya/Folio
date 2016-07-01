'use strict';

let gulp = require('gulp'),
    browserSync = require('browser-sync'),
    ncu = require('npm-check-updates');

let plugins = require('gulp-load-plugins')();

// HTML
gulp.task('pug', () => {
  return gulp.src('src/pug/*.pug')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.pug())
  .pipe(gulp.dest('src/'));
});

gulp.task('html', ['pug'], () => {
  gulp.src('src/*.html')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.htmlhint.reporter('htmlhint-stylish'))
  .pipe(plugins.htmlhint.failReporter({ suppress: true }));
});

// Styles
gulp.task('scss', () => {
  return gulp.src('src/scss/styles.scss')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass())
  .pipe(plugins.autoprefixer(['last 3 versions', '> 1%'], { cascade: true }))
  .pipe(plugins.sourcemaps.write())
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('css', ['scss'], () => {
  return gulp.src('src/css/styles.css')
    .pipe(plugins.csscomb())
    .pipe(plugins.csslint())
    .pipe(plugins.csslint.reporter())
    .pipe(plugins.cssnano())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest('src/css'));
});

// Scripts
gulp.task('babel', () => {
  return gulp.src('src/js/es2015/*.js')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.babel({ presets: ['es2015'] }))
  .pipe(plugins.eslint({ rulePaths: ['/'] }))
  .pipe(plugins.eslint.format())
  .pipe(plugins.eslint.failAfterError())
  .pipe(gulp.dest('src/js/commonJS'));
});

gulp.task('concat', ['babel'], function() {
  return gulp.src(['src/js/commonJS/slider.js', 'src/js/commonJS/navigation.js'])
    .pipe(plugins.concat('common.js'))
    .pipe(gulp.dest('src/js/commonJS'));
});

gulp.task('script', ['concat'], function() {
  return gulp.src(['src/js/commonJS/common.js', 'src/js/commonJS/contact.js', 'src/js/commonJS/portfolio.js'])
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest('src/js'));
});

// Utils
gulp.task('browserSync', () => {
  browserSync({
    server: { baseDir: 'src' },
    notify: false
  });
});

gulp.task('clear', () => {
  return plugins.cache.clearAll();
});

// Watch
gulp.task('watch', ['html', 'css', 'script', 'browserSync'], () => {
  gulp.watch('src/pug/*.pug', ['html', 'css', browserSync.reload]);
  gulp.watch('src/scss/*.scss', ['css', browserSync.reload]);
  gulp.watch('src/js/*.js', ['script', browserSync.reload]);
});

// Build
gulp.task('build', ['html', 'css', 'script'], () => {
  let buildFonts = gulp.src('src/fonts/*')
  .pipe(gulp.dest('./fonts'));

  let buildImg = gulp.src('src/img/**/*')
  .pipe(gulp.dest('./img'));

  let buildHtml = gulp.src('src/*.html')
  .pipe(gulp.dest('./'));

  let buildCss = gulp.src('src/css/styles.min.css')
  .pipe(gulp.dest('./css'));

  let buildScripts = gulp.src('src/js/*.js')
  .pipe(gulp.dest('./js'));
});

// Update the plugins
gulp.task('updates', function(cb) {
  ncu.run({
    packageFile: 'package.json',
    silent: true,
    upgrade: true,
    jsonUpgraded: true
  }).then(function(upgraded) {
    console.log('\n\nDEPENDENCIES TO BE UPDATED:\n', upgraded);
    cb();
  });
});
