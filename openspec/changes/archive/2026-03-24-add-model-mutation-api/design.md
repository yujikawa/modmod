## Context

現在の CLI は `merge` / `extract` / `layout` などファイル単位の操作が中心で、YAML 内の個別エンティティ（テーブル・カラム・リレーション）を安全に操作するコマンドが存在しない。AI エージェントが YAML を直接編集すると構造破壊のリスクがあるため、CLI を mutation API として整備する。

## Goals / Non-Goals

**Goals:**
- リソース型コマンド体系（`modscape table add` など）で YAML を安全に操作できる
- `add` は重複 ID でエラー、`update` は存在しない ID でエラー（厳密な区別）
- `--json` オプションで AI が機械読み取りしやすい出力を提供する
- `rules.md` とエージェントテンプレートに CLI 利用指針を追記する

**Non-Goals:**
- インタラクティブな操作 UI
- アノテーションの mutation（ビジュアル補足は人間が担う）
- トランザクション（複数操作のロールバック）
- `layout` の自動更新（`modscape layout` で別途対応）

## Decisions

### リソース型コマンド体系

```
modscape table add / get / list / update / remove
modscape column add / update / remove
modscape relationship add / list / remove
modscape lineage add / list / remove
modscape domain add / get / list / update / remove
modscape domain member add / remove
```

Commander.js のネストコマンドで実装。`modscape table` がサブコマンドグループになる。

**代替案: フラット型** (`modscape add-table`, `modscape remove-relationship`) → ヘルプが読みにくくなるため不採用。

### CLI はフラットなスカラーフィールドのみ受け付ける

CLI で指定できるのは「フラグで自然に表現できるスカラー値」に限定する。複雑なネスト構造（`implementation`、`sampleData`、`columns` の全定義など）は YAML 直接編集に任せる。

```
table
  --id / --name / --logical-name / --physical-name
  --type (fact|dimension|mart|hub|link|satellite|table)
  --description

column
  --table / --id
  --name (logical.name) / --type (logical.type)
  --primary-key / --foreign-key
  --physical-name (physical.name) / --physical-type (physical.type)

relationship
  --from (table.column 形式) / --to (table.column 形式) / --type

lineage
  --from (table id) / --to (table id)

domain
  --id / --name / --description / --color
```

**CLIの役割 = スカラー値のピンポイント操作**
**YAMLの役割 = 構造の詳細定義（implementation, sampleData, columns全体など）**

この原則により `--data JSON` のような複雑な入力機構は不要になる。`--help` を見れば何が指定できるか即座にわかるシンプルさを保つ。

**代替案: `--data JSON` で全フィールドを受け付ける** → JSON が YAML と等価になり CLI を介す意味が薄れるため不採用。

### add と update の厳密な分離

- `add`: 既存 ID があれば **ERROR** → 「`table update` を使え」と案内
- `update`: 存在しない ID なら **ERROR** → 「`table add` を使え」と案内
- `get` で存在確認してから操作するフローを AI に推奨する（rules.md に明記）

**代替案: upsert** → 意図しない上書きが起きやすいため不採用。

### ファイル読み書きの atomic 性

1. YAML を読み込む
2. バリデーションを実行
3. 変更をメモリ上で適用
4. `yaml.dump()` で書き戻す

失敗時はファイルを書かない（read → validate → write の順序を守る）。

### --json 出力

全コマンドに `--json` を追加。成功時は変更後のリソース、失敗時はエラー構造を JSON で返す。

```json
{ "ok": true, "resource": "table", "id": "fct_orders", "action": "add" }
{ "ok": false, "error": "ID already exists", "hint": "Use `table update` instead" }
```

### column get は不要

カラム情報は `table get --id <id>` のレスポンスに含まれるため独立した `column get` は不要。

## Risks / Trade-offs

- [YAML 書き戻し] コメントや独自フォーマットが `yaml.dump()` で失われる → 既存の `merge`/`layout` と同じ挙動なので許容
- [layout 未更新] `table add` 後に layout エントリが増えても座標は追加されない → `modscape layout` を実行するよう rules.md に明記
- [Commander ネスト] サブコマンドの深さが増えると `--help` が煩雑になる → 各リソースに `.description()` を丁寧に書くことで対処
