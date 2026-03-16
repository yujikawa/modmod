## Why

Modscape の YAML は「実装前のデータモデル設計書」として機能するが、現状は可視化に必要なメタデータのみで、AI エージェントが dbt・Spark・SQLMesh 等の実装コードを生成するのに必要な情報（マテリアライゼーション戦略・集計ロジック・パーティション設定）が欠けている。`implementation` ブロックを任意フィールドとして追加することで、Modscape YAML を「設計仕様書 → 実装コード生成の起点」として機能させる。

## What Changes

- 各テーブルに任意の `implementation` ブロックを追加
  - `materialization`: table / view / incremental / ephemeral
  - `incremental_strategy`: merge / append / delete+insert
  - `unique_key`: インクリメンタル更新の一意キー
  - `partition_by`: パーティション設定（field + granularity）
  - `cluster_by`: クラスタリングキーのリスト
  - `grain`: Mart テーブルの GROUP BY 相当のカラムリスト
  - `measures`: 集計定義（column / agg / source_column）
- `implementation` ブロックは完全に任意。既存 YAML の後方互換性は維持。
- `implementation` が省略された場合、AI エージェントは `appearance.type` と `scd` から推論する。
- `src/templates/rules.md` に implementation セクションと AI 推論ガイドを追加。
- `visualizer/src/types/schema.ts` に `Implementation` 型を追加。
- `implementation` が定義されているテーブルに**フッターエリアを追加**し、マテリアライゼーション・パーティション・ユニークキーをアイコン付きバッジで表示する。ヘッダーへの追加は行わない（情報過多を避けるため）。

## Capabilities

### New Capabilities

- `implementation-hints`: テーブルごとのコード生成ヒントを保持する `implementation` ブロック。マテリアライゼーション・パーティション・集計ロジックを宣言的に記述できる。

### Modified Capabilities

- `visualizer-core`: `Implementation` 型を Schema に追加し、パーサーが `implementation` フィールドを passthrough で保持するよう対応。`TableNode` にフッターエリアを追加し `implementation` の主要フィールドをバッジ表示。
- `rules-templating`: AI エージェント向けルールに `implementation` セクションと推論ガイドを追加。

## Impact

- `visualizer/src/types/schema.ts`: `Table` インターフェースに `implementation?: Implementation` を追加
- `visualizer/src/lib/parser.ts`: `implementation` フィールドを passthrough（バリデーション不要、そのまま保持）
- `visualizer/src/components/TableNode.tsx`: `implementation` が定義されている場合のみフッターエリアを描画
- `src/templates/rules.md`: Section 追加（implementation フィールドリファレンス + AI 推論デフォルト表）
- `CLAUDE.md`: YAML フォーマットセクションの更新
- 既存の model.yaml サンプル・テストへの影響なし（任意フィールドのため）
