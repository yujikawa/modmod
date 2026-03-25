## Why

現在のModscapeはデータの流れを上流から下流（source → staging → mart）まで表現できるが、「そのデータが実際に何に使われているか（BIダッシュボード、MLモデル、アプリケーション等）」を記述・可視化する手段がない。dbt exposureに相当するユースケース接続機能を追加することで、データモデルとビジネス用途の全体像を一望できるようにする。

## What Changes

- 新しいトップレベルYAMLセクション `usecases` を追加
- usecaseノードをキャンバス上にテーブルとは異なるスタイルで描画
- 既存の `lineage` セクションの構造は変更せず、`to` にusecase IDを指定するだけで接続可能
- `layout` セクションによるusecaseノードの座標管理に対応
- `modscape layout` コマンドでusecaseノードを自動配置対象に含める
- **BREAKING**: `domains[].tables` を `domains[].members` にリネーム（テーブル以外のノードも所属できることを明示するため）

## Capabilities

### New Capabilities

- `usecase-nodes`: YAMLで `usecases` セクションを定義し、キャンバス上にユースケースノードとして表示・lineageで接続する機能

### Modified Capabilities

- `data-lineage`: lineageの `to` 参照先としてusecaseノードIDを解決できるよう、テーブル以外のノード種別への参照をサポート
- `domain-containers`: `domains[].tables` を `domains[].members` にリネームし、テーブル・usecaseの両方を受け入れる

## Impact

- `visualizer/src/types/schema.ts` — `UseCase` 型の追加、`Schema` に `usecases` フィールド追加、`Domain.tables` → `Domain.members` にリネーム
- `visualizer/src/lib/parser.ts` — `usecases` セクションのパース処理追加、`members` フィールドの読み取り対応
- `visualizer/src/lib/cytoscapeElements.ts` — usecaseノードのCytoscape要素生成追加、`lineage.to` / `domains[].members` のID解決をusecaseまで拡張
- `visualizer/src/components/CytoscapeCanvas.tsx` — usecaseノードのスタイル定義追加
- `visualizer/src/store/useStore.ts` — `domain.tables` 参照箇所を `domain.members` に更新
- `visualizer/src/components/**` — `domain.tables` 参照箇所を `domain.members` に更新（DetailPanel、EntitiesTab、QuickConnectTab、TablesTab、PathFinderTab、CommandPalette）
- `src/layout.js` — usecaseノードを自動レイアウト対象に含める、`domain.members` 対応
