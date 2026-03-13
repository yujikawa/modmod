import { create } from 'zustand'
import yaml from 'js-yaml'
import dagre from 'dagre'
import type { Schema, Table, Relationship, Domain, Annotation } from '../types/schema'
import { parseYAML, normalizeSchema } from '../lib/parser'

export interface ModelFile {
  slug: string;
  name: string;
  path: string;
}

interface AppState {
  schema: Schema | null;
  selectedTableId: string | null;
  selectedTableIds: string[];
  selectedEdgeId: string | null;
  selectedAnnotationId: string | null;
  hoveredColumnId: string | null;
  error: string | null;
  isCliMode: boolean;
  isAutoSaveEnabled: boolean;
  lastSavedAt: number;
  savingStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastUpdateSource: 'user' | 'visual' | 'undo';
  
  // YAML Input (Sidebar State)
  yamlInput: string;
  setYamlInput: (yaml: string) => void;
  syncToYamlInput: () => void;
  
  // Multi-file state
  availableFiles: ModelFile[];
  currentModelSlug: string | null;
  
  // UI State
  isSidebarOpen: boolean;
  isRightPanelOpen: boolean;
  isQuickConnectBarOpen: boolean;
  isCommandPaletteOpen: boolean;
  isPresentationMode: boolean;
  activeTab: 'editor' | 'entities' | 'connect';
  activeRightPanelTab: 'tables' | 'path' | 'notes';
  focusNodeId: string | null;
  pathFinderResult: { nodeIds: string[], edgeIds: string[] } | null;
  showER: boolean;
  showLineage: boolean;
  showAnnotations: boolean;
  connectionStartHandle: { nodeId: string; handleId: string | null; handleType: string | null } | null;
  theme: 'dark' | 'light';
  isDetailPanelSuppressed: boolean;
  isDetailPanelMinimized: boolean;
  
  // Actions
  setSchema: (schema: any) => void;
  setSelectedTableId: (id: string | null) => void;
  setSelectedTableIds: (ids: string[]) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setSelectedAnnotationId: (id: string | null) => void;
  setIsDetailPanelSuppressed: (suppressed: boolean) => void;
  setIsDetailPanelMinimized: (minimized: boolean) => void;
  setHoveredColumnId: (id: string | null) => void;
  setIsCliMode: (isCli: boolean) => void;
  setShowER: (show: boolean) => void;
  setShowLineage: (show: boolean) => void;
  setShowAnnotations: (show: boolean) => void;
  setIsPresentationMode: (enabled: boolean) => void;
  setIsAutoSaveEnabled: (enabled: boolean) => void;
  setLastUpdateSource: (source: 'user' | 'visual' | 'undo') => void;
  parseAndSetSchema: (yaml: string) => void;
  updateNodePosition: (id: string, x: number, y: number, parentId?: string | null) => void;
  updateNodesPosition: (nodes: { id: string, x: number, y: number, parentId?: string | null }[]) => void;
  updateNodeDimensions: (id: string, width: number, height: number) => void;
  saveSchema: (force?: boolean) => Promise<void>;
  refreshModelData: () => Promise<void>;
  
  // Modeling Actions
  addTable: (x: number, y: number) => void;
  addDomain: (x: number, y: number) => void;
  addRelationship: (source: string, target: string, sourceHandle?: string | null, targetHandle?: string | null) => void;
  bulkAddRelationship: (source: { table: string, column?: string }, targetPattern: string, type: Relationship['type'] | 'lineage') => void;
  addLineage: (source: string, target: string) => void;
  updateRelationship: (index: number, updates: Partial<Relationship>) => void;
  removeEdge: (sourceId: string, targetId: string) => void;
  removeNode: (id: string) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  updateDomain: (id: string, updates: Partial<Domain>) => void;
  toggleDomainLock: (id: string) => void;
  assignTableToDomain: (tableId: string, domainId?: string | null) => void;
  bulkAssignTablesToDomain: (tableIds: string[], domainId: string | null) => void;
  toggleTableSelection: (id: string) => void;
  toggleEdgeSelection: (id: string) => void;
  toggleAnnotationSelection: (id: string) => void;
  
