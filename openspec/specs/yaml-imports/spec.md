### Requirement: importsセクションによるテーブル参照
YAMLファイルは `imports:` セクションを持つことができ、他のYAMLファイルで定義されたテーブルをコピーなしで参照しなければならない。

#### Scenario: 全テーブルをimport
- **WHEN** YAMLに `imports: [{ from: ../other.yaml }]` が記述されている
- **THEN** `modscape dev` / `modscape build` 実行時に `other.yaml` の全テーブルが解決済みスキーマに含まれる

#### Scenario: 特定テーブルをidsで絞り込んでimport
- **WHEN** YAMLに `imports: [{ from: ../conformed.yaml, ids: [dim_date, dim_customer] }]` が記述されている
- **THEN** `dim_date` と `dim_customer` のみが解決済みスキーマに含まれ、`conformed.yaml` の他のテーブルは含まれない

#### Scenario: ローカル定義がimportより優先される
- **WHEN** ローカルYAMLとimport元YAMLに同一IDのテーブルが存在する
- **THEN** ローカルの定義が使用され、import元の定義は無視される

#### Scenario: importを持たない既存YAMLへの影響なし
- **WHEN** `imports:` セクションを持たないYAMLを読み込む
- **THEN** 従来と同じ動作となり、影響を受けない

### Requirement: importされたテーブルのドメイン・リレーション参照
importされたテーブルのIDは、`domains.members` / `relationships` / `lineage` から通常のローカルテーブルと同様に参照できなければならない。

#### Scenario: importテーブルをdomainメンバーに追加
- **WHEN** `domains[].members` にimportされたテーブルのIDが記述されている
- **THEN** キャンバス上でそのテーブルが対象domainの中に表示される

#### Scenario: importテーブルをリレーションに使用
- **WHEN** `relationships` にimportされたテーブルIDを含むエントリが記述されている
- **THEN** キャンバス上でERエッジが正しく描画される

#### Scenario: importテーブルをリネージに使用
- **WHEN** `lineage` にimportされたテーブルIDを含むエントリが記述されている
- **THEN** キャンバス上でリネージエッジが正しく描画される

### Requirement: import元ファイル変更時のhot-reload
`modscape dev` 実行中にimport元のYAMLファイルが変更された場合、キャンバスが自動的に再読み込みされなければならない。

#### Scenario: import元ファイルの変更を検知
- **WHEN** `modscape dev` 実行中にimport元のYAMLファイルが保存される
- **THEN** ブラウザのキャンバスが自動的に更新される

### Requirement: import解決エラー時の安全な継続
import先ファイルが存在しない、または `ids:` に指定したIDが見つからない場合でも、サーバーはクラッシュせず警告を出力して処理を継続しなければならない。

#### Scenario: import先ファイルが存在しない
- **WHEN** `from:` に存在しないファイルパスが指定されている
- **THEN** 警告ログが出力され、そのimportエントリはスキップされ、残りのスキーマは正常に返される

#### Scenario: ids指定のIDが見つからない
- **WHEN** `ids:` に指定したIDがimport元YAMLに存在しない
- **THEN** 警告ログが出力され、そのIDはスキップされ、残りの処理は継続される

### Requirement: importされたテーブルの読み取り専用表示
visualizer上でimportされたテーブルは編集不可として表示されなければならない。

#### Scenario: DetailPanelで読み取り専用バッジを表示
- **WHEN** importされたテーブルを選択してDetailPanelを開く
- **THEN** "Imported — read only" バッジが表示され、名前フィールドは編集不可となる

#### Scenario: 保存時にimportテーブルが本体YAMLに書き込まれない
- **WHEN** importされたテーブルを含むモデルを保存する
- **THEN** 本体YAMLにはimportされたテーブルの定義は書き込まれず、`imports:` セクションのみが保持される
