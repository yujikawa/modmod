## 1. ModelStatsTab コンポーネント作成

- [x] 1.1 `visualizer/src/components/RightPanel/ModelStatsTab.tsx` を新規作成する
- [x] 1.2 `useStore` から `schema`, `theme`, `setSelectedTableId`, `setFocusNodeId` を取得する
- [x] 1.3 `useMemo` でリネージ接続数Map（テーブルIDごとの upstream/downstream/total）を計算するロジックを実装する
- [x] 1.4 `useMemo` で孤立テーブル一覧（lineageに登場しないテーブル）を計算するロジックを実装する

## 2. Overview セクションの実装

- [x] 2.1 テーブル数・リネージエッジ数・リレーション数・ドメイン数を4カード横並びで表示するUIを実装する

## 3. Lineage Hotspots セクションの実装

- [x] 3.1 リネージ接続数合計の降順でテーブルをソートして一覧表示するUIを実装する
- [x] 3.2 CSSの `width %` でホリゾンタルバーを表示する（外部ライブラリ不使用）
- [x] 3.3 リネージが空の場合の空状態メッセージを表示する

## 4. Isolated Tables セクションの実装

- [x] 4.1 孤立テーブル一覧を警告スタイルで表示するUIを実装する
- [x] 4.2 孤立テーブルが0件の場合はセクション自体を非表示にする

## 5. フォーカスナビゲーションの実装

- [x] 5.1 Hotspotsの各行クリック時に `setSelectedTableId` + `setFocusNodeId` を呼び出す
- [x] 5.2 Isolated Tablesの各行クリック時に同じフォーカス処理を呼び出す

## 6. RightPanel へのタブ追加

- [x] 6.1 `RightPanel.tsx` に `ModelStatsTab` をimportする
- [x] 6.2 Activity Barに `BarChart2` アイコンのボタンを追加する（`activeRightPanelTab === 'stats'`）
- [x] 6.3 タブコンテンツ切り替え部に `<ModelStatsTab />` を追加する
- [x] 6.4 パネルヘッダーのタイトルに `'stats'` → `'Model Stats'` を追加する

## 7. ビルドと動作確認

- [x] 7.1 `npm run build-ui` を実行してビルドエラーがないことを確認する
- [x] 7.2 `npm run test:e2e -- --update-snapshots` を実行してスナップショットを更新する
