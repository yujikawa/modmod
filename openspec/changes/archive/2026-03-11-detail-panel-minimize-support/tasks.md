## 1. 状態管理の実装 (Store)

- [x] 1.1 `useStore.ts` に `isDetailPanelMinimized` (boolean) 状態を追加。
- [x] 1.2 `useStore.ts` に `setIsDetailPanelMinimized` アクションを追加。
- [x] 1.3 `setSelectedTableId` 等の既存アクションで、自動的に最小化が解除されないことを確認（設計通り）。

## 2. 詳細パネルの UI 改修 (DetailPanel)

- [x] 2.1 `DetailPanel.tsx` で `isDetailPanelMinimized` を取得。
- [x] 2.2 パネルヘッダーに「最小化/展開」を切り替えるボタン（アイコン）を追加。
- [x] 2.3 最小化時のレンダリングロジックを実装（高さ40px、コンテンツ非表示、名前のみ表示）。
- [x] 2.4 最小化バーをクリックした時に展開されるインタラクションを追加。

## 3. インタラクションの強化 (Canvas)

- [x] 3.1 `App.tsx` の `onNodeDoubleClick` イベント（または相当する箇所）で `setIsDetailPanelMinimized(false)` を呼び出すように変更。
- [x] 3.2 同様にエッジのダブルクリックでも展開されるように調整。

## 4. 検証とビルド

- [x] 4.1 ライト/ダークモード両方での最小化バーの視認性を確認。
- [x] 4.2 オブジェクトを切り替えても最小化が維持されることを確認。
- [x] 4.3 ダブルクリックで期待通り展開されることを確認。
- [x] 4.4 `npm run build-ui` を実行し、ビルドエラーがないことを確認。
