## 1. ストアと基本機能の更新

- [x] 1.1 `useStore.ts` に `isRightPanelOpen` (boolean, 初期値 false) を追加する
- [x] 1.2 `setIsRightPanelOpen` アクションを実装する

## 2. 右パネルの新設とエンティティ一覧の移動

- [x] 2.1 `visualizer/src/components/RightPanel/RightPanel.tsx` を作成し、右パネルの基本レイアウト（左にコンテンツ、右にアクティビティバー）を実装する
- [x] 2.2 `visualizer/src/components/Sidebar/EntitiesTab.tsx` の内容を右パネル内に移植する
- [x] 2.3 右パネル専用のアクティビティバー（ロゴなし、エンティティアイコンなど）を実装し、トグル機能を付ける

## 3. 左サイドバーの簡素化

- [x] 3.1 `Sidebar.tsx` から `Tabs` (Radix UI) 関連のコードを削除し、`EditorTab` のみを常時表示するように修正する
- [x] 3.2 サイドバー内にある「ENTITIES」などのタブスイッチを完全に除去する

## 4. 全体レイアウトの再構築 (App.tsx)

- [x] 4.1 `App.tsx` のルートコンテナを `flex-row` にし、`Sidebar`, `MainContainer`, `RightPanel` を配置する
- [x] 4.2 `MainContainer` 内に `Flow`（キャンバス）と `DetailPanel` を上下に配置し、中央領域として独立させる
- [x] 4.3 左右のパネル開閉に合わせて中央の `Flow` 領域が伸縮することを確認する

## 5. 仕上げと動作検証

- [x] 5.1 左パネルのみ開いた状態、右パネルのみ開いた状態、両方開いた状態でのレイアウト崩れがないか確認する
- [x] 5.2 詳細パネル（DetailPanel）が中央下部に正しく表示され、左右のパネルに被らないことを確認する
- [x] 5.3 `npm run build` を実行してビルドエラーが発生しないことを確認する
