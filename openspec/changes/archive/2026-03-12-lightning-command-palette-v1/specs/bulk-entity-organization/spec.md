## ADDED Requirements

### Requirement: ドメイン一括割り当てエンジン
ストアは、複数のテーブル ID を受け取り、それらを特定のドメインへ一括で割り当てる機能を備えなければならない (SHALL implement bulk assignment)。

#### Scenario: 複数テーブルのドメイン所属変更
- **WHEN** `bulkAssignTablesToDomain` がテーブル ID リスト `[t1, t2]` とドメイン ID `d1` で呼び出される
- **THEN** YAML データ内の `d1` ドメインの `tables` リストに `t1, t2` が追加され、他のドメインからは削除される

### Requirement: 効率的な永続化
一括操作の際、システムはファイルへの書き込み回数を最小限に抑えなければならない (SHALL optimize persistence)。

#### Scenario: 一括操作後の単一保存
- **WHEN** 10 個のテーブルを一度に移動するコマンドが実行される
- **THEN** ファイルへの `save` リクエストは 1 回だけ発行される
