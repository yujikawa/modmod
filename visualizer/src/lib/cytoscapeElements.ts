import type { Schema, Table } from '../types/schema'

// Minimal element definition shape for Cytoscape
export interface CyElementDefinition {
  data: Record<string, unknown>
  position?: { x: number; y: number }
  classes?: string
}

export const TYPE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  fact: { color: '#f87171', icon: '📊', label: 'FACT' },
  dimension: { color: '#60a5fa', icon: '🏷️', label: 'DIM' },
  hub: { color: '#fbbf24', icon: '🌐', label: 'HUB' },
  link: { color: '#34d399', icon: '🔗', label: 'LINK' },
  satellite: { color: '#a78bfa', icon: '🛰️', label: 'SAT' },
  mart: { color: '#f5700b', icon: '📈', label: 'MART' },
  table: { color: '#64748b', icon: '📋', label: 'TABLE' },
}

export function buildTypeLabel(table: Table): string {
  const typeConfig = table.appearance?.type ? TYPE_CONFIG[table.appearance.type] : null
  let typeLabel = typeConfig?.label || ''
  const subType = table.appearance?.sub_type
  const scd = table.appearance?.scd

  if (table.appearance?.type === 'fact' && subType) {
    const strategyMap: Record<string, string> = {
      transaction: 'Trans.',
      periodic: 'Periodic',
      accumulating: 'Accum.',
      factless: 'Factless',
    }
    typeLabel = `FACT (${strategyMap[subType] || subType})`
  } else if (table.appearance?.type && subType) {
    typeLabel = `${table.appearance.type.toUpperCase()} (${subType})`
  } else if (table.appearance?.type) {
    typeLabel = table.appearance.type.toUpperCase()
  }

  if (scd) {
    const scdLabel = `SCD ${scd.replace('type', 'T')}`
    typeLabel = typeLabel ? `${typeLabel} / ${scdLabel}` : scdLabel
  }

  return typeLabel
}

function cardinalityLabel(type: string | undefined): string {
  switch (type) {
    case 'one-to-many': return '1..N'
    case 'many-to-one': return 'N..1'
    case 'many-to-many': return 'N..N'
    case 'one-to-one': return '1..1'
    default: return ''
  }
}

/**
 * Convert a parsed YAML schema to Cytoscape element definitions.
 * Tables → nodes, lineage.upstream[] → lineage edges, relationships[] → ER edges.
 * Does NOT mutate the schema.
 */
export function yamlToElements(schema: Schema): CyElementDefinition[] {
  const elements: CyElementDefinition[] = []

  // Build domain membership map for quick lookup
  const domainByTableId = new Map<string, string>()
  schema.domains?.forEach(domain => {
    domain.tables.forEach(tableId => {
      domainByTableId.set(tableId, domain.id)
    })
  })

  // Auto-layout fallback positions
  const TABLE_WIDTH = 280
  const TABLE_HEIGHT = 200
  const GRID_COLS = 3

  // Table nodes
  schema.tables.forEach((table, index) => {
    const layout = schema.layout?.[table.id]
    const col = index % GRID_COLS
    const row = Math.floor(index / GRID_COLS)

    // Always treat layout x/y as absolute canvas coordinates.
    // parentId in layout is semantic metadata only (domain membership), not used for coordinate math.
    const x = layout?.x ?? col * (TABLE_WIDTH + 40)
    const y = layout?.y ?? row * (TABLE_HEIGHT + 40)

    const typeConfig = table.appearance?.type ? TYPE_CONFIG[table.appearance.type] : null
    const typeColor = table.appearance?.color || typeConfig?.color || '#334155'

    elements.push({
      data: {
        id: table.id,
        table,
        domainId: domainByTableId.get(table.id) ?? null,
        typeColor,
        typeLabel: buildTypeLabel(table),
        typeIcon: table.appearance?.icon || typeConfig?.icon || '',
      },
      position: { x, y },
    })
  })

  // Lineage edges (from lineage.upstream[])
  schema.tables.forEach(table => {
    table.lineage?.upstream?.forEach((upId, i) => {
      elements.push({
        data: {
          id: `lin-${upId}-${table.id}-${i}`,
          source: upId,
          target: table.id,
          kind: 'lineage',
        },
        classes: 'lineage-edge',
      })
    })
  })

  // ER edges (from relationships[])
  schema.relationships?.forEach((rel, i) => {
    elements.push({
      data: {
        id: `er-${i}`,
        source: rel.from.table,
        target: rel.to.table,
        kind: 'er',
        label: cardinalityLabel(rel.type),
        fromColumn: rel.from.column ?? null,
        toColumn: rel.to.column ?? null,
        relType: rel.type ?? null,
      },
      classes: 'er-edge',
    })
  })

  return elements
}
