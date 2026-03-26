## Context

Modscape のビジュアライザーには2つのパフォーマンスホットスポットがある。

**1. yaml.dump の過剰呼び出し**
`useStore.ts` の `syncToYamlInput()` は `yaml.dump(schema)` でスキーマ全体を YAML 文字列に変換し、YAMLエディタ用の `yamlInput` ステートに反映する。この関数はテーブル追加・更新・位置変更・接続変更など **約30箇所** のミューテーション末尾で呼ばれている。ドラッグ中は毎フレーム `updateNodePosition()` が呼ばれるため、その都度 O(n) のシリアライズが走る。

**2. getDomainBB の毎フレーム再計算**
`CytoscapeCanvas.tsx` の `renderDomainBackgrounds()` / `renderDomainHandles()` は pan/zoom イベントのたびに呼ばれ、各ドメインに対して `getDomainBB()` を実行する。`getDomainBB()` はメンバーノードを全走査して外接矩形を計算するが、pan/zoom ではドメインの構成もノード位置も変わらないため、同じ結果を毎回計算し直している。

## Goals / Non-Goals

**Goals:**
- ドラッグ中の `yaml.dump` 呼び出しを間引き、CPU使用率を削減する
- pan/zoom 時の `getDomainBB` 再計算をキャッシュで回避する
- YAMLエディタとの同期は維持する（遅延は許容するが欠落はしない）

**Non-Goals:**
- `syncToYamlInput()` の呼び出し箇所を削減・整理すること（別改善）
- `CytoscapeCanvas.tsx` のコンポーネント分割（別改善）
- pan/zoom 以外の描画最適化

## Decisions

### 1. syncToYamlInput のデバウンス方式

**決定**: `syncToYamlInput()` 内部にデバウンス（300ms）を実装する。

```
呼び出し元は変更しない → syncToYamlInput() 内部でタイマーを管理
```

**理由**: 約30箇所の呼び出し元を書き換えるとリスクが高い。デバウンスを関数内部に閉じ込めることで、呼び出し側のコードは一切変えずに済む。

**実装方法**:
- モジュールスコープに `let syncTimer: ReturnType<typeof setTimeout> | null = null` を保持
- `syncToYamlInput()` 呼び出し時にタイマーをリセットし、300ms後に実際の `yaml.dump` を実行
- `saveSchema()` は debounce の外（ファイル保存は別途管理済み）なので影響しない

**代替案と却下理由**:
- `useDebouncedCallback` (React Hook): Zustand store 内（React外）なので使えない
- 呼び出し元に `setTimeout` を追加: 30箇所の変更が必要でリスクが高い

**トレードオフ**: ドラッグ終了から最大300ms後にYAMLエディタが更新される。視覚的なキャンバスはリアルタイム更新されるため、実使用上の違和感は最小限。

---

### 2. getDomainBB のキャッシュ方式

**決定**: `renderDomainBackgrounds` / `renderDomainHandles` の呼び出し元（または関数内）に、ドメインごとの BB キャッシュを `Map` で持つ。

**キャッシュキー**: ドメインID + メンバーノードの位置・サイズの文字列ハッシュ
→ ノード位置が変わったらキャッシュミス → 再計算

**実装方法**:
```typescript
// Module-level cache (or ref in CytoscapeCanvas)
const domainBBCache = new Map<string, { key: string; bb: DomainBB }>()

function getDomainBBCached(domainId, memberNodes, schema): DomainBB {
  const key = buildCacheKey(memberNodes, schema) // positions + sizes → string
  const cached = domainBBCache.get(domainId)
  if (cached && cached.key === key) return cached.bb
  const bb = getDomainBB(memberNodes, schema)
  domainBBCache.set(domainId, { key, bb })
  return bb
}
```

**キャッシュ無効化のトリガー**:
- ノード位置が変わる（ドラッグ） → キーが変わる → 自動的にキャッシュミス
- ドメインメンバーが変わる → memberNodes が変わる → キーが変わる
- スキーマ全体リセット時 → キャッシュをクリア（`domainBBCache.clear()`）

**代替案と却下理由**:
- `useMemo` / React の memoization: `getDomainBB` は React コンポーネント外の純粋関数なので使えない
- pan/zoom イベントをスロットリング: 描画の滑らかさが犠牲になるため却下

## Risks / Trade-offs

| リスク | 軽減策 |
|--------|--------|
| デバウンス中にYAMLエディタが古い状態を表示する | 300msは体感的に気にならない範囲。ドラッグ終了後に必ず反映される |
| キャッシュキーの生成コストがキャッシュ節約を上回る | キー生成は O(m) だが getDomainBB 本体も O(m)。キー生成を軽量に保てば問題なし |
| スキーマリセット時にキャッシュが古い値を返す | スキーマ変更イベントで `domainBBCache.clear()` を呼ぶことで防ぐ |
| pan/zoom 中にノード位置が変わるケースでのキャッシュ整合性 | キャッシュキーにノード位置を含めるため、位置変化は自動的に検知される |
