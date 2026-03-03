import { create } from 'zustand'
import yaml from 'js-yaml'
import type { Schema, Table, Relationship, Domain } from '../types/schema'
import { parseYAML, normalizeSchema } from '../lib/parser'

export interface ModelFile {
  slug: string;
  name: string;
  path: string;
}

interface AppState {
  schema: Schema | null;
  selectedTableId: string | null;
  selectedEdgeId: string | null;
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
  showER: boolean;
  showLineage: boolean;
  
  // Actions
  setSchema: (schema: any) => void;
  setSelectedTableId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setHoveredColumnId: (id: string | null) => void;
  setIsCliMode: (isCli: boolean) => void;
  setShowER: (show: boolean) => void;
  setShowLineage: (show: boolean) => void;
  parseAndSetSchema: (yaml: string) => void;
  updateNodePosition: (id: string, x: number, y: number, parentId?: string | null) => void;
  updateNodeDimensions: (id: string, width: number, height: number) => void;
  saveLayout: () => Promise<void>;
  
  // Modeling Actions
  addTable: (x: number, y: number) => void;
  addDomain: (x: number, y: number) => void;
  addRelationship: (source: string, target: string, sourceHandle?: string | null, targetHandle?: string | null) => void;
  addLineage: (source: string, target: string) => void;
  updateRelationship: (index: number, updates: Partial<Relationship>) => void;
  removeEdge: (sourceId: string, targetId: string) => void;
  removeNode: (id: string) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  updateDomain: (id: string, updates: Partial<Domain>) => void;
  toggleTableSelection: (id: string) => void;
  toggleEdgeSelection: (id: string) => void;
  
  // Multi-file Actions
  fetchAvailableFiles: () => Promise<void>;
  setCurrentModel: (slug: string) => Promise<void>;
  
  // Sidebar Actions
  setIsSidebarOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: 'editor' | 'entities') => void;
  setFocusNodeId: (id: string | null) => void;
  
  // Computed (helpers)
  getSelectedTable: () => Table | null;
  getSelectedDomain: () => Domain | null;
  getSelectedRelationship: () => { relationship: Relationship; index: number } | null;
}

