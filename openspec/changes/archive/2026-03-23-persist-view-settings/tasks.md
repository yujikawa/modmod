## 1. Persist view settings with Zustand middleware

- [x] 1.1 In `visualizer/src/store/useStore.ts`, import `persist` and `createJSONStorage` from `zustand/middleware`
- [x] 1.2 Wrap the store creator with `persist(...)`, using `name: 'modscape-ui-settings'` and `partialize` to select only `theme`, `showER`, `showLineage`, `showAnnotations`, `isCompactMode`

## 2. Verify and build

- [x] 2.1 Run `npm run build-ui` and confirm it succeeds with no type errors
