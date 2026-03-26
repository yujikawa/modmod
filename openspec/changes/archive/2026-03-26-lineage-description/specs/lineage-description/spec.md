## ADDED Requirements

### Requirement: リネージエッジへのdescription付与
YAMLの `lineage` エントリはオプションフィールド `description` を持てなければならない（SHALL）。`description` が省略された既存エントリは引き続き正常に動作しなければならない（SHALL）。

#### Scenario: descriptionなしの既存エントリが動作する
- **WHEN** `description` フィールドを持たないリネージエントリがYAMLに存在する
- **THEN** キャンバスは正常にリネージエッジを描画する

#### Scenario: descriptionありのエントリをYAMLに書ける
- **WHEN** ユーザーが `description: "Filter: status != 'deleted'"` をリネージエントリに追加する
- **THEN** YAMLパースが正常に完了し、descriptionがモデルに保持される

### Requirement: descriptionを持つエッジのキャンバス上のⓘインジケーター表示
`description` が設定されているリネージエッジはキャンバス上でⓘマークを表示しなければならない（SHALL）。`description` が未設定のエッジにはⓘマークを表示してはならない（SHALL NOT）。

#### Scenario: descriptionありエッジにⓘが表示される
- **WHEN** `description` が設定されたリネージエッジがキャンバスに描画される
- **THEN** そのエッジ上にⓘラベルが表示される

#### Scenario: descriptionなしエッジにⓘが表示されない
- **WHEN** `description` が設定されていないリネージエッジがキャンバスに描画される
- **THEN** そのエッジ上にⓘラベルは表示されない

### Requirement: DetailPanelでのdescription表示と編集
リネージエッジをクリックしたとき、DetailPanelに `description` を表示・編集できなければならない（SHALL）。編集した内容はYAMLに書き戻されなければならない（SHALL）。

#### Scenario: descriptionありエッジをクリックするとDetailPanelに表示される
- **WHEN** ユーザーが `description` を持つリネージエッジをクリックする
- **THEN** DetailPanelにdescriptionの内容が表示される

#### Scenario: DetailPanelでdescriptionを編集するとYAMLに反映される
- **WHEN** ユーザーがDetailPanelのdescription入力欄を編集してフォーカスを外す
- **THEN** YAMLの該当リネージエントリの `description` が更新される

#### Scenario: descriptionなしエッジをクリックするとDetailPanelに空の入力欄が表示される
- **WHEN** ユーザーが `description` を持たないリネージエッジをクリックする
- **THEN** DetailPanelにdescriptionの空の入力欄が表示される

### Requirement: CLIによるdescriptionの追加と更新
`modscape lineage add` コマンドは `--description` オプションを受け付けなければならない（SHALL）。`modscape lineage update` コマンドは既存リネージエントリの `description` を更新できなければならない（SHALL）。

#### Scenario: lineage add --description でdescriptionを付けて追加できる
- **WHEN** `modscape lineage add model.yaml --from A --to B --description "..."` を実行する
- **THEN** YAMLに `description` フィールドを含むリネージエントリが追加される

#### Scenario: lineage update で既存エントリのdescriptionを更新できる
- **WHEN** `modscape lineage update model.yaml --from A --to B --description "新しい説明"` を実行する
- **THEN** 該当エントリの `description` が更新される

#### Scenario: lineage update で存在しないエントリを指定するとエラーになる
- **WHEN** 存在しない `from`/`to` の組み合わせで `modscape lineage update` を実行する
- **THEN** エラーメッセージが出力され、YAMLは変更されない
