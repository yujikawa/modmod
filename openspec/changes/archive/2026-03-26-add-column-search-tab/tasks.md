## 1. Zustand ストアの型拡張

- [x] 1.1 `useStore.ts` の `activeRightPanelTab` 型に `'information-search'` を追加する

## 2. InformationSearchTab コンポーネントの実装

- [x] 2.1 `visualizer/src/components/RightPanel/InformationSearchTab.tsx` を新規作成する
- [x] 2.2 検索入力欄（テキストボックス）を実装する
- [x] 2.3 入力キーワードに対してインメモリ全文検索ロジックを実装する（テーブル: name / logical_name / physical_name / conceptual.description、カラム: logical.name / physical.name / logical.description / BEAMタグ）
- [x] 2.4 検索結果をカラム単位のリストで表示するUIを実装する
- [x] 2.5 各結果アイテムにテーブル名（概念名大・論理名中・物理名小）とカラム名・説明を表示する
- [x] 2.6 長いテキストは CSS `truncate` で `...` 切り詰めを実装する
- [x] 2.7 検索結果の上限を50件に制限する
- [x] 2.8 結果が0件のとき「No results found」の空状態表示を実装する
- [x] 2.9 検索入力が空のとき初期プレースホルダー表示を実装する

## 3. クリックによるキャンバスフォーカス

- [x] 3.1 結果アイテムクリック時に該当テーブルをキャンバス上でフォーカス・選択状態にする処理を実装する（既存の `focusOnNode` / `selectTable` アクションを再利用）

## 4. RightPanel へのタブ統合

- [x] 4.1 `RightPanel.tsx` に `InformationSearchTab` をインポートし、タブコンテンツとして追加する
- [x] 4.2 アクティビティバーの**先頭**（Tablesタブより上）にタブアイコン（`Search` または `ScanSearch`）とツールチップ（`"Information Search"`）を追加する
- [x] 4.3 ヘッダーの表示テキストに `'information-search'` ケースを追加する

## 5. ビルド・スナップショット更新

- [x] 5.1 `npm run build-ui` でビルドが通ることを確認する
- [x] 5.2 `npm run test:e2e -- --update-snapshots` でビジュアルスナップショットを更新する
