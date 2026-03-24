## ADDED Requirements

### Requirement: table list
CLI は `modscape table list <file>` コマンドを提供しなければならない（SHALL）。YAML ファイル内の全テーブル ID と name を出力する。`--json` オプションで JSON 配列を返す。

#### Scenario: テーブル一覧を取得する
- **WHEN** `modscape table list model.yaml` を実行する
- **THEN** 全テーブルの id と name が一覧表示される

#### Scenario: JSON 出力
- **WHEN** `modscape table list model.yaml --json` を実行する
- **THEN** `[{ "id": "...", "name": "..." }, ...]` 形式の JSON が出力される

### Requirement: table get
CLI は `modscape table get <file> --id <id>` コマンドを提供しなければならない（SHALL）。指定 ID のテーブル定義全体を返す。

#### Scenario: 存在するテーブルを取得する
- **WHEN** `modscape table get model.yaml --id fct_orders` を実行する
- **THEN** fct_orders のテーブル定義が出力される

#### Scenario: 存在しない ID を指定する
- **WHEN** 存在しない ID を指定する
- **THEN** エラーメッセージが出力される（終了コード非ゼロ）

### Requirement: table add
CLI は `modscape table add <file> --id <id> --name <name> [--type <type>]` コマンドを提供しなければならない（SHALL）。指定 ID が既存の場合は ERROR とし `table update` を使うよう案内する。

#### Scenario: 新規テーブルを追加する
- **WHEN** 存在しない ID でテーブルを追加する
- **THEN** YAML の tables セクションにテーブルが追加される

#### Scenario: 既存 ID で add する
- **WHEN** 既存 ID を指定して add する
- **THEN** ERROR となり「`table update` を使え」と案内される

### Requirement: table update
CLI は `modscape table update <file> --id <id> [更新フィールド...]` コマンドを提供しなければならない（SHALL）。存在しない ID の場合は ERROR とし `table add` を使うよう案内する。

#### Scenario: 既存テーブルを更新する
- **WHEN** 既存 ID で name を変更する
- **THEN** YAML の該当テーブルが更新される

#### Scenario: 存在しない ID で update する
- **WHEN** 存在しない ID を指定して update する
- **THEN** ERROR となり「`table add` を使え」と案内される

### Requirement: table remove
CLI は `modscape table remove <file> --id <id>` コマンドを提供しなければならない（SHALL）。存在しない ID の場合は警告を出力するが ERROR にはしない。

#### Scenario: テーブルを削除する
- **WHEN** 既存 ID を指定して remove する
- **THEN** tables からそのテーブルが削除される

### Requirement: column add / update / remove
CLI は `modscape column add/update/remove <file> --table <table-id> --id <col-id> [フィールド...]` コマンドを提供しなければならない（SHALL）。`--table` で指定されたテーブルが存在しない場合は ERROR とする。

#### Scenario: カラムを追加する
- **WHEN** 既存テーブルに新規カラムを add する
- **THEN** 該当テーブルの columns にカラムが追加される

#### Scenario: 存在しないテーブルを指定する
- **WHEN** `--table` に存在しない ID を指定する
- **THEN** ERROR となる

### Requirement: relationship list / add / remove
CLI は relationship の list / add / remove コマンドを提供しなければならない（SHALL）。`add` 時は from/to テーブル ID の存在確認を行い、存在しない場合は ERROR とする。

#### Scenario: リレーションシップを追加する
- **WHEN** `modscape relationship add model.yaml --from dim_customers.customer_id --to fct_orders.customer_id --type one-to-many` を実行する
- **THEN** relationships セクションにエントリが追加される

#### Scenario: 存在しないテーブル ID を指定する
- **WHEN** from または to に存在しないテーブル ID を指定する
- **THEN** ERROR となる

### Requirement: lineage list / add / remove
CLI は lineage の list / add / remove コマンドを提供しなければならない（SHALL）。`add` 時は from/to テーブル ID の存在確認を行い、存在しない場合は ERROR とする。

#### Scenario: リネージを追加する
- **WHEN** `modscape lineage add model.yaml --from fct_orders --to mart_revenue` を実行する
- **THEN** lineage セクションにエントリが追加される

#### Scenario: 重複エントリを追加する
- **WHEN** 既存の from/to の組み合わせを add する
- **THEN** 警告を出力し重複追加しない

### Requirement: domain list / get / add / update / remove
CLI は domain の list / get / add / update / remove コマンドを提供しなければならない（SHALL）。table と同様の厳密な add/update 分離を適用する。

#### Scenario: ドメインを追加する
- **WHEN** 新規ドメインを add する
- **THEN** domains セクションにドメインが追加される

### Requirement: domain member add / remove
CLI は `modscape domain member add/remove <file> --domain <domain-id> --table <table-id>` コマンドを提供しなければならない（SHALL）。

#### Scenario: テーブルをドメインに追加する
- **WHEN** `modscape domain member add model.yaml --domain sales_ops --table fct_orders` を実行する
- **THEN** domains の該当ドメインの tables リストに table-id が追加される

#### Scenario: 既に所属しているテーブルを追加する
- **WHEN** 既にドメインに所属しているテーブルを add する
- **THEN** 警告を出力し重複追加しない

### Requirement: --json オプション
全コマンドは `--json` オプションを提供しなければならない（SHALL）。成功時は操作結果を JSON で、失敗時はエラー構造を JSON で返す。

#### Scenario: 成功時の JSON 出力
- **WHEN** コマンドに `--json` を付けて成功する
- **THEN** `{ "ok": true, "resource": "...", "id": "...", "action": "..." }` 形式で出力される

#### Scenario: 失敗時の JSON 出力
- **WHEN** コマンドに `--json` を付けてエラーになる
- **THEN** `{ "ok": false, "error": "...", "hint": "..." }` 形式で出力される
