## 1. 基礎インフラの構築

- [x] 1.1 `visualizer/src/store/useStore.ts` に `activeRightPanelTab` と `pathFinderResult` ステートを追加する
- [x] 1.2 関連するアクション（`setActiveRightPanelTab`, `setPathFinderResult`）を実装する

## 2. グラフ探索エンジンの実装

- [x] 2.1 `visualizer/src/lib/graph.ts` を作成し、最短経路探索用の隣接リスト生成ロジックを実装する
- [x] 2.2 BFS (Breadth-First Search) を用いた最短経路探索関数を実装する（ERとLineageを統合）

## 3. 右パネルのタブ化とリデザイン

- [x] 3.1 `RightPanel.tsx` を修正し、上部に「Tables」「Path」「Notes」を切り替えるタブ（アイコン）を追加する
- [x] 3.2 既存のエンティティ一覧を `Tables` タブの内容として分離する

## 4. パス検索 (Path Finder) の実装

- [x] 4.1 `visualizer/src/components/RightPanel/PathFinderTab.tsx` を新規作成する
- [x] 4.2 From/To テーブルの選択（ドロップダウン等）と「Find Path」ボタンを実装する
- [x] 4.3 探索結果の表示（ステップごとの詳細、ER/Lineageの区別）を実装する

## 5. 付箋検索 (Note Search) の実装

- [x] 5.1 `visualizer/src/components/RightPanel/NoteSearchTab.tsx` を新規作成する
- [x] 5.2 全ての付箋を対象としたテキスト検索と、該当付箋へのフォーカス機能を実装する

## 6. キャンバス上でのハイライト演出

- [x] 6.1 `App.tsx` のノード/エッジ生成ロジックを修正し、`pathFinderResult` がある場合にスポットライト効果を適用する
- [x] 6.2 パスに含まれるエッジの色や太さを動的に変更する

## 7. 仕上げと検証

- [x] 7.1 ダークモード/ライトモードでの視認性を調整する
- [x] 7.2 大規模モデルでの動作パフォーマンスを確認する
- [x] 7.3 `npm run build` を実行してエラーがないか確認する
