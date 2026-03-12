# 🛠 開発者向けガイド (DEVELOPMENT.md)

このドキュメントは、`modscape` の開発者（およびAIエージェント）がスムーズに作業を進めるためのガイドです。

## 🎨 開発用コマンド

### ローカル開発サーバーの起動
モデルファイルまたはディレクトリを指定して、ビジュアライザを起動します。

```bash
# サンプルのディレクトリを指定して起動 (全サンプルを切り替え可能)
npm run dev -- samples/

# 特定のファイルを指定して起動
npm run dev -- samples/ecommerce.yaml
```
- `npm run dev` の後の `--` は、それ以降の引数をスクリプトに直接渡すために必要です。
- ディレクトリを指定すると、サイドバーのドロップダウンでファイルを切り替えられます。
- **Live Sync機能**: 外部エディタでファイルを保存すると、ブラウザ側が自動的に更新されます。

### 自動テスト (E2E / ビジュアルテスト)
Playwright を使用した自動テストを実行します。Modscape では UI ビルドとテスト結果が密接に関連しているため、一括実行コマンドの使用を推奨します。

```bash
# 【推奨】UIをビルドしてから全テストを実行
npm run test:all

# 【推奨】UIをビルドしてからビジュアルスナップショットを更新
# UIの意図的な変更を行った後は必ず実行してください
npm run test:update

# (デバッグ用) すでにビルド済みの状態でテストのみ実行
npm run test:e2e

# UIモードで実行 (ブラウザの動きを確認しながらデバッグ可能)
npx playwright test --ui
```

### UI（React/Vite）のビルド
フロントエンド（`visualizer/`）の単体ビルドコマンドです。通常は上記テストコマンド内で自動実行されます。

```bash
npm run build-ui
```
> [!NOTE]
> `visualizer-dist` は Git 管理から除外されています。npm 公開時や GitHub Actions 上で自動生成されます。

---

## 🚀 リリースとデプロイ (CI/CD)

GitHub Actions を使用して、テストの実行、デモの公開、npm へのリリースを自動化しています。

### 1. PRチェック (Continuous Integration)
プルリクエストが作成されると、自動的に E2E テストとビルドチェックが走ります。テストが失敗した場合は、GitHub Actions の Artifacts から Playwright のレポート（スクリーンショット付）を確認できます。

### 2. デモサイトの更新 (GitHub Pages)
`main` ブランチにプッシュされると、自動で [GitHub Pages](https://yujikawa.github.io/modscape/) が更新されます。

### 3. npm への公開
バージョンタグをプッシュすることで、自動的に npm レジストリへ公開されます。

```bash
# 1. バージョンを上げる
npm version patch # または minor, major

# 2. タグと一緒にプッシュ
git push origin main --tags
```

---

## ✨ ビジュアル・アピアランス（見た目）のカスタマイズ

各エンティティ（テーブル）の `appearance` ブロックで、アイコンとアクセントカラーを設定できます。

### 標準タイプ設定
`appearance.type` を指定すると、デフォルトの絵文字とカラーが適用されます。

| タイプ (`type`) | 役割 | デフォルト絵文字 |
| :--- | :--- | :---: |
| `fact` | 数値・集計データ | 📊 |
| `dimension` | 属性・マスタデータ | 🏷️ |
| `mart` | データマート・最終出力 | 📈 |
| `hub` | 中心・ビジネスキー (Data Vault) | 🌐 |
| `link` | 関係・リンク (Data Vault) | 🔗 |
| `satellite` | 履歴・詳細 (Data Vault) | 🛰️ |
| `table` | 汎用テーブル | 📋 |

---

## 🛠 プロジェクト構造
- `src/`: CLI（Node.js/Express）のソースコード
- `visualizer/`: フロントエンド（React/Vite/ReactFlow）のソースコード
- `visualizer-dist/`: ビルド済みのフロントエンド資産（npm配布用）
- `tests/`: Playwright による E2E テストコード
- `samples/`: YAML形式のデータモデルのサンプル集
- `openspec/`: OpenSpecによる開発プロセスの管理
