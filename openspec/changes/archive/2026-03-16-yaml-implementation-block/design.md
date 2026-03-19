## Context

Modscape の YAML は現在、可視化レイヤー（appearance, layout, lineage）と論理モデリングレイヤー（columns, relationships）を持つが、実装レイヤーが存在しない。AI エージェントが dbt・Spark・SQLMesh などのコードを生成しようとしても、マテリアライゼーション戦略や集計ロジックを推論するしかなく、精度が低くなる。

`implementation` ブロックはこの「設計 → 実装」のギャップを埋める任意の宣言的ヒントとして機能する。

## Goals / Non-Goals

**Goals:**
- `Table` 型に任意の `implementation` フィールドを追加する
- フィールドは完全にツール非依存（dbt 固有の設定は含まない）
- パーサーは `implementation` を passthrough で保持する（バリデーションなし）
- `rules.md` に AI エージェント向けの実装ルールを追加する
- 後方互換性を完全に維持する（既存 YAML は変更不要）

**Non-Goals:**
- dbt / Spark / SQLMesh 向けのコード生成機能の実装は今回のスコープ外（AI エージェントが rules.md を読んで生成する）
- `implementation` フィールドのバリデーション・スキーマ強制は行わない
- フッターでの `measures` / `grain` / `cluster_by` の表示は今回のスコープ外（情報量が多く、主要 3 フィールドに絞る）
- `measures` の DetailPanel フォームは今回のスコープ外（行追加・削除・マッピング編集が複雑なため。YAML 直接編集で対応）

## Decisions

### 1. `implementation` は `Table` の任意フィールドとして追加する

**Why**: `domains` や `annotations` と同様に、モデリングの中核ではなくオプションのメタデータとして扱う。`implementation` がなくても可視化・ER 表示は完全に機能する。

**Alternatives considered**:
- `appearance` の下に追加 → 視覚的設定と実装設定が混在するため却下
- トップレベルに `implementations: {}` として追加 → テーブルごとに閲覧・編集が分離して不便なため却下

### 2. パーサーは passthrough で保持し、バリデーションを行わない

**Why**: `implementation` の内容はツールごとに拡張される可能性が高い。今後 Spark 固有フィールドや SQLMesh 固有フィールドが追加されても、パーサーを変更せずに対応できる。TypeScript 型は `Implementation` インターフェースとして定義するが、ランタイムでは `unknown` 許容の型とする。

### 3. AI 推論デフォルトを rules.md に定義する

**Why**: `implementation` が省略された場合でも AI エージェントが適切なコードを生成できるよう、`appearance.type` / `scd` からの推論ルールを明示する。これにより既存ユーザーへの価値も維持される。

| appearance.type | scd | 推論される materialization |
|----------------|-----|--------------------------|
| `fact` | — | `incremental` |
| `dimension` | `type2` | `table` (snapshot) |
| `dimension` | `type1` 以外 | `table` |
| `mart` | — | `table` |
| `hub` / `link` / `satellite` | — | `incremental` |
| `table` / `view` | — | `view` |

### 4. `measures` は Mart テーブル専用の集計定義とする

**Why**: Mart テーブルは `lineage.upstream` で上流テーブルを参照するが、「どのカラムをどう集計するか」が不明だった。`measures` フィールドで `source_column`（上流カラム）→ `column`（出力カラム）のマッピングと `agg` 関数を宣言できるようにすることで、AI が正確な GROUP BY + 集計 SQL を生成できる。

### 5. DetailPanel に Implementation タブを追加する

**Why**: `implementation` はテーブル内フィールド（`appearance`・`conceptual`・`lineage` と同列）であり、他のフィールドと同様に専用タブでフォーム編集できるべき。Physical タブへの統合は「物理名・カラム物理定義」という既存の責務と混在するため避ける。

**タブ構成（5タブ）:**

```
Conceptual | Logical | Physical | Implementation | Sample Data
```

Physical（物理定義）の直後・Sample Data の直前に配置する。物理名・カラム定義の流れで自然に「次にどう実装するか」へ移れる位置。

**Implementation タブのフォーム構成:**

```
Materialization  [incremental ▼]     ← table | view | incremental | ephemeral

  ↓ incremental 選択時のみ表示
  Strategy       [merge ▼]           ← merge | append | delete+insert
  Unique Key     [order_id        ]

Partition By
  Field          [event_date      ]
  Granularity    [day ▼]             ← day | month | year | hour

Cluster By       [customer_id ×] [region_id ×] [+ Add]
```

- `measures` / `grain` はフォームを用意しない（YAML 直接編集で対応）
- `implementation` が未定義の状態で Materialization を選択した瞬間に `implementation: {}` が自動生成される
- フォームの変更は即時 `updateTable` で YAML に反映（他タブと同じ双方向同期）

### 6. テーブルノードにフッターエリアを追加する

**Why**: ヘッダーはすでに概念名・論理名・物理名の 3 層で情報量が高い。実装ヒントをヘッダーに追加すると視覚的に過密になるため、責務を分離してフッターに配置する。

**レイアウト構造:**

```
┌────────────────────────────────┐
│ FACT (Trans.)  ← Index Tab     │
├────────────────────────────────┤
│ 💰 Orders      ← 概念名        │
│  Order Trans.  ← 論理名        │  Header
│  fct_sales_... ← 物理名        │
├────────────────────────────────┤
│ 🔑 order_id   Int              │
│ 🔩 customer   Int              │  Body (columns)
│ Σ  amount     Decimal          │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ ⚡ INCR  📅 day  🔑 order_id   │  Footer (implementation)
└────────────────────────────────┘
```

**フッターに表示するフィールドと対応アイコン:**

| フィールド | 表示条件 | アイコン + ラベル例 |
|-----------|---------|------------------|
| `materialization` | 常に表示（定義時） | `⚡ INCR` / `📋 TABLE` / `👁 VIEW` / `👻 EPHEM` |
| `partition_by` | `field` が存在する場合 | `📅 day` （granularity も表示） |
| `unique_key` | 存在する場合 | `🔑 order_id` |

- フッターは `implementation` が未定義の場合は描画しない（非表示）
- フッターの区切り線はダッシュ（`╌`）スタイルで Body と視覚的に区別する
- フォントサイズは 9px・モノスペース。ヘッダーの物理名と同系統のトーン

**Alternatives considered:**
- ヘッダーに追記 → 既存の 3 層表示が過密になるため却下
- Index Tab に追記（`FACT / ⚡INCR`）→ Tab が長くなりすぎるため却下
- ホバー時のみ表示 → 常時確認できないため却下

## Risks / Trade-offs

- **フィールドの肥大化リスク** → `implementation` はブロックとして隔離されており、他フィールドへの影響なし。passthrough 設計なので将来の拡張も吸収できる。
- **AI が implementation を無視するリスク** → rules.md に明示的な読み取りルールを追加することで対処。
- **`measures.source_column` の解決困難** → 上流テーブルに同名カラムが複数ある場合は `<table_id>.<column_id>` 形式で修飾できるよう rules.md に記載する。
