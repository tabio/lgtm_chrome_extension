### 概要
LGTM用の画像をFlickr API経由で取得するchromeの拡張機能

### 事前準備
- Flickr
  - [Flickr API Key](https://www.flickr.com/services/apps/create/apply/)を取得しておく
  - `js/lttm.js`内の`flickr_api_key`を自分のものに置き換える

- Tumblr
  - [Tumblr Consumr Key](https://syncer.jp/tumblr-api-matome)を取得しておく
  - `js/lttm.js`内の`tumblr_cunsumer_key`を自分のものに置き換える

- Google
  - Google Custom Search APIを設定しておく
  - [参考](http://qiita.com/onlyzs/items/c56fb76ce43e45c12339)
  - [参考](http://qiita.com/megu_ma/items/8cad39f61e35588e5476)
  - `js/lttm.js`内の`google_engine_id`と`google_api_key`を自分のものに置き換える

### 使い方
- chromeの拡張機能にてパッケージされていない拡張機能を読み込むでこのリポジトリのmanifest.jsonがあるディレクトリを指定して読み込む
- textボックスがある場所で`!f`とタイプするとLGTM画像が表示される

### その他
- 検索しているキーワードは`lib/config/idol`を参照

### Thanks
[lttm-crx](https://github.com/fukayatsu/lttm-crx)
