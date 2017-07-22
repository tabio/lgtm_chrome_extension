### 概要
LGTM用の画像をFlickr API経由で取得するchromeの拡張機能

### 事前準備
- [Flickr API Key](https://www.flickr.com/services/apps/create/apply/)を取得しておく
- `js/lttm.js`内の`flickr_api_key`を自分のものに置き換える

### 使い方
- chromeの拡張機能にてパッケージされていない拡張機能を読み込むでこのリポジトリのmanifest.jsonがあるディレクトリを指定して読み込む
- textボックスがある場所で`!a`とタイプするとLGTM画像が表示される

### その他
- Flickrで検索しているキーワードは`lib/config/flickr.json`を参照

### Thanks
[lttm-crx](https://github.com/fukayatsu/lttm-crx)
