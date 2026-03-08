## Context

現在のツールバーはキャンバス上の絶対座標に浮いており、サイドバーのタブ切り替えはサイドバー内部に限定されています。これらを一つにまとめ、IDE（統合開発環境）の「アクティビティバー」のような役割を持つ垂直バーをサイドバーの右端に作成します。

## Goals / Non-Goals

**Goals:**
- キャンバス上の浮遊ツールバーを廃止し、操作系をサイドバー右端に集約する。
- サイドバー開閉時でも主要なツール（追加、表示切替）に常にアクセス可能にする。
- プロフェッショナルなツールとしての統一感（IDEライクなUX）を実現する。

**Non-Goals:**
- ツール自体の機能変更（追加や表示切替のロジック自体は維持）。
- ショートカットキー機能の変更。

## Decisions

### 1. 2列構成のサイドバー・レイアウト
`Sidebar.tsx` を `flex flex-row` コンテナに変更します。
- **左側**: `SidebarContent` (既存の Header, FileSelector, TabsContent)。サイドバーが閉じている時は `hidden`（またはアイコンのみの極細幅）。
- **右側**: `ActivityBar` (幅固定 50px-60px)。常に表示され、境界線としての役割も果たす。

### 2. アクティビティバーの機能グループ
垂直バー内でアイコンをグループ化し、視認性を高めます。
- **Top**: アプリロゴ（クリックでサイドバー全開閉）。
- **Section 1**: パネル切り替え（Editor / Entities）。
- **Section 2**: 表示切り替え（ER / Lineage / Annotation）。
- **Section 3**: アクション（Add Table / Domain / Sticky / Auto Layout）。
- **Bottom**: システム（Theme / Help）。

### 3. インタラクティブ・トグル・ロジック
タブアイコン（Editor / Entities）のクリック時の動作を定義します。
- `isSidebarOpen === false` の時にクリック → サイドバーを開き、そのタブを表示。
- `isSidebarOpen === true` かつ別タブが表示されている時にクリック → タブを切り替え。
- `isSidebarOpen === true` かつ同じタブが表示されている時にクリック → サイドバーを閉じる。

### 4. デザイン・テーマの適用
IDEのような階層感を出すため、背景色を分けます。
- **Main Panel**: `bg-slate-900` (Dark) / `bg-white` (Light)
- **Activity Bar**: `bg-slate-950` (Dark) / `bg-slate-50` (Light)
- **Border**: アクティビティバーの左側に細い境界線を追加。

## Risks / Trade-offs

- **[Risk] 追加位置の把握** → ツールバーが画面左端に移動するため、オブジェクト追加時の座標計算を「画面中央」に保つよう注意が必要。
  - **Mitigation**: `screenToFlowPosition` の引数をウィンドウ中央（`window.innerWidth / 2`）で固定し、サイドバーの幅に依存しないようにする。
- **[Risk] モバイル表示** → サイドバーが横に広がるとキャンバスが狭くなる。
  - **Mitigation**: 画面幅が一定以下の場合はアクティビティバーのみにするか、オーバーレイ形式に変更する余地を残す（今回はデスクトップ優先）。
