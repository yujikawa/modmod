## Context

Presentation Modeは当初React Flow時代にキャンバスのスクリーンショット用に作られた機能だが、Cytoscape.js移行後は「Sidebar/RightPanel/DetailPanelを隠す」だけの機能になっており実用価値がない。Cytoscape.jsは`cy.png()`/`cy.jpg()`をMITライセンスで内蔵しており、追加依存なしで画像エクスポートが実現できる。

## Goals / Non-Goals

**Goals:**
- Presentation Modeおよび関連コードをすべて削除する
- RightPanelにExport as Imageボタンを追加する
- PNG/JPGフォーマット選択ポップアップを実装する
- PNGのみ背景色（White / Transparent）を選択できるようにする
- Cytoscape.js内蔵APIでファイルダウンロードを実現する

**Non-Goals:**
- SVGエクスポート（ライセンス問題・実装コストにより対象外）
- 解像度・スケール指定UI（内部的に2x固定で十分）
- キャンバスの特定範囲のみの部分エクスポート

## Decisions

### 1. エクスポートAPI：`cy.png()` / `cy.jpg()` を直接使用
- **採用理由**: Cytoscape.js本体に内蔵（MIT）。追加依存ゼロ。`scale: 2`で高解像度出力が1行で書ける。
- **不採用の代替**: `html-to-image`（既存・MIT）はCytoscapeキャンバスをラスタとして埋め込むだけで品質が落ちる。`cytoscape-svg`はGPL-3.0で使用不可。

### 2. ポップアップUI：インラインのシンプルなdiv（ShadCN Dialogは使わない）
- **採用理由**: フォーマット選択 + Exportボタンだけのシンプルな内容。ShadCN Dialogを導入するほどの複雑さがない。RightPanelのアクティビティバー上にabsoluteで表示する形が既存のTooltipパターンと一貫している。
- **不採用の代替**: ShadCN Dialog — 過剰。

### 3. Cytoscapeインスタンスの取得：`useStore` 経由で `cyRef` を共有
- **採用理由**: `CytoscapeCanvas.tsx`がCytoscapeインスタンスを保持している。既存の`useStore`にrefを持たせるか、`window`経由で渡すのが最もシンプル。
- **実装方針**: `useStore`に`cyInstance`を保持するフィールドを追加し、`CytoscapeCanvas`の初期化時にセットする。

## Risks / Trade-offs

- **[リスク] cyInstanceがnullのままExportが呼ばれる** → Exportボタンを`cyInstance`がある場合のみ活性化することで対応
- **[トレードオフ] PNG背景Transparent時の見た目** → ダークモードのキャンバス背景が透過になるため、用途によっては意図しない見た目になりうる。オプションとして提供するにとどめる
