## 1. NodeCombobox コンポーネントの実装

- [x] 1.1 `PathFinderTab.tsx` 内に `NodeCombobox` コンポーネントの骨格を追加する（`query`, `isOpen` の useState、`ref` の useRef）
- [x] 1.2 `useEffect` でコンボボックス外のクリックを検知し `isOpen` を false にする（`mousedown` + `ref.contains()`）
- [x] 1.3 `useMemo` でフィルタ済み `groupedNodes` を生成する（`query` で name・id を小文字部分一致フィルタ、空グループは除外）
- [x] 1.4 テキスト入力欄を実装する（フォーカスで `isOpen: true`、入力時に `onChange('')` を呼んで選択リセット＋`query` 更新）
- [x] 1.5 ドロップダウン部分を実装する（`isOpen` のとき表示、フィルタ済みグループをグループヘッダー付きで列挙、マッチなし時に "No results" 表示）
- [x] 1.6 ドロップダウンの各項目クリックで `onChange(id)` を呼び、`query` をクリア・`isOpen: false` にする
- [x] 1.7 選択済み状態（`value` が非空）のときテキスト欄にノード名を表示し、クリアボタン（✕）を表示する
- [x] 1.8 クリアボタンクリックで `onChange('')`・`query` クリア・`isOpen: true` にする

## 2. NodeSelect から NodeCombobox への差し替え

- [x] 2.1 Single モードの `<NodeSelect label="Node" ...>` を `<NodeCombobox label="Node" ...>` に差し替える
- [x] 2.2 Path モードの From・To それぞれの `<NodeSelect>` を `<NodeCombobox>` に差し替える
- [x] 2.3 `NodeSelect` コンポーネントの定義を削除する

## 3. ビルド・動作確認

- [x] 3.1 `npm run build-ui` でビルドが通ることを確認する
- [x] 3.2 手動動作確認：テキスト入力でフィルタ・選択・クリアが正しく動くことを確認する
- [x] 3.3 `npm run test:e2e -- --update-snapshots` でスナップショットを更新し、差分をコミットに含める
