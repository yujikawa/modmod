## ADDED Requirements

### Requirement: rules.md に mutation CLI セクションを追加する
`src/templates/rules.md` は mutation CLI コマンドの利用方法を説明するセクションを持たなければならない（SHALL）。AI エージェントは YAML を直接編集する前に mutation CLI の使用を検討しなければならない（SHALL）。

#### Scenario: AI が新規テーブルを追加する
- **WHEN** AI エージェントが新規テーブルの追加を求められる
- **THEN** `modscape table add` を使うよう rules.md に記載されている

#### Scenario: AI が操作前に存在確認する
- **WHEN** AI エージェントがテーブルを更新しようとする
- **THEN** `modscape table get` で存在確認してから `add` または `update` を選ぶよう rules.md に記載されている

#### Scenario: table add 後の layout 更新指示
- **WHEN** AI がテーブルを追加した後
- **THEN** `modscape layout` を実行して座標を更新するよう rules.md に記載されている

### Requirement: エージェントテンプレートに CLI 優先指示を追加する
`src/templates/claude/modeling.md` および対応する codex / gemini テンプレートは、YAML 直接編集より mutation CLI を優先するよう AI エージェントに指示しなければならない（SHALL）。

#### Scenario: Claude modeling テンプレートの指示
- **WHEN** Claude エージェントが modeling セッションを開始する
- **THEN** テンプレートに「YAML を直接編集する前に mutation CLI コマンドを使え」という指示が含まれている

#### Scenario: 複数エージェントへの一貫した指示
- **WHEN** Claude / Codex / Gemini の各テンプレートを確認する
- **THEN** いずれも mutation CLI 優先の指示を含んでいる
