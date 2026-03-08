## 1. スキーマ正規化の強化

- [x] 1.1 `src/export.js` 内の `normalizeSchema` を更新し、`annotations` 配列を安全に初期化するようにする
- [x] 1.2 カラム定義において、`physical.name` や `physical.type` が欠落している場合のデフォルト値処理を追加する

## 2. Mermaid 出力の拡張

- [x] 2.1 リネージ情報を `flowchart TD` 形式で生成する `generateMermaidLineage` 関数を実装する
- [x] 2.2 ER図生成時、テーブル名やカラム名のサニタイズ処理を強化し、特殊文字による描画エラーを防ぐ

## 3. カタログと注釈のドキュメント化

- [x] 3.1 各テーブルの定義表に「Physical Name」と「Physical Type」の列を追加する
- [x] 3.2 モデル全体の付箋（Sticky Notes）をリストアップする `generateNotesSection` 関数を実装する

## 4. 動的レンダリングと統合

- [x] 4.1 `generateMarkdown` 関数を更新し、ER関係、リネージ、付箋のそれぞれについて、データが存在する場合のみセクションを出力するように修正する
- [x] 4.2 セクションの順序を「Title -> ER -> Lineage -> Domains -> Catalog -> Notes」に整理する

## 5. 検証

- [x] 5.1 既存の `star-schema-sample.yaml` で ER 図とカタログが正しく出力されることを確認する
- [x] 5.2 リネージ定義を含む YAML で、フローチャートが追加出力されることを確認する
- [x] 5.3 付箋を含む YAML で、末尾に注釈セクションが追加されることを確認する
