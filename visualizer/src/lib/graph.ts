import type { Schema } from '../types/schema'

export interface GraphEdge {
  from: string;
  to: string;
  type: 'er' | 'lineage';
  id: string; // relationship index for ER, or custom string for lineage
  metadata?: any;
}

export interface PathStep {
  from: string;
  to: string;
  edge: GraphEdge;
}

/**
 * Builds an adjacency list from schema including ER and Lineage relationships
 */
export const buildAdjacencyList = (schema: Schema) => {
  const adj: Record<string, GraphEdge[]> = {}

  const addEdge = (from: string, to: string, type: 'er' | 'lineage', id: string, metadata?: any) => {
    if (!adj[from]) adj[from] = []
    adj[from].push({ from, to, type, id, metadata })
    
    // Treat as undirected for path discovery
    if (!adj[to]) adj[to] = []
    adj[to].push({ from: to, to: from, type, id, metadata })
  }

  // 1. Add ER Relationships
  schema.relationships?.forEach((rel, index) => {
    addEdge(rel.from.table, rel.to.table, 'er', `er-${index}`, rel)
  })

  // 2. Add Lineage Relationships
  schema.tables.forEach(table => {
    if (table.lineage?.upstream) {
      table.lineage.upstream.forEach((upId, index) => {
        addEdge(upId, table.id, 'lineage', `lin-${upId}-${table.id}-${index}`, { direction: 'upstream' })
      })
    }
  })

  return adj
}

/**
 * Finds the shortest path between two nodes using BFS
 */
export const findShortestPath = (
  schema: Schema, 
  startId: string, 
  targetId: string
): PathStep[] | null => {
  if (startId === targetId) return []

  const adj = buildAdjacencyList(schema)
  const queue: string[] = [startId]
  const visited = new Set<string>([startId])
  const parent: Record<string, PathStep> = {}

  while (queue.length > 0) {
    const current = queue.shift()!
    if (current === targetId) {
      // Reconstruct path
      const path: PathStep[] = []
      let step = targetId
      while (step !== startId) {
        const p = parent[step]
        path.unshift(p)
        step = p.from
      }
      return path
    }

    const neighbors = adj[current] || []
    for (const edge of neighbors) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to)
        parent[edge.to] = { from: current, to: edge.to, edge }
        queue.push(edge.to)
      }
    }
  }

  return null
}
