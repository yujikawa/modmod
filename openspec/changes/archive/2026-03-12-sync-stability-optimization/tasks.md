## 1. ストアの拡張と自己保存ガードの実装

- [x] 1.1 `visualizer/src/store/useStore.ts` の `AppState` インターフェースに `lastSavedAt: number` を追加する
- [x] 1.2 `saveSchema` アクション内で、保存が成功した際に `set({ lastSavedAt: Date.now() })` を実行するように修正する
- [x] 1.3 `refreshModelData` アクション内で、`savingStatus === 'saving'` または `Date.now() - lastSavedAt < 3000` の場合に処理を中断（スキップ）するガードロジックを実装する

## 2. 安定性の検証とテスト

- [x] 2.1 `tests/sync-stability.spec.ts` を新規作成し、高速ドラッグ操作をシミュレートする E2E テストを追加する
- [x] 2.2 テストコードから直接ファイルを書き換え、アイドル状態では同期が走り、保存直後には同期が走らないことを検証する
- [x] 2.3 `npm run test:e2e` を実行し、既存のテストおよび新規追加テストがすべてパスすることを確認する

## 3. UI フィードバックの調整

- [x] 3.1 `EditorTab.tsx` 等で保存ステータスの表示（Saving... Saved）が最新のロジックと矛盾なく動くことを確認する
- [x] 3.2 必要に応じて、`test:update` コマンドでビジュアルスナップショットを更新する
