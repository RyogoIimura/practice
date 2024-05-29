const {
  src, dest, watch, series, parallel,
} = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');
const postcss = require('gulp-postcss');
const gulpCopy = require('gulp-copy')
const autoprefixer = require('autoprefixer');
const cssdeclsort = require('css-declaration-sorter');
const sassGlob = require('gulp-sass-glob');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const fibers = require('fibers');
const browserSync = require('browser-sync');
const rename = require('gulp-rename');
const connectPhp = require('gulp-connect-php');
sass.compiler = require('sass');

const minimist = require('minimist');

const options = minimist(process.argv.slice(2), {
  string: 'env',
  default: { env: 'development' },
});

const PROD = options.env === 'build';
const BREAKPOINT = 736;
const PROTOCOL = 'https';
const SERVER_NAME = '';

const CSS_DIR = 'assets/css/';
const JS_DIR = 'assets/js/';
const IMG_DIR = 'assets/images/';

const ROOT = './dist/';
const DIR = '';
const HOST_NAME = `${PROTOCOL}://${SERVER_NAME}`;
const CANONICAL_ROOT = `${HOST_NAME}`;

const errorHandler = (error) => {
  notifier.notify(
    {
      title: 'エラー発生！',
      message: error.message,
      sound: true,
    },
    () => {
      console.log(error.message);
    },
  );
};


const compilePug = (done) => {
  src(
    [
      'src/pug/**.pug',
      'src/pug/dir/**/**.pug',

      '!src/pug/**/**/_*/**.pug',
      '!src/pug/_*/**.pug',
      '!src/pug/_*/**/**.pug',
    ],
    { sourcemaps: PROD ? false : true },
  )
    .pipe(plumber({ errorHandler }))
    .pipe(
      pug({
        pretty: true,
        locals: {
          PROD,
          DIR,
          CSS_DIR: `${CSS_DIR}`,
          JS_DIR: `${JS_DIR}`,
          IMG_DIR: `${IMG_DIR}`,
          BREAKPOINT,
          CANONICAL_ROOT,
          now: new Date(),
        },
      }),
    )
    // .pipe(rename(path => path.extname = '.php'))
    .pipe(dest(`${ROOT}`) /* , { sourcemaps: './sourcemaps'} */);
  done();
};

const compileSass = (done) => {
  const postcssPlugins = [
    autoprefixer({
      cascade: false,
    }),
    cssdeclsort({ order: 'alphabetical' /* smacss, concentric-css */ }),
  ];
  src([
    'src/scss/**.scss',
    'src/scss/**/**.scss',

    '!src/scss/_*/_*/**.scss',
  ], { sourcemaps: false })
    .pipe(plumber({ errorHandler }))
    .pipe(sassGlob())
    .pipe(sass({
      fiber: fibers,
      outputStyle: 'compressed',
    }))
    .pipe(postcss(postcssPlugins))
    .pipe(gcmq())
    .pipe(cleanCSS({ rebase: false }))
    .pipe(dest(`${ROOT}assets/css/`) /* , { sourcemaps: './sourcemaps'} */);
  done(); // 終了宣言
};

const buildServer = (done) => {
  const PORT = 3000;

  connectPhp.server({
    base: ROOT,
    port: PORT,
  }, () => {
    browserSync.init({
      proxy: 'localhost:' + PORT,
      logLevel: 'silent',
      notify: false,
      startPath: DIR,
    })
  })

  done();
};


const browserReload = (done) => {
  browserSync.reload();
  done();
};

const watchFiles = () => {
  watch(['src/pug/*.pug'], series(compilePug, browserReload));
  watch(['src/pug/**/**/*.pug'], series(compilePug, browserReload));
  watch(['src/pug/_*/*.pug'], series(compilePug, browserReload));

  watch(['src/scss/*.scss'], series(compileSass, browserReload));
  watch(['src/scss/**/*.scss'], series(compileSass, browserReload));
  watch(['src/scss/_*/_*/*.scss'], series(compileSass, browserReload));

  watch(['src/js/*.js'], series(browserReload));
  watch(['src/js/**/*.js'], series(browserReload));
  watch(['src/js/_*/*.js'], series(browserReload));
};

if (PROD) {
  exports.default = series(
    parallel(compilePug, compileSass),
  );
} else {
  exports.default = series(
    parallel(compilePug, compileSass),
    parallel(buildServer, watchFiles),
  );
}
