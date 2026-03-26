## ADDED Requirements

### Requirement: getDomainBB 結果のキャッシュ

`getDomainBB()` は同一ドメインに対してメンバーノードの位置・サイズが変化していない場合、前回の計算結果を返さなければならない（SHALL）。

#### Scenario: pan/zoom 中のキャッシュヒット

- **WHEN** pan または zoom が行われ、ドメインのメンバーノード位置が変化していない
- **THEN** `getDomainBB()` はキャッシュされた結果を返し、ノードの走査を行わない

#### Scenario: ノード移動後のキャッシュ無効化

- **WHEN** ドメイン内のテーブルがドラッグされ位置が変わる
- **THEN** 次の `getDomainBB()` 呼び出しでキャッシュミスが発生し、再計算が行われる

#### Scenario: ドメインメンバー変更後のキャッシュ無効化

- **WHEN** ドメインへのテーブルの追加または除去が行われる
- **THEN** 次の `getDomainBB()` 呼び出しでキャッシュミスが発生し、再計算が行われる

### Requirement: スキーマリセット時のキャッシュクリア

スキーマ全体が差し替えられたとき（ファイル切り替え・YAML再読み込みなど）、ドメイン BB キャッシュはすべてクリアされなければならない（SHALL）。

#### Scenario: ファイル切り替え後に古いキャッシュが使われない

- **WHEN** 別の model.yaml ファイルに切り替える
- **THEN** 以前のファイルのドメイン BB がキャッシュから除去され、新しいスキーマで正しく再計算される

### Requirement: キャッシュはドメイン背景とドメインハンドルの両方に適用される

`renderDomainBackgrounds()` と `renderDomainHandles()` のどちらも、同じキャッシュを利用して `getDomainBB()` の再計算を回避しなければならない（SHALL）。

#### Scenario: 同一フレームでの重複計算を回避

- **WHEN** 同一フレーム内で `renderDomainBackgrounds()` と `renderDomainHandles()` の両方が呼ばれる
- **THEN** 同一ドメインの BB は 1回だけ計算される
