## MODIFIED Requirements

### Requirement: Distinct Relationship Path Visualization
PathFinderの経路結果はエッジ種別（ER・リネージ）を視覚的に区別して表示しなければならない。エッジ種別フィルターが「両方」のときは両種別を色分けして表示する。

#### Scenario: ERエッジの視覚的区別
- **WHEN** PathFinder結果にERエッジのステップが含まれる
- **THEN** ER関係のバッジはエメラルド系の配色（bg-emerald-50, text-emerald-700）で表示される

#### Scenario: リネージエッジの視覚的区別
- **WHEN** PathFinder結果にリネージエッジのステップが含まれる
- **THEN** リネージ関係のバッジはブルー系の配色（bg-blue-50, text-blue-700）で表示される

#### Scenario: エッジ種別フィルター「リネージのみ」での表示
- **WHEN** エッジ種別フィルターが「リネージ」でPathFinder結果が表示される
- **THEN** 結果にはリネージエッジのみが含まれ、ERバッジは表示されない

#### Scenario: エッジ種別フィルター「ERのみ」での表示
- **WHEN** エッジ種別フィルターが「ER」でPathFinder結果が表示される
- **THEN** 結果にはERエッジのみが含まれ、リネージバッジは表示されない
