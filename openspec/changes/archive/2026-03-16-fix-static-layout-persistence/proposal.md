## Why

staticビルド（`modscape build`で生成される静的HTML）では、ノードのドラッグによる位置変更が `isCliMode` ガードによってメモリ上のストアに反映されず、スキーマ同期のたびに元の位置に戻ってしまう。ファイル保存の抑止とメモリ更新の抑止が混在しているバグで、閲覧用途のstatic buildで操作性を損ねている。

## What Changes

- `App.tsx` の `onNodeDragStop` から `if (!isCliMode) return;` ガードを削除
- `App.tsx` の `onSelectionDragStop` から `if (!isCliMode) return;` ガードを削除
- これにより staticモードでもドラッグ位置がメモリ上の `schema.layout` に反映される
- ファイル保存は `saveSchema()` 内の `if (!isCliMode ...) return;` が引き続き担保するため、ファイルへの書き込みは発生しない

## Capabilities

### New Capabilities

- `static-layout-persistence`: staticビルドモードでノードのドラッグ位置がセッション内で保持される

### Modified Capabilities

（なし。既存のファイル保存ロジックは変更しない）

## Impact

- **変更ファイル**: `visualizer/src/App.tsx`（2行削除のみ）
- **影響範囲**: staticビルド（`isCliMode=false`）のドラッグ挙動のみ
- **CLIモードへの影響**: なし（ガード削除後も `saveSchema()` 内のガードで保存は担保される）
- **破壊的変更**: なし
