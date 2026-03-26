## ADDED Requirements

### Requirement: キャンバスの画像エクスポート
システムはRightPanelのアクティビティバーにExport as Imageボタンを提供し、キャンバスをPNGまたはJPG形式でダウンロードできなければならない（SHALL）。

#### Scenario: Exportボタンからポップアップが開く
- **WHEN** ユーザーがRightPanelのExport as Imageボタンをクリックする
- **THEN** フォーマット選択ポップアップが表示される

#### Scenario: PNG形式でエクスポートする
- **WHEN** ユーザーがPNGを選択してExportボタンをクリックする
- **THEN** キャンバスがPNGファイルとしてダウンロードされる

#### Scenario: JPG形式でエクスポートする
- **WHEN** ユーザーがJPGを選択してExportボタンをクリックする
- **THEN** キャンバスがJPGファイルとしてダウンロードされる

### Requirement: PNG背景色の選択
PNG形式選択時、ユーザーは背景色をWhiteまたはTransparentから選択できなければならない（SHALL）。

#### Scenario: PNG選択時に背景色オプションが表示される
- **WHEN** ユーザーがフォーマットとしてPNGを選択する
- **THEN** 背景色オプション（White / Transparent）が表示される

#### Scenario: JPG選択時に背景色オプションが非表示になる
- **WHEN** ユーザーがフォーマットとしてJPGを選択する
- **THEN** 背景色オプションは表示されない

### Requirement: Presentation Modeの削除
**REMOVED**

Presentation Modeおよびその関連実装（`isPresentationMode`ストア状態・`PresentationOverlay`コンポーネント・UIガード）をすべて削除しなければならない（SHALL）。

#### Scenario: Presentation Modeが存在しない
- **WHEN** ユーザーがアプリケーションを操作する
- **THEN** Presentation Modeに関するUI（Playボタン・オーバーレイ）は一切表示されない
