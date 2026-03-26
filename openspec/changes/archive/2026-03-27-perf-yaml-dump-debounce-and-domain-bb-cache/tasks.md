## 1. syncToYamlInput のデバウンス実装

- [x] 1.1 `visualizer/src/store/useStore.ts` のモジュールスコープにデバウンス用タイマー変数 `let syncTimer` を追加する
- [x] 1.2 `syncToYamlInput()` 内の `yaml.dump` 呼び出しを `setTimeout(300ms)` でラップし、既存タイマーがあればクリアしてからセットする
- [x] 1.3 `saveSchema()` の呼び出しがデバウンスの影響を受けていないことを確認する（呼び出し元は変更しない）
- [x] 1.4 `npm run build-ui` でビルドが通ることを確認する
- [x] 1.5 手動動作確認：テーブルをドラッグしてYAMLエディタが 300ms 後に更新されることを確認する

## 2. 動作確認・テスト

- [x] 2.1 E2E テストを実行し既存テストが壊れていないことを確認する（`npm run test:e2e`）
- [x] 2.2 スナップショットに差分が出た場合は `npm run test:update` で更新してコミットに含める
