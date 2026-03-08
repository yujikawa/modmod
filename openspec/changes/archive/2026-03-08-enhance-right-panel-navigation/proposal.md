## Why

大規模で複雑なデータモデルにおいて、特定のテーブル間がどのように繋がっているか（ビジネス的なER関係、またはデータの流れであるLineage）を特定する作業は、手動では非常に困難です。また、モデル内に記述された重要な注釈（付箋）が増えるにつれ、それらを目視で探す手間も増大しています。これらを自動化・効率化することで、モデルの理解スピードを上げ、設計の正確性を向上させます。

## What Changes

- **ハイブリッド・パス検索 (Path Finder)**:
    - 2つのテーブルを指定すると、その間を繋ぐパスを自動探索します。
    - 探索対象にはER関係（Relationships）とデータの流れ（Lineage）の両方を含めます。
    - 検索結果には、各ステップが「ER（1-Nなど）」か「Lineage（Upstream/Downstream）」かを明示します。
    - 検索されたパスをキャンバス上で視覚的にハイライト（強調）する機能を追加します。
- **付箋検索機能**:
    - モデル内の全ての付箋（Sticky Notes）のテキストを検索し、一覧表示します。
    - 検索結果をクリックすると、キャンバス上の該当する付箋へジャンプ（フォーカス）します。
- **右パネルのUI拡張**:
    - 現在のエンティティ一覧に加え、パス検索と付箋検索を切り替えて利用できるタブインターフェースを導入します。

## Capabilities

### New Capabilities
- `path-finder`: ERとLineageを統合したグラフ探索機能。
- `note-search`: 全文検索による付箋の発見とナビゲーション。

### Modified Capabilities
- `right-panel`: 複数の情報ソース（Tables, Paths, Notes）を管理できるよう拡張。

## Impact

- `visualizer/src/lib/graph.ts` (新設): BFS等を用いた最短経路探索エンジンの実装。
- `visualizer/src/components/RightPanel/RightPanel.tsx`: タブ切り替えおよび各検索UIの実装。
- `visualizer/src/store/useStore.ts`: 検索結果（ハイライトすべきノード・エッジ）の状態管理。
- `visualizer/src/App.tsx`: キャンバス上でのパスハイライト演出の追加。
