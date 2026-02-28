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
フロントエンドの変更を CLI に反映させるには、UI をビルドして `visualizer-dist` を更新する必要があります。

```bash
npm run build-ui
```

---

## ✨ ビジュアル・アピアランス（見た目）のカスタマイズ

各エンティティ（テーブル）の `appearance` ブロックで、直感的なアイコンとアクセントカラーを設定できます。

### 標準タイプ設定
`appearance.type` を指定すると、デフォルトの絵文字とカラーが適用されます。

| タイプ (`type`) | デフォルト絵文字 | デフォルトカラー | 役割 |
| :--- | :---: | :--- | :--- |
| `fact` | 📊 | 赤 (Red-400) | 数値・集計データ |
| `dimension` | 🏷️ | 青 (Blue-400) | 属性・マスタデータ |
| `hub` | 🌐 | 琥珀 (Amber-400) | 中心・ビジネスキー (Data Vault) |
| `link` | 🔗 | 緑 (Emerald-400) | 関係・リンク (Data Vault) |
| `satellite` | 🛰️ | 紫 (Violet-400) | 履歴・詳細 (Data Vault) |

### 個別のカスタマイズ
`icon` や `color` を個別に指定して、デフォルトを上書きできます。

```yaml
- id: orders
  appearance:
    type: fact
    icon: "💰"      # 絵文字を上書き
    color: "#ff0000" # カラーを上書き
```

---

## 🛠 プロジェクト構造
- `src/`: CLI（Node.js/Express）のソースコード
- `samples/`: YAML形式のデータモデルのサンプル集
- `visualizer/`: フロントエンド（React/Vite/ReactFlow）のソースコード
- `visualizer-dist/`: ビルド済みのフロントエンド資産（CLIから配布）
- `openspec/`: OpenSpecによる開発プロセスの管理
