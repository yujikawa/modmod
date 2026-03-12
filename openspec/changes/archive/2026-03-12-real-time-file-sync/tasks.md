## 1. 環境構築と依存関係の追加

- [x] 1.1 `package.json` の `dependencies` に `ws` ライブラリを追加する
- [x] 1.2 `npm install` を実行して依存関係を解決する

## 2. サーバー側（CLI）の実装

- [x] 2.1 `src/dev.js` に `ws` をインポートし、WebSocket サーバーをセットアップする
- [x] 2.2 `chokidar.watch` の監視イベントを `add`, `change`, `unlink` に拡張する
- [x] 2.3 イベントの種類（モデル変更 vs ファイルリスト変更）に応じたメッセージ送信機能を実装する
- [x] 2.4 送信処理にデバウンス（200ms程度）を導入する

## 3. クライアント側（ビジュアライザ）の実装

- [x] 3.1 `App.tsx` 等で WebSocket 接続を確立し、受信時に `refreshModelData` または `fetchAvailableFiles` を実行する
- [x] 3.2 手動リロードボタン（`RefreshCw` アイコン）を `Sidebar.tsx` および `PathFinderTab.tsx` から削除する
- [x] 3.3 接続切断時の再接続ロジック（指数バックオフ）を実装する

## 4. 動作確認とビルド

- [x] 4.1 外部エディタでの YAML 編集・新規ファイル作成・削除が即座に UI に反映されることを確認する
- [x] 4.2 リロードボタンが UI から消えていることを確認する
- [x] 4.3 `npm run build-ui` を実行し、UI が正しくビルドできることを確認する
