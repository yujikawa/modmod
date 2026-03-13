## 1. ハイライト機能の構築 (Infrastructure)

- [x] 1.1 `useStore.ts` に `highlightedNodeIds: string[]` 状態を追加する
- [x] 1.2 `TableNode.tsx` を修正し、ハイライト状態に応じた視覚効果（グロー効果など）を付与する
- [x] 1.3 `index.css` にハイライト用のアニメーション定義を追加する (boxShadowで代替実装完了)

## 2. パイプラインエンジンの実装 (Core Logic)

- [x] 2.1 `useStore.ts` に `executePipeline(input: string)` アクションを実装する
- [x] 2.2 `select` コマンドを実装し、ワイルドカードマッチングで ID リストを生成する
- [x] 2.3 既存の `bulkAssignTablesToDomain`, `distributeSelectedTables`, `bulkRemoveTables` をパイプラインから利用可能にする

## 3. UI のターミナル化 (Interface)

- [x] 3.1 `CommandPalette.tsx` 内に入力文字列を `|` で分割してリアルタイム解析するロジックを追加する
- [x] 3.2 パレット内に「Execution Plan」エリアを新設し、各ステージの予測結果（マッチ件数等）を表示する
- [x] 3.3 パレット下部に「Working Set」プレビューを表示し、対象テーブル名のチップを並べる
- [x] 3.4 入力内容に基づいて `highlightedNodeIds` をリアルタイム更新する `useEffect` を実装する

## 4. 検証 (Verification)

- [x] 4.1 `select fact_* | mv Sales` のような複雑なパイプラインが正しく動作することを確認する
- [x] 4.2 `npm run build-ui` および `npm run test:update` を実行する
