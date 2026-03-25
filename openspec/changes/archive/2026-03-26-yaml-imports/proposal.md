## Why

複数のYAMLファイルにまたがってモデルを管理するとき、コンフォームドディメンションなど複数のモデルで共通して使うテーブルの定義を各YAMLにコピーしなければならない問題がある。これを解決するため、YAMLに `imports:` セクションを導入し、他のYAMLファイルから特定テーブルを参照できる仕組みを実装する。

## What Changes

- YAMLスキーマに `imports:` セクションを追加する（`from` / `ids` キー）
- `modscape dev` / `modscape build` のサーバーサイドでimport解決を行い、visualizerには透過的に解決済みスキーマを渡す
- importされたテーブルはキャンバス上で通常ノードとして表示されるが、YAMLエディタには `imports:` 宣言のみが表示され編集不可
- importされたテーブルのIDは `domains.members` / `relationships` / `lineage` から通常通り参照できる
- `chokidar` の監視対象にimport先ファイルを追加し、import元の変更もhot-reloadに反映する

## Capabilities

### New Capabilities
- `yaml-imports`: YAMLファイル間でテーブル定義を参照する `imports:` ディレクティブ

### Modified Capabilities

## Impact

- `src/dev.js` — `/api/model` エンドポイントにimport解決ロジックを追加、chokidar監視対象を拡張
- `src/build.js` — ビルド時にも同じimport解決処理を適用
- `visualizer/src/types/schema.ts` — `Schema` 型に `imports` フィールドを追加（任意）
- `visualizer/src/lib/parser.ts` — `isImported` フラグのノーマライズ対応
- YAMLスキーマの後方互換性は維持される（`imports:` を持たない既存YAMLは影響なし）
