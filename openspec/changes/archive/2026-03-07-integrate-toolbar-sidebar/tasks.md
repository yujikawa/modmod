## 1. レイアウトの再構築

- [x] 1.1 `visualizer/src/components/Sidebar/ActivityBar.tsx` を新規作成し、垂直バーの基本構造を実装する
- [x] 1.2 `Sidebar.tsx` を `flex-row` 構成に変更し、右側に `ActivityBar` を配置する
- [x] 1.3 サイドバー開閉時 (`isSidebarOpen`) の `SidebarContent` 部分の表示・非表示アニメーションを調整する

## 2. 機能の移植と統合

- [x] 2.1 `CanvasToolbar.tsx` の表示切り替え（ER/Lineage/Annotation）ロジックを `ActivityBar` に移植する
- [x] 2.2 `CanvasToolbar.tsx` のオブジェクト追加（Table/Domain/Sticky）ロジックを `ActivityBar` に移植する
- [x] 2.3 `CanvasToolbar.tsx` の補助機能（Auto Layout/Help）およびテーマ切り替えを `ActivityBar` に集約する

## 3. インタラクションの実装

- [x] 3.1 アクティビティバー最上部のロゴクリックでサイドバーを開閉するトグル処理を実装する
- [x] 3.2 タブアイコン（Editor/Entities）クリック時の「展開・切り替え・折り畳み」ロジックを実装する
- [x] 3.3 各アイコンにツールチップ（右側に表示）を追加して、サイドバーが閉じている時の視認性を確保する

## 4. クリーンアップ

- [x] 4.1 `App.tsx` から `CanvasToolbar` コンポーネントの読み込みと配置を削除する
- [x] 4.2 `visualizer/src/components/CanvasToolbar.tsx` ファイルを削除する
- [x] 4.3 `Sidebar.tsx` 内の古い `TabsList` や `SidebarToggle` (境界線上のボタン) を整理・削除する

## 5. 検証とビルド

- [x] 5.1 サイドバーの開閉、タブの切り替え、オブジェクトの追加が正常に動作することを確認する
- [x] 5.2 ダークモード/ライトモードでの色のコントラストと視認性を確認する
- [x] 5.3 `npm run build` を実行してビルドエラーが発生しないことを確認する
