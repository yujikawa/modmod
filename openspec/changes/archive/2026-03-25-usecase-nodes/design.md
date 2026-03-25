## Context

現在のModscapeのYAMLスキーマは `tables`、`domains`、`relationships`、`lineage`、`annotations`、`layout` の6セクションで構成される。`lineage` はテーブルIDのペア（`from` / `to`）でデータの流れを表現するが、`to` の解決先は常に `tables` 配列内のIDである。

今回追加する `usecases` セクションは「lineageの終端に置けるノード種別」を新たに導入する。実装上の変更は最小限で、既存のlineageパイプラインを拡張する形をとる。

## Goals / Non-Goals

**Goals:**
- `usecases` トップレベルセクションのYAMLパース・型定義
- usecaseノードのCytoscapeキャンバス描画（テーブルとは異なるスタイル）
- 既存の `lineage` の `to` でusecaseノードIDを解決できるようにする
- `layout` セクションによるusecaseノードの座標管理
- `modscape layout` CLIコマンドでusecaseノードを自動配置対象に含める

**Non-Goals:**
- usecaseノードのインタラクティブ編集（詳細パネルからの編集）
- usecaseノードのサイドバー一覧表示
- dbt exposureの自動インポート（将来の拡張として保留）

## Decisions

### 1. `lineage.to` の解決順序

`lineage` の `to` を解決する際、現在は `tables` のみを参照している。これを「`tables` に存在しなければ `usecases` を参照する」というフォールバック解決に変更する。

**理由:** lineageセクションの構造を変えずに済み、既存のYAMLとの後方互換性が完全に保たれる。`toType` のような追加フィールドを設けるより自然。

### 2. `UseCase` の型構造

```typescript
export interface UseCase {
  id: string;
  name: string;
  description?: string;
  appearance?: {
    icon?: string;
    color?: string;
  };
  url?: string;
}
```

`appearance` の構造は `Table` と統一。`description` はトップレベル（`Domain` と統一）。`type` フィールドは設けず、`icon` で自由に表現する。

**理由:** `type` を列挙型にするとBIツール・ML・アプリ等の多様なユースケースを表現しきれない。`icon` による自由な表現の方が実用的。

### 3. キャンバスのノードスタイル

usecaseノードには専用のCytoscapeクラス `usecase-node` を付与し、テーブルノードとは異なる外観（例：角丸の強調、ヘッダーなし、アイコン中央配置）にする。デフォルトアイコンは `🔗`。

**理由:** テーブルノードと明確に区別することで、モデルの境界（データモデル層 vs ビジネス用途層）が一目でわかる。

### 4. layoutセクションとの統合

usecaseノードの座標も既存の `layout` セクションで管理する。テーブルと同様に `parentId` でドメインへの所属を宣言できる。

```yaml
layout:
  revenue_dashboard:
    x: 1200
    y: 300

  # ドメイン内に配置する場合
  churn_ml_model:
    x: 200
    y: 150
    parentId: bi_tools_domain
```

**理由:** 既存のlayout管理機構（Zustandストア、ドラッグ操作、auto-layout）をそのまま再利用できる。ドメインへの所属もテーブルと同じ仕組みで表現できる。

### 5. ドメインへの所属

`domains[].members` はIDのリストとして機能し、テーブルIDとusecaseIDの両方を受け入れる。レンダリング時に `tables` と `usecases` を合わせたIDマップで解決するため、ドメイン定義側の変更は不要。

```yaml
domains:
  - id: bi_tools_domain
    name: "BI Tools"
    members: [revenue_dashboard, sales_report]  # usecaseのIDも同様に記述

  - id: ml_domain
    name: "ML Models"
    members: [churn_ml_model, ltv_model]
```

**理由:** ドメインはIDコンテナであり、そのIDが何を指すかはレンダリング層の責務。`tables` から `members` へのリネームにより、テーブル以外のノード種別（usecase等）も所属できることをスキーマ上で明示する。

## Risks / Trade-offs

- **lineage参照の曖昧性** → テーブルIDとusecaseIDが衝突した場合、テーブルが優先される。YAMLの記述者にはIDの一意性を守る責任があり、これは既存の制約と変わらない。
- **サイドバー非対応（初期スコープ）** → usecaseノードはキャンバスにのみ表示され、サイドバーの一覧には出ない。視認性はキャンバス側で担保する。
