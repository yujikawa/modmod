## Context

`App.tsx` の `onNodeDragStop` と `onSelectionDragStop` は、ドラッグ終了時にノード位置をストアへ書き戻す処理の先頭で `if (!isCliMode) return;` を実行している。このガードの意図は「CLIモード以外ではファイルに保存しない」だったと思われるが、実際にはメモリ上の `schema.layout` 更新も行われなくなってしまっている。

ファイル保存は `updateNodePosition` → `saveSchema()` の連鎖の末尾で行われており、`saveSchema()` 自体に `if (!isCliMode ...) return;` のガードがある。つまり App.tsx 側のガードは二重チェックであり、かつ副作用としてメモリ更新まで阻害している。

## Goals / Non-Goals

**Goals:**
- staticモードでもドラッグ操作がメモリ上の `schema.layout` に反映される
- セッション内でノード位置が維持される（ページリロードまで）

**Non-Goals:**
- staticビルドでのレイアウト永続化（ファイル保存・localStorage保存）
- その他のstatic/CLIモード差分の解消

## Decisions

### App.tsx のガードを削除する

`onNodeDragStop` と `onSelectionDragStop` の `if (!isCliMode) return;` を削除する。

**理由**: ファイル保存の責務は `saveSchema()` が持っており、そちらに `!isCliMode` チェックがある。App.tsx 側のガードは不要であり、削除してもファイル書き込みは発生しない。

**検討した代替案**: `updateNodePosition` の内部でモード分岐する案もあったが、関心の分離を壊すため却下。ストア側のロジックには手を加えない方針とした。

## Risks / Trade-offs

- **リスク**: staticモードでのドラッグによる `syncToYamlInput()` 呼び出しがエディタタブのYAML表示を更新する → 軽微、エディタは `lastUpdateSource` で制御されており影響は限定的
- **リスク**: `saveSchema()` が呼ばれるがデバウンスタイマー後に `!isCliMode` で早期リターンするため、パフォーマンス上の懸念はない
