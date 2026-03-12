## Context

失敗しているテストの多くは `strict mode violation`（要素が1つであるはずが複数見つかった）です。これは `.sidebar-content` や `USERS` という文字列が、キャンバス、サイドバー、詳細パネルの複数箇所に現れるためです。

## Decisions

### 1. セレクタの「階層指定」の徹底
`locator('.sidebar-content')` ではなく、`locator('nav .sidebar-content')` (Sidebar用) や `locator('.detail-panel-container .sidebar-content')` のように親要素を含めて指定します。

### 2. 要素の属性を利用した特定
単なるテキストマッチングではなく、`aria-label`, `title`, `role` などを組み合わせて、意図したボタンや入力を正確に狙います。

### 3. テストファイルの統合と重複排除
`basic.spec.ts` と `comprehensive.spec.ts` で似たようなテストを行っているため、これを整理して `tests/main.spec.ts` などの単一の強力なテストファイルにまとめることも検討します。

## Risks / Trade-offs

- **[Risk]** テストが通りやすくなるが、チェックが甘くなる。
  - **Mitigation:** アサーション（期待される結果）は弱めず、あくまで「要素を見つける力（Locator）」だけを強化します。
