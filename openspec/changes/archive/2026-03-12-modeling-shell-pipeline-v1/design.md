## Context

コマンドパレットは現在、一入力一命令の単純な形式です。これを拡張し、複数の命令をパイプで繋いで「データフロー」のように扱えるようにします。

## Goals / Non-Goals

**Goals:**
- パイプ `|` によるコマンドの連結機能。
- 入力中の「実行計画 (Plan)」のリアルタイム可視化。
- パイプラインの対象となるノードのリアルタイム・ハイライト。
- トランザクション的な一括実行（全ステージ完了後に一度だけ保存）。

**Non-Goals:**
- 分岐（Conditional）やループ（Loop）。
- 複雑なシェルスクリプト言語のフル実装。

## Decisions

### 1. `PipelinePlan` 型の定義
```typescript
interface PipelineStage {
  command: string;
  args: string[];
  inputIds: string[];  // 前段から受け取ったもの
  outputIds: string[]; // 次段へ渡すもの
  status: 'pending' | 'active' | 'success' | 'error';
  message: string;
}
```

### 2. ストア拡張: `executePipeline` アクション
**ロジック:**
1.  入力を `|` で分割し、`PipelineStage` の配列を作成。
2.  最初のステージ（通常は `select`）を実行し、対象 ID リストを生成。
3.  以降のステージをループで回し、前段の `outputIds` を使って各アクション（mv, stack等）を適用。
4.  すべての処理がメモリ上のスキーマ（一時的なコピー）に対して行われ、最後に `set` と `saveSchema` を実行。

### 3. ハイライト機能の導入
**設計:** 
- ストアに `highlightedNodeIds: string[]` を追加。
- `TableNode.tsx` で、自分の ID がこの配列に含まれていれば、青い光（`shadow-blue-500/50` など）を纏わせる。
- パレット入力中、各ステージの結果を計算してこの配列を更新し続ける。

### 4. UI 構成 (CommandPalette)
- **Top**: 入力欄。
- **Middle**: パイプラインの各ステージの進捗・予定を表示する「Execution Plan」エリア。
- **Bottom**: 作業セット（対象テーブル名のチップ）を表示する「Working Set」エリア。

## Risks / Trade-offs

- **[Risk]** 大量テーブルに対するリアルタイム・パイプライン計算の負荷。
  - **Mitigation:** パースと計算を `useMemo` でラップし、かつ対象が 1000 件を超える場合はプレビューを簡略化する。
- **[Risk]** パイプライン中のエラー（例：存在しないドメインへの mv）。
  - **Mitigation:** ステージごとにバリデーションを行い、エラーがあるステージ以降は「赤色」で表示し、実行をブロックする。
