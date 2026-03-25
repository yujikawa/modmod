## Why

現在の PathFinder は「A→B の最短経路を探す」機能のみで、「このテーブルを変えたら何が影響するか」「このノードに直接つながっているものは何か」といった実践的な問いに答えられない。またERエッジとリネージエッジが混在した経路しか返せず、用途別の絞り込みができない。

PathFinder を機能拡張し、単一ノード起点の探索（直接隣接・全連鎖）と2ノード間経路探索の両方に対応させ、ERとリネージを独立して選択できるようにする。探索結果はキャンバス上でハイライト表示する。

## What Changes

- PathFinder タブに **モード切り替え**を追加：「単一ノード」と「2ノード間」
- **エッジ種別フィルター**を追加：「ER」「リネージ」「両方」
- **単一ノードモード**：ノードを1つ選択し、直接つながっているノード（1ホップ）または上流・下流すべて（全連鎖）をキャンバスにハイライト
- **2ノード間モード**：既存のA→B最短経路機能をエッジ種別フィルター付きに拡張
- 探索結果はキャンバス上でハイライト、非対象ノード・エッジはdim表示

## Capabilities

### New Capabilities

- `lineage-highlight`：PathFinderの拡張による単一ノード起点のリネージ・ER探索ハイライト（1ホップ／全連鎖切り替え対応）

### Modified Capabilities

- `interactive-navigation`：PathFinderのUIにモード・エッジ種別フィルター・単一ノードモードが追加される

## Impact

- `visualizer/src/lib/graph.ts` — `getDirectNeighbors()` と `getAllReachable()` の探索関数を追加（ER・リネージを種別指定で探索）
- `visualizer/src/store/useStore.ts` — `pathFinderResult` をそのまま活用。`lineageHighlight` への置き換えは不要
- `visualizer/src/components/RightPanel/PathFinderTab.tsx` — モード切り替え・エッジ種別フィルター・単一ノードモードUIを追加
- `visualizer/src/components/CytoscapeCanvas.tsx` — `pathFinderResult` によるハイライト処理は既存のまま流用
