import yaml from 'js-yaml'
import type { Schema } from '../types/schema'

export function parseYAML(input: string): Schema {
  try {
    const data = yaml.load(input) as any
    
    // Basic validation and mapping
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid YAML: Root must be an object')
    }

    if (!Array.isArray(data.tables)) {
      throw new Error('Invalid YAML: "tables" must be an array')
    }

    // Return the data cast to Schema
    // In a real app, we might want more rigorous validation (e.g. Zod)
    return data as Schema
  } catch (e: any) {
    throw new Error(`YAML Parsing Error: ${e.message}`)
  }
}
