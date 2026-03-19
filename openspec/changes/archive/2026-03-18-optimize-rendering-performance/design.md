## Context

現在のModscapeはZustandの単一storeオブジェクト（875行）にすべての状態を保持しており、コンポーネントはstore全体を購読している。その結果、テーブル1個のプロパティ変更でも全コンポーネントが再レンダリングされる。

App.tsxではschema変更のたびに全ノード・全エッジを再生成しており、200テーブル規模では毎回6,000以上のDOM要素が再構築される。加えて、DetailPanel（69KB）・CommandPalette（16KB）など主要コンポーネントにReact.memoがなく、パスハイライト処理でもO(m)の線形探索が使われている。

## Goals / Non-Goals

**Goals:**
- 200テーブル規模でのインタラクション（選択・移動・編集）をストレスなく操作できるようにする
- テーブル1個の変更が他のテーブルの再レンダリングをトリガーしない構造にする
- YAML・ビジュアルエディタの同期やYAMLフォーマットには一切変更を加えない

**Non-Goals:**
- 500〜1000テーブル以上への対応（React Flowのアーキテクチャ的な限界）
- React Flowの仮想化（viewport外ノードの非描画）の導入
- storeの大幅なリファクタリング（スライス分割など）

## Decisions

### 1. Zustand shallow比較 + 個別セレクター

**採用**: `useStore(state => state.xxx)` と `useShallow` を使い、コンポーネントが必要なフィールドのみを購読する。

**却下した代替案**: storeをスライスに分割する → store全体の構造変更になりリスクが高い。セレクターパターンの方が最小限の変更で最大の効果が得られる。

### 2. `useMemo` による安定したノード/エッジ参照

**採用**: App.tsxのノード生成処理を `useMemo` でメモ化し、依存配列を精査する。特に `selectedTableId` や `pathFinderResult` の変化がノード全体の再生成をトリガーしないよう分離する。

**却下した代替案**: React Flowの `useNodesState` を直接使う差分更新 → 現在のschema駆動の設計と衝突するため採用しない。

### 3. `React.memo` + `useCallback` の追加

**採用**: DetailPanel・CommandPalette・Sidebar・RightPanel等に `React.memo` を追加。イベントハンドラには `useCallback` を付与する。

対象を「大きくて再レンダリングコストが高いコンポーネント」に限定し、すべてに適用するような過剰なmemoizationは避ける。

### 4. Setによるパスハイライト最適化

**採用**: `pathFinderResult.edgeIds` を `Set<string>` で保持し、`includes()` を `has()` に変更する。

### 5. MapによるO(1)ルックアップ

**採用**: App.tsxのノード生成ループ内で `.find(n => n.id === ...)` を繰り返している箇所を、事前に `Map<id, node>` を構築してO(1)参照に変更する。

## Risks / Trade-offs

- **[Risk] React.memo追加によるバグ**: props比較が期待通りに動かず、更新が画面に反映されないケースが起こりうる。→ 各コンポーネントに変更後の動作確認をタスクに含める。
- **[Risk] useShallowの配列/オブジェクト比較**: 配列やオブジェクトを購読する場合、shallow比較が正しく動作しない場合がある。→ プリミティブ値か安定したIDの配列を購読するよう設計する。
- **[Trade-off] 最適化の恩恵は200テーブル規模まで**: React Flowは500〜1000ノード以上では本質的に重くなるため、本対応の効果範囲は200テーブル前後が上限。それ以上はReact Flowの代替（WebGL等）が必要になる。
