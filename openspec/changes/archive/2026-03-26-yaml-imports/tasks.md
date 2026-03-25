## 1. import解決ロジックの実装

- [x] 1.1 `src/model-utils.js` に `resolveImports(schema, basePath)` 関数を追加する — `imports:` エントリを読んでファイルを解決し、`ids:` で絞り込み、ローカル優先でテーブルをマージして返す
- [x] 1.2 `resolveImports` に訪問済みパスの `Set` を渡して循環import検出を実装する — 循環を検出したら警告ログを出してスキップする
- [x] 1.3 import先ファイルが存在しない場合・`ids:` に存在しないIDを指定した場合の警告ログ処理を実装する

## 2. dev serverへの組み込み

- [x] 2.1 `src/dev.js` の `/api/model` エンドポイントで `resolveImports` を呼び出し、解決済みスキーマを返すよう修正する
- [x] 2.2 `resolveImports` が返す import先ファイルパスのリストを `chokidar` の監視対象に動的に追加する — import元ファイルの変更でもhot-reloadが効くようにする

## 3. buildコマンドへの組み込み

- [x] 3.1 `src/build.js` でも `resolveImports` を呼び出し、ビルド成果物に解決済みスキーマが埋め込まれるよう修正する

## 4. YAMLスキーマ型定義の更新

- [x] 4.1 `visualizer/src/types/schema.ts` の `Schema` 型に `imports?: Array<{ from: string; ids?: string[] }>` フィールドを追加する（任意フィールド）

## 5. ビルド確認

- [x] 5.1 `npm run build-ui` が成功することを確認する
