## 1. ストアの拡張 (Engine Implementation)

- [ ] 1.1 `useStore.ts` に `distributeSelectedTables` アクションを実装し、垂直・水平方向の分配ロジックを追加する
- [ ] 1.2 `useStore.ts` に `bulkRemoveTables` アクションを実装し、複数選択時の削除を効率化する（既存の単一削除を拡張）

## 2. ツールバーのマルチセレクト対応 (GUI)

- [ ] 2.1 `SelectionToolbar.tsx` を修正し、`selectedTableIds.length > 1` の場合に一括操作用の UI を表示する
- [ ] 2.2 ツールバーに「垂直整列 (AlignVertical)」と「水平整列 (AlignHorizontal)」のアイコンボタンを追加する
- [ ] 2.3 ツールバーの削除ボタンを複数削除（`bulkRemoveTables`）に対応させる

## 3. ショートカットとコマンドの統合 (UX)

- [ ] 3.1 `App.tsx` のグローバルキーリスナーに `V` (垂直整列) および `H` (水平整列) のショートカットを追加する
- [ ] 3.2 `CommandPalette.tsx` に `align v`, `align h`, `stack` コマンドを追加し、パレットからも整列可能にする

## 4. 検証と仕上げ (Verification)

- [ ] 4.1 `npm run build-ui` を実行し、ビルドエラーがないことを確認する
- [ ] 4.2 複数テーブルを選択して V/H キーでシュバッと並ぶことを目視で確認する
- [ ] 4.3 `npm run test:update` を実行し、スナップショットを更新する
