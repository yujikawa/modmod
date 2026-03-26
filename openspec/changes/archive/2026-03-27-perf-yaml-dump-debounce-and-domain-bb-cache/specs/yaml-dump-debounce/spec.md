## ADDED Requirements

### Requirement: yaml.dump のデバウンス実行

`syncToYamlInput()` は呼び出しから 300ms 以内に重複して呼ばれた場合、最後の呼び出しから 300ms 後に一度だけ `yaml.dump` を実行し `yamlInput` を更新しなければならない（SHALL）。

#### Scenario: ドラッグ中の連続呼び出しを間引く

- **WHEN** テーブルをドラッグし、`syncToYamlInput()` が 100ms 以内に 10回呼ばれる
- **THEN** `yaml.dump` の実行は最後の呼び出しから 300ms 後に 1回だけ行われる

#### Scenario: 単発の呼び出しは 300ms 後に反映される

- **WHEN** `syncToYamlInput()` が 1回だけ呼ばれる
- **THEN** 300ms 後に `yamlInput` が更新された状態に変わる

#### Scenario: ドラッグ終了後に必ず YAML エディタへ反映される

- **WHEN** ドラッグ操作が完了し、その後 300ms 以上操作がない
- **THEN** YAMLエディタに最新のスキーマが表示される

### Requirement: saveSchema はデバウンスの影響を受けない

`saveSchema()` の呼び出しタイミングは `syncToYamlInput()` のデバウンスに依存してはならない（SHALL NOT）。ファイル保存は既存のタイミングで独立して行われる。

#### Scenario: ドラッグ中もファイル保存は従来通り動作する

- **WHEN** テーブルをドラッグしながら `saveSchema()` が呼ばれる
- **THEN** ファイル保存は `syncToYamlInput()` のデバウンスとは独立して実行される
