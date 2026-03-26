## Why

Presentation Modeはもともとキャンバスのスクリーンショット撮影を目的としていたが、Cytoscape.jsへの移行後は「UIを隠すだけ」の抜け殻となっており実用的な価値がない。Cytoscape.jsが`cy.png()`/`cy.jpg()`を内蔵しているため、これを活用した本来の目的に即した機能に置き換える。

## What Changes

- **削除**: Presentation Mode（`isPresentationMode`ストート状態・`PresentationOverlay`コンポーネント・関連するUI制御すべて）
- **削除**: RightPanelアクティビティバーのPlayボタン
- **追加**: RightPanelアクティビティバーにExport as Imageボタン
- **追加**: フォーマット選択ポップアップ（PNG / JPG）
  - PNG選択時のみ背景色オプション（White / Transparent）
  - Exportボタンで`cy.png()`/`cy.jpg()`を使いファイルダウンロード

## Capabilities

### New Capabilities

- `export-as-image`: RightPanelからキャンバスをPNG/JPG画像としてエクスポートする機能。Cytoscape.js内蔵APIを使用し、追加依存なしで実現する。

### Modified Capabilities

（なし）

## Impact

- `visualizer/src/components/PresentationOverlay.tsx` — 削除
- `visualizer/src/store/useStore.ts` — `isPresentationMode`・`setIsPresentationMode` を削除
- `visualizer/src/App.tsx` — `isPresentationMode` ガード（Sidebar/RightPanel/DetailPanel/SelectionToolbar）を削除
- `visualizer/src/components/RightPanel/RightPanel.tsx` — Playボタン削除、Exportボタン追加、ポップアップ実装
- 追加依存なし（`cy.png()`/`cy.jpg()`はCytoscape.js本体に内蔵、MIT）
