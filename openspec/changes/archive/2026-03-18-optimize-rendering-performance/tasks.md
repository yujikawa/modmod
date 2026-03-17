## 1. Zustand セレクター最適化

- [x] 1.1 `TableNode.tsx`: `useStore()` 全体購読を個別セレクター + `useShallow` に変更する
- [x] 1.2 `DomainNode.tsx`: 同上、必要なフィールドだけ購読するよう変更する
- [x] 1.3 `AnnotationNode.tsx`: 同上
- [x] 1.4 `DetailPanel.tsx`: store購読をセレクター化する
- [x] 1.5 `CommandPalette.tsx`: store購読をセレクター化する
- [x] 1.6 `Sidebar` 配下コンポーネント: store購読をセレクター化する
- [x] 1.7 `RightPanel` 配下コンポーネント: store購読をセレクター化する

## 2. ノード/エッジ生成の安定化

- [x] 2.1 `App.tsx`: ノードリスト生成を `useMemo` でラップし、依存配列を `schema.tables`・`schema.domains`・`schema.annotations`・`layout` に限定する（`selectedTableId` や `pathFinderResult` を外す）
- [x] 2.2 `App.tsx`: エッジリスト生成を `useMemo` でラップし、`schema.relationships` と `schema.tables`（lineage用）のみに依存させる
- [x] 2.3 `App.tsx`: パスハイライトとテーブル選択によるスタイル変更を別の `useMemo` に分離し、既存のノード/エッジ参照を更新する形で処理する

## 3. O(1) ルックアップへの変更

- [x] 3.1 `App.tsx`: ノード同期ループ内の `.find(n => n.id === ...)` を事前 `Map<string, Node>` 構築に変更する（O(n²) → O(n)）
- [x] 3.2 `App.tsx` / store: `pathFinderResult.edgeIds` を `string[]` から `Set<string>` に変更し、`includes()` を `has()` に置き換える

## 4. memoization 追加

- [x] 4.1 `DetailPanel.tsx`: `React.memo` でラップする
- [ ] 4.2 `DetailPanel.tsx`: 主要なイベントハンドラ（列追加・削除・更新など）を `useCallback` でラップする
- [x] 4.3 `CommandPalette.tsx`: `React.memo` でラップする
- [x] 4.4 `Sidebar.tsx`: `React.memo` でラップする
- [x] 4.5 `RightPanel.tsx`: `React.memo` でラップする
- [x] 4.6 `EntitiesTab.tsx` / `TablesTab.tsx`: `React.memo` でラップし、検索フィルタリングを `useMemo` に移す
- [x] 4.7 `App.tsx`: `onConnect`・`onNodeDrag`・`onNodeDragStop` 等のイベントハンドラを `useCallback` でラップする

## 5. ビルド確認・動作検証

- [x] 5.1 `npm run build-ui` が通ることを確認する
- [ ] 5.2 200テーブル規模のサンプルYAMLを用意し、テーブル選択・移動・編集でのレスポンスを手動確認する
- [x] 5.3 `npm run test:e2e` を実行し、既存テストがパスすることを確認する（スナップショット更新が必要な場合は `npm run test:e2e -- --update-snapshots` を実行）
