const  path = require('path');
const  glob = require("glob");
const TerserPlugin = require("terser-webpack-plugin");

const SRC_PATH    = path.resolve(__dirname, 'src/babel/dir/');
const DIST_PATH = path.resolve(__dirname, 'dist/assets/js/');

const entries = glob.sync("**/*.js", {
  ignore: ["_*/**.js", "**/_*/**.js", "_*/**/**.js"],
  cwd: SRC_PATH,
}).map(key => {
  return [key, path.resolve(SRC_PATH, key)]// [ '**/*.js' , './src/**/*.js' ]という形式の配列になる
}).reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",
  watch: false,
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },

  entry: entries,

  // ファイルの出力設定
  output: {
    // 出力ファイル名
    // path: DIST_PATH,
    filename: "[name]"
  },

  // babel
  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        use: [
          {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2020 を ES5 に変換
                '@babel/preset-env',
              ]
            }
          }
        ]
      }
    ]
  },
  // ES5(IE11等)向けの指定
  target: ["web", "es5"],

  // optimization: {
  //   splitChunks: {
  //     name: 'vendor.js',
  //     chunks : 'initial',
  //   },
  //   // LICENSE.txtを出力させない
  //   minimizer: [new TerserPlugin({
  //     extractComments: false,
  //   })],
  // },
};
