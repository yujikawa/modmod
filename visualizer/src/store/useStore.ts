import { create } from 'zustand'
import type { Schema, Table } from '../types/schema'
import { parseYAML } from '../lib/parser'

interface AppState {
  schema: Schema | null;
  selectedTableId: string | null;
  hoveredColumnId: string | null;
  error: string | null;
  
  // Actions
  setSchema: (schema: Schema) => void;
  setSelectedTableId: (id: string | null) => void;
  setHoveredColumnId: (id: string | null) => void;
  parseAndSetSchema: (yaml: string) => void;
  
  // Computed (helpers)
  getSelectedTable: () => Table | null;
}

export const useStore = create<AppState>((set, get) => ({
  schema: null,
  selectedTableId: null,
  hoveredColumnId: null,
  error: null,

  setSchema: (schema) => set({ schema, error: null }),
  
  setSelectedTableId: (id) => set({ selectedTableId: id }),

  setHoveredColumnId: (id) => set({ hoveredColumnId: id }),
  
  parseAndSetSchema: (yaml) => {
    try {
      const schema = parseYAML(yaml)
      set({ schema, error: null })
    } catch (e: any) {
      set({ error: e.message })
    }
  },

  getSelectedTable: () => {
    const { schema, selectedTableId } = get()
    if (!schema || !selectedTableId) return null
    return schema.tables.find(t => t.id === selectedTableId) || null
  }
}))
