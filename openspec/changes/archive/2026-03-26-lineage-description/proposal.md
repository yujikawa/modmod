## Why

リネージエッジは現在 `from` と `to` のみで定義されており、データフローの意味（フィルター条件・変換内容・増分ロード条件など）を記録する手段がない。エンジニアやAIエージェントがモデルを読んだとき、テーブル間のデータ連携がどのような変換・絞り込みを伴うのかをYAMLから把握できない。

## What Changes

- `lineage` エントリにオプションフィールド `description` を追加する（後方互換）
- `description` を持つリネージエッジはキャンバス上に `ⓘ` マークを表示する
- リネージエッジをクリックしたときのDetailPanelに `description` を表示・編集できるようにする
- CLIの `modscape lineage add` に `--description` オプションを追加する
- CLIに `modscape lineage update` コマンドを追加し、既存エントリのdescriptionを更新できるようにする

## Capabilities

### New Capabilities

- `lineage-description`: リネージエッジへの説明文付与、キャンバス上のⓘインジケーター表示、DetailPanelでの表示・編集

### Modified Capabilities

（なし）

## Impact

- `visualizer/src/types/schema.ts` — `LineageEdge` 型に `description?: string` を追加
- `visualizer/src/lib/cytoscapeElements.ts` — エッジのdataにdescriptionを渡す
- Cytoscapeスタイル — descriptionありエッジに `ⓘ` ラベルを付与
- `visualizer/src/components/DetailPanel.tsx` — リネージパネルにdescription表示・編集UIを追加
- `visualizer/src/store/useStore.ts` — lineage description更新アクションを追加
- `src/lineage.js` (CLI) — `lineage add` に `--description` オプション、`lineage update` コマンドを追加
