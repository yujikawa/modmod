## 1. TypeScript 型定義

- [x] 1.1 `visualizer/src/types/schema.ts` に `Implementation` インターフェースを追加（`materialization`, `incremental_strategy`, `unique_key`, `partition_by`, `cluster_by`, `grain`, `measures` フィールド）
- [x] 1.2 `Table` インターフェースに `implementation?: Implementation` を追加
- [x] 1.3 `Measure` 型を定義（`column`, `agg`, `source_column` フィールド）

## 2. パーサー対応

- [x] 2.1 `visualizer/src/lib/parser.ts` の `normalizeSchema` で `table.implementation` を passthrough するよう対応（既存の `lineage` と同様の処理）

## 3. DetailPanel — Implementation タブ

- [x] 3.1 `DetailPanel.tsx` のタブ定義に `implementation` タブを追加（Physical と Sample Data の間、4番目）
- [x] 3.2 `materialization` ドロップダウンを実装（`table` / `view` / `incremental` / `ephemeral`）
- [x] 3.3 `incremental_strategy` ドロップダウンと `unique_key` テキスト入力を実装（`materialization === 'incremental'` 時のみ表示）
- [x] 3.4 `partition_by.field` テキスト入力と `granularity` ドロップダウンを実装（`day` / `month` / `year` / `hour`）
- [x] 3.5 `cluster_by` タグ入力（追加・削除）を実装
- [x] 3.6 フォーム変更時に `updateTable` で即時 YAML 反映（双方向同期）
- [x] 3.7 `npm run build-ui` でビルドが通ることを確認

## 4. TableNode フッター実装

- [x] 4.1 `visualizer/src/components/TableNode.tsx` の columns Body 直下に `implementation` フッターエリアを追加（`implementation` 未定義時は非表示）
- [x] 4.2 `materialization` バッジを実装（`⚡ INCR` / `📋 TABLE` / `👁 VIEW` / `👻 EPHEM`）
- [x] 4.3 `partition_by` バッジを実装（`field` が定義されている場合のみ表示、`📅 <granularity>`）
- [x] 4.4 `unique_key` バッジを実装（定義されている場合のみ表示、`🔑 <key>`）
- [x] 4.5 フッターの区切り線スタイルを Body と視覚的に区別（破線ボーダー、9px モノスペース）
- [x] 4.6 `npm run build-ui` でビルドが通ることを確認し、E2E スナップショットを更新（`npm run test:e2e -- --update-snapshots`）

## 5. rules.md 更新

- [x] 5.1 `src/templates/rules.md` に `implementation` ブロックのセクションを追加（全フィールドのリファレンスと使用例）
- [x] 5.2 AI 推論デフォルト表（`appearance.type` / `scd` → `materialization` の対応）を追加
- [x] 5.3 `measures.source_column` の修飾形式（`<table_id>.<column_id>`）をドキュメント化
- [x] 5.4 Complete Example に `implementation` ブロックの記述例を追加

## 6. CLAUDE.md 更新

- [x] 6.1 `CLAUDE.md` の YAML フォーマットセクションに `implementation` ブロックのコメント付き例を追加

## 7. 動作確認

- [x] 7.1 `implementation` ブロックを含むサンプル YAML を作成し、`npm run build-ui` が通ることを確認
- [x] 7.2 `implementation` なしの既存 YAML が引き続き正常にパースされることを確認
