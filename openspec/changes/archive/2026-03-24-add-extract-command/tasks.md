## 1. extract コマンド実装

- [x] 1.1 `src/extract.js` を新規作成し、`extractModels(inputs, options)` 関数を実装する
- [x] 1.2 `--tables` オプションのカンマ区切りパースを実装する
- [x] 1.3 複数ファイル・ディレクトリの展開ロジックを実装する（`merge.js` の `collectYamlFiles` を参考に）
- [x] 1.4 後勝ちマージ（同一 ID は後のファイルで上書き）ロジックを実装する
- [x] 1.5 マッチしなかった ID を警告出力するロジックを実装する
- [x] 1.6 出力 YAML に `tables` のみを含める（relationships 等は除外）

## 2. CLI 登録

- [x] 2.1 `src/index.js` に `import { extractModels } from './extract.js'` を追加する
- [x] 2.2 `extract` コマンドを Commander.js に登録する（引数・オプション・デフォルト出力名 `extracted.yaml`）

## 3. 動作確認

- [x] 3.1 `samples/` のサンプル YAML を使って `extract` コマンドの動作を手動確認する
- [x] 3.2 `extract` した YAML を `merge` に渡して統合できることを確認する
