## ADDED Requirements

### Requirement: 複数選択用ツールバー
システムは、複数のエンティティが選択された際に、一括操作のための専用ツールバーを表示しなければならない (SHALL show multi-selection toolbar)。

#### Scenario: 複数テーブル選択時の表示
- **WHEN** ユーザーがキャンバス上で 2 つ以上のテーブルを選択する
- **THEN** 画面右上に「N Tables Selected」というラベルと、整列・削除ボタンを含むツールバーが表示される
