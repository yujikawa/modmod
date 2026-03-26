## 1. YAMLスキーマとパーサーの更新

- [x] 1.1 `visualizer/src/types/schema.ts` の `LineageEdge` に `description?: string` を追加する
- [x] 1.2 `visualizer/src/lib/cytoscapeElements.ts` のリネージエッジ生成部分でエッジの `data` に `description` を渡す

## 2. キャンバスのⓘインジケーター表示

- [x] 2.1 Cytoscapeスタイルシートに `description` ありエッジ向けの `label: 'ⓘ'` スタイルを追加する
- [x] 2.2 `description` なしエッジにはラベルが表示されないことを確認する

## 3. Zustand ストアの更新

- [x] 3.1 `useStore.ts` に `updateLineageDescription(from: string, to: string, description: string)` アクションを追加する

## 4. DetailPanelのdescription表示・編集UI

- [x] 4.1 DetailPanelのリネージパネルに `description` の表示・編集用テキストエリアを追加する
- [x] 4.2 テキストエリアの `onBlur` で `updateLineageDescription` を呼び出しYAMLに書き戻す
- [x] 4.3 `description` が未設定の場合は空の入力欄を表示する

## 5. CLIの更新

- [x] 5.1 `src/lineage.js` の `lineage add` に `--description` オプションを追加し、YAMLに書き込む
- [x] 5.2 `src/lineage.js` に `lineage update` コマンドを追加する（`--from`・`--to`・`--description` オプション）
- [x] 5.3 `lineage update` で存在しないエントリを指定した場合にエラーを返す
- [x] 5.4 `lineage list` の出力に `description` があれば表示するよう更新する

## 6. ビルド・スナップショット更新

- [x] 6.1 `npm run build-ui` でビルドが通ることを確認する
- [x] 6.2 `npm run test:e2e -- --update-snapshots` でビジュアルスナップショットを更新する
