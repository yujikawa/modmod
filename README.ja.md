# <img src="./visualizer/public/favicon.svg" width="32" height="32" align="center" /> Modscape

[![npm version](https://img.shields.io/npm/v/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![npm downloads](https://img.shields.io/npm/dm/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![Deploy Demo](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml)
[![Publish to NPM](https://github.com/yujikawa/modscape/actions/workflows/publish.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Modscape** は、モダンなデータ基盤（Modern Data Stack）に特化した、YAML駆動のデータモデリング・ビジュアライザーです。物理的なスキーマとビジネスロジックのギャップを埋め、データチームがデータを通じた「ストーリー」を設計、文書化、共有することを可能にします。

[ライブデモ](https://yujikawa.github.io/modscape/)

## なぜ Modscape なのか？

現代のデータ分析基盤において、データモデリングは単に図を描くだけの作業ではありません。バージョン管理が可能で、AIと親和性が高く、エンジニアとステークホルダーの双方が理解できる **「信頼できる唯一の情報源（SSOT）」** を維持することが不可欠です。

- **データエンジニア向け**: 物理テーブルと論理エンティティの明確なマッピングを維持。複雑な **Data Vault** や **スター・スキーマ** を視覚化。
- **アナリティクスエンジニア向け**: dbt などのツールに適した、モジュール性の高いモデルを設計。SQLを書く前に、データの粒度（Grain）や主キー、リレーションを定義。
- **データサイエンティスト向け**: **サンプルデータ「ストーリー」** によるデータ探索。クエリを叩くことなく、統合されたサンプルプレビューからテーブルの目的と内容を把握。

## 主な機能

- **YAML-as-Code**: データアーキテクチャ全体を人間が読みやすい単一のYAMLファイルで定義。Gitによる変更管理が可能。
- **データ分析特化のモデリング**: `fact`, `dimension`, `hub`, `link`, `satellite` などのエンティティタイプを標準サポート。
- **サンプルデータ「ストーリー」**: エンティティに現実的なサンプルデータを紐付け、データの背後にある「物語」を解説。
- **インタラクティブなビジュアルキャンバス**: 
  - **ドラッグで接続**: カラム間のリレーションを直感的に作成。
  - **自動レイアウト永続化**: キャンバス上の配置は、即座に元のYAMLファイルの座標情報として保存。
  - **ドメイン・グルーピング**: テーブルをビジネスドメインごとに整理。
- **AIエージェント対応**: **Gemini, Claude, Codex** 用の雛形を内蔵。LLMを活用してモデリング作業を劇的に加速。
- **ドキュメント・エクスポート**: 社内WikiやGitHub/GitLab Pagesで利用可能な、Mermaid図入りのMarkdownを生成。

## インストール

npm経由でグローバルにインストールします：

```bash
npm install -g modscape
```

---

## はじめに

### A: AI駆動のモデリング（推奨）
Gemini CLI, Claude Code, Codex などのAIアシスタントを活用してモデルを構築します。

1.  **初期化**: 使用するAIエージェントに合わせてモデリングルールと手順書を生成します。
    ```bash
    # Gemini CLI の場合
    modscape init --gemini

    # Claude Code の場合
    modscape init --claude

    # Codex の場合
    modscape init --codex
    ```
2.  **起動**: ビジュアライザーを起動します。
    ```bash
    modscape dev model.yaml
    ```
3.  **AIに指示**: AIエージェントにこう伝えてください： *" .modscape/rules.md のルールに従って、model.yaml に新しい 'Marketing' ドメインと 'campaign_performance' ファクトテーブルを追加して。"*

### B: 手動モデリング
詳細な設計コントロールを行いたい場合に最適です。

1.  **YAML作成**: `model.yaml` ファイルを作成します（[YAMLリファレンス](#モデルの定義-yaml)を参照）。
2.  **起動**: ビジュアライザーを起動します。
    ```bash
    modscape dev model.yaml
    ```
3.  **サンプルを試す**: 組み込みのパターンを確認できます：
    ```bash
    modscape dev samples/
    ```

---

## モデルの定義 (YAML)

Modscapeは、データ分析のコンテキストに最適化されたスキーマを採用しています。

```yaml
# 1. Domains: ビジネスロジックに基づいた視覚的なグループ化
domains:
  - id: core_sales
    name: 主要売上
    color: "rgba(59, 130, 246, 0.05)"
    tables: [orders, products]

# 2. Tables: マルチレイヤーのメタデータを持つエンティティ定義
tables:
  - id: orders
    name: ORDERS
    appearance:
      type: fact    # fact | dimension | hub | link | satellite
      icon: 📦      # エンティティを象徴するアイコン
    conceptual:
      description: "販売取引記録"
      tags: ["WHO", "WHEN", "HOW MUCH"] # 粒度の識別子
    physical:
      name: STG_ORDERS
      schema: ANALYTICS_DB
    columns:
      - id: order_id
        logical: { name: ORDER_ID, type: Int, isPrimaryKey: true }
      - id: customer_id
        logical: { name: CUSTOMER_ID, type: Int, isForeignKey: true }
    
    # 3. Sample Data: データを通じたストーリーの提示
    sampleData:
      - [1001, 501]
      - [1002, 502]

# 4. Relationships: カラムレベルの接続
relationships:
  - from: { table: orders, column: customer_id }
    to: { table: customers, column: id }
    type: many-to-one
```

---

## 使い方

### 開発モード (インタラクティブ)
YAMLを編集し、エンティティを視覚的に配置します。

```bash
modscape dev ./models
```
- `http://localhost:5173` が開きます。
- **永続化**: レイアウトやメタデータの変更は、直接ファイルに書き戻されます。

### ビルドモード (静的サイト)
チーム共有用のスタンドアロンなドキュメントサイトを生成します。

```bash
modscape build ./models -o docs-site
```

### エクスポートモード (Markdown)
Mermaid図を含むMarkdownドキュメントを生成します。

```bash
modscape export ./models -o docs/ARCHITECTURE.md
```

## AIエージェントとの統合

Modscapeは **AI-First** を掲げて設計されています。 `modscape init` を実行することで、 `.modscape/rules.md` を通じてAIエージェントと「契約」を結び、プロジェクト全体で一貫したモデリングパターン（命名規則、データ型など）を維持できます。

## クレジット

Modscapeは以下のプロジェクトによって支えられています：
- **React Flow**: インタラクティブなグラフエンジン。
- **Lucide**: 一貫性のあるアイコンセット。
- **Express**: ローカル開発サーバー。
- **Commander**: CLIフレームワーク。

## ライセンス
MIT
