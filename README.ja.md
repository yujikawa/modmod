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
- **ローカルYAMLの即時可視化**: Modscapeのスキーマに従ったYAMLファイルを指定するだけで、即座にビジュアライズ。データベース接続やクラウド設定は一切不要で、すぐにモデリング結果を確認できます。
- **データ分析特化のモデリング**: `fact`, `dimension`, `hub`, `link`, `satellite` などのエンティティタイプを標準サポート。
- **サンプルデータ「ストーリー」**: エンティティに現実的なサンプルデータを紐付け、データの背後にある「物語」を解説。
- **インタラクティブなビジュアルキャンバス**: 
  - **ドラッグで接続**: カラム間のリレーションを直感的に作成。
  - **自動レイアウト永続化**: キャンバス上の配置は、即座に元のYAMLファイルの座標情報として保存。
  - **ドメイン・グルーピング**: テーブルをビジネスドメインごとに整理。
- **分析メタデータ**: 
  - **ファクトテーブル・タイプ**: `transaction`, `periodic`, `accumulating`, `factless` といったデータの性質を定義。
  - **SCD（徐変ディメンション）管理**: `SCD Type 2` などの履歴管理方式を可視化。
  - **加算規則（Additivity）**: カラムが合計可能か（`fully`, `semi`, `non`）を明示し、BI開発をガイド。
  - **メタデータ/監査追跡**: 監査用カラムを専用アイコンで識別。
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

Modscapeは、データ分析のコンテキストに最適化されたスキーマを採用しています。この単一のファイルが、論理および物理データアーキテクチャの「信頼できる唯一の情報源（SSOT）」として機能します。

```yaml
# 1. Domains: 関連するテーブルをグループ化する視覚的なコンテナ
domains:
  - id: core_sales
    name: 主要売上
    description: "ドメインの任意の説明"
    color: "rgba(59, 130, 246, 0.05)" # コンテナの背景色
    tables: [orders, products] # 所属するテーブルIDのリスト

# 2. Tables: マルチレイヤーのメタデータを持つエンティティ定義
tables:
  - id: orders
    name: ORDERS
    appearance:
      type: fact    # fact | dimension | hub | link | satellite
      # --- 分析メタデータ ---
      sub_type: transaction # transaction | periodic | accumulating | factless
      # (Dimension用SCDタイプ: type0 | type1 | type2 | type3 | type4 | type5 | type6 | type7)
      icon: 📦      # カスタム絵文字や文字
      color: "#f87171" # エンティティのテーマカラー
    
    conceptual:
      description: "販売取引記録"
      tags: ["WHO", "WHEN", "HOW MUCH"] # 粒度の識別子（BEAM*等）
    
    physical:
      name: STG_ORDERS     # 実際のDBテーブル名
      schema: ANALYTICS_DB # DBスキーマ/名前空間
    
    columns:
      - id: order_id
        logical:
          name: ORDER_ID
          type: Int
          description: "ユニークな識別子"
          isPrimaryKey: true
          isForeignKey: false
          isPartitionKey: false
          # --- 分析メタデータ ---
          isMetadata: false # 監査用カラム等に true を設定 (🕒 アイコン)
          additivity: fully # fully | semi | non (Σ アイコン)
        physical:
          name: O_ID
          type: NUMBER(38,0)
          constraints: ["NOT NULL"]
      
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
    type: many-to-one # one-to-one | one-to-many | many-to-many

# 5. Layout: 座標情報 (自動管理)
layout:
  orders: { x: 100, y: 100, width: 320, height: 400 }
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
