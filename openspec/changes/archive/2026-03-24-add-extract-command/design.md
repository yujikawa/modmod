## Context

現在の `merge` コマンド（`src/merge.js`）は複数 YAML から全テーブルをマージする。重複 ID は先勝ち。`extract` は merge とは独立した新コマンドとして実装し、既存挙動を変えない。

## Goals / Non-Goals

**Goals:**
- `src/extract.js` を新規作成し、ID フィルタ付きの抽出ロジックを実装する
- `src/index.js` に `extract` コマンドを登録する
- 同一 ID は後勝ち（後のファイルが優先）

**Non-Goals:**
- `merge` コマンドの変更
- `physical_name` や `name` による検索（将来の拡張候補）
- relationships / domains / lineage / annotations / layout の出力
- インタラクティブな ID 選択 UI

## Decisions

### `merge.js` を拡張せず新ファイルに分ける

`merge` に `--tables` オプションを追加する案もあったが、「マージ」と「抽出」は意味が異なる。コマンドの責務を分けることで、それぞれのヘルプ文・テスト・将来の拡張が独立して扱える。

### 後勝ち（last-write-wins）

`merge` は先勝ちだが、`extract` のユースケースは「ソースから特定テーブルを持ってくる」。複数ソースで同 ID が存在する場合、より後（より具体的と想定）のファイルを優先する方が直感的。

### 出力は `tables` のみ

抽出後は別の YAML と `merge` することを想定しており、relationships/domains などはコピー先に任せる。シンプルさを優先。

### CLI オプション: `--tables` カンマ区切り

```
modscape extract common_master.yaml --tables dim_customers,dim_products -o extracted.yaml
```

Commander.js のデフォルトオプション文字列として実装。複数 `--table` フラグ方式より入力が簡潔。

## Risks / Trade-offs

- [ID typo] 存在しない ID を指定しても出力が空になるだけで、エラーにならない → マッチしなかった ID を warning として出力することで対処
- [後勝ち混乱] `merge` と挙動が異なるため混乱する可能性 → ヘルプ文とログで明示する
