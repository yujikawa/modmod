## 1. グラフ探索関数の拡張

- [x] 1.1 `graph.ts` に `EdgeTypeFilter = 'er' | 'lineage' | 'both'` 型を追加する
- [x] 1.2 `getDirectNeighbors(schema, nodeId, filter: EdgeTypeFilter): { nodeIds: Set<string>, edgeIds: Set<string> }` を追加する — 指定エッジ種別で1ホップ隣接を返す
- [x] 1.3 `getAllReachable(schema, nodeId, filter: EdgeTypeFilter): { nodeIds: Set<string>, edgeIds: Set<string> }` を追加する — 指定エッジ種別で全連鎖到達可能ノード・エッジを返す（BFS双方向）
- [x] 1.4 `findShortestPath` に `filter: EdgeTypeFilter = 'both'` 引数を追加し、エッジ種別フィルターに対応させる（デフォルト `'both'` で既存動作を維持）

## 2. PathFinderTabのUI拡張

- [x] 2.1 モード切り替えトグル「単一ノード／2ノード間」を追加する
- [x] 2.2 エッジ種別フィルタートグル「ER／リネージ／両方」を全モード共通で追加する
- [x] 2.3 単一ノードモードのUIを実装する — ノード検索・選択セレクト、「直接のみ／全連鎖」トグル
- [x] 2.4 単一ノードモードで探索を実行し `setPathFinderResult` を呼ぶ処理を実装する
- [x] 2.5 2ノード間モードのUIを既存のFrom/To構成から検索セレクト形式に更新し、エッジ種別フィルターを適用する
- [x] 2.6 モード・フィルター・範囲を切り替えたとき探索結果が即時更新されるようにする
- [x] 2.7 クリアボタンで `setPathFinderResult(null)` を呼び、ハイライトとパネルの選択状態をリセットする

## 3. キャンバスのdim表示実装

- [x] 3.1 `buildCytoscapeStyle` に `dimmed` スタイルクラス（`opacity: 0.15`）を追加する（既存の `faded` クラスと重複しない形で）
- [x] 3.2 `CytoscapeCanvas.tsx` で `pathFinderResult` を `useEffect` で監視し、非nullのとき全要素に `dimmed` を追加→ハイライト対象IDの `dimmed` を除去、nullのとき全要素から `dimmed` を除去する
- [x] 3.3 Escキーで `setPathFinderResult(null)` を呼ぶ処理を追加する（既存のEsc処理と共存）
