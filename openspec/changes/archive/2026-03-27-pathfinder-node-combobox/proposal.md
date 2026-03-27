## Why

パスファインダータブのノード選択UIはネイティブ `<select>` のみで、テーブル数が多いモデルではスクロールして目的のノードを探す必要がある。フリー入力でノード名・IDを絞り込めるコンボボックスに変更することで、ノード選択の操作性を改善する。

## What Changes

- `PathFinderTab.tsx` の `NodeSelect` コンポーネントを `NodeCombobox` コンポーネントに置き換える
- テキスト入力によるノード名・IDのリアルタイムフィルタリングを追加する
- 入力欄フォーカス時にドロップダウンが展開し、ドメイングループを維持した候補一覧を表示する
- 選択後はテキスト欄にノード名を表示し、クリアボタンで選択解除できる
- 外部ライブラリ追加なし（自前実装）

## Capabilities

### New Capabilities
- `pathfinder-node-combobox`: パスファインダーのノード選択をコンボボックス（フリー入力＋ドロップダウン）で行う機能

### Modified Capabilities

（なし）

## Impact

- `visualizer/src/components/RightPanel/PathFinderTab.tsx` のみ変更
- 外部依存なし・APIなし・スキーマ変更なし
