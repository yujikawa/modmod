## Context

右パネル（RightPanel）には現在4つのタブがある（Information Search・Tables & Entities・Path Finder・Note Search）。各タブは独立したコンポーネントとして実装されており、Activity Barのアイコンクリックで切り替わる構造。

データはZustandのuseStoreから`schema`を取得するだけで、リネージ・リレーション・テーブル・ドメインの全情報が揃っている。追加の状態管理は不要。

## Goals / Non-Goals

**Goals:**
- 右パネルに5つ目のタブ「Model Stats」を追加する
- schema.lineageをもとにリネージ接続数を集計し、ランキング表示する
- リネージに登場しない孤立テーブルを検出して警告表示する
- クリックでキャンバス上の該当テーブルにフォーカスできる

**Non-Goals:**
- relationships（ERリレーション）の接続数集計
- 閾値設定・アラート通知などの設定UI
- storeへの新規状態追加
- 外部ライブラリの追加

## Decisions

### データ計算はuseMemo内で完結させる

**採用理由：** `schema`はすでにstoreにあり、リネージ集計はO(n)の単純ループで済む。Zustandのselectorを増やすほどの複雑さではないため、コンポーネント内のuseMemoで完結させる。

```
schema.lineage → テーブルごとの {upstream, downstream, total} をMap化
孤立テーブル = schema.tables.filter(t => Map.get(t.id) === undefined)
最大値 = Math.max(...values) → バーの幅を % で計算
```

### バーチャートはCSSのみで実装する

**採用理由：** 数値の大小比較が目的であり、正確な座標や軸ラベルは不要。`width: ${(total / max) * 100}%`のインラインスタイルで十分。外部チャートライブラリを追加するコストに見合わない。

### タブアイコンはBarChart2（lucide-react）を使用する

**採用理由：** 既存タブはすべてlucide-reactのアイコンを使用。BarChart2は統計・分析を直感的に示し、既存の4タブアイコンと視覚的に区別しやすい。

### フォーカスは既存の`setFocusNodeId` / `setSelectedTableId`を使用する

**採用理由：** TablesTab・PathFinderTabですでに同パターンが使われており、コードの一貫性を保てる。

## Risks / Trade-offs

- **lineageが空の場合：** Hotspots・Isolated Tablesいずれも全テーブルが「孤立」として表示される。これはモデル初期状態として正しい動作。空stateのガイダンスメッセージで対処する。
- **タブ数が5つになる：** Activity Barのアイコン間隔がやや詰まる。既存レイアウトはgap-2で並んでいるため、5つ目を追加しても視覚的な破綻はない。
