## Why

現在のフローティングツールバー（`CanvasToolbar`）は、機能追加に伴い縦に長くなってきており、キャンバス上のノード（テーブル等）と重なって操作を妨げる問題が発生しています。また、サイドバー内の「タブ（Editor/Entities）」がサイドバーを閉じた際に実質的に機能していない点も課題です。これらをサイドバーの右端に「アクティビティバー（Activity Bar）」として統合・集約することで、キャンバスを最大化し、一貫性のある操作体系を構築します。

## What Changes

- **フローティングツールバーの廃止**: キャンバス上に浮いている `CanvasToolbar.tsx` を削除します。
- **サイドバーのリデザイン (flex-row構成)**: `Sidebar.tsx` を、エディタ等のコンテンツを表示する「メインパネル」と、常にアイコンが表示される「アクティビティバー」の2列構成に変更します。
- **アクティビティバーの新設**:
    - **最上部**: アプリロゴを表示（サイドバー全体の開閉トグルを兼ねる）。
    - **上部**: パネル切り替え（Editor / Entities）。
    - **中部**: 表示切り替え（ER / Lineage / Annotation）およびオブジェクト追加（Table / Domain / Sticky）。
    - **下部**: システム操作（Layout / Help / Theme）。
- **サイドバー開閉挙動の最適化**: アクティビティバーのアイコン（Ed/En）をクリックすることで、サイドバーを展開/折り畳み/切り替えできるようにします。

## Capabilities

### New Capabilities
- なし

### Modified Capabilities
- `sidebar-ui`: サイドバーの構造を「アクティビティバー」を含む2列構成に更新し、ツールバー機能の統合に関する要件を追加します。

## Impact

- `visualizer/src/components/Sidebar/Sidebar.tsx`: 大幅なレイアウト変更。
- `visualizer/src/components/CanvasToolbar.tsx`: 廃止・削除。
- `visualizer/src/App.tsx`: `CanvasToolbar` の読み込みと配置の削除。
- `visualizer/src/store/useStore.ts`: サイドバー開閉とタブ切り替えの連動ロジックの調整。
