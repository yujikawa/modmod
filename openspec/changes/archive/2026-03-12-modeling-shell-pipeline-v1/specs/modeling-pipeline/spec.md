## ADDED Requirements

### Requirement: コマンドのパイプライン連結
システムは、パイプ `|` 文字によって複数のコマンドを連結し、前段の出力を次段の入力として実行できなければならない (SHALL support command piping)。

#### Scenario: 連結されたコマンドの実行
- **WHEN** ユーザーが `select fact_* | mv Sales` と入力して実行する
- **THEN** `fact_` で始まる全テーブルが `Sales` ドメインへ一括移動される

### Requirement: リアルタイム実行計画の表示
システムは、コマンド入力中にパイプラインの各ステージの内容と予測結果をリアルタイムに表示しなければならない (SHALL show execution plan)。

#### Scenario: 入力中のプラン表示
- **WHEN** ユーザーが `select fact_* | mv ` まで入力する
- **THEN** パレット内に「1. Select: 12 tables matched」「2. Move: Waiting for domain...」というプランが表示される

### Requirement: ライブ・エンティティ・ハイライト
システムは、パイプラインの現在のステージで対象となっているエンティティをキャンバス上で強調表示しなければならない (SHALL highlight target entities)。

#### Scenario: 対象テーブルのハイライト
- **WHEN** ユーザーが `select fact_*` と入力する
- **THEN** キャンバス上の `fact_` で始まる全テーブルノードが青くハイライトされる
