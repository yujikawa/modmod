## 1. バグ修正

- [x] 1.1 `CytoscapeCanvas.tsx` の `renderDomainBackgrounds` 内の `finalW = Math.max(bb.w, lw)` と `finalH = Math.max(bb.h, lh)` を `finalW = bb.w`、`finalH = bb.h` に変更する

## 2. ビルド・スナップショット更新

- [x] 2.1 `npm run build-ui` でビルドが成功することを確認する
- [x] 2.2 `npm run test:e2e -- --update-snapshots` でビジュアルスナップショットを更新する
