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
- ブラウザが自動的に開き、モデルの変更（ホットリロード）が反映されます。

### UI（React/Vite）のビルド
フロントエンド（`visualizer/`）の変更を CLI に反映させるには、UI をビルドして `visualizer-dist` を生成する必要があります。

```bash
npm run build-ui
```
> [!NOTE]
> `visualizer-dist` は Git 管理から除外されています。npm 公開時や GitHub Actions 上で自動生成されます。

### 静的サイトのビルド（デモ出力）
YAML モデルを埋め込んだ、ポータブルな HTML サイトを書き出します。

```bash
# samples ディレクトリの全ファイルを dist-site に書き出し
node src/index.js build samples/ -o dist-site
```

---

## 🚀 リリースとデプロイ (CI/CD)

GitHub Actions を使用して、デモの公開と npm へのリリースを自動化しています。

### 1. デモサイトの更新 (GitHub Pages)
`main` ブランチにプッシュされると、`src/`, `visualizer/`, `samples/` のいずれかに変更がある場合にのみ自動で [GitHub Pages](https://yujikawa.github.io/modscape/) が更新されます。
- **README** や **LICENSE** の修正のみでは実行されません（リソース節約のため）。

### 2. npm への公開
バージョンタグをプッシュすることで、自動的に npm レジストリへ公開されます。

```bash
# 1. バージョンを上げる (package.json の更新と git tag の作成)
npm version patch # または minor, major

# 2. タグと一緒にプッシュ
git push origin main --tags
```
> [!IMPORTANT]
> GitHub のリポジトリ設定（Secrets）に `NPM_TOKEN` が登録されている必要があります。

---

## ✨ ビジュアル・アピアランス（見た目）のカスタマイズ

各エンティティ（テーブル）の `appearance` ブロックで、アイコンとアクセントカラーを設定できます。

### 標準タイプ設定
`appearance.type` を指定すると、デフォルトの絵文字とカラーが適用されます。

| タイプ (`type`) | 役割 | デフォルト絵文字 |
| :--- | :--- | :---: |
| `fact` | 数値・集計データ | 📊 |
| `dimension` | 属性・マスタデータ | 🏷️ |
| `hub` | 中心・ビジネスキー (Data Vault) | 🌐 |
| `link` | 関係・リンク (Data Vault) | 🔗 |
| `satellite` | 履歴・詳細 (Data Vault) | 🛰️ |

---

## 🛠 プロジェクト構造
- `src/`: CLI（Node.js/Express）のソースコード
- `visualizer/`: フロントエンド（React/Vite/ReactFlow）のソースコード
- `visualizer-dist/`: **ビルド済みのフロントエンド資産**（Git管理外、npm配布用）
- `samples/`: YAML形式のデータモデルのサンプル集
- `openspec/`: OpenSpecによる開発プロセスの管理

