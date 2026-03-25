## 1. Type Definition & Schema

- [x] 1.1 `visualizer/src/types/schema.ts` に `UseCase` インターフェースを追加（`id`, `name`, `description?`, `appearance?`, `url?`）
- [x] 1.2 `Schema` インターフェースに `usecases?: UseCase[]` フィールドを追加
- [x] 1.3 `Domain` インターフェースの `tables` フィールドを `members` にリネーム

## 2. YAML Parser

- [x] 2.1 `visualizer/src/lib/parser.ts` で `usecases` セクションをパースし `Schema.usecases` に格納する処理を追加
- [x] 2.2 `usecases` が未定義の場合に空配列をデフォルトとして扱う処理を確認
- [x] 2.3 `domain.tables` の読み取りを `domain.members` に更新（後方互換として `tables` も受け入れるか検討）

## 3. Cytoscape Elements Builder

- [x] 3.1 `visualizer/src/lib/cytoscapeElements.ts` の `yamlToElements` にusecaseノード生成処理を追加（クラス `usecase-node` を付与）
- [x] 3.2 `lineage` の `to` 解決ロジックを修正し、`tables` に存在しない場合は `usecases` をフォールバック参照するよう変更
- [x] 3.3 `layout` セクションからusecaseノードの座標を読み込む処理を追加（既存テーブルの座標解決と同じロジックを適用）
- [x] 3.4 `domain.tables` 参照を `domain.members` に更新し、テーブル・usecaseの両方をドメインコンテナ内に描画できることを確認

## 4. Canvas Styling

- [x] 4.1 `visualizer/src/components/CytoscapeCanvas.tsx` にusecaseノード用のCytoscapeスタイルを追加（形状・色・デフォルトアイコン `🔗`）
- [x] 4.2 `appearance.color` が指定されている場合にノードの背景色へ反映するスタイルルールを追加
- [x] 4.3 `CytoscapeCanvas.tsx` 内の `domain.tables` 参照を `domain.members` に更新

## 5. Store & Component Updates (`domain.tables` → `domain.members`)

- [x] 5.1 `visualizer/src/store/useStore.ts` の `domain.tables` 参照を `domain.members` に更新
- [x] 5.2 `visualizer/src/components/DetailPanel.tsx` の `domain.tables` 参照を更新
- [x] 5.3 `visualizer/src/components/Sidebar/EntitiesTab.tsx` の `domain.tables` 参照を更新
- [x] 5.4 `visualizer/src/components/Sidebar/QuickConnectTab.tsx` の `domain.tables` 参照を更新（参照なし）
- [x] 5.5 `visualizer/src/components/RightPanel/TablesTab.tsx` の `domain.tables` 参照を更新
- [x] 5.6 `visualizer/src/components/RightPanel/PathFinderTab.tsx` の `domain.tables` 参照を更新（参照なし）
- [x] 5.7 `visualizer/src/components/CommandPalette.tsx` の `domain.tables` 参照を更新（参照なし）

## 6. Layout Persistence

- [x] 6.1 Cytoscapeのドラッグイベントハンドラーでusecaseノードの位置変更時に `layout` セクションへ書き戻す処理が動作することを確認

## 7. CLI Auto-Layout

- [x] 7.1 `src/layout.js` の自動レイアウト処理にusecaseノードを含める（Dagreグラフへの追加と座標の書き出し）
- [x] 7.2 `src/layout.js` の `domain.tables` 参照を `domain.members` に更新

## 8. Documentation & Templates

- [x] 8.1 `src/templates/rules.md` の `domains[].tables` 記述をすべて `domains[].members` に更新（ドメイン定義例・ルール記述・サンプルYAML含む）
- [x] 8.2 `CLAUDE.md` の YAML スキーマ例の `domains[].tables` を `domains[].members` に更新
- [x] 8.3 `README.md` のドメイン定義例の `tables:` を `members:` に更新
- [x] 8.4 `README.ja.md` のドメイン定義例の `tables:` を `members:` に更新

## 9. Build & Verification

- [x] 9.1 `npm run build-ui` が成功することを確認
- [x] 9.2 サンプルYAMLに `usecases` セクションと `members` を使ったドメイン定義を追加してビジュアライザーで動作確認
- [x] 9.3 `npm run test:update` でE2Eスナップショットを更新してコミット
