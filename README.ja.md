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

- **YAML-as-Code**: データアーキテクチャ全体を単一のYAMLファイルで定義。Gitによる変更管理が可能。
- **統合プロフェッショナル・エディタ**: **CodeMirror 6** を内蔵。シンタックスハイライト対応のエディタをサイドバーで直接利用可能。
- **統合 Undo/Redo & オートセーブ**: 
  - ビジュアル操作（ドラッグ、リサイズ、編集）がエディタの履歴と同期。 `Ctrl+Z` で直前の操作を元に戻せます。
  - **オートセーブ**をONにすれば、キャンバス上の変更が即座にローカルファイルに反映されます。
- **ダーク/ライトモード対応**: 利用環境やドキュメント作成の用途に合わせて、ワンクリックでテーマを切り替え可能。
- **データ分析特化のモデリング**: `fact`, `dimension`, `mart`, `hub`, `link`, `satellite` などのエンティティタイプを標準サポート。
- **インタラクティブなビジュアルキャンバス**: 
  - **ドラッグで接続**: カラム間のリレーションを直感的に作成。吸着（Snapping）機能で快適な操作感。
  - **データリネージ・モード**: データの流れをアニメーション付きの点線矢印で可視化。
  - **ドメイン階層ナビゲーション**: テーブルをビジネスドメインごとに整理し、構造化されたサイドバーから素早くアクセス。
- **分析メタデータ**: 
  - **ファクトテーブル・タイプ**: `transaction`, `periodic`, `accumulating`, `factless` といったデータの性質を定義。
  - **SCD管理**: `SCD Type 2` などの履歴管理方式を可視化。
  - **加算規則（Additivity）**: カラムが合計可能か（`fully`, `semi`, `non`）を明示 (Σ アイコン)。
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
    color: "#3b82f6"
    tables: [orders, products]

# 2. Tables: エンティティ定義
tables:
  - id: orders
    name: ORDERS
    appearance:
      type: fact    # fact | dimension | mart | hub | link | satellite
      sub_type: transaction
      scd: type2
      icon: 📦
    columns:
      - id: order_id
        logical:
          name: ORDER_ID
          isPrimaryKey: true
          additivity: fully # fully | semi | non (Σ アイコン)
          isMetadata: false # 監査用カラム等 (🕒 アイコン)
```

---

## 使い方

### 開発モード (インタラクティブ)
```bash
modscape dev ./models
```
- **永続化**: レイアウトやメタデータの変更は、直接ファイルに書き戻されます（オートセーブ対応）。

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
- [Lucide React](https://lucide.dev/) - シンプルで美しいアイコンセット。
- [Zustand](https://github.com/pmndrs/zustand) - React 用の状態管理ライブラリ。
- [Express](https://expressjs.com/) - Node.js 用のウェブフレームワーク。
- [js-yaml](https://github.com/nodeca/js-yaml) - JavaScript 用 YAML パーサー。
- [Commander.js](https://github.com/tj/commander.js) - CLI フレームワーク。

## ライセンス
MIT
