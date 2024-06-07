const { src, dest, watch, series, parallel } = require("gulp");
// 直列処理(順番に処理):series(), 並列処理（順番を問わない）:parallel()
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const notifier = require('node-notifier');
const sassGlob = require('gulp-sass-glob'); // @importを纏めて指定
const browserSync = require('browser-sync');
const minimist = require("minimist");
const gcmq = require('gulp-group-css-media-queries'); // media queryを纏める
const mode = require('gulp-mode')({
  modes: ['production', 'development'], // 本番実装時は 'gulp --production'
  default: 'development',
  verbose: false,
})

const errorHandler = function (error) {
  notifier.notify({
    title: 'エラー発生！',
    message: error.message,
    sound: true
  }, function () {
    console.log(error.message);
  });
};

notifier.notify({
  title: 'Gulp',
  message: 'watchを開始します！',
});


const options = minimist(process.argv.slice(2), {
  string: 'env',
  default: { env: 'development' }
});

const isProduction = options.env === 'prod'; // リリース時ならtrue
const isTestup = options.env === 'testup'; // リリース時ならtrue

let DEV_MODE = true;
let ITEM_API = false;
if(isProduction){
  DEV_MODE = false
  ITEM_API = true
}
if(isTestup){
  ITEM_API = true
}
let CDN = '';
if (!DEV_MODE) {
  CDN = '//cdn1.beams.co.jp';
}

// const CONTENT_NAME = "prj-name";

const PORT = 3000,
  WATCH_INTERVAL = 800,
  PROTOCOL = 'https',
  SERVER_NAME = '',
  // SERVER_NAME = 'www.beams.co.jp',
  HOST_NAME = PROTOCOL + '://' + SERVER_NAME,

  ROOT = 'dist',
  DIR = '',
  // DIR = "/special/"+CONTENT_NAME,
  CANONICAL_ROOT = HOST_NAME + (DIR ? DIR : ''),

  INDEX_DIR = ROOT + DIR,
  CSS_DIR = "/assets/css/",
  JS_DIR = "/assets/js/",
  IMG_DIR = "/assets/images/",
  BREAKPOINT = 768;

  DATE = new Date().getTime();


////////////// pug //////////////////// -->
const compilePug = done => {
  src(['src/pug/dir/**/*.pug', '!src/pug/_**/*.pug', '!src/pug/**/_**/*.pug', '!src/pug/**/_*.pug'])
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(pug({
      pretty: false,
      locals: {
        DIR: DIR,
        CSS_DIR: CSS_DIR,
        JS_DIR: JS_DIR,
        IMG_DIR: IMG_DIR,
        BREAKPOINT: BREAKPOINT,
        CANONICAL_ROOT: CANONICAL_ROOT,
        DEV_MODE: DEV_MODE,
        CDN: CDN,
        ITEM_API: ITEM_API,
        DATE: DATE
      }
    }))
    .pipe(dest(INDEX_DIR));

  done(); // 終了宣言
}


////////////// sass //////////////////// -->
const compileSass = done => {
  src(["src/scss/dir/**/**.scss"])
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(sassGlob())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(
      postcss([
        autoprefixer({
          cascade: false,
          grid: true
        })
      ])
    )
    // .pipe(mode.production(gcmq()))
    .pipe(dest(INDEX_DIR));

  done(); // 終了宣言
}


////////////// webpack //////////////////// -->
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
// webpackの設定ファイルの読み込み
const webpackConfigDev = require("./webpack.config");
// const webpackConfigDev = require('./webpack.dev');
const webpackConfigProd = require('./webpack.prod');
const webpackConfig = isProduction || isTestup ? webpackConfigProd : webpackConfigDev;

const bundleJs = () => {
  // webpackStreamの第2引数にwebpackを渡す
  return webpackStream(webpackConfig, webpack)
    .pipe(plumber({ errorHandler: errorHandler }))
    .on('error', function (e) {
      this.emit('end');
      errorHandler(e);
    })
    .pipe(dest(INDEX_DIR));
};




////////////// server //////////////////// -->
const watchServer = done => {
  browserSync({
    files: ROOT+'/**/*',
    startPath: DIR,
    reloadDelay: WATCH_INTERVAL,
    server: {
      baseDir: ROOT // ルートとなるディレクトリを指定
    }
  });

  done();
}

// ブラウザ自動リロード
const browserReload = (done) => {
  browserSync.reload();
  done();
};


// ファイル監視
const watchFiles = () => {
  watch(['src/pug/**/*.pug'], series(compilePug))
  watch(['src/scss/**/*.scss','src/scss/**/*.sass','src/scss/**/*.css',], series(compileSass))
  watch(['src/babel/**/*.js',], series(bundleJs,browserReload))
}

exports.default = parallel(watchServer,watchFiles,compilePug,compileSass,bundleJs);
