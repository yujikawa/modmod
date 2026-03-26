## Why

AIの普及によりビジネスサイドのユーザーもSQLを書けるようになってきた。しかし「どのテーブルのどのカラムを使えば目的の指標を出せるか」がわからないという問題が残っている。現状のModscapeはテーブル単位の閲覧しかできず、カラム横断検索の手段がない。

## What Changes

- RightPanelに「Column Search」タブを新規追加する
- テーブル・カラムに登録されているすべての情報（概念名・論理名・物理名・説明文・BEAMタグ）を横断検索できる
- 検索結果はカラム単位でリスト表示し、テーブル名を概念名（大）・論理名（中）・物理名（小）の階層で表示する
- 結果のカラム名・説明は長い場合は `...` で切り詰める
- 検索結果のアイテムをクリックするとキャンバス上の対象テーブルにフォーカスする

## Capabilities

### New Capabilities

- `information-search`: RightPanelの新タブとして提供するモデル横断検索機能。テーブルおよびカラムのすべてのテキスト情報をインメモリで検索し、結果をカラム単位のリストで表示する。

### Modified Capabilities

（なし）

## Impact

- `visualizer/src/components/RightPanel/` — `ColumnSearchTab.tsx` を新規追加、`RightPanel.tsx` にタブ追加
- `visualizer/src/store/useStore.ts` — `activeRightPanelTab` の型に `'columns'` を追加
- 既存のYAMLスキーマ変更なし、パフォーマンスへの影響は軽微（インメモリ文字列検索）
