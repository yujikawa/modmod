## Why

テーブルのドラッグ操作や頻繁なスキーマ編集の際に、不要な重い処理が毎フレーム実行されており、大規模モデル（100テーブル以上）でのパフォーマンスが低下している。操作の滑らかさとレスポンスを改善する。

## What Changes

- `syncToYamlInput()` にデバウンス（300ms）を導入し、高頻度ミューテーション中の `yaml.dump()` 呼び出しを間引く
- `getDomainBB()` の計算結果をドメインIDと入力値単位でキャッシュし、pan/zoom のたびの再計算を防ぐ

## Capabilities

### New Capabilities

- `yaml-dump-debounce`: スキーマの変更が頻発する場面（ドラッグ中など）での yaml.dump 呼び出しをデバウンスで間引き、YAMLエディタへの同期コストを削減する
- `domain-bb-cache`: getDomainBB() の結果をドメインID単位でメモ化し、pan/zoom 時のバウンディングボックス再計算を回避する

### Modified Capabilities

（なし）

## Impact

- `visualizer/src/store/useStore.ts` — `syncToYamlInput()` のデバウンス実装
- `visualizer/src/components/CytoscapeCanvas.tsx` — `getDomainBB()` のキャッシュ実装
- YAMLエディタの表示更新タイミングが最大300ms遅延する（ドラッグ終了後に反映）
- pan/zoom のフレームレート向上（ドメイン数が多いモデルで効果大）
