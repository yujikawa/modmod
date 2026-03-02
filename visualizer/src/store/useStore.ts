import { create } from 'zustand'
import yaml from 'js-yaml'
import type { Schema, Table, Relationship } from '../types/schema'
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
  
  // YAML Input (Sidebar State)
  yamlInput: string;
  setYamlInput: (yaml: string) => void;
  syncToYamlInput: () => void;
  
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
  updateNodePosition: (id: string, x: number, y: number, parentId?: string | null) => void;
  updateNodeDimensions: (id: string, width: number, height: number) => void;
  saveLayout: () => Promise<void>;
  
  // Modeling Actions
  addTable: (x: number, y: number) => void;
  addDomain: (x: number, y: number) => void;
  addEdge: (source: string, target: string) => void;
  
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
  isCliMode: (typeof window !== 'undefined' && (window as any).MODSCAPE_CLI_MODE === true),

  // YAML Input
  yamlInput: '',
  setYamlInput: (yaml) => set({ yamlInput: yaml }),
  syncToYamlInput: () => {
    const { schema } = get();
    if (schema) {
      const yamlString = yaml.dump(schema, { indent: 2, lineWidth: -1, noRefs: true });
      set({ yamlInput: yamlString });
    }
  },

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
      get().syncToYamlInput();
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
    const injectedData = (window as any).__MODSCAPE_DATA__;
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
    const injectedData = (window as any).__MODSCAPE_DATA__;
    if (injectedData && injectedData.models) {
      const model = injectedData.models.find((m: any) => m.slug === slug);
      if (model) {
        set({ 
          currentModelSlug: slug, 
          schema: normalizeSchema(model.schema), 
          selectedTableId: null, 
          error: null 
        });
        get().syncToYamlInput();
        
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
      get().syncToYamlInput();

      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('model', slug);
      const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      window.history.pushState(null, '', newRelativePathQuery);
    } catch (e) {
      console.error('Failed to fetch model:', e);
    }
  },

  parseAndSetSchema: (yamlInput) => {
    try {
      const schema = parseYAML(yamlInput)
      set({ schema, error: null })
    } catch (e: any) {
      set({ error: e.message })
    }
  },

  updateNodePosition: (id, x, y, parentId) => {
    const schema = get().schema;
    if (!schema) return;

    let newDomains = schema.domains || [];

    // If a parentId is provided (dropped into a domain), update domain membership
    if (parentId !== undefined) {
      // 1. Remove from all existing domains
      newDomains = newDomains.map(d => ({
        ...d,
        tables: d.tables.filter(tid => tid !== id)
      }));

      // 2. Add to the new domain if parentId is set
      if (parentId) {
        newDomains = newDomains.map(d => {
          if (d.id === parentId) {
            return { ...d, tables: Array.from(new Set([...d.tables, id])) };
          }
          return d;
        });
      }
    }

    const currentLayout = schema.layout?.[id] || { x: 0, y: 0 };
    const newLayout = {
      ...(schema.layout || {}),
      [id]: { ...currentLayout, x: Math.round(x), y: Math.round(y) }
    };

    set({ schema: { ...schema, domains: newDomains, layout: newLayout } });
    get().syncToYamlInput();
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
    get().syncToYamlInput();
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

  addTable: (x, y) => {
    const schema = get().schema || { tables: [], relationships: [], domains: [], layout: {} };
    const newId = `new_table_${Date.now()}`;
    const newTable: Table = {
      id: newId,
      name: 'NEW_TABLE',
      appearance: { type: 'fact' },
      columns: [
        { id: 'id', logical: { name: 'ID', type: 'Integer', isPrimaryKey: true } }
      ]
    };
    
    const newSchema = {
      ...schema,
      tables: [...(schema.tables || []), newTable],
      layout: {
        ...(schema.layout || {}),
        [newId]: { x: Math.round(x), y: Math.round(y) }
      }
    };
    
    set({ schema: normalizeSchema(newSchema), error: null });
    get().syncToYamlInput();
  },
  
  addDomain: (x, y) => {
    const schema = get().schema || { tables: [], relationships: [], domains: [], layout: {} };
    const newId = `new_domain_${Date.now()}`;
    const newDomain = {
      id: newId,
      name: 'NEW_DOMAIN',
      description: 'Domain purpose',
      tables: [],
      color: 'rgba(59, 130, 246, 0.05)'
    };
    
    const newSchema = {
      ...schema,
      domains: [...(schema.domains || []), newDomain],
      layout: {
        ...(schema.layout || {}),
        [newId]: { x: Math.round(x), y: Math.round(y), width: 600, height: 400 }
      }
    };
    
    set({ schema: normalizeSchema(newSchema), error: null });
    get().syncToYamlInput();
  },

  addEdge: (source, target) => {
    const schema = get().schema;
    if (!schema) return;

    const newRelationship: Relationship = {
      from: { table: source, column: 'id' },
      to: { table: target, column: 'id' },
      type: 'one-to-many'
    };

    const newSchema = {
      ...schema,
      relationships: [...(schema.relationships || []), newRelationship]
    };

    set({ schema: normalizeSchema(newSchema) });
    get().syncToYamlInput();
  },
  
  getSelectedTable: () => {
    const { schema, selectedTableId } = get();
    if (!schema || !selectedTableId) return null;
    return schema.tables.find(t => t.id === selectedTableId) || null;
  }
}));
