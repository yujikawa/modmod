## ADDED Requirements

### Requirement: Overview統計の表示
右パネルのModel StatsタブはモデルのOverview統計を表示しなければならない（SHALL）。表示項目はテーブル総数・リネージエッジ総数・リレーション総数・ドメイン総数の4つ。

#### Scenario: schemaが読み込まれた状態でタブを開く
- **WHEN** ユーザーがModel Statsタブを開く
- **THEN** テーブル数・リネージエッジ数・リレーション数・ドメイン数がカード形式で表示される

#### Scenario: lineageが空の場合
- **WHEN** schema.lineageが空またはundefinedの状態でタブを開く
- **THEN** リネージエッジ数は0として表示される

---

### Requirement: リネージホットスポットのランキング表示
Model Statsタブはテーブルごとのリネージ接続数合計（上流数＋下流数）をランキング順に表示しなければならない（SHALL）。

#### Scenario: 複数テーブルにリネージが存在する場合
- **WHEN** ユーザーがModel Statsタブを開く
- **THEN** リネージ接続数の多い順にテーブル一覧が並び、各行にテーブル名・CSSバー・合計数が表示される

#### Scenario: リネージが存在しない場合
- **WHEN** schema.lineageが空の状態でタブを開く
- **THEN** Lineage Hotspotsセクションには「No lineage data」等の空状態メッセージが表示される

---

### Requirement: 孤立テーブルの警告表示
Model Statsタブはschema.lineageに一度も登場しないテーブルを孤立テーブルとして検出し、警告セクションに一覧表示しなければならない（SHALL）。

#### Scenario: 孤立テーブルが存在する場合
- **WHEN** ユーザーがModel Statsタブを開く
- **THEN** Isolated Tablesセクションに孤立テーブルの件数と一覧が表示される

#### Scenario: 孤立テーブルが存在しない場合
- **WHEN** 全テーブルがlineageに登場する状態でタブを開く
- **THEN** Isolated Tablesセクションは表示されない（またはクリア状態として表示）

---

### Requirement: テーブルへのフォーカスナビゲーション
Model StatsタブのHotspotsおよびIsolated Tablesの各エントリーをクリックすると、キャンバス上の該当テーブルにフォーカスしなければならない（SHALL）。

#### Scenario: Hotspotsのテーブル行をクリックする
- **WHEN** ユーザーがLineage Hotspotsのテーブル行をクリックする
- **THEN** キャンバスが該当テーブルにスクロール・フォーカスし、DetailPanelが開く

#### Scenario: Isolated Tablesのエントリーをクリックする
- **WHEN** ユーザーがIsolated Tablesのテーブル行をクリックする
- **THEN** キャンバスが該当テーブルにスクロール・フォーカスし、DetailPanelが開く
