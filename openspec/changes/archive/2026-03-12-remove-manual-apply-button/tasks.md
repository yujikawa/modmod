## 1. UI のクリーンアップ

- [x] 1.1 `visualizer/src/components/Sidebar/EditorTab.tsx` から右下の「Apply Changes / Save & Update」ボタンを削除する
- [x] 1.2 `visualizer/src/components/Sidebar/EditorTab.tsx` のフッター領域を簡素化し、ステータス表示のみにする
- [x] 1.3 `visualizer/src/components/Sidebar/EditorTab.tsx` のヘッダーからオートセーブのトグルスイッチを削除し、オートセーブが有効であることを示すラベルに置き換える

## 2. デフォルト設定の変更

- [x] 2.1 `visualizer/src/store/useStore.ts` で `isAutoSaveEnabled` をデフォルトで `true` に設定する
- [x] 2.2 CLI モードでない場合（Sandboxモード）でも、入力後 300ms で自動反映されることを確認する

## 3. 動作確認とビルド

- [x] 3.1 外部エディタでの編集が反映されること、およびブラウザ内での編集も自動で反映されることを確認する
- [x] 3.2 `npm run build-ui` を実行し、UI が正しくビルドできることを確認する
