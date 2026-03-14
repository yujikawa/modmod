# <img src="./visualizer/public/favicon.svg" width="32" height="32" align="center" /> Modscape

[![npm version](https://img.shields.io/npm/v/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![npm downloads](https://img.shields.io/npm/dm/modscape.svg?style=flat-square)](https://www.npmjs.com/package/modscape)
[![Deploy Demo](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/deploy.yml)
[![Publish to NPM](https://github.com/yujikawa/modscape/actions/workflows/publish.yml/badge.svg)](https://github.com/yujikawa/modscape/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Modscape** は、モダンなデータ基盤（Modern Data Stack）に特化した、YAML駆動のデータモデリング・ビジュアライザーです。物理的なスキーマとビジネスロジックのギャップを埋め、データチームがデータを通じた「ストーリー」を設計、文書化、共有することを可能にします。


🌐 **Live Demo:**
https://yujikawa.github.io/modscape/


![Modscape Screenshot](https://raw.githubusercontent.com/yujikawa/modscape/main/docs/assets/modscape.png)


## なぜ Modscape なのか？

現代のデータ分析基盤において、データモデリングは単に図を描くだけの作業ではありません。バージョン管理が可能で、AIと親和性が高く、エンジニアとステークホルダーの双方が理解できる **「信頼できる唯一の情報源（SSOT）」** を維持することが不可欠です。

- **データエンジニア向け**: 物理テーブルと論理エンティティの明確なマッピングを維持。複雑な **Data Vault** や **スター・スキーマ** を視覚化。
- **アナリティクスエンジニア向け**: dbt などのツールに適した、モジュール性の高いモデルを設計。SQLを書く前に、データの粒度（Grain）や主キー、リレーションを定義。
- **データサイエンティスト向け**: **サンプルデータ「ストーリー」** によるデータ探索。クエリを叩くことなく、統合されたサンプルプレビューからテーブルの目的と内容を把握。

## 主な機能

- **YAML-as-Code**: データアーキテクチャ全体を単一のYAMLファイルで定義。Gitによる変更管理が可能。
- **3階層ネーミングシステム**: エンティティを **概念名**（ビジュアル）、**論理名**（ビジネス定義）、**物理名**（実際のテーブル名）の3段階でドキュメント化。
- **自動レイアウト調整**: インテリジェントな階層型レイアウトエンジンにより、リレーションに基づいてテーブルとドメインを自動的に整列（※モデルの複雑さによっては手動での微調整が必要な場合があります）。
- **刷新されたモデリング・ノード**: 左上に突き出した「インデックス・タブ」で種類（FACT, DIM, HUB等）を明示。長い物理名は自動省略され、プロフェッショナルな外観を維持。
- **インタラクティブなビジュアルキャンバス**: 
  - **ドラッグで接続**: カラム間のリレーションを直感的に作成。吸着機能で快適な操作感。
  - **意味的なエッジバッジ**: 接続点に `( 1 )` や `[ N ]` バッジを表示し、カーディナリティ（多重度）を視覚化。
  - **データリネージ・モード**: データの流れをアニメーション付きの点線矢印で可視化。
  - **ドメイン階層ナビゲーション**: テーブルをビジネスドメインごとに整理し、構造化されたサイドバーから素早くアクセス。
- **統合 Undo/Redo & オートセーブ**: 
  - ドラッグや自動整列、編集などの操作が内蔵エディタの履歴と同期。
  - オートセーブにより、ローカルのYAMLを常に最新の状態に維持。
- **ダーク/ライトモード対応**: 利用環境やドキュメント作成の用途に合わせて、ワンクリックでテーマを切り替え可能。
- **データ分析特化のモデリング**: `fact`, `dimension`, `mart`, `hub`, `link`, `satellite` に加え、汎用的な `table` タイプを標準サポート。
- **AIエージェント対応**: **Gemini, Claude, Codex** 用の雛形を内蔵。LLMを活用してモデリング作業を劇的に加速。

## インストール

```bash
npm install -g modscape
```

---

## はじめに

### A: AI駆動のモデリング（推奨）
1.  **初期化**: 使用するAIエージェントに合わせてモデリングルールを生成します。
    ```bash
    modscape init --gemini  # または --claude, --codex
    ```
2.  **起動**: ビジュアライザーを起動します。
    ```bash
    modscape dev model.yaml
    ```
3.  **AIに指示**: AIにこう伝えてください： *" .modscape/rules.md のルールに従って、model.yaml に新しい 'Marketing' ドメインを追加して。"*

### B: 手動モデリング
1.  **YAML作成**: `model.yaml` ファイルを作成します。
2.  **起動**: ビジュアライザーを起動します。
    ```bash
    modscape dev model.yaml
    ```

---

## モデルの定義 (YAML)

```yaml
# 1. Domains: 関連するテーブルをグループ化するコンテナ
domains:
  - id: core_sales
    name: 主要売上
    color: "rgba(59, 130, 246, 0.1)"
    tables: [orders]

# 2. Tables: エンティティ定義
tables:
  - id: orders
    name: 注文           # 概念名（大）
    logical_name: "顧客注文履歴" # 論理名（中）
    physical_name: "fct_retail_sales" # 物理名（小）
    appearance:
      type: fact    # fact | dimension | mart | hub | link | satellite | table
      sub_type: transaction
      icon: 💰
    columns:
      - id: order_id
        logical:
          name: ORDER_ID
          isPrimaryKey: true
          additivity: fully
    sampleData:
      - [order_id, amount, status]
      - [1001, 50.0, "COMPLETED"]

# 3. Relationships: カーディナリティの定義
relationships:
  - from: { table: customers, column: customer_id }
    to: { table: orders, column: customer_id }
    type: one-to-many
```

---

## 使い方

### 開発モード (インタラクティブ)
```bash
modscape dev ./models
```
- **永続化**: レイアウトやメタデータの変更は、直接ファイルに書き戻されます（オートセーブ対応）。

### 新規モデルの作成
```bash
modscape new models/sales/customer.yaml
```
- **再帰的作成**: 指定したパスの親ディレクトリが存在しない場合、自動的に作成します。
- **ボイラープレート**: ドメイン、3階層ネーミング、リレーション、リネージの例が含まれた有効なYAMLファイルを生成します。

### ビルドモード (静的サイト)
```bash
modscape build ./models -o docs-site
```

### エクスポートモード (Markdown)
```bash
modscape export ./models -o docs/ARCHITECTURE.md
```

## クレジット

Modscape は以下の素晴らしいオープンソースプロジェクトによって支えられています：

- [React Flow](https://reactflow.dev/) - インタラクティブなグラフ UI フレームワーク。
- [CodeMirror 6](https://codemirror.net/) - 次世代のウェブベース・コードエディタ。
- [Dagre](https://github.com/dagrejs/dagre) - 階層型グラフ・レイアウトエンジン。
- [Lucide React](https://lucide.dev/) - シンプルで美しいアイコンセット。
- [Zustand](https://github.com/pmndrs/zustand) - React 用の状態管理ライブラリ。
- [js-yaml](https://github.com/nodeca/js-yaml) - JavaScript 用 YAML パーサー。

## ライセンス
MIT
