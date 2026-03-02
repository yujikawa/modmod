# <img src="./visualizer/public/favicon.svg" width="32" height="32" align="center" /> Modscape

[![npm version](https://img.shields.io/npm/v/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![npm downloads](https://img.shields.io/npm/dm/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![Deploy Demo](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml)
[![Publish to NPM](https://github.com/yujikawa/modscape/actions/workflows/publish.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Modscapeは、YAMLベースのデータモデリング・ビジュアライザーです。データエンジニアやアーキテクトが、概念・論理・物理モデルのギャップを埋め、サンプルデータに基づいた「ストーリー」を共有しながら設計を進めることを支援します。

[ライブデモ](https://yujikawa.github.io/modscape/)

## 主な機能

- **YAMLファースト**: 単一のシンプルなYAMLファイルでデータモデル全体を定義。
- **統合サイドバー**: ナビゲーション、検索、YAML編集機能を備えた高機能サイドバー。
- **インタラクティブ・モデリング**: 
  - **ドラッグで接続**: カラムから別のテーブルへドラッグするだけでリレーションを作成。
  - **プロパティ・エディタ**: テーブルやリレーションのメタデータをUIから直接編集。
  - **インタラクティブ削除**: クリック一つでテーブルやリレーションを削除。
- **サンプルデータ「ストーリー」**: エンティティにサンプルデータを紐付け、データの目的を具体的に解説。
- **スマート・レイアウト**: 
  - **自動位置保存**: ドラッグ＆ドロップで配置を調整。座標はYAMLに即座に反映。
  - **適応型サイジング**: カラム数が多いテーブル（10行以上）は自動でリミットがかかり、スクロール表示に。
- **マルチファイル・サポート**: ディレクトリ内の複数のモデルをシームレスに切り替え。
- **ドキュメント・エクスポート**: Mermaid互換のMarkdownドキュメント（ER図、ドメインカタログを含む）を生成。
- **AIエージェント対応**: Gemini, Claude, Codex向けのプロンプトを用意。AIとの共同モデリングを支援。

## インストール

npm経由でグローバルにインストールします：

```bash
npm install -g modscape
```

---

## はじめに

ワークフローに合わせて以下のいずれかの方法で開始してください。

### A: AI駆動のモデリング（推奨）
Gemini CLI, Claude Code, Cursor/CodexなどのAIアシスタントを使用する場合に最適です。

1.  **初期化**: モデリングルールとAIエージェント用手順書を生成します。
    ```bash
    modscape init
    ```
2.  **起動**: モデルファイルを指定してビジュアライザーを起動します。
    ```bash
    modscape dev model.yaml
    ```
3.  **AIに指示**: `.modscape/rules.md` のルールに従って `model.yaml` にテーブルやカラムを追加するようAIに伝えてください。

### B: 手動モデリング
YAMLを直接編集して詳細なコントロールを行いたい場合に最適です。

1.  **YAML作成**: `model.yaml` ファイルを作成します（[モデルの定義](#モデルの定義-yaml)を参照）。
2.  **起動**: ビジュアライザーを起動します。
    ```bash
    modscape dev model.yaml
    ```
3.  **サンプルを試す**: 付属のサンプルディレクトリを読み込むことも可能です：
    ```bash
    modscape dev samples/
    ```

---

## モデルの定義 (YAML)

Modscapeは、包括的でありながら人間が読みやすいYAMLスキーマを採用しています。この単一のファイルが、概念・論理・物理データモデルの「信頼できる唯一の情報源（SSOT）」として機能します。

### 完全なYAMLリファレンス

```yaml
# 1. Domains: 関連するテーブルをグループ化する視覚的なコンテナ
domains:
  - id: sales_domain
    name: 売上と注文
    description: 主要な商取引
    color: "rgba(59, 130, 246, 0.05)" # コンテナの背景色
    tables: [orders, order_items] # 所属するテーブルIDのリスト

# 2. Tables: エンティティの定義
tables:
  - id: orders
    name: ORDERS
    appearance:
      type: fact    # fact | dimension | hub | link | satellite
      icon: 📦      # 絵文字や任意の文字
      color: "#f87171" # このエンティティのカスタムテーマカラー
    
    conceptual:
      description: "顧客の購入記録"
      tags: ["WHAT", "WHEN"] # BEAM* メソドロジーのタグ
    
    physical:
      name: T_ORDERS     # データベース上の実際のテーブル名
      schema: RAW_SALES  # データベースのスキーマ名
    
    columns:
      - id: order_id
        logical:
          name: ORDER_ID
          type: Integer
          description: "注文のユニークな識別子"
          isPrimaryKey: true
        physical:
          name: O_ID
          type: NUMBER(38,0)
          constraints: ["NOT NULL"]
      
      - id: customer_id
        logical:
          name: CUSTOMER_ID
          type: Integer
          isForeignKey: true # 外部キーであることを示す

    # 3. Sample Data: ストーリーを伝えるための現実的なデータ
    sampleData:
      columns: [order_id, customer_id]
      rows:
        - [1001, 501]
        - [1002, 502]

# 4. Relationships: テーブル間の接続
relationships:
  - from: { table: orders, column: customer_id }
    to: { table: customers, column: id }
    type: many-to-one # one-to-one | one-to-many | many-to-many

# 5. Layout: 座標情報 (自動管理)
# 手動で記述する必要はありません。ドラッグするとModscapeが自動更新します。
layout:
  orders: { x: 100, y: 100, width: 320, height: 400 }
```

### スキーマの詳細解説

| セクション | フィールド | 説明 |
| :--- | :--- | :--- |
| **`domains`** | `color` | ビジュアライザー上でグループを囲むコンテナの背景色を定義します。 |
| **`appearance`**| `type` | 指定がない場合のヘッダーアイコンと色を決定します（標準: スター・スキーマまたはData Vault）。 |
| **`conceptual`**| `tags` | ビジネスコンテキストタグ。モデリングの粒度（WHO, WHAT, WHERE）の識別に役立ちます。 |
| **`physical`** | `name`/`schema` | 論理エンティティを実際のデータベースオブジェクトにマッピングします。 |
| **`columns`** | `isPrimaryKey` | 🔑 アイコンを表示し、テーブルの粒度を明示します。 |
| | `isForeignKey` | 🔩 アイコンを表示し、下流への接続を示します。 |
| **`sampleData`**| `rows` | 2次元配列。これを入れることで、詳細パネルに「生きたデータ」が表示されます。 |
| **`relationships`**| `type` | 接続線の矢印の形や視覚的なスタイルを制御します。 |

---

## 使い方

### 開発モード (Interactive Editor)
YAMLを編集し、エンティティを視覚的に配置するためのローカルセッションを開始します。

```bash
# ディレクトリを指定して、中のすべてのモデルを管理
modscape dev models/

# または特定のファイルを指定
modscape dev my-model.yaml
```
- 自動的に `http://localhost:5173` が開きます。
- **永続化**: エンティティの配置変更はYAMLファイルに即座に保存されます。
- **セキュアルーティング**: モデルはスラッグ経由でアクセスされ、ローカルの絶対パスは隠蔽されます。

### ビルドモード (Static Site Generation)
ドキュメントを共有するための静的ウェブサイトを生成します（GitHub Pagesなどに最適）。

```bash
modscape build models/ -o dist-site
```

### エクスポートモード (Static Documentation)
Mermaid図を含むMarkdownドキュメントを一括生成します。

```bash
# 標準出力に書き出し
modscape export models/ecommerce.yaml

# ファイルに保存
modscape export models/ -o docs/
```

## AIエージェントとの統合

ModscapeはAIアシスタントとの連携を前提に設計されています。`modscape init` を実行すると以下のファイルが生成されます：

- **`.modscape/rules.md`**: モデリング規約の「信頼できる唯一の情報源（SSOT）」。
- **エージェント向け手順書**: Gemini, Claude, Cursor/Codex向けの事前定義プロンプト。

AIに対して：*"Follow the rules in .modscape/rules.md to add a new billing domain to my model.yaml."* と指示してください。

## クレジット

Modscapeは以下の素晴らしいオープンソースプロジェクトによって支えられています：

- **[React Flow](https://reactflow.dev/)**: インタラクティブなグラフエンジン。
- **[Radix UI](https://www.radix-ui.com/)**: アクセシブルなUIプリミティブ。
- **[Lucide](https://lucide.dev/)**: 美しく一貫性のあるアイコン。
- **[shadcn/ui](https://ui.shadcn.com/)**: コンポーネントパターンとデザインインスピレーション。
- **[Express](https://expressjs.com/)**: ローカル開発環境のサーバー。

## ライセンス
MIT
