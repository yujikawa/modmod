import yaml from 'js-yaml'
import type { Schema } from '../types/schema'

export function normalizeSchema(data: any): Schema {
  // Basic validation and mapping
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid YAML: Root must be an object')
  }

  // Normalization: Ensure tables, relationships and domains are always arrays
  const schema: Schema = {
    tables: Array.isArray(data.tables) ? data.tables : [],
    relationships: Array.isArray(data.relationships) ? data.relationships : [],
    domains: Array.isArray(data.domains) ? data.domains : [],
    layout: data.layout || {}
  }

  // Further normalization for each table
  schema.tables = schema.tables.map((table: any) => ({
    ...table,
    id: table.id || 'unknown',
    name: table.name || table.id || 'Unnamed Table',
    appearance: table.appearance || undefined,
    columns: Array.isArray(table.columns) ? table.columns : []
  }))

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
