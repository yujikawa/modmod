## Why

AI エージェントが `model.yaml` を直接編集すると、スキーマ違反や既存データの破壊が起きやすい。CLI をモデル操作の安全な API として提供することで、AI エージェントはバリデーション保証された操作だけを使えばよくなる。

## What Changes

- CLI にリソース型 mutation コマンド群を追加する（`modscape table add` など）
- 対象リソース: `table` / `column` / `relationship` / `lineage` / `domain`
- 各リソースに適切な操作（list / get / add / update / remove）を実装する
- 全コマンドに `--json` オプションを追加し、機械可読な出力をサポートする
- `src/templates/rules.md` に mutation CLI セクションを追加し、AI エージェントへの利用指針を明記する
- `src/templates/claude/modeling.md` などのエージェントテンプレートを更新し、CLI コマンドを優先利用するよう指示する

**操作マトリクス:**

| リソース | list | get | add | update | remove |
|---------|------|-----|-----|--------|--------|
| table | ✅ | ✅ | ✅ | ✅ | ✅ |
| column | — | — | ✅ | ✅ | ✅ |
| relationship | ✅ | — | ✅ | — | ✅ |
| lineage | ✅ | — | ✅ | — | ✅ |
| domain | ✅ | ✅ | ✅ | ✅ | ✅ |
| domain member | — | — | ✅ | — | ✅ |

## Capabilities

### New Capabilities

- `model-mutation-commands`: リソース型 CLI mutation コマンド群（table/column/relationship/lineage/domain の CRUD 操作）
- `agent-mutation-workflow`: rules.md およびエージェントテンプレートへの mutation CLI 利用ガイドの追加

### Modified Capabilities

（なし）

## Impact

- `src/table.js` / `src/column.js` / `src/relationship.js` / `src/lineage.js` / `src/domain.js`: 新規追加
- `src/index.js`: リソース型サブコマンドの登録
- `src/templates/rules.md`: Section 追加
- `src/templates/claude/modeling.md`, `codex/`, `gemini/` テンプレート: エージェント指示の更新
