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
  updateNodePosition: (id: string, x: number, y: number) => void;
  saveLayout: () => Promise<void>;
  
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

  updateNodePosition: (id, x, y) => {
    const schema = get().schema;
    if (!schema) return;

    const newLayout = {
      ...(schema.layout || {}),
      [id]: { x: Math.round(x), y: Math.round(y) }
    };

    set({ schema: { ...schema, layout: newLayout } });
  },

  saveLayout: async () => {
    const schema = get().schema;
    if (!schema || !schema.layout) return;

    try {
      await fetch('/api/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schema.layout)
      });
    } catch (e) {
      console.error('Failed to save layout:', e);
    }
  },

  getSelectedTable: () => {
    const { schema, selectedTableId } = get()
    if (!schema || !selectedTableId) return null
    return schema.tables.find(t => t.id === selectedTableId) || null
  }
}))