  // Annotation Actions
  addAnnotation: (offset: { x: number, y: number }, targetId?: string, targetType?: Annotation['targetType']) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  
  // Multi-file Actions
  fetchAvailableFiles: () => Promise<void>;
  setCurrentModel: (slug: string) => Promise<void>;
  
  // Sidebar Actions
  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsRightPanelOpen: (isOpen: boolean) => void;
  setIsQuickConnectBarOpen: (isOpen: boolean) => void;
  setIsCommandPaletteOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: 'editor' | 'entities' | 'connect') => void;
  setActiveRightPanelTab: (tab: 'tables' | 'path' | 'notes') => void;
  setPathFinderResult: (result: { nodeIds: string[], edgeIds: string[] } | null) => void;
  setFocusNodeId: (id: string | null) => void;
  setConnectionStartHandle: (handle: { nodeId: string; handleId: string | null; handleType: string | null } | null) => void;
  toggleTheme: () => void;
  calculateAutoLayout: () => void;
  
  // Computed (helpers)
  getSelectedTable: () => Table | null;
  getSelectedDomain: () => Domain | null;
  getSelectedRelationship: () => { relationship: Relationship; index: number } | null;
  getSelectedAnnotation: () => Annotation | null;
}

let saveTimeout: any = null;

export const useStore = create<AppState>((set, get) => ({
  schema: null,
  selectedTableId: null,
  selectedTableIds: [],
  selectedEdgeId: null,
  selectedAnnotationId: null,
  hoveredColumnId: null,
  error: null,
  isCliMode: (typeof window !== 'undefined' && (window as any).MODSCAPE_CLI_MODE === true),
  isAutoSaveEnabled: true,
  lastSavedAt: 0,
  savingStatus: 'idle',
  lastUpdateSource: 'visual',

  // YAML Input
  yamlInput: '',
  setYamlInput: (yaml) => set({ yamlInput: yaml, lastUpdateSource: 'user' }),
  syncToYamlInput: () => {
    const { schema } = get();
    if (schema) {
      const yamlString = yaml.dump(schema, { indent: 2, lineWidth: -1, noRefs: true });
      set({ yamlInput: yamlString, lastUpdateSource: 'visual' });
    }
  },

  // Multi-file Defaults
  availableFiles: [],
  currentModelSlug: null,

  // UI Defaults
  isSidebarOpen: true,
  isRightPanelOpen: false,
  isQuickConnectBarOpen: false,
  isCommandPaletteOpen: false,
  isPresentationMode: false,
  activeTab: 'editor',
  activeRightPanelTab: 'tables',
  focusNodeId: null,
  pathFinderResult: null,
  showER: true,
  showLineage: true,
  showAnnotations: true,
  connectionStartHandle: null,
  theme: (typeof window !== 'undefined' && (localStorage.getItem('modscape-theme') as any)) || 
         (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
  isDetailPanelSuppressed: false,
  isDetailPanelMinimized: true,

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
  setShowAnnotations: (show) => set({ showAnnotations: show }),
  setIsPresentationMode: (enabled) => set({ isPresentationMode: enabled }),
  setIsAutoSaveEnabled: (enabled) => set({ isAutoSaveEnabled: enabled }),
  setLastUpdateSource: (source) => set({ lastUpdateSource: source }),
  
  setSelectedTableId: (id) => set({ 
    selectedTableId: id, 
    selectedEdgeId: null, 
    selectedAnnotationId: null,
    isDetailPanelMinimized: id ? get().isDetailPanelMinimized : true // 選択時は現在の状態を維持、解除時は次に備えて最小化
  }),

  setSelectedTableIds: (ids) => set({
    selectedTableIds: ids,
    selectedTableId: ids.length === 1 ? ids[0] : get().selectedTableId, // If only one selected, sync with selectedTableId for compatibility
  }),
  setSelectedEdgeId: (id) => set({ 
    selectedEdgeId: id, 
    selectedTableId: null, 
    selectedAnnotationId: null,
    isDetailPanelMinimized: id ? get().isDetailPanelMinimized : true
  }),
  setSelectedAnnotationId: (id) => set({ 
    selectedAnnotationId: id, 
    selectedTableId: null, 
    selectedEdgeId: null,
    isDetailPanelMinimized: id ? get().isDetailPanelMinimized : true
  }),
  setIsDetailPanelSuppressed: (suppressed) => set({ isDetailPanelSuppressed: suppressed }),
  setIsDetailPanelMinimized: (minimized) => set({ isDetailPanelMinimized: minimized }),
  setHoveredColumnId: (id) => set({ hoveredColumnId: id }),
  setIsCliMode: (isCli) => set({ isCliMode: isCli }),
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setIsRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),
  setIsQuickConnectBarOpen: (isOpen) => set({ isQuickConnectBarOpen: isOpen }),
  setIsCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setActiveTab: (tab) => set({ activeTab: tab, isSidebarOpen: true }),
  setActiveRightPanelTab: (tab) => set({ activeRightPanelTab: tab, pathFinderResult: null }),
  setPathFinderResult: (result) => set({ pathFinderResult: result }),
  setFocusNodeId: (id) => set({ focusNodeId: id }),
  setConnectionStartHandle: (handle) => set({ connectionStartHandle: handle }),
  
  toggleTheme: () => {
    const { theme } = get();
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    set({ theme: nextTheme });
    localStorage.setItem('modscape-theme', nextTheme);
  },

  calculateAutoLayout: () => {
    const { schema } = get();
    if (!schema) return;

    const newLayout = { ...(schema.layout || {}) };
    const TABLE_WIDTH = 320;
    const TABLE_HEIGHT = 220; 
    const NODE_SPACING = 80;
    const DOMAIN_PADDING = 120;

    // Pass 1: Inner Pass (Tables inside each Domain)
    const domainLayouts: Record<string, { width: number, height: number, tableOffsets: Record<string, { x: number, y: number }> }> = {};

    schema.domains?.forEach(domain => {
      const tablesInDomain = domain.tables;
      if (tablesInDomain.length === 0) {
        domainLayouts[domain.id] = { width: 400, height: 200, tableOffsets: {} };
        return;
      }

      const g = new dagre.graphlib.Graph();
      g.setGraph({ rankdir: 'TB', nodesep: NODE_SPACING, ranksep: NODE_SPACING });
      g.setDefaultEdgeLabel(() => ({}));

      tablesInDomain.forEach(id => {
        const layout = schema.layout?.[id];
        g.setNode(id, { width: layout?.width || TABLE_WIDTH, height: layout?.height || TABLE_HEIGHT });
      });

      // Inner relationships
      (schema.relationships || []).forEach(rel => {
        if (tablesInDomain.includes(rel.from.table) && tablesInDomain.includes(rel.to.table)) {
          g.setEdge(rel.from.table, rel.to.table);
        }
      });

      // Inner lineage
      schema.tables.forEach(table => {
        if (tablesInDomain.includes(table.id) && table.lineage?.upstream) {
          table.lineage.upstream.forEach(upId => {
            if (tablesInDomain.includes(upId)) g.setEdge(upId, table.id);
          });
        }
      });

      dagre.layout(g);

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const tableOffsets: Record<string, { x: number, y: number }> = {};

      g.nodes().forEach(v => {
        const node = g.node(v);
        tableOffsets[v] = { x: node.x, y: node.y };
        minX = Math.min(minX, node.x - node.width / 2);
        minY = Math.min(minY, node.y - node.height / 2);
        maxX = Math.max(maxX, node.x + node.width / 2);
        maxY = Math.max(maxY, node.y + node.height / 2);
      });

      const width = (maxX - minX) + DOMAIN_PADDING;
      const height = (maxY - minY) + DOMAIN_PADDING;

      // Make relative to top-left
      tablesInDomain.forEach(tid => {
        tableOffsets[tid].x = Math.round(tableOffsets[tid].x - minX - (g.node(tid).width / 2) + DOMAIN_PADDING / 2);
        tableOffsets[tid].y = Math.round(tableOffsets[tid].y - minY - (g.node(tid).height / 2) + DOMAIN_PADDING / 2);
      });

      domainLayouts[domain.id] = { width, height, tableOffsets };
    });

    // Pass 2: Outer Pass (Domains and Unassigned Tables)
    const topLevelIds = [
      ...(schema.domains?.map(d => d.id) || []),
      ...schema.tables.filter(t => !schema.domains?.some(d => d.tables.includes(t.id))).map(t => t.id)
    ];

    const gGlobal = new dagre.graphlib.Graph();
    gGlobal.setGraph({ rankdir: 'LR', nodesep: 200, ranksep: 300 });
    gGlobal.setDefaultEdgeLabel(() => ({}));

    topLevelIds.forEach(id => {
      const isDomain = schema.domains?.some(d => d.id === id);
      const w = isDomain ? domainLayouts[id].width : (schema.layout?.[id]?.width || TABLE_WIDTH);
      const h = isDomain ? domainLayouts[id].height : (schema.layout?.[id]?.height || TABLE_HEIGHT);
      gGlobal.setNode(id, { width: w, height: h });
    });

    const getContainerId = (tid: string) => schema.domains?.find(d => d.tables.includes(tid))?.id || tid;

    schema.relationships?.forEach(rel => {
      const src = getContainerId(rel.from.table);
      const dst = getContainerId(rel.to.table);
      if (src !== dst) gGlobal.setEdge(src, dst);
    });

    schema.tables.forEach(table => {
      if (table.lineage?.upstream) {
        const dst = getContainerId(table.id);
        table.lineage.upstream.forEach(upId => {
          const src = getContainerId(upId);
          if (src !== dst) gGlobal.setEdge(src, dst);
        });
      }
    });

    dagre.layout(gGlobal);

    gGlobal.nodes().forEach(v => {
      const node = gGlobal.node(v);
      const absX = Math.round(node.x - node.width / 2);
      const absY = Math.round(node.y - node.height / 2);

      const domain = schema.domains?.find(d => d.id === v);
      if (domain) {
        newLayout[v] = { x: absX, y: absY, width: domainLayouts[v].width, height: domainLayouts[v].height };
        domain.tables.forEach(tid => {
          newLayout[tid] = { x: domainLayouts[v].tableOffsets[tid].x, y: domainLayouts[v].tableOffsets[tid].y };
        });
      } else {
        newLayout[v] = { x: absX, y: absY };
      }
    });

    set({ schema: { ...schema, layout: newLayout }, lastUpdateSource: 'visual' });
    get().syncToYamlInput();
    get().saveSchema(true);
  },

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
          selectedEdgeId: null,
          selectedAnnotationId: null,
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
        selectedEdgeId: null,
        selectedAnnotationId: null,
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
    if (!yamlInput || yamlInput.trim() === '') return;
    try {
      const schema = parseYAML(yamlInput)
      set({ schema, error: null })
      get().saveSchema()
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
    get().saveSchema();
  },

  updateNodesPosition: (nodes) => {
    const schema = get().schema;
    if (!schema || nodes.length === 0) return;

    const newLayout = { ...(schema.layout || {}) };
    
    nodes.forEach(node => {
      const currentLayout = newLayout[node.id] || { x: 0, y: 0 };
      newLayout[node.id] = { 
        ...currentLayout, 
        x: Math.round(node.x), 
        y: Math.round(node.y) 
      };
    });

    set({ schema: { ...schema, layout: newLayout }, lastUpdateSource: 'visual' });
    get().syncToYamlInput();
    get().saveSchema();
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
    get().saveSchema();
  },

  saveSchema: async (force = false) => {
    const { schema, currentModelSlug, isAutoSaveEnabled, isCliMode } = get();
    if (!schema || !isCliMode) return;
    if (!isAutoSaveEnabled && !force) return;

    set({ savingStatus: 'saving' });

    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
      try {
        const url = currentModelSlug ? `/api/save?model=${currentModelSlug}` : '/api/save';
        const yamlString = yaml.dump(schema, { indent: 2, lineWidth: -1, noRefs: true });
        
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ yaml: yamlString })
        });
        set({ savingStatus: 'saved', lastSavedAt: Date.now() });
        setTimeout(() => set({ savingStatus: 'idle' }), 2000);
      } catch (e) {
        console.error('Failed to save schema:', e);
        set({ savingStatus: 'error' });
      }
    }, 500);
  },

  refreshModelData: async () => {
    const { currentModelSlug, isCliMode, savingStatus, lastSavedAt } = get();
    if (!isCliMode) return;
    
    // Guard: Skip refresh if we are currently saving or just saved (within 3s)
    // to prevent self-triggered updates from causing UI flickering or state reversal.
    if (savingStatus === 'saving' || (Date.now() - lastSavedAt < 3000)) {
      console.log('🔇 Skipping refresh: update originated from recent browser save or save in progress');
      return;
    }
    
    try {
      set({ savingStatus: 'saving' });
      
      // 1. Refresh available files list
      await get().fetchAvailableFiles();
      
      // 2. Identify target slug (from state, URL, or fallback to first available)
      let targetSlug = currentModelSlug;
      if (!targetSlug) {
        const params = new URLSearchParams(window.location.search);
        targetSlug = params.get('model');
      }
      
      // If still no slug, use the first one from the freshly fetched list
      if (!targetSlug && get().availableFiles.length > 0) {
        targetSlug = get().availableFiles[0].slug;
      }
      
      // 3. Refresh current model content
      if (targetSlug) {
        const url = `/api/model?model=${targetSlug}`;
        const res = await fetch(url);
        const data = await res.json();
        const schema = normalizeSchema(data);
        set({ schema, currentModelSlug: targetSlug, error: null });
        get().syncToYamlInput();
      }
      
      set({ savingStatus: 'idle' });
    } catch (e) {
      console.error('Failed to refresh data:', e);
      set({ error: 'Failed to refresh data from server', savingStatus: 'error' });
    }
  },

  addTable: (x, y) => {
    const schema = get().schema || { tables: [], relationships: [], domains: [], layout: {} };
    const newId = `new_table_${Date.now()}`;
    const newTable: Table = {
      id: newId,
      name: 'NEW_TABLE',
      appearance: { type: 'table' },
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
    
    set({ 
      schema: normalizeSchema(newSchema), 
      error: null,
      selectedTableId: newId,
      selectedEdgeId: null,
      selectedAnnotationId: null
    });
    get().syncToYamlInput();
    get().saveSchema();
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
    
    set({ 
      schema: normalizeSchema(newSchema), 
      error: null,
      selectedTableId: newId,
      selectedEdgeId: null,
      selectedAnnotationId: null
    });
    get().syncToYamlInput();
    get().saveSchema();
  },

  addRelationship: (source, target, sourceHandle, targetHandle) => {
    const schema = get().schema;
    if (!schema) return;

    // 1. Handle Lineage
    const isLineage = sourceHandle?.includes('lineage') || targetHandle?.includes('lineage');
    
    if (isLineage) {
      get().addLineage(source, target);
      return;
    }

    // 2. Handle ER (Bidirectional Support)
    let finalSource = source;
    let finalTarget = target;
    let finalSourceHandle = sourceHandle;
    let finalTargetHandle = targetHandle;

    const isSourceTargetRole = sourceHandle?.includes('target');
    const isTargetSourceRole = targetHandle?.includes('source');

    if (isSourceTargetRole || isTargetSourceRole) {
      finalSource = target;
      finalTarget = source;
      finalSourceHandle = targetHandle;
      finalTargetHandle = sourceHandle;
    }

    const parseColumn = (nodeId: string, handleId: string | null | undefined) => {
      if (!handleId) return undefined;
      const baseId = handleId.replace(`${nodeId}-`, '');
      if (baseId.startsWith('er-') || baseId.startsWith('lin-')) return undefined;
      return baseId.split('-')[0] || undefined;
    };

    const sourceCol = parseColumn(finalSource, finalSourceHandle);
    const targetCol = parseColumn(finalTarget, finalTargetHandle);

    const isDuplicate = (schema.relationships || []).some(rel => 
      rel.from.table === finalSource && 
      rel.from.column === sourceCol && 
      rel.to.table === finalTarget && 
      rel.to.column === targetCol
    );

    if (isDuplicate) return;

    const newRelationship: Relationship = {
      from: { table: finalSource, column: sourceCol },
      to: { table: finalTarget, column: targetCol },
      type: 'one-to-many'
    };

    const newSchema = {
      ...schema,
      relationships: [...(schema.relationships || []), newRelationship]
    };

    set({ schema: normalizeSchema(newSchema) });
    get().syncToYamlInput();
    get().saveSchema();
  },

  bulkAddRelationship: (source, targetPattern, type) => {
    const { schema } = get();
    if (!schema) return;

    if (type === 'lineage') {
      const parts = targetPattern.split('.');
      const targetTablePattern = parts[0];
      
      if (targetTablePattern === '*') {
        // Bulk Lineage: NOT supporting wildcard for lineage yet as it's less common, 
        // but could be implemented if needed.
        return;
      }
      
      get().addLineage(source.table, targetTablePattern);
      return;
    }

    let newRelationships = [...(schema.relationships || [])];
    const parts = targetPattern.split('.');
    const targetTablePattern = parts[0];
    const targetCol = parts[1]; // might be undefined

    if (targetTablePattern === '*') {
      // Wildcard Mode: Search across all tables for a specific column
      if (!targetCol) return; // Wildcard requires a column

      schema.tables.forEach(table => {
        if (table.id === source.table) return;

        const hasColumn = table.columns?.some(c => c.id === targetCol);
        if (hasColumn) {
          const isDuplicate = newRelationships.some(rel => 
            rel.from.table === source.table && 
            rel.from.column === source.column && 
            rel.to.table === table.id && 
            rel.to.column === targetCol
          );

          if (!isDuplicate) {
            newRelationships.push({
              from: { table: source.table, column: source.column },
              to: { table: table.id, column: targetCol },
              type
            });
          }
        }
      });
    } else {
      // Direct Mode: table.col or just table
      const isDuplicate = newRelationships.some(rel => 
        rel.from.table === source.table && 
        rel.from.column === source.column && 
        rel.to.table === targetTablePattern && 
        rel.to.column === targetCol
      );

      if (!isDuplicate) {
        newRelationships.push({
          from: { table: source.table, column: source.column },
          to: { table: targetTablePattern, column: targetCol },
          type
        });
      }
    }

    set({ schema: normalizeSchema({ ...schema, relationships: newRelationships }) });
    get().syncToYamlInput();
    get().saveSchema();
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
    get().saveSchema();
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
    get().saveSchema();
  },

  removeEdge: (source, target) => {
    const { schema } = get();
    if (!schema) return;

    const newRelationships = (schema.relationships || []).filter(
      r => {
        const isMatch = (r.from.table === source && r.to.table === target) ||
                        (r.from.table === target && r.to.table === source);
        return !isMatch;
      }
    );

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
    get().saveSchema();
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
    const newAnnotations = (schema.annotations || []).filter(a => a.id !== id && a.targetId !== id);
    
    const newLayout = { ...(schema.layout || {}) };
    delete newLayout[id];

    const newSchema = {
      ...schema,
      tables: newTables,
      domains: newDomains,
      relationships: newRelationships,
      annotations: newAnnotations,
      layout: newLayout
    };

    set({ schema: normalizeSchema(newSchema), selectedTableId: null, selectedAnnotationId: null });
    get().syncToYamlInput();
    get().saveSchema();
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
    get().saveSchema();
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
    get().saveSchema();
  },

  toggleDomainLock: (id) => {
    const { schema } = get();
    if (!schema || !schema.domains) return;

    const newDomains = schema.domains.map(domain => {
      if (domain.id === id) {
        return { ...domain, isLocked: !domain.isLocked };
      }
      return domain;
    });

    set({ schema: { ...schema, domains: newDomains } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  assignTableToDomain: (tableId, domainId) => {
    const { schema } = get();
    if (!schema) return;

    const newDomains = (schema.domains || []).map(domain => {
      const filteredTables = domain.tables.filter(id => id !== tableId);
      if (domain.id === domainId) {
        return { ...domain, tables: Array.from(new Set([...filteredTables, tableId])) };
      }
      return { ...domain, tables: filteredTables };
    });

    const newLayout = {
      ...(schema.layout || {}),
      [tableId]: { x: 20, y: 20 }
    };

    set({ schema: { ...schema, domains: newDomains, layout: newLayout } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  bulkAssignTablesToDomain: (tableIds, domainId) => {
    const { schema } = get();
    if (!schema) return;

    const newDomains = (schema.domains || []).map(domain => {
      const filteredTables = domain.tables.filter(id => !tableIds.includes(id));
      if (domain.id === domainId) {
        return { ...domain, tables: Array.from(new Set([...filteredTables, ...tableIds])) };
      }
      return { ...domain, tables: filteredTables };
    });

    const newLayout = { ...(schema.layout || {}) };
    if (domainId) {
      tableIds.forEach(id => {
        newLayout[id] = { x: 20, y: 20 };
      });
    }

    set({ schema: { ...schema, domains: newDomains, layout: newLayout } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  toggleTableSelection: (id) => {
    const { selectedTableId, isDetailPanelMinimized } = get();
    if (selectedTableId === id) {
      set({ selectedTableId: null, isDetailPanelMinimized: true });
    } else {
      set({ 
        selectedTableId: id, 
        selectedEdgeId: null, 
        selectedAnnotationId: null,
        isDetailPanelMinimized: isDetailPanelMinimized // 現在の状態（バーならバー）を維持
      });
    }
  },

  toggleEdgeSelection: (id) => {
    const { selectedEdgeId, isDetailPanelMinimized } = get();
    if (selectedEdgeId === id) {
      set({ selectedEdgeId: null, isDetailPanelMinimized: true });
    } else {
      set({ 
        selectedEdgeId: id, 
        selectedTableId: null, 
        selectedAnnotationId: null,
        isDetailPanelMinimized: isDetailPanelMinimized
      });
    }
  },

  toggleAnnotationSelection: (id) => {
    const { selectedAnnotationId, isDetailPanelMinimized } = get();
    if (selectedAnnotationId === id) {
      set({ selectedAnnotationId: null, isDetailPanelMinimized: true });
    } else {
      set({ 
        selectedAnnotationId: id, 
        selectedTableId: null, 
        selectedEdgeId: null,
        isDetailPanelMinimized: isDetailPanelMinimized
      });
    }
  },

  addAnnotation: (offset, targetId, targetType) => {
    const { schema } = get();
    if (!schema) return;
    const newId = `note_${Date.now()}`;
    const newAnnotation: Annotation = {
      id: newId,
      targetId,
      targetType,
      text: 'New Note',
      type: 'sticky',
      offset
    };
    const newSchema = {
      ...schema,
      annotations: [...(schema.annotations || []), newAnnotation]
    };
    set({ 
      schema: normalizeSchema(newSchema), 
      selectedAnnotationId: newId,
      selectedTableId: null,
      selectedEdgeId: null
    });
    if (!targetId) {
      get().setFocusNodeId(newId);
    }
    get().syncToYamlInput();
    get().saveSchema();
  },

  updateAnnotation: (id, updates) => {
    const { schema } = get();
    if (!schema || !schema.annotations) return;
    const newAnnotations = schema.annotations.map(a => a.id === id ? { ...a, ...updates } : a);
    set({ schema: { ...schema, annotations: newAnnotations } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  removeAnnotation: (id) => {
    const { schema } = get();
    if (!schema || !schema.annotations) return;
    const newAnnotations = schema.annotations.filter(a => a.id !== id);
    set({ schema: { ...schema, annotations: newAnnotations }, selectedAnnotationId: null });
    get().syncToYamlInput();
    get().saveSchema();
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
  },

  getSelectedAnnotation: () => {
    const { schema, selectedAnnotationId } = get();
    if (!schema || !selectedAnnotationId || !schema.annotations) return null;
    return schema.annotations.find(a => a.id === selectedAnnotationId) || null;
  }
  }));
