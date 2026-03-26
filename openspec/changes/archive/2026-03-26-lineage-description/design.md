## Context

現在の `LineageEdge` は `from` と `to` の2フィールドのみ。キャンバス上ではリネージエッジはシンプルな矢印として描かれ、変換の意味を持たない。DetailPanelはすでに `selectedEdgeId` を持ちリネージエッジの選択状態を扱えるが、表示内容は固定テキストのみで編集機能はない。CLIの `modscape lineage` コマンドは `list`・`add`・`remove` のみ。

## Goals / Non-Goals

**Goals:**
- `LineageEdge` に `description?: string` を追加し、後方互換を保つ
- descriptionが設定されたエッジにキャンバス上でⓘラベルを表示する
- DetailPanelのリネージパネルでdescriptionを表示・編集できるようにする
- CLIで `lineage add --description` および `lineage update` をサポートする

**Non-Goals:**
- descriptionに基づくフィルタリング・検索（将来の拡張）
- descriptionからのSQL/dbtコード自動生成
- エッジ上へのツールチップ表示（ホバーUIは今回スコープ外）
- `transform` のような構造化フィールド（自由記述のみ）

## Decisions

### 1. フィールド名は `description`

**決定:** `description` 1フィールドの自由記述テキスト。

**理由:** `table`・`domain`・`consumer` がいずれも `description?: string` を使っており、スキーマの一貫性がある。`label`/`note`/`condition` と分けることも検討したが、フィルター条件もSCDの変換説明も「説明文」として自由に書けるほうがエンジニア・AI両方にとって低摩擦。

### 2. キャンバスのⓘラベルはCytoscapeのedge labelとして実装

**決定:** `description` ありのエッジに対して Cytoscape CSS の `label: 'ⓘ'` を付与する。

**理由:** Cytoscapeはエッジラベルをネイティブサポートしており、DOMノードと混在するキャンバス環境でも確実に表示できる。HTMLオーバーレイでのアイコン実装は位置計算が複雑になるため採用しない。

### 3. DetailPanelの編集はZustandの `updateLineageDescription` アクション経由

**決定:** `useStore` に `updateLineageDescription(from: string, to: string, description: string)` を追加し、DetailPanelからYAML更新と再レンダリングを行う。

**理由:** 既存のtable/column更新と同じパターン（store → YAML書き戻し）に揃えることで実装コストを最小化する。

### 4. CLIは `add --description` と新規 `update` コマンドを追加

**決定:** `lineage add` に `--description` オプションを追加。既存エントリのdescription更新は `lineage update --from X --to Y --description "..."` として新規追加する。

**理由:** `add` は新規登録、`update` は既存更新、という責務分離でCLI操作が明確になる。

## Risks / Trade-offs

- **[Risk] Cytoscapeのエッジラベル位置がエッジ密度によって重なる** → ⓘは短い1文字なので影響は小さい。問題が出れば `text-margin-x` 等で微調整する。
- **[Trade-off] 自由記述のため機械的な解析ができない** → 将来的に構造化が必要になった場合はフィールドを追加拡張する（descriptionは残す）。
