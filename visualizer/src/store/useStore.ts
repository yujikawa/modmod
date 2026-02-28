import { create } from 'zustand'
import type { Schema, Table } from '../types/schema'
import { parseYAML } from '../lib/parser'

interface AppState {
  schema: Schema | null;
  selectedTableId: string | null;
  hoveredColumnId: string | null;
  error: string | null;
  isCliMode: boolean;
  
  // Sidebar State
  isSidebarOpen: boolean;
  activeTab: 'editor' | 'entities';
  focusNodeId: string | null;
  
  // Actions
  setSchema: (schema: Schema) => void;
  setSelectedTableId: (id: string | null) => void;
  setHoveredColumnId: (id: string | null) => void;
  setIsCliMode: (isCli: boolean) => void;
  parseAndSetSchema: (yaml: string) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNodeDimensions: (id: string, width: number, height: number) => void;
  saveLayout: () => Promise<void>;
  
  // Sidebar Actions
  setIsSidebarOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: 'editor' | 'entities') => void;
  setFocusNodeId: (id: string | null) => void;
  
  // Computed (helpers)
  getSelectedTable: () => Table | null;
}

export const useStore = create<AppState>((set, get) => ({
  schema: null,
  selectedTableId: null,
  hoveredColumnId: null,
  error: null,
  isCliMode: (typeof window !== 'undefined' && (window as any).MODMOD_CLI_MODE === true),

  // Sidebar Defaults
  isSidebarOpen: true,
  activeTab: 'editor',
  focusNodeId: null,

  setSchema: (schema) => set({ schema, error: null }),
  
  setSelectedTableId: (id) => set({ selectedTableId: id }),

  setHoveredColumnId: (id) => set({ hoveredColumnId: id }),

  setIsCliMode: (isCli) => set({ isCliMode: isCli }),
  
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFocusNodeId: (id) => set({ focusNodeId: id }),
  
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

    const currentLayout = schema.layout?.[id] || { x: 0, y: 0 };
    const newLayout = {
      ...(schema.layout || {}),
      [id]: { ...currentLayout, x: Math.round(x), y: Math.round(y) }
    };

    set({ schema: { ...schema, layout: newLayout } });
  },

  updateNodeDimensions: (id, width, height) => {
    const schema = get().schema;
    if (!schema) return;

    const currentLayout = schema.layout?.[id] || { x: 0, y: 0 };
    const newLayout = {
      ...(schema.layout || {}),
      [id]: { ...currentLayout, width: Math.round(width), height: Math.round(height) }
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
