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
- **AIエージェント対応**: **Gemini CLI, Claude Code, Codex** 用の雛形を内蔵。モデリング（`/modscape:modeling`）と実装コード生成（`/modscape:codegen`）の両方でLLMを活用できます。

## インストール

```bash
npm install -g modscape
```

---

## はじめに

### A: AI駆動のモデリング（推奨）
1.  **初期化**: 使用するAIエージェントに合わせてルールファイルとコマンドを生成します。
    ```bash
    modscape init --gemini   # Gemini CLI
    modscape init --claude   # Claude Code
    modscape init --codex    # Codex
    modscape init --all      # 3つすべて
    ```
    `.modscape/rules.md`（YAMLスキーマのルール）と `.modscape/codegen-rules.md`（実装コード生成のルール）、および各エージェント用のコマンドファイルが生成されます。

2.  **起動**: ビジュアライザーを起動します。
    ```bash
    modscape dev model.yaml
    ```

3.  **データモデルの設計** — `/modscape:modeling` でモデルを作成・編集します。
    > *".modscape/rules.md のルールに従って、model.yaml に新しい 'Marketing' ドメインを追加して。"*

4.  **実装コードの生成** — `/modscape:codegen` でYAMLをdbt / SQLMesh / Spark SQLに変換します。
    > *".modscape/codegen-rules.md に従って、model.yaml からdbtモデルを生成して。"*

    エージェントは `lineage.upstream` を元に依存関係の順でモデルを生成し、YAMLで定義しきれない箇所には `-- TODO:` コメントを残します。

### B: 手動モデリング
1.  **YAML作成**: `model.yaml` ファイルを作成します。
2.  **起動**: ビジュアライザーを起動します。
    ```bash
    modscape dev model.yaml
    ```

---

## モデルの定義 (YAML)

YAMLのルートレベル構造は以下の通りです：

```
domains      – 関連テーブルをまとめるビジュアルコンテナ
tables       – 3階層メタデータを持つエンティティ定義
relationships – テーブル間のERカーディナリティ
annotations  – キャンバス上のスティッキーノート・吹き出し
layout       – 全座標データ（tables/domains の中に x/y を書いてはいけない）
```

### Domains（ドメイン）

```yaml
domains:
  - id: core_sales
    name: "主要売上"
    description: "営業チームのトランザクションデータ。"  # 任意
    color: "rgba(59, 130, 246, 0.1)"  # 背景色
    tables: [orders, dim_customers]
    isLocked: false  # true にするとキャンバスでの誤ドラッグを防止
```

### Tables（テーブル）

```yaml
tables:
  - id: orders
    name: 注文                           # 概念名（大）
    logical_name: "顧客注文履歴"          # 論理名（中）
    physical_name: "fct_retail_sales"   # 物理名（小）

    appearance:
      type: fact        # fact | dimension | mart | hub | link | satellite | table
      sub_type: transaction  # transaction | periodic | accumulating など
      scd: type2        # ディメンション用 SCD タイプ: type0〜type6
      icon: "💰"
      color: "#e0f2fe"  # 任意のヘッダーカラー

    conceptual:  # 任意 – AIエージェント向けビジネスコンテキスト
      description: "1行 = 1注文明細。"
      tags: [WHO, WHAT, WHEN]  # BEAM* タグ
      businessDefinitions:
        revenue: "割引・返品後の純売上"

    lineage:  # mart/集計テーブルのみに定義
      upstream:
        - fct_sales
        - dim_dates

    implementation:  # 任意 – AIコード生成へのヒント
      materialization: incremental  # table | view | incremental | ephemeral
      incremental_strategy: merge   # merge | append | delete+insert
      unique_key: order_id
      partition_by:
        field: order_date       # DATE/TIMESTAMP型カラムを指定（サロゲートキーは不可）
        granularity: day        # day | month | year | hour
      cluster_by: [customer_id]
      grain: [month_key]        # GROUP BY カラム（martのみ）
      measures:                 # 集計定義（martのみ）
        - column: total_revenue
          agg: sum              # sum | count | count_distinct | avg | min | max
          source_column: fct_sales.amount

    columns:
      - id: order_id
        logical:
          name: "注文ID"
          type: Int         # Int | String | Decimal | Date | Timestamp | Boolean など
          description: "サロゲートキー。"
          isPrimaryKey: true
          isForeignKey: false
          isPartitionKey: false
          isMetadata: false  # 監査カラム(load_date, record_source)は true
          additivity: fully  # fully | semi | non
        physical:  # 任意 – ウェアハウスの物理定義を上書き
          name: order_id
          type: "BIGINT"
          constraints: [NOT NULL]

    sampleData:  # 2次元配列。先頭行 = カラムID
      - [order_id, amount, status]
      - [1001, 50.0, "COMPLETED"]
      - [1002, 120.5, "PENDING"]
```

**テーブルタイプと `appearance.type` の使い分け：**

| type | 用途 |
|------|------|
| `fact` | 取引・イベント・測定値 |
| `dimension` | エンティティ・マスタ・参照リスト |
| `mart` | 集計・消費者向けテーブル（`lineage.upstream` を必ず定義） |
| `hub` | Data Vault のビジネスキー |
| `link` | Data Vault のハブ間結合・トランザクション |
| `satellite` | Data Vault のハブに紐づく履歴属性 |
| `table` | 汎用 |

### Relationships（リレーションシップ）

```yaml
relationships:
  - from:
      table: dim_customers   # テーブル ID
      column: customer_id    # カラム ID（任意）
    to:
      table: fct_orders
      column: customer_id
    type: one-to-many  # one-to-one | one-to-many | many-to-one | many-to-many
```

> **データリネージ**は `lineage.upstream` で定義し、リネージモードでアニメーション矢印として表示されます。`relationships` に重複して記載しないでください。

### Annotations（アノテーション）

```yaml
annotations:
  - id: note_001
    type: sticky   # sticky | callout
    text: "粒度：1行 = 1注文明細"
    color: "#fef9c3"          # 任意の背景色
    targetId: fct_orders      # 貼り付け先のオブジェクト ID（任意）
    targetType: table         # table | domain | relationship | column
    offset:
      x: 100    # 対象の左上からのオフセット（targetId 未指定時は絶対座標）
      y: -80
```

### Layout（レイアウト）

全座標データはオブジェクト ID をキーとして `layout` に記述します。**`tables` や `domains` の中に `x`/`y` を書いてはいけません。**

```yaml
layout:
  # ドメイン – width と height が必要
  core_sales:
    x: 0
    y: 0
    width: 880
    height: 480
    isLocked: false  # true でキャンバスのドラッグを防止

  # ドメイン内のテーブル – 座標はドメインの原点からの相対値
  orders:
    x: 280
    y: 200
    parentId: core_sales  # ドメインへの所属を宣言

  # スタンドアロンテーブル – キャンバス絶対座標
  mart_summary:
    x: 1060
    y: 200
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
