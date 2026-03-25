## Context

現在の PathFinder は `graph.ts` の `buildAdjacencyList`（ER・リネージ混在・無向）と `findShortestPath`（BFS）を使い、2点間の最短経路を返す。結果は `pathFinderResult: { nodeIds, edgeIds } | null` としてストアに保持され、CytoscapeCanvas がハイライト適用に使用する。

この基盤を活かしつつ、単一ノード起点の探索（直接隣接・全連鎖）と、エッジ種別（ER・リネージ・両方）のフィルタリングを追加する。

## Goals / Non-Goals

**Goals:**
- PathFinderに「単一ノード」モードを追加：直接隣接（1ホップ）または全連鎖を探索してキャンバスハイライト
- PathFinderに「2ノード間」モードを追加：既存のA→B経路探索をエッジ種別フィルター付きに拡張
- エッジ種別フィルター（ER／リネージ／両方）を全モードで共通提供
- テーブル・コンシューマー両対応
- 既存の `pathFinderResult` ストア構造・CytoscapeCanvas のハイライト処理を流用

**Non-Goals:**
- キャンバス上のクリックインタラクションの変更
- PathFinder タブの廃止
- 上流のみ・下流のみの方向フィルター（v1スコープ外）

## Decisions

### 1. PathFinderTabのUIレイアウト

```
┌─────────────────────────────────┐
│ モード: [単一ノード] [2ノード間] │
├─────────────────────────────────┤
│ エッジ: [ER] [リネージ] [両方]  │
├─────────────────────────────────┤
│ ── 単一ノードモード ──           │
│ ノード: [検索して選択...]        │
│ 範囲:  [直接のみ] [全連鎖]      │
│                                  │
│ ── 2ノード間モード ──            │
│ From: [検索して選択...]          │
│ To:   [検索して選択...]          │
└─────────────────────────────────┘
```

「直接のみ／全連鎖」は単一ノードモードのみ表示。2ノード間モードは常に最短経路。

### 2. `graph.ts` に種別指定対応の探索関数を追加

```ts
type EdgeTypeFilter = 'er' | 'lineage' | 'both'

getDirectNeighbors(schema, nodeId, filter): { nodeIds, edgeIds }
getAllReachable(schema, nodeId, filter): { nodeIds, edgeIds }
```

既存の `buildAdjacencyList` はER・リネージ混在のため、フィルター適用のために種別を保持した状態でBFS/DFSを行う新関数を用意する。`findShortestPath` も同様にフィルターを受け取るよう拡張する。

### 3. ストア・ハイライト処理は既存流用

`pathFinderResult: { nodeIds: string[], edgeIds: string[] } | null` の型・CytoscapeCanvas の `useEffect` によるハイライト適用はそのまま使用する。単一ノードモードの結果も同じ形式で格納するため、キャンバス側の変更は最小限。

## Risks / Trade-offs

- **findShortestPath の拡張：** 既存の BFS はエッジ種別フィルターを持たない。フィルター引数を追加する際、デフォルト値を `'both'` にすれば既存の PathFinder の動作を維持できる。
- **コンシューマーの取り扱い：** コンシューマーはリネージの `to` として有効なIDを持つが、ERエッジは持たない。ERフィルター選択時にコンシューマーが孤立ノードになることは仕様通り。

## Migration Plan

データマイグレーション不要。YAMLスキーマ変更なし。既存のPathFinder利用者は「2ノード間／両方」モードで従来通りの操作ができる。
