## 1. Presentation Mode の削除

- [x] 1.1 `visualizer/src/components/PresentationOverlay.tsx` を削除する
- [x] 1.2 `useStore.ts` から `isPresentationMode`・`setIsPresentationMode` を削除する
- [x] 1.3 `App.tsx` から `isPresentationMode` の参照・UIガード（Sidebar/RightPanel/DetailPanel/SelectionToolbar）をすべて削除する
- [x] 1.4 `RightPanel.tsx` から Playボタン・`isPresentationMode` 関連コードを削除する

## 2. Cytoscape インスタンスの共有

- [x] 2.1 `useStore.ts` に `cyInstance` フィールド（`cytoscape.Core | null`）と `setCyInstance` アクションを追加する
- [x] 2.2 `CytoscapeCanvas.tsx` の Cytoscape 初期化時に `setCyInstance` を呼び出す

## 3. Export as Image ポップアップの実装

- [x] 3.1 `RightPanel.tsx` にフォーマット状態（`'png' | 'jpg'`）と背景色状態（`'white' | 'transparent'`）のローカルstateを追加する
- [x] 3.2 ポップアップの表示/非表示を制御するローカルstateを追加する
- [x] 3.3 ポップアップUIを実装する（PNG/JPG選択・PNG時のみ背景色選択・Exportボタン）
- [x] 3.4 `cy.png()` / `cy.jpg()` を使ったエクスポート処理を実装し、ファイルダウンロードを行う
- [x] 3.5 `cyInstance` がnullのときExportボタンをdisabledにする

## 4. RightPanel へのボタン統合

- [x] 4.1 アクティビティバーに Export as Image ボタン（`Download` アイコン・ツールチップ `"Export as Image"`）を追加する

## 5. ビルド・スナップショット更新

- [x] 5.1 `npm run build-ui` でビルドが通ることを確認する
- [x] 5.2 `npm run test:e2e -- --update-snapshots` でビジュアルスナップショットを更新する
