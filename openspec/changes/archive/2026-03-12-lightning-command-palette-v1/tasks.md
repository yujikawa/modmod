## 1. サイドバーのクリーンアップ

- [x] 1.1 `QuickConnectTab.tsx` から `command` モードと `mv` 関連のロジックを削除し、純粋な接続機能に戻す

## 2. ストアの拡張

- [x] 2.1 `useStore.ts` に `isCommandPaletteOpen: boolean` 状態と setter を追加する

## 3. Command Palette の実装

- [x] 3.1 `CommandPalette.tsx` を新規作成し、画面中央にフローティング表示する
- [x] 3.2 `App.tsx` に `Ctrl+K` (または `Cmd+K`) でパレットをトグルするショートカットを追加する
- [x] 3.3 `mv` コマンドや `search` コマンドのパースと実行ロジックを `CommandPalette` に実装する

## 4. 検証

- [x] 4.1 `npm run test:all` で動作を確認し、スナップショットを更新する
