import { create } from 'zustand'
import type { Schema, Table } from '../types/schema'
import { parseYAML, normalizeSchema } from '../lib/parser'

export interface ModelFile {
  slug: string;
  name: string;
  path: string;
}

interface AppState {
  schema: Schema | null;
  selectedTableId: string | null;
  hoveredColumnId: string | null;
  error: string | null;
  isCliMode: boolean;
  
  // Multi-file state
  availableFiles: ModelFile[];
  currentModelSlug: string | null;
  
  // Sidebar State
  isSidebarOpen: boolean;
  activeTab: 'editor' | 'entities';
  focusNodeId: string | null;
  
  // Actions
  setSchema: (schema: any) => void;
  setSelectedTableId: (id: string | null) => void;
  setHoveredColumnId: (id: string | null) => void;
  setIsCliMode: (isCli: boolean) => void;
  parseAndSetSchema: (yaml: string) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNodeDimensions: (id: string, width: number, height: number) => void;
  saveLayout: () => Promise<void>;
  
  // Multi-file Actions
  fetchAvailableFiles: () => Promise<void>;
  setCurrentModel: (slug: string) => Promise<void>;
  
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

  // Multi-file Defaults
  availableFiles: [],
  currentModelSlug: null,

  // Sidebar Defaults
  isSidebarOpen: true,
  activeTab: 'editor',
  focusNodeId: null,

  setSchema: (data) => {
    try {
      const schema = normalizeSchema(data);
      set({ schema, error: null });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  
  setSelectedTableId: (id) => set({ selectedTableId: id }),

  setHoveredColumnId: (id) => set({ hoveredColumnId: id }),

  setIsCliMode: (isCli) => set({ isCliMode: isCli }),
  
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFocusNodeId: (id) => set({ focusNodeId: id }),
  
  fetchAvailableFiles: async () => {
    // Check for injected data (static build)
    const injectedData = (window as any).__MODMOD_DATA__;
    if (injectedData && injectedData.models) {
      const files = injectedData.models.map((m: any) => ({
        slug: m.slug,
        name: m.name,
        path: ''
      }));
      set({ availableFiles: files });
      return;
    }

    try {
      const res = await fetch('/api/files');
      const files = await res.json();
      set({ availableFiles: files });
    } catch (e) {
      console.error('Failed to fetch files:', e);
    }
  },

  setCurrentModel: async (slug: string) => {
    // Check for injected data (static build)
    const injectedData = (window as any).__MODMOD_DATA__;
    if (injectedData && injectedData.models) {
      const model = injectedData.models.find((m: any) => m.slug === slug);
      if (model) {
        set({ 
          currentModelSlug: slug, 
          schema: normalizeSchema(model.schema), 
          selectedTableId: null, 
          error: null 
        });
        
        // Update URL
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('model', slug);
        const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        window.history.pushState(null, '', newRelativePathQuery);
      }
      return;
    }

    try {
      const url = `/api/model?model=${slug}`;
      const res = await fetch(url);
      const data = await res.json();
      
      set({ 
        currentModelSlug: slug, 
        schema: normalizeSchema(data), 
        selectedTableId: null, 
        error: null 
      });

      // Update URL without reload
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('model', slug);
      const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      window.history.pushState(null, '', newRelativePathQuery);
    } catch (e) {
      console.error('Failed to fetch model:', e);
    }
  },

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
    const { schema, currentModelSlug } = get();
    if (!schema || !schema.layout) return;

    try {
      const url = currentModelSlug ? `/api/layout?model=${currentModelSlug}` : '/api/layout';
      await fetch(url, {
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
