## 1. 共通ユーティリティ

- [x] 1.1 `src/model-utils.js` を新規作成し、YAML の読み書き・バリデーション共通処理を実装する（readYaml / writeYaml / findTableById など）

## 2. table コマンド

- [x] 2.1 `src/table.js` を新規作成し `tableCommand()` を実装する
- [x] 2.2 `table list <file> [--json]` を実装する
- [x] 2.3 `table get <file> --id <id> [--json]` を実装する
- [x] 2.4 `table add <file> --id --name [--type] [--json]` を実装する（既存 ID は ERROR）
- [x] 2.5 `table update <file> --id [更新フィールド...] [--json]` を実装する（存在しない ID は ERROR）
- [x] 2.6 `table remove <file> --id <id> [--json]` を実装する

## 3. column コマンド

- [x] 3.1 `src/column.js` を新規作成し `columnCommand()` を実装する
- [x] 3.2 `column add <file> --table --id --name [--type] [--primary-key] [--json]` を実装する
- [x] 3.3 `column update <file> --table --id [更新フィールド...] [--json]` を実装する
- [x] 3.4 `column remove <file> --table --id [--json]` を実装する

## 4. relationship コマンド

- [x] 4.1 `src/relationship.js` を新規作成し `relationshipCommand()` を実装する
- [x] 4.2 `relationship list <file> [--json]` を実装する
- [x] 4.3 `relationship add <file> --from --to --type [--json]` を実装する（from/to テーブル存在確認・重複チェック）
- [x] 4.4 `relationship remove <file> --from --to [--json]` を実装する

## 5. lineage コマンド

- [x] 5.1 `src/lineage.js` を新規作成し `lineageCommand()` を実装する
- [x] 5.2 `lineage list <file> [--json]` を実装する
- [x] 5.3 `lineage add <file> --from --to [--json]` を実装する（テーブル存在確認・重複チェック）
- [x] 5.4 `lineage remove <file> --from --to [--json]` を実装する

## 6. domain コマンド

- [x] 6.1 `src/domain.js` を新規作成し `domainCommand()` を実装する
- [x] 6.2 `domain list <file> [--json]` を実装する
- [x] 6.3 `domain get <file> --id <id> [--json]` を実装する
- [x] 6.4 `domain add <file> --id --name [--color] [--json]` を実装する
- [x] 6.5 `domain update <file> --id [更新フィールド...] [--json]` を実装する
- [x] 6.6 `domain remove <file> --id <id> [--json]` を実装する
- [x] 6.7 `domain member add <file> --domain --table [--json]` を実装する（重複チェック）
- [x] 6.8 `domain member remove <file> --domain --table [--json]` を実装する

## 7. CLI 登録

- [x] 7.1 `src/index.js` に全リソースコマンドをインポートして登録する

## 8. ドキュメント更新

- [x] 8.1 `src/templates/rules.md` に mutation CLI セクションを追加する（操作マトリクス・AI フロー例・layout 更新の注意）
- [x] 8.2 `src/templates/claude/modeling.md` に mutation CLI 優先利用の指示を追加する
- [x] 8.3 `src/templates/codex/modscape-modeling/` および `src/templates/gemini/modscape-modeling/` の対応テンプレートを更新する

## 9. 動作確認

- [x] 9.1 `samples/` のサンプル YAML を使って table / relationship / lineage / domain の基本操作を手動確認する
- [x] 9.2 `--json` オプションの出力形式を確認する
