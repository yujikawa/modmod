## ADDED Requirements

### Requirement: Static mode node drag position persistence
staticモード（`isCliMode=false`）でノードをドラッグした場合、位置変更はセッション内のメモリ上の `schema.layout` に反映されなければならない（SHALL）。ファイルへの書き込みは行わない。

#### Scenario: Single node drag in static mode
- **WHEN** staticモードでユーザーがテーブルノードをドラッグして離す
- **THEN** ノードは新しい位置に留まり、スキーマ同期後も元の位置に戻らない

#### Scenario: Multi-node drag in static mode
- **WHEN** staticモードでユーザーが複数ノードを選択してドラッグして離す
- **THEN** すべての選択ノードが新しい位置に留まる

#### Scenario: File is not written in static mode
- **WHEN** staticモードでドラッグ操作を行う
- **THEN** ファイルシステムへの書き込みは発生しない（`saveSchema` は早期リターンする）
