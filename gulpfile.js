const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const webpack = require('webpack-stream');
const named = require('vinyl-named');
const plugins = require('gulp-load-plugins')();

const SRC = 'src';
const PUBLIC = './';


// Pug
gulp.task('pug', (done) => {
  gulp
    .src(`${SRC}/*.pug`)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError(),
    }))
    .pipe(plugins.pug())
    .pipe(gulp.dest(PUBLIC));
  done();
});


// Styles
gulp.task('scss', (done) => {
  gulp
    .src(`${SRC}/*.scss`)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError(),
    }))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      includePaths: require('node-normalize-scss').includePaths,
    }))
    .pipe(plugins.autoprefixer(
      ['last 3 versions', '> 1%'],
      { cascade: true }
    ))
    .pipe(plugins.cssnano())
    .pipe(plugins.rename({
      suffix: '.min',
    }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(PUBLIC));
  done();
});


// Scripts
gulp.task('js', () =>
  gulp
    .src(`${SRC}/*.js`)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError(err => ({
        title: 'Webpack',
        message: err.message,
      })),
    }))
    .pipe(named())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(plugins.rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest(PUBLIC))
);


// Images
gulp.task('img', () =>
  gulp
    .src([`${SRC}/blocks/**/img/**/*`, `${SRC}/img/**/*`])
    .pipe(plugins.imagemin([
      imageminJpegRecompress({
        loops: 4,
        min: 50,
        max: 65,
        quality: 'high',
        strip: true,
        progressive: true,
      }),
      imageminPngquant({
        quality: '50-80',
      })
    ]))
    .pipe(gulp.dest(`${PUBLIC}/img`))
);


// Copy fonts
gulp.task('fonts', () =>
  gulp
    .src([`${SRC}/fonts/**/*`])
    .pipe(gulp.dest(`${PUBLIC}/fonts`))
);


// Copy all
gulp.task('copy', gulp.parallel('fonts'));


// Clean
gulp.task('cleanImg', () => del(`${PUBLIC}/img`));
gulp.task('cleanFonts', () => del(`${PUBLIC}/fonts`));

gulp.task('clean', gulp.parallel('cleanImg', 'cleanFonts'));


// Server
gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: PUBLIC,
      index: 'index.html',
    },
    port: 8800,
    open: false,
    reloadOnRestart: true,
  });
});


// Watch
gulp.task('watch', () => {
  gulp.watch([
    `${SRC}/*.pug`,
    `${SRC}/blocks/**/*.pug`,
    `${SRC}/pug/*.pug`,
  ]).on('change', gulp.series('pug', browserSync.reload));

  gulp.watch([
    `${SRC}/*.scss`,
    `${SRC}/blocks/**/*.scss`,
    `${SRC}/scss/*.scss`,
  ]).on('change', gulp.series('scss', browserSync.reload));

  gulp.watch([
    `${SRC}/*.js`,
    `${SRC}/blocks/**/*.js`,
    `${SRC}/js/*.js`,
  ]).on('change', gulp.series('js', browserSync.reload));

  gulp.watch([
    `${SRC}/blocks/**/img/*`,
    `${SRC}/img/*`,
  ]).on('change', gulp.series('cleanImg', 'img', browserSync.reload));

  gulp.watch(`${SRC}/fonts/**/*`).on('change', gulp.series('cleanFonts', 'fonts', browserSync.reload));
});


// Default
gulp.task('default', gulp.series(
  gulp.parallel('clean'),
  gulp.parallel('img', 'pug', 'scss', 'js', 'copy'),
  gulp.parallel('server', 'watch')
));
