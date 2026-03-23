// Ambient declarations for Cytoscape extensions (no TypeScript types shipped)
declare module 'cytoscape-dagre' {
  const ext: (cy: unknown) => void
  export = ext
}

declare module 'cytoscape-dom-node' {
  const ext: (cy: unknown) => void
  export = ext
}

declare module 'cytoscape-edgehandles' {
  const ext: (cy: unknown) => void
  export = ext
}

// Extend the cytoscape function declaration to include `use`
declare module 'cytoscape' {
  // Plugin registration
  function use(plugin: (cy: unknown) => void): void
}