export const useStore = create<AppState>((set, get) => ({
  schema: null,
  selectedTableId: null,
  selectedEdgeId: null,
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
  showER: true,
  showLineage: true,

  setSchema: (data) => {
    try {
      const schema = normalizeSchema(data);
      set({ schema, error: null });
      get().syncToYamlInput();
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  setShowER: (show) => set({ showER: show }),
  setShowLineage: (show) => set({ showLineage: show }),
  
  setSelectedTableId: (id) => set({ selectedTableId: id }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id }),
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

    if (parentId !== undefined) {
      newDomains = newDomains.map(d => ({
        ...d,
        tables: d.tables.filter(tid => tid !== id)
      }));

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
addRelationship: (source, target, sourceHandle, targetHandle) => {
  const schema = get().schema;
  if (!schema) return;

  // Correctly extract column ID by removing table ID and suffix
  const sourceCol = sourceHandle ? (sourceHandle.replace(`${source}-`, '').replace('-source', '') || undefined) : undefined;
  const targetCol = targetHandle ? (targetHandle.replace(`${target}-`, '').replace('-target', '') || undefined) : undefined;

  // Validation: Prevent duplicate relationships
  const isDuplicate = (schema.relationships || []).some(rel => 
    rel.from.table === source && 
    rel.from.column === sourceCol && 
    rel.to.table === target && 
    rel.to.column === targetCol
  );

  if (isDuplicate) return;

  const newRelationship: Relationship = {
    from: { table: source, column: sourceCol },
    to: { table: target, column: targetCol },
    type: 'one-to-many'
  };


    const newSchema = {
      ...schema,
      relationships: [...(schema.relationships || []), newRelationship]
    };

    set({ schema: normalizeSchema(newSchema) });
    get().syncToYamlInput();
  },

  addLineage: (source, target) => {
    const { schema } = get();
    if (!schema) return;

    const newTables = schema.tables.map(table => {
      if (table.id === target) {
        const currentUpstream = table.lineage?.upstream || [];
        if (!currentUpstream.includes(source)) {
          return {
            ...table,
            lineage: {
              ...table.lineage,
              upstream: [...currentUpstream, source]
            }
          };
        }
      }
      return table;
    });

    const newSchema = { ...schema, tables: newTables };
    set({ schema: normalizeSchema(newSchema) });
    get().syncToYamlInput();
  },

  updateRelationship: (index, updates) => {
    const { schema } = get();
    if (!schema || !schema.relationships) return;

    const newRelationships = schema.relationships.map((rel, i) => {
      if (i === index) {
        return { ...rel, ...updates };
      }
      return rel;
    });

    set({ schema: { ...schema, relationships: newRelationships } });
    get().syncToYamlInput();
  },

  removeEdge: (source, target) => {
    const { schema } = get();
    if (!schema) return;

    // 1. Remove ER Relationship
    const newRelationships = (schema.relationships || []).filter(
      r => {
        const isMatch = (r.from.table === source && r.to.table === target) ||
                        (r.from.table === target && r.to.table === source);
        return !isMatch;
      }
    );

    // 2. Remove Lineage Dependency
    const newTables = schema.tables.map(table => {
      if (table.id === target && table.lineage?.upstream) {
        return {
          ...table,
          lineage: {
            ...table.lineage,
            upstream: table.lineage.upstream.filter(id => id !== source)
          }
        };
      }
      return table;
    });

    const newSchema = { ...schema, relationships: newRelationships, tables: newTables };
    set({ schema: normalizeSchema(newSchema), selectedEdgeId: null });
    get().syncToYamlInput();
  },

  removeNode: (id) => {
    const { schema } = get();
    if (!schema) return;

    const newTables = schema.tables.filter(t => t.id !== id);
    const newDomains = (schema.domains || []).filter(d => d.id !== id).map(d => ({
      ...d,
      tables: d.tables.filter(tid => tid !== id)
    }));
    const newRelationships = (schema.relationships || []).filter(r => r.from.table !== id && r.to.table !== id);
    
    const newLayout = { ...(schema.layout || {}) };
    delete newLayout[id];

    const newSchema = {
      ...schema,
      tables: newTables,
      domains: newDomains,
      relationships: newRelationships,
      layout: newLayout
    };

    set({ schema: normalizeSchema(newSchema), selectedTableId: null });
    get().syncToYamlInput();
  },

  updateTable: (id, updates) => {
    const { schema } = get();
    if (!schema) return;

    const newTables = schema.tables.map(table => {
      if (table.id === id) {
        return { ...table, ...updates };
      }
      return table;
    });

    const newSchema = { ...schema, tables: newTables };
    set({ schema: normalizeSchema(newSchema) });
    get().syncToYamlInput();
  },

  updateDomain: (id, updates) => {
    const { schema } = get();
    if (!schema || !schema.domains) return;

    const newDomains = schema.domains.map(domain => {
      if (domain.id === id) {
        return { ...domain, ...updates };
      }
      return domain;
    });

    const newSchema = { ...schema, domains: newDomains };
    set({ schema: normalizeSchema(newSchema) });
    get().syncToYamlInput();
  },

  toggleTableSelection: (id) => {
    const { selectedTableId } = get();
    if (selectedTableId === id) {
      set({ selectedTableId: null });
    } else {
      set({ selectedTableId: id, selectedEdgeId: null });
    }
  },

  toggleEdgeSelection: (id) => {
    const { selectedEdgeId } = get();
    if (selectedEdgeId === id) {
      set({ selectedEdgeId: null });
    } else {
      set({ selectedEdgeId: id, selectedTableId: null });
    }
  },
  
  getSelectedTable: () => {
    const { schema, selectedTableId } = get();
    if (!schema || !selectedTableId) return null;
    return schema.tables.find(t => t.id === selectedTableId) || null;
  },

  getSelectedDomain: () => {
    const { schema, selectedTableId } = get();
    if (!schema || !selectedTableId || !schema.domains) return null;
    return schema.domains.find(d => d.id === selectedTableId) || null;
  },

  getSelectedRelationship: () => {
    const { schema, selectedEdgeId } = get();
    if (!schema || !selectedEdgeId) return null;

    if (selectedEdgeId.startsWith('lin-')) {
      // Lineage Edge Format: lin-SOURCE-TARGET-INDEX
      const parts = selectedEdgeId.split('-');
      const source = parts[1];
      const target = parts[2];
      return { 
        relationship: { from: { table: source }, to: { table: target }, type: 'lineage' as any }, 
        index: -1 
      };
    }

    if (!selectedEdgeId.startsWith('e-')) return null;
    const index = parseInt(selectedEdgeId.split('-')[1]);
    const relationship = schema.relationships[index];
    if (!relationship) return null;
    return { relationship, index };
  }
  }));
