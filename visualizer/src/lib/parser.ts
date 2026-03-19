import yaml from 'js-yaml'
import type { Schema } from '../types/schema'

export function normalizeSchema(data: any): Schema {
  // Basic validation and mapping
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid YAML: Root must be an object')
  }

  // Normalization: Ensure tables, relationships, domains and annotations are always arrays
  const schema: Schema = {
    tables: Array.isArray(data.tables) ? data.tables : [],
    relationships: Array.isArray(data.relationships) ? data.relationships : [],
    domains: Array.isArray(data.domains) ? data.domains : [],
    annotations: Array.isArray(data.annotations) ? data.annotations : [],
    layout: data.layout || {}
  }

  // Further normalization for each table
  schema.tables = schema.tables.map((table: any) => {
    let sampleData = table.sampleData;
    
    // Migrate legacy format { columns: [...], rows: [[...]] } to new [[...]] format
    if (sampleData && typeof sampleData === 'object' && !Array.isArray(sampleData)) {
      const legacyColumns = Array.isArray(sampleData.columns) ? sampleData.columns : [];
      const legacyRows = Array.isArray(sampleData.rows) ? sampleData.rows : [];
      
      if (legacyColumns.length > 0 && legacyRows.length > 0) {
        // Map legacy columns (ID list) to current table column order
        const currentColumns = Array.isArray(table.columns) ? table.columns : [];
        sampleData = legacyRows.map((row: any[]) => {
          return currentColumns.map((col: any) => {
            const colIndex = legacyColumns.indexOf(col.id);
            return colIndex !== -1 ? row[colIndex] : null;
          });
        });
      } else if (legacyRows.length > 0) {
        sampleData = legacyRows;
      } else {
        sampleData = [];
      }
    }

    const appearance = table.appearance ? { ...table.appearance } : undefined;
    if (appearance) {
      // Compatibility mapping: sub_type (if type0-7) -> scd
      if (appearance.sub_type && /^type[0-7]$/.test(appearance.sub_type) && !appearance.scd) {
        appearance.scd = appearance.sub_type;
        appearance.sub_type = undefined;
      }
    }

    return {
      ...table,
      id: table.id || 'unknown',
      name: table.name !== undefined ? table.name : (table.id || 'Unnamed Table'),
      logical_name: table.logical_name,
      physical_name: table.physical_name,
      appearance,
      lineage: table.lineage ? { ...table.lineage } : undefined,
      implementation: table.implementation ? {
        ...table.implementation,
        // Normalize unique_key: YAML may have a single string or an array
        unique_key: table.implementation.unique_key
          ? (Array.isArray(table.implementation.unique_key)
              ? table.implementation.unique_key
              : [table.implementation.unique_key])
          : undefined,
        // Normalize partition_by: YAML may have a single object or an array
        partition_by: table.implementation.partition_by
          ? (Array.isArray(table.implementation.partition_by)
              ? table.implementation.partition_by
              : [table.implementation.partition_by])
          : undefined,
      } : undefined,
      columns: Array.isArray(table.columns) ? table.columns.map((col: any) => ({
        ...col,
        logical: col.logical ? { ...col.logical } : undefined,
        physical: col.physical ? { ...col.physical } : undefined
      })) : [],
      sampleData: Array.isArray(sampleData) ? sampleData : []
    }
  })

  return schema
}

export function parseYAML(input: string): Schema {
  try {
    const data = yaml.load(input) as any
    return normalizeSchema(data)
  } catch (e: any) {
    throw new Error(`YAML Parsing Error: ${e.message}`)
  }
}
