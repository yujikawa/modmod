# CLAUDE.md

## Project Overview

**Modscape** — YAMLドリブンのデータモデリングビジュアライザー。Modern Data Stack向けに、Star Schema・Data Vault・Data Martを視覚的にモデリングするCLIツール。

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Flow, CodeMirror 6, Zustand |
| Layout | Dagre |
| YAML | js-yaml |
| CLI | Node.js, Commander |
| Test | Playwright (E2E) |
| Build | Vite (visualizer), ESM (CLI) |

## Repository Structure

```
modscape/
├── src/               # CLI (Node.js ESM)
│   ├── index.js       # エントリーポイント
│   ├── dev.js         # dev サーバー
│   ├── build.js       # ビルド
│   ├── init.js        # init コマンド
│   ├── export.js      # export コマンド
│   └── import-dbt.js  # dbt import コマンド
├── visualizer/
│   └── src/
│       ├── App.tsx
│       ├── components/ # Reactコンポーネント
│       ├── store/      # Zustand ストア
│       ├── lib/        # ユーティリティ
│       └── types/      # TypeScript型定義
├── tests/             # Playwright E2Eテスト
├── openspec/          # OpenSpec仕様管理
│   ├── config.yaml    # プロジェクトルール
│   ├── specs/         # アクティブな機能仕様 (38件)
│   └── changes/archive/ # アーカイブ済みチェンジ (77件)
└── samples/           # サンプルmodel.yaml
```

## Key Commands

```bash
# ビルド
npm run build-ui          # visualizer をビルドして visualizer-dist/ に配置

# 開発
npm run dev               # ローカル dev サーバー起動

# テスト
npm run test:e2e          # E2Eテスト実行
npm run test:cli          # CLIテスト (dbt import)
npm run test:all          # build-ui + test:cli

# スナップショット更新 (UIに変更を加えた場合は必須)
npm run test:e2e -- --update-snapshots
# または
npm run test:update       # build-ui + スナップショット更新
```

## Development Rules

### 実装時の注意
- UI変更後は **必ず** `npm run build-ui` でビルドが通ることを確認
- UIに視覚的変更がある場合は `npm run test:e2e -- --update-snapshots` でスナップショットを更新してコミット
- タスクは小さなインクリメンタルなステップに分割する
- 大規模な書き直しより反復的なUI改善を優先する

### 設計方針
- YAMLスキーマはできる限り安定を保つ
- ビジュアルエディタとYAMLの同期を維持する
- シンプルなアーキテクチャを優先し、重い抽象化を避ける
- データベース固有の前提を持ち込まない
- Star Schema と Data Vault のモデリングとの互換性を維持する

## YAML Model Format

ルートレベルの5セクション（`tables`/`domains` 内に座標を書かないこと）：

```yaml
# ── Domains ──────────────────────────────────────────────
domains:
  - id: sales_ops
    name: "Sales Operations"
    description: "営業系テーブルのグループ。"    # 任意
    color: "rgba(59, 130, 246, 0.1)"
    tables: [fct_orders, dim_customers]
    isLocked: false                             # 任意: ドラッグ防止

# ── Tables ───────────────────────────────────────────────
tables:
  - id: fct_orders
    name: Orders                               # 概念名
    logical_name: "Order Transactions"         # 論理名（任意）
    physical_name: "fct_retail_sales"          # 物理テーブル名（任意）
    appearance:
      type: fact       # fact|dimension|mart|hub|link|satellite|table
      sub_type: transaction  # 任意サブ分類
      scd: type2       # ディメンション用 SCD (type0〜type6)
      icon: "💰"
      color: "#e0f2fe" # 任意ヘッダーカラー
    conceptual:        # AIエージェント向けビジネスコンテキスト（任意）
      description: "1行 = 1注文明細。"
      tags: [WHAT, HOW_MUCH]   # BEAM* タグ: WHO|WHAT|WHEN|WHERE|HOW|COUNT|HOW_MUCH
      businessDefinitions:
        revenue: "割引後純売上"
    lineage:           # mart/集計テーブルのみ定義
      upstream: [fct_sales, dim_dates]
    implementation:    # AIコード生成ヒント（任意）省略時は appearance.type から自動推論
      materialization: incremental          # table|view|incremental|ephemeral
      incremental_strategy: merge          # merge|append|delete+insert
      unique_key: order_id
      partition_by: { field: event_date, granularity: day }  # day|month|year|hour
      cluster_by: [customer_id]
      grain: [month_key]                   # GROUP BY (mart のみ)
      measures:                            # 集計定義 (mart のみ)
        - column: total_revenue
          agg: sum                         # sum|count|count_distinct|avg|min|max
          source_column: fct_sales.amount  # 上流カラム (<table_id>.<col_id> で修飾可)
    columns:
      - id: order_id
        logical:
          name: "Order ID"
          type: Int
          description: "サロゲートキー。"
          isPrimaryKey: true
          isForeignKey: false
          isPartitionKey: false
          isMetadata: false    # 監査カラムは true
          additivity: fully    # fully|semi|non
        physical:              # 物理定義の上書き（任意）
          name: order_id
          type: "BIGINT"
          constraints: [NOT NULL]
    sampleData:                # 2D配列。先頭行 = カラムID
      - [order_id, amount]
      - [1001, 150.00]

# ── Relationships ─────────────────────────────────────────
relationships:
  - from: { table: dim_customers, column: customer_id }
    to:   { table: fct_orders,    column: customer_id }
    type: one-to-many   # one-to-one|one-to-many|many-to-one|many-to-many
  # ※ lineage.upstream で定義した接続を relationships に重複記載しないこと

# ── Annotations ──────────────────────────────────────────
annotations:
  - id: note_001
    type: sticky             # sticky|callout
    text: "Grain: 1行 = 1注文明細"
    color: "#fef9c3"         # 任意背景色
    targetId: fct_orders     # 貼付先ID（任意）
    targetType: table        # table|domain|relationship|column
    offset: { x: 100, y: -80 }  # 対象左上からのオフセット（未指定時は絶対座標）

# ── Layout ───────────────────────────────────────────────
layout:
  sales_ops:                  # ドメイン: width/height 必須
    x: 0
    y: 0
    width: 880
    height: 480
    isLocked: false
  fct_orders:                 # ドメイン内テーブル: 座標はドメイン原点からの相対値
    x: 280
    y: 200
    parentId: sales_ops       # ドメイン所属の宣言
  mart_summary:               # スタンドアロンテーブル: キャンバス絶対座標
    x: 1060
    y: 200
```

## OpenSpec Workflow

このプロジェクトは **OpenSpec** による仕様駆動開発を採用。

```
探索 (explore) → 提案 (propose) → 実装 (apply) → アーカイブ (archive)
```

| コマンド | 用途 |
|---------|------|
| `/opsx:explore` | アイデア探索・要件の整理 |
| `/opsx:propose` | 新しいチェンジの提案・設計・タスク生成 |
| `/opsx:apply`   | タスクの実装 |
| `/opsx:archive` | 完了チェンジのアーカイブ |

アクティブな仕様は `openspec/specs/` 配下の各 `spec.md` を参照。
