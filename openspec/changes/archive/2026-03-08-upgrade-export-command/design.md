## Context

ビジュアライザーで構築されたデータモデルの全情報を Markdown ドキュメントとして書き出すために、`src/export.js` のロジックを刷新します。特にデータの連続性を保証するリネージ情報と、設計の意図を伝える付箋情報を正式な出力項目として追加します。

## Goals / Non-Goals

**Goals:**
- ER図（Mermaid）の出力。
- データリネージ図（Mermaid Flowchart）の独立出力。
- 物理レイヤーの情報を含んだ詳細なテーブルカタログの出力。
- 全付箋（Sticky Notes）の一覧出力。
- 定義が存在する場合のみ、該当セクションを生成する動的制御。

**Non-Goals:**
- プレゼンテーションモードの「シーン」情報の書き出し。
- 画像ファイル（PNG等）の CLI 側での直接生成（今回は Markdown のみ）。

## Decisions

### 1. リネージの図示 (Mermaid Flowchart)
`schema.tables[].lineage.upstream` を走査し、`UpstreamNode --> DownstreamNode` の形式でエッジを生成します。
- **Rationale**: `erDiagram` はビジネス関係（FK等）に特化しており、データの流れを混ぜると複雑になりすぎるため、独立した `graph TD` として出力します。

### 2. 物理情報の統合
カラム定義表を以下の形式に拡張します：
`| Logical Name | Physical Name | Logical Type | Physical Type | Key | Description |`
- **Rationale**: 論理モデルとしての理解と、実際の DB 実装へのマッピングを同時に確認できるようにします。

### 3. 付箋情報のドキュメント化
`schema.annotations` を走査し、モデル全体の注釈セクションを作成します。
- 形式： `> [Sticky Note] テキスト内容`
- ターゲット（テーブル等）に紐付いている場合は、その対象名も記載します。

### 4. 正規化ロジックの強化
CLI 側の `normalizeSchema` を更新し、新しく追加された `annotations` などのプロパティが欠落している場合でも、空の配列として安全に扱えるようにします。

## Risks / Trade-offs

- **[Risk] ドキュメントの肥大化** → テーブル数が多い場合に Markdown が極端に長くなる。
  - **Mitigation**: セクションごとの動的なスキップロジックにより、無駄な余白を削減します。
- **[Risk] Mermaidのレンダリング制限** → 接続が複雑すぎると Mermaid 側で描画エラーや重なりが発生する。
  - **Mitigation**: CLI 側では正しい文法で出力することに徹し、複雑な場合はビジュアライザー（React Flow）側での閲覧を推奨する旨を検討します。
