## Why

リネージが増えるにつれてモデル全体の状況が把握しにくくなる。どのテーブルに接続が集中しているか、追加されたテーブルがどこにあるかを一目で確認できる統計ビューが必要。

## What Changes

- 右パネルに「Model Stats」タブを新規追加
- モデル全体のOverview統計（テーブル数・リネージエッジ数・リレーション数・ドメイン数）を表示
- リネージ接続数（上流＋下流の合計）でテーブルをランキング表示し、ホットスポットを可視化
- リネージに一度も登場しない孤立テーブルを警告表示
- 各エントリーをクリックするとキャンバス上の該当テーブルにフォーカス

## Capabilities

### New Capabilities

- `model-stats-tab`: 右パネルのModel Statsタブ。Overview統計・リネージホットスポットランキング・孤立テーブル一覧を提供する統計ダッシュボード

### Modified Capabilities

（なし）

## Impact

- `visualizer/src/components/RightPanel/ModelStatsTab.tsx` — 新規コンポーネント
- `visualizer/src/components/RightPanel/RightPanel.tsx` — タブアイコン・タブコンテンツの追加
- storeへの変更なし（schemaは既存のuseStoreから取得）
- 外部ライブラリの追加なし
