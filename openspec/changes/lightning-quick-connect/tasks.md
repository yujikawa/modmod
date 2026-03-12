## 1. スペックと要件の定義

- [ ] 1.1 `specs/quick-connector/spec.md` を作成し、自動補完とコマンド入力の要件を定義する
- [ ] 1.2 `specs/bulk-relationship-creation/spec.md` を作成し、ワイルドカード一致の仕様を定義する

## 2. ストアの拡張

- [ ] 2.1 `useStore.ts` に `isQuickConnectBarOpen` 状態を追加する
- [ ] 2.2 `useStore.ts` に `bulkAddRelationship` アクションを実装し、複数テーブルへの一括接続ロジックを追加する

## 3. UI コンポーネントの実装

- [ ] 3.1 `QuickConnectBar.tsx` を新規作成し、入力フィールドとサジェストリストを実装する
- [ ] 3.2 `App.tsx` に `L` キーでバーを開くグローバルショートカットを追加する
- [ ] 3.3 `QuickConnectBar` 内での自動補完（Autocomplete）ロジックを実装し、`table.column` のサジェストを有効にする

## 4. 仕上げと検証

- [ ] 4.1 連続入力モード（Enter でリレーション作成後もバーを閉じない）の実装
- [ ] 4.2 `npm run test:all` を実行し、既存機能への影響がないことを確認する
- [ ] 4.3 ビジュアルスナップショットを更新する
