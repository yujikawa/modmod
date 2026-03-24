## Why

複数の YAML モデルを管理する環境では、共通マスタ（shared dimensions など）と各ドメイン固有の YAML が別ファイルに分かれることが多い。現在の `merge` コマンドは全テーブルを一括マージするため、共通マスタから特定テーブルだけを取り込みたいユースケースに対応できない。

## What Changes

- CLI に `extract` コマンドを新規追加する
- `--tables` オプションでカンマ区切りのテーブル ID を指定し、対象テーブルのみを出力 YAML に含める
- 同一 ID が複数ファイルに存在する場合は後勝ち（後のファイルで上書き）とする
- 出力には `tables` のみ含め、`relationships` / `domains` / `lineage` / `annotations` / `layout` は含めない
- `merge` コマンドの既存挙動は変更しない

## Capabilities

### New Capabilities

- `cli-extract-command`: YAML ファイル（複数可）から指定 ID のテーブルだけを抽出して出力する CLI コマンド

### Modified Capabilities

（なし）

## Impact

- `src/extract.js`: 新規追加
- `src/index.js`: `extract` コマンドの登録を追加
- `merge` コマンドへの影響なし
