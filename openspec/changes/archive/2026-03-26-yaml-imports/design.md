## Context

現在 `modscape dev` / `modscape build` は複数のYAMLファイルを引数に取ることができるが、ファイル間でテーブルを参照する仕組みがない。コンフォームドディメンションのような共通テーブルを複数のモデルで使う場合、各YAMLに同じ定義をコピーする必要があり、定義の重複と保守コストが生じている。

`src/dev.js` の `/api/model` エンドポイントは `yaml.load(readFileSync(path))` でYAMLをそのまま返す。ブラウザ（visualizer）はファイルシステムにアクセスできないため、import解決はサーバーサイドで完結させる必要がある。

## Goals / Non-Goals

**Goals:**
- YAMLに `imports:` セクションを追加し、他のYAMLファイルから特定テーブル（`ids:` で絞り込み可、省略で全テーブル）を参照できるようにする
- `dev` / `build` のサーバーサイドでimportを解決し、visualizerには解決済みスキーマを返す（visualizer側の変更は最小限）
- importされたテーブルのIDは `domains.members` / `relationships` / `lineage` から通常通り参照できる
- import元ファイルの変更もhot-reloadに反映する
- 既存YAMLとの後方互換性を保つ

**Non-Goals:**
- ブラウザ側でのimport解決
- 循環importの完全な検出・防止（基本的なガードのみ）
- importされたテーブルのキャンバス上での視覚的区別（将来の拡張）
- `imports:` のネスト（import先のYAMLがさらにimportを持つケース）

## Decisions

### 1. import解決はサーバーサイド（`/api/model`）で行う

ブラウザはファイルシステムにアクセスできないため、visualizerに手を加えずに解決できる唯一の場所。`/api/model` がレスポンスを返す前に `imports:` を解決してマージし、`imports:` キーを除去して返す。visualizer側は解決済みスキーマを受け取るため変更不要。

**代替案**: visualizer側で解決する → ブラウザからファイルシステムを読めないため不可

### 2. ローカルテーブルがimportより優先（first-local-wins）

同一IDのテーブルがローカルと import元の両方に存在する場合、ローカルの定義を使う。これにより、importしたテーブルをローカルで上書きカスタマイズするワークフローが成立する。

### 3. import元ファイルをchokidarの監視対象に追加

`/api/model` 呼び出し時にimport先パスを解析し、`wss`（WebSocketServer）経由でbroadcastするchokidarの監視対象に動的に追加する。import元が変わっても hot-reload が効くようにする。

### 4. `build.js` にも同じ解決ロジックを適用

`build.js` は静的ファイルを生成するため、ビルド時にも同じimport解決を行い、生成物に解決済みスキーマを埋め込む。共通の `resolveImports(schema, basePath)` 関数として切り出して両者で使う。

### 5. `isImported` フラグをテーブルに付与しない（visualizer変更なし）

importされたテーブルを読み取り専用にする視覚的区別は今回のスコープ外。将来の拡張として `isImported: true` フラグを付与する余地は残すが、現時点ではimportされたテーブルは通常ノードとして扱う。

## Risks / Trade-offs

- **循環import** → `resolveImports` 内で訪問済みパスを `Set` で管理し、循環検出時は警告を出してスキップする
- **import先ファイルが存在しない** → エラーログを出力してそのエントリをスキップする（サーバーはクラッシュしない）
- **`ids:` に存在しないIDを指定した場合** → 警告ログを出力するが処理は継続する（`extract` コマンドと同じ挙動）
- **ビルド成果物の肥大化** → import解決後のスキーマをそのまま埋め込むため、importしたテーブル数に比例してビルドサイズが増加する。現時点では許容範囲とする
