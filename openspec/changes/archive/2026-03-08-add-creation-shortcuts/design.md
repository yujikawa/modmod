## Context

熟練したユーザーや、思考を止めずにモデリングを行いたいデザイナーにとって、マウス操作は一つのボトルネックとなります。本設計では、業界標準（Figma, Miro等）に準拠した単体キー・ショートカットを導入し、キーボード主体でのオブジェクト作成を可能にします。

## Goals / Non-Goals

**Goals:**
- T, D, S キーによるクイック作成を実装する。
- ユーザーが見ている現在の Viewport の中心にオブジェクトを配置する。
- 誤入力（編集中など）を防ぐための強固なガードを実装する。

**Non-Goals:**
- 修飾キー（Cmd/Ctrl）を必須とするショートカットの大量追加（今回は単体キーを優先）。
- オブジェクト作成以外の複雑なショートカットの導入。

## Decisions

### 1. グローバルキーボードイベントの統合
`App.tsx` 内の `useEffect` によるイベントリスナー `handleKeyDown` を拡張します。
- **キー判定**: `e.key.toLowerCase()` を使用し、大文字・小文字を問わず反応するようにします。
- **競合回避**: 既存の `Escape`（選択解除）や `Arrow`（スクロール）の処理と共存させ、適切な順序で実行します。

### 2. 厳格な「入力中」判定 (Typing Guard)
誤ってオブジェクトを作成しないよう、以下の要素にフォーカスがある場合はショートカットを無視します。
- `tagName === 'INPUT'`
- `tagName === 'TEXTAREA'`
- `hasAttribute('contenteditable')`
- `classList.contains('cm-content')` (CodeMirror エディタ)

### 3. Viewport 中央への動的配置
React Flow の `screenToFlowPosition` ユーティリティを使用し、以下の計算式で配置座標を算出します。
- **中心点 (Center)**: `window.innerWidth / 2`, `window.innerHeight / 2`
- **オフセット調整**: 各オブジェクトのデフォルトサイズ（Table: 320x250, Domain: 600x400, Sticky: 120x80）の半分を差し引き、中心が正確に合うようにします。

## Risks / Trade-offs

- **[Risk] 他のショートカットとの競合** → ブラウザの標準機能や将来の拡張機能と競合する可能性。
  - **Mitigation**: 今回は Alt や Cmd を使わない単体キー（かつ非入力時のみ）に限定することで、ブラウザの基本操作（Ctrl+T 等）を妨げないようにしています。
- **[Risk] 連続入力による重複** → キーを押しっぱなしにすると大量に生成される。
  - **Mitigation**: `e.repeat` が true の場合は無視する処理を加えるか、あるいは追加後に自動選択（Selected）されることで「追加 ＋ 即編集」のフローを確立し、無意識な連打を防ぎます。
