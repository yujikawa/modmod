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

### Requirement: PNGトランスペアレント背景トグル
PNG形式選択時、ユーザーはTransparent（透過）背景トグルを切り替えられなければならない（SHALL）。トグルOFFの場合は現在のテーマの背景色（ダークモード: `#020617`、ライトモード: `#f8fafc`）が適用される。

#### Scenario: PNG選択時にTransparentトグルが表示される
- **WHEN** ユーザーがフォーマットとしてPNGを選択する
- **THEN** TransparentトグルがポップアップUI内に表示される

#### Scenario: JPG選択時にTransparentトグルが非表示になる
- **WHEN** ユーザーがフォーマットとしてJPGを選択する
- **THEN** Transparentトグルは表示されない

### Requirement: Presentation Modeの削除
Presentation Modeおよびその関連実装（`isPresentationMode`ストア状態・`PresentationOverlay`コンポーネント・UIガード）をすべて削除しなければならない（SHALL）。

#### Scenario: Presentation Modeが存在しない
- **WHEN** ユーザーがアプリケーションを操作する
- **THEN** Presentation Modeに関するUI（Playボタン・オーバーレイ）は一切表示されない
