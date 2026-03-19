## Why

200個以上のテーブルを含む大規模なモデルで描画が著しく遅くなり、実用に耐えない状態になっている。原因はReact Flowの限界ではなく、Zustandストアの設計・memoization不足・ノード/エッジの全件再構築といったコード側の問題であり、修正によって200個規模のモデルでも快適に操作できるようにする。

## What Changes

- **Zustand storeをセレクターパターンで最適化**: コンポーネントが必要なstateのスライスだけを購読するよう変更し、無関係な変更による再レンダリングを防ぐ
- **ノード/エッジ配列の安定化**: schema変更時に全件再構築していたものを、変更されたノード/エッジだけを差分更新するよう `useMemo` の依存配列を最適化する
- **主要コンポーネントのmemoization追加**: `DetailPanel`、`CommandPalette`、`Sidebar`、`RightPanel`等に `React.memo` / `useCallback` を追加する
- **パスハイライトの検索をSetに変更**: `edgeIds.includes()` による O(m) 線形探索を `Set` で O(1) に変更する
- **ノード/エッジ生成のO(n²)ルックアップを排除**: App.tsx内の `.find()` を事前にMapを構築する方式に変更する

## Capabilities

### New Capabilities
- `rendering-performance`: 大規模モデル（200テーブル以上）での描画パフォーマンス最適化。Zustandセレクター最適化・memoization・差分更新・Set利用によるスケーラブルなレンダリング実現

### Modified Capabilities
<!-- 既存のスペックレベルの動作変更はなし。実装の内部最適化のみ -->

## Impact

- `visualizer/src/store/useStore.ts`: セレクターパターン導入のためにstoreのstore.subscribe / shallow比較を活用
- `visualizer/src/App.tsx`: ノード/エッジ生成ロジックの `useMemo` 依存配列の見直し、MapによるO(1)ルックアップ
- `visualizer/src/components/DetailPanel.tsx`: `React.memo` 追加
- `visualizer/src/components/CommandPalette.tsx`: `React.memo` 追加
- `visualizer/src/components/Sidebar/` 配下: `React.memo` / `useCallback` 追加
- `visualizer/src/components/RightPanel/` 配下: `React.memo` / `useCallback` 追加
- `visualizer/src/components/TableNode.tsx`: store購読のセレクター化
- 外部依存・YAMLフォーマット・APIへの影響なし
