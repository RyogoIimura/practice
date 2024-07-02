
## node-version
`v16.14.0`

## node_modules インストール
`yarn`
`npm i`

## 開発モード(これをしないと js がコンパイルされない)
`yarn start`
`npm run start`

## コンパイル
`npx gulp`
`npm run dev`

## 納品モード
`yarn build`

## 新規プロジェクト作成の際、変更する箇所(`new_project` は任意の名前)
### pug
   * src/pug/_data/`new_project`/data.pug
   * src/pug/dir/`new_project`/_modules/content.pug
   * src/pug/dir/`new_project`/index.pug
   * src/pug/_modules/header.pug

### scss
  * src/scss/dir/`new_project`.scss

### js
  * src/js/dir/`new_project`.js
