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
  highlightedNodeIds: string[];
  hoveredColumnId: string | null;
  error: string | null;
  isModelLoading: boolean;
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
  setHighlightedNodeIds: (ids: string[]) => void;
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
  addTable: (x: number, y: number, name?: string) => void;
  addDomain: (x: number, y: number, name?: string) => void;
  addRelationship: (source: string, target: string, sourceHandle?: string | null, targetHandle?: string | null) => void;
  bulkAddRelationship: (source: { table: string, column?: string }, targetPattern: string, type: Relationship['type'] | 'lineage') => void;
  addLineage: (source: string, target: string) => void;
  updateRelationship: (index: number, updates: Partial<Relationship>) => void;
  removeEdge: (sourceId: string, targetId: string) => void;
  removeNode: (id: string) => void;
  bulkRemoveTables: (ids: string[]) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  updateDomain: (id: string, updates: Partial<Domain>) => void;
  toggleDomainLock: (id: string) => void;
  assignTableToDomain: (tableId: string, domainId?: string | null) => void;
  bulkAssignTablesToDomain: (tableIds: string[], domainId: string | null) => void;
  distributeSelectedTables: (direction: 'horizontal' | 'vertical') => void;
  executePipeline: (input: string, previewOnly?: boolean) => { stages: any[], outputIds: string[] };
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
  getSelectedRelationship: () => { relationship: Relationship; index: number; kind: 'er' | 'lineage' } | null;
  getSelectedAnnotation: () => Annotation | null;
}

let saveTimeout: any = null;

export const useStore = create<AppState>((set, get) => ({
  schema: null,
  selectedTableId: null,
  selectedTableIds: [],
  selectedEdgeId: null,
  selectedAnnotationId: null,
  highlightedNodeIds: [],
  hoveredColumnId: null,
  isModelLoading: false,
  error: null,
  isCliMode: (typeof window !== 'undefined' && (window as any).MODSCAPE_CLI_MODE === true),
  isAutoSaveEnabled: true,
  lastSavedAt: 0,
  savingStatus: 'idle',
  lastUpdateSource: 'visual',

  // YAML Input
  yamlInput: '',
  setYamlInput: (yaml) => {
    set({ yamlInput: yaml, lastUpdateSource: 'user', lastSavedAt: Date.now() });
    get().saveSchema();
  },
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
  theme: 'dark',
  isDetailPanelSuppressed: false,
  isDetailPanelMinimized: true,

  setSchema: (schema) => {
    const normalized = normalizeSchema(schema);
    set({ schema: normalized });
    get().syncToYamlInput();
  },

  parseAndSetSchema: (yamlStr) => {
    try {
      const schema = parseYAML(yamlStr);
      set({ schema, error: null });
      get().saveSchema(); // 3sガードを効かせるために呼ぶ（内部でlastUpdateSourceをチェック）
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  setSelectedTableId: (id) => set({ 
    selectedTableId: id, 
    selectedEdgeId: null, 
    selectedAnnotationId: null,
    isDetailPanelMinimized: id ? get().isDetailPanelMinimized : true
  }),

  setSelectedTableIds: (ids) => set({
    selectedTableIds: ids,
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

  setHighlightedNodeIds: (ids) => set({ highlightedNodeIds: ids }),

  setIsDetailPanelSuppressed: (suppressed) => set({ isDetailPanelSuppressed: suppressed }),
  setIsDetailPanelMinimized: (minimized) => set({ isDetailPanelMinimized: minimized }),
  setHoveredColumnId: (id) => set({ hoveredColumnId: id }),
  setIsCliMode: (isCli) => set({ isCliMode: isCli }),
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setIsRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),
  setIsQuickConnectBarOpen: (isOpen) => set({ isQuickConnectBarOpen: isOpen }),
  setIsCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setActiveTab: (tab) => set({ activeTab: tab, isSidebarOpen: true }),
  setActiveRightPanelTab: (tab) => set({ activeRightPanelTab: tab, isRightPanelOpen: true }),
  setIsPresentationMode: (enabled) => set({ isPresentationMode: enabled }),
  setIsAutoSaveEnabled: (enabled) => set({ isAutoSaveEnabled: enabled }),
  setLastUpdateSource: (source) => set({ lastUpdateSource: source }),
  setPathFinderResult: (result) => set({ pathFinderResult: result }),
  setFocusNodeId: (id) => set({ focusNodeId: id }),
  setConnectionStartHandle: (handle) => set({ connectionStartHandle: handle }),
  
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  setShowER: (show) => set({ showER: show }),
  setShowLineage: (show) => set({ showLineage: show }),
  setShowAnnotations: (show) => set({ showAnnotations: show }),

  updateNodePosition: (id, x, y, parentId) => {
    const { schema } = get();
    if (!schema) return;
    const existing = schema.layout?.[id] || {};
    const newLayout = {
      ...(schema.layout || {}),
      // width/height を保持しながら x/y だけ更新する
      [id]: { ...existing, x, y, ...(parentId ? { parentId } : {}) }
    };
    set({ schema: { ...schema, layout: newLayout } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  updateNodesPosition: (updates) => {
    const { schema } = get();
    if (!schema) return;
    const newLayout = { ...(schema.layout || {}) };
    updates.forEach(({ id, x, y, parentId }) => {
      const existing = newLayout[id] || {};
      // width/height を保持しながら x/y だけ更新する
      newLayout[id] = { ...existing, x, y, ...(parentId ? { parentId } : {}) };
    });
    set({ schema: { ...schema, layout: newLayout } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  updateNodeDimensions: (id, width, height) => {
    const { schema } = get();
    if (!schema) return;
    // x/y のデフォルトを持ちつつ既存エントリをマージして parentId 等を保持する
    const currentLayout = { x: 0, y: 0, ...schema.layout?.[id] };
    const newLayout = { 
      ...(schema.layout || {}), 
      [id]: { ...currentLayout, width, height } 
    };
    set({ schema: { ...schema, layout: newLayout } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  saveSchema: async (force = false) => {
    const { schema, isCliMode, isAutoSaveEnabled, lastUpdateSource, currentModelSlug } = get();

    // refreshModelData の3秒ガードを確実に効かせるため、
    // saveSchema 呼び出し時点で即座に lastSavedAt を更新する。
    set({ lastSavedAt: Date.now() });

    // ユーザー操作（エディタ入力等）の場合はファイル書き込みは不要
    if (lastUpdateSource === 'user') return;

    if (!isCliMode || (!isAutoSaveEnabled && !force)) return;

    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
      // 実際の送信直前に再度、現在のモデルを確認する（切り替え直後の割り込み防止）
      const activeModel = get().currentModelSlug;
      if (currentModelSlug !== activeModel) return;

      try {
        const yamlStr = yaml.dump(schema, { indent: 2, lineWidth: -1, noRefs: true });
        const query = activeModel ? `?model=${activeModel}` : '';
        await fetch(`/api/save${query}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ yaml: yamlStr })
        });
        set({ lastSavedAt: Date.now(), savingStatus: 'saved' });
        setTimeout(() => set({ savingStatus: 'idle' }), 2000);
      } catch (e) {
        set({ savingStatus: 'error' });
      }
    }, 1000);
    set({ savingStatus: 'saving' });
  },

  refreshModelData: async () => {
    const { lastSavedAt } = get();
    const diff = Date.now() - lastSavedAt;
    
    // 自身が変更・保存してから3秒以内は、サーバーからの通知によるリフレッシュを無視する
    if (diff < 3000) return;

    try {
      const res = await fetch('/api/model' + window.location.search);
      const data = await res.json();
      set({ schema: normalizeSchema(data), selectedTableId: null, selectedEdgeId: null, selectedAnnotationId: null });
      get().syncToYamlInput();
    } catch (e) {
      console.error('Failed to refresh data:', e);
    }
  },

  addTable: (x, y, name) => {
    const schema = get().schema || { tables: [], relationships: [], domains: [], layout: {} };
    const newId = name ? name.toLowerCase().replace(/\s+/g, '_') : `new_table_${Date.now()}`;
    const newTable: Table = {
      id: newId,
      name: name || 'NEW_TABLE',
      appearance: { type: 'table' },
      columns: [{ id: 'id', logical: { name: 'ID', type: 'Integer', isPrimaryKey: true } }]
    };
    const newSchema = {
      ...schema,
      tables: [...(schema.tables || []), newTable],
      layout: { ...(schema.layout || {}), [newId]: { x: Math.round(x), y: Math.round(y) } }
    };
    set({ schema: normalizeSchema(newSchema), selectedTableId: newId });
    get().syncToYamlInput();
    get().saveSchema();
  },

  addDomain: (x, y, name) => {
    const schema = get().schema || { tables: [], relationships: [], domains: [], layout: {} };
    const newId = name ? name.toLowerCase().replace(/\s+/g, '_') : `new_domain_${Date.now()}`;
    const newDomain = {
      id: newId,
      name: name || 'NEW_DOMAIN',
      description: 'Domain purpose',
      tables: [],
      color: 'rgba(59, 130, 246, 0.05)'
    };
    const newSchema = {
      ...schema,
      domains: [...(schema.domains || []), newDomain],
      layout: { ...(schema.layout || {}), [newId]: { x: Math.round(x), y: Math.round(y), width: 600, height: 400 } }
    };
    set({ schema: normalizeSchema(newSchema), selectedTableId: newId });
    get().syncToYamlInput();
    get().saveSchema();
  },

  addRelationship: (source, target, sourceHandle, targetHandle) => {
    const { schema } = get();
    if (!schema) return;
    const newRel: Relationship = {
      from: { table: source, column: sourceHandle?.split('-')[1] },
      to: { table: target, column: targetHandle?.split('-')[1] },
      type: 'one-to-many'
    };
    const newSchema = { ...schema, relationships: [...(schema.relationships || []), newRel] };
    set({ schema: normalizeSchema(newSchema) });
    get().syncToYamlInput();
    get().saveSchema();
  },

  bulkAddRelationship: (source, targetPattern, type) => {
    const { schema } = get();
    if (!schema) return;
    const regex = new RegExp('^' + targetPattern.replace(/\*/g, '.*') + '$', 'i');
    const matchedTables = schema.tables.filter(t => regex.test(t.id) || (t.columns || []).some(c => regex.test(`${t.id}.${c.id}`)));
    
    const newRels = matchedTables.map(t => {
        let targetCol = undefined;
        if (targetPattern.includes('.')) targetCol = targetPattern.split('.')[1];
        return { from: source, to: { table: t.id, column: targetCol }, type };
    });

    set({ schema: { ...schema, relationships: [...(schema.relationships || []), ...newRels] } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  addLineage: (source, target) => {
    const { schema } = get();
    if (!schema) return;
    const newRel: Relationship = { from: { table: source }, to: { table: target }, type: 'lineage' as any };
    set({ schema: { ...schema, relationships: [...(schema.relationships || []), newRel] } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  updateRelationship: (index, updates) => {
    const { schema } = get();
    if (!schema) return;
    const newRels = [...schema.relationships];
    newRels[index] = { ...newRels[index], ...updates };
    set({ schema: { ...schema, relationships: newRels } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  removeEdge: (sourceId, targetId) => {
    const { schema } = get();
    if (!schema) return;
    const newRels = schema.relationships.filter(r => !(r.from.table === sourceId && r.to.table === targetId));
    set({ schema: { ...schema, relationships: newRels }, selectedEdgeId: null });
    get().syncToYamlInput();
    get().saveSchema();
  },

  removeNode: (id) => {
    const { schema } = get();
    if (!schema) return;
    const isDomain = (schema.domains || []).some(d => d.id === id);
    const newTables = schema.tables.filter(t => t.id !== id);
    const newDomains = (schema.domains || []).filter(d => d.id !== id).map(d => ({ ...d, tables: d.tables.filter(tid => tid !== id) }));
    const newRelationships = schema.relationships.filter(r => r.from.table !== id && r.to.table !== id);
    const newLayout = { ...(schema.layout || {}) };
    delete newLayout[id];

    // CRITICAL: If a domain was deleted, clear parentId for all tables that were inside it
    if (isDomain) {
      Object.keys(newLayout).forEach(key => {
        if (newLayout[key].parentId === id) {
          delete newLayout[key].parentId;
        }
      });
    }

    set({ schema: { ...schema, tables: newTables, domains: newDomains, relationships: newRelationships, layout: newLayout }, selectedTableId: null });
    get().syncToYamlInput();
    get().saveSchema();
  },

  bulkRemoveTables: (ids) => {
    const { schema } = get();
    if (!schema) return;
    const newTables = schema.tables.filter(t => !ids.includes(t.id));
    const newLayout = { ...(schema.layout || {}) };
    ids.forEach(id => delete newLayout[id]);
    const newRelationships = (schema.relationships || []).filter(r => !ids.includes(r.from.table) && !ids.includes(r.to.table));
    const newDomains = (schema.domains || []).map(d => ({ ...d, tables: d.tables.filter(tid => !ids.includes(tid)) }));
    set({ schema: { ...schema, tables: newTables, relationships: newRelationships, domains: newDomains, layout: newLayout }, selectedTableIds: [] });
    get().syncToYamlInput();
    get().saveSchema();
  },

  updateTable: (id, updates) => {
    const { schema } = get();
    if (!schema) return;
    const newTables = schema.tables.map(t => t.id === id ? { ...t, ...updates } : t);
    set({ schema: { ...schema, tables: newTables } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  updateDomain: (id, updates) => {
    const { schema } = get();
    if (!schema) return;
    const newDomains = (schema.domains || []).map(d => d.id === id ? { ...d, ...updates } : d);
    set({ schema: { ...schema, domains: newDomains } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  toggleDomainLock: (id) => {
    const { schema } = get();
    if (!schema || !schema.layout) return;
    const current = schema.layout[id] || { x: 0, y: 0 };
    const newLayout = { 
      ...schema.layout, 
      [id]: { ...current, isLocked: !current.isLocked } 
    };
    set({ schema: { ...schema, layout: newLayout } });
    get().saveSchema();
  },

  assignTableToDomain: (tableId, domainId) => {
    const { schema } = get();
    if (!schema) return;
    const newDomains = (schema.domains || []).map(domain => {
      const filteredTables = domain.tables.filter(id => id !== tableId);
      if (domain.id === domainId) return { ...domain, tables: Array.from(new Set([...filteredTables, tableId])) };
      return { ...domain, tables: filteredTables };
    });
    const newLayout = {
      ...(schema.layout || {}),
      // 既存の width/height を保持しつつ parentId を設定する
      [tableId]: { x: 20, y: 20, ...schema.layout?.[tableId], ...(domainId ? { parentId: domainId } : {}) }
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
      if (domain.id === domainId) return { ...domain, tables: Array.from(new Set([...filteredTables, ...tableIds])) };
      return { ...domain, tables: filteredTables };
    });
    const newLayout = { ...(schema.layout || {}) };
    // 既存の width/height/x/y を保持しつつ parentId を設定する（未設定なら x/y はデフォルト値）
    if (domainId) tableIds.forEach(id => {
      const existing = newLayout[id] || {};
      newLayout[id] = { ...existing, x: existing.x ?? 20, y: existing.y ?? 20, parentId: domainId };
    });
    set({ schema: { ...schema, domains: newDomains, layout: newLayout } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  distributeSelectedTables: (direction) => {
    const { schema, selectedTableIds } = get();
    if (!schema || selectedTableIds.length < 2) return;
    const tablePositions = selectedTableIds.map(id => ({ id, pos: schema.layout?.[id] || { x: 0, y: 0 } }));
    if (direction === 'vertical') tablePositions.sort((a, b) => a.pos.y - b.pos.y);
    else tablePositions.sort((a, b) => a.pos.x - b.pos.x);
    const newLayout = { ...(schema.layout || {}) };
    const basePos = tablePositions[0].pos;
    tablePositions.forEach((item, index) => {
      newLayout[item.id] = {
        x: direction === 'vertical' ? basePos.x : basePos.x + (index * 280),
        y: direction === 'vertical' ? basePos.y + (index * 320) : basePos.y
      };
    });
    set({ schema: { ...schema, layout: newLayout } });
    get().syncToYamlInput();
    get().saveSchema();
  },

  executePipeline: (input, previewOnly = false) => {
    const { schema, selectedTableIds } = get();
    if (!schema) return { stages: [], outputIds: [] };
    const rawStages = input.split('|').map(s => s.trim()).filter(Boolean);
    const stages: any[] = [];
    let currentIds: string[] = [];
    let tempSchema = JSON.parse(JSON.stringify(schema));

    rawStages.forEach((raw) => {
      const parts = raw.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);
      let outputIds: string[] = [...currentIds];
      let message = '';
      let status: 'success' | 'error' | 'active' = 'success';

      try {
        if (cmd === 'select') {
          const pattern = args.join(' ');
          if (pattern === '*') {
            outputIds = [
                ...tempSchema.tables.map((t: any) => t.id),
                ...(tempSchema.domains || []).map((d: any) => d.id)
            ];
          } else if (pattern) {
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$', 'i');
            const matchedTables = tempSchema.tables
                .filter((t: any) => t.id === pattern || regex.test(t.id) || regex.test(t.name))
                .map((t: any) => t.id);
            const matchedDomains = (tempSchema.domains || [])
                .filter((d: any) => d.id === pattern || regex.test(d.id) || regex.test(d.name))
                .map((d: any) => d.id);
            outputIds = [...matchedTables, ...matchedDomains];
          } else outputIds = [];
          
          if (outputIds.length > 0) { 
            message = `Matched ${outputIds.length} objects`; 
            status = 'success'; 
          } else { 
            status = 'error'; 
            message = `No objects matched "${pattern}"`; 
          }
        } else if (cmd === 'selected') {
          outputIds = [...selectedTableIds];
          message = `Using ${outputIds.length} selected tables`;
          status = 'success';
        } else if (cmd === 'mv') {
          const toIndex = parts.findIndex(p => p.toLowerCase() === 'to');
          const domainId = toIndex > -1 ? parts.slice(toIndex + 1).join(' ') : args.join(' ');
          if (!currentIds || currentIds.length === 0) { status = 'error'; message = 'No tables to move. Add a "select" stage.'; }
          else if (domainId) {
            const domainExists = (tempSchema.domains || []).some((d: any) => d.id === domainId);
            if (!domainExists) { status = 'error'; message = `Domain "${domainId}" not found`; }
            else {
              tempSchema.domains = (tempSchema.domains || []).map((d: any) => {
                const filtered = d.tables.filter((tid: string) => !currentIds.includes(tid));
                if (d.id === domainId) return { ...d, tables: Array.from(new Set([...filtered, ...currentIds])) };
                return { ...d, tables: filtered };
              });
              currentIds.forEach(id => { if (tempSchema.layout) tempSchema.layout[id] = { x: 20, y: 20 }; });
              message = `Move ${currentIds.length} to ${domainId}`;
              status = 'success';
            }
          } else { status = 'active'; message = 'Waiting for domain...'; }
        } else if (cmd === 'stack' || cmd === 'v' || cmd === 'h') {
          const dir = (cmd === 'v' || args.includes('v') || args.includes('vertical')) ? 'vertical' : 'horizontal';
          const tablePositions = currentIds.map(id => ({ id, pos: tempSchema.layout?.[id] || { x: 0, y: 0 } }));
          if (dir === 'vertical') tablePositions.sort((a, b) => a.pos.y - b.pos.y);
          else tablePositions.sort((a, b) => a.pos.x - b.pos.x);
          const basePos = tablePositions.length > 0 ? tablePositions[0].pos : { x: 0, y: 0 };
          tablePositions.forEach((item, i) => {
            if (tempSchema.layout) tempSchema.layout[item.id] = {
              x: dir === 'vertical' ? basePos.x : basePos.x + (i * 280),
              y: dir === 'vertical' ? basePos.y + (i * 320) : basePos.y
            };
          });
          message = `Stacked ${currentIds.length} ${dir}`;
          status = 'success';
        } else if (cmd === 'delete') {
          const tableIdsToDelete = currentIds.filter(id => tempSchema.tables.some((t: any) => t.id === id));
          const domainIdsToDelete = currentIds.filter(id => (tempSchema.domains || []).some((d: any) => d.id === id));
          
          tempSchema.tables = tempSchema.tables.filter((t: any) => !tableIdsToDelete.includes(t.id));
          tempSchema.domains = (tempSchema.domains || []).filter((d: any) => !domainIdsToDelete.includes(d.id));
          
          // CRITICAL: Cleanup parentId references if domains were deleted
          if (domainIdsToDelete.length > 0 && tempSchema.layout) {
            const layout = { ...tempSchema.layout };
            Object.keys(layout).forEach(key => {
              if (domainIdsToDelete.includes(layout[key].parentId)) {
                const { parentId, ...rest } = layout[key];
                layout[key] = rest;
              }
              if (domainIdsToDelete.includes(key)) {
                delete layout[key];
              }
            });
            tempSchema.layout = layout;
          }

          outputIds = [];
          message = `Deleted ${tableIdsToDelete.length} tables and ${domainIdsToDelete.length} domains`;
          status = 'success';
        } else if (cmd === 'clear') {
          tempSchema.domains = (tempSchema.domains || []).map((d: any) => ({ ...d, tables: d.tables.filter((tid: string) => !currentIds.includes(tid)) }));
          message = `Cleared domain for ${currentIds.length} tables`;
          status = 'success';
        } else if (cmd === 'add') {
          const subCmd = args[0]?.toLowerCase();
          const name = args.slice(1).join(' ');
          
          const generateUniqueId = (baseName: string) => {
            const baseId = baseName.toLowerCase().replace(/\s+/g, '_');
            let uniqueId = baseId || `new_${subCmd}_${Date.now()}`;
            let counter = 1;
            const exists = (id: string) => 
                tempSchema.tables.some((t: any) => t.id === id) || 
                (tempSchema.domains || []).some((d: any) => d.id === id);
            
            while (exists(uniqueId)) {
                uniqueId = `${baseId}_${counter}`;
                counter++;
            }
            return uniqueId;
          };

          if (subCmd === 'table') {
            const newId = generateUniqueId(name);
            tempSchema.tables.push({
              id: newId,
              name: name || 'NEW_TABLE',
              columns: [{ id: 'id', logical: { name: 'ID', type: 'Integer', isPrimaryKey: true } }]
            });
            if (!tempSchema.layout) tempSchema.layout = {};
            tempSchema.layout[newId] = { x: 400, y: 300 };
            message = `Added table ${newId}`;
            status = 'success';
          } else if (subCmd === 'domain') {
            const newId = generateUniqueId(name);
            tempSchema.domains.push({
              id: newId,
              name: name || 'NEW_DOMAIN',
              tables: [],
              color: 'rgba(59, 130, 246, 0.05)'
            });
            if (!tempSchema.layout) tempSchema.layout = {};
            tempSchema.layout[newId] = { x: 400, y: 300, width: 600, height: 400 };
            message = `Added domain ${newId}`;
            status = 'success';
          }
        } else { status = 'error'; message = `Unknown command: ${cmd}`; }
      } catch (e) { status = 'error'; message = 'Execution error'; }
      stages.push({ command: cmd, args, inputIds: currentIds, outputIds, status, message });
      currentIds = outputIds;
    });

    if (!previewOnly && stages.length > 0 && stages.every(s => s.status === 'success')) {
      set({ schema: normalizeSchema(tempSchema) });
      get().syncToYamlInput();
      get().saveSchema();
    }
    return { stages, outputIds: currentIds };
  },

  toggleTableSelection: (id) => {
    const { selectedTableId } = get();
    if (selectedTableId === id) set({ selectedTableId: null, isDetailPanelMinimized: true });
    else set({ selectedTableId: id, selectedEdgeId: null, selectedAnnotationId: null });
  },

  toggleEdgeSelection: (id) => {
    const { selectedEdgeId } = get();
    if (selectedEdgeId === id) set({ selectedEdgeId: null });
    else set({ selectedEdgeId: id, selectedTableId: null, selectedAnnotationId: null });
  },

  toggleAnnotationSelection: (id) => {
    const { selectedAnnotationId } = get();
    if (selectedAnnotationId === id) set({ selectedAnnotationId: null });
    else set({ selectedAnnotationId: id, selectedTableId: null, selectedEdgeId: null });
  },

  addAnnotation: (offset, targetId, targetType) => {
    const { schema } = get();
    if (!schema) return;
    const newId = `note_${Date.now()}`;
    const newAnnotation: Annotation = { id: newId, targetId, targetType, text: 'New Note', type: 'sticky', offset };
    const newSchema = { ...schema, annotations: [...(schema.annotations || []), newAnnotation] };
    set({ schema: normalizeSchema(newSchema), selectedAnnotationId: newId, selectedTableId: null, selectedEdgeId: null });
    if (!targetId) get().setFocusNodeId(newId);
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

  fetchAvailableFiles: async () => {
    const injectedData = (window as any).__MODSCAPE_DATA__;
    if (injectedData?.models) {
      const files = injectedData.models.map((m: any) => ({ slug: m.slug, name: m.name, path: '' }));
      set({ availableFiles: files });
      return;
    }
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      set({ availableFiles: data });
    } catch (e) { console.error('Failed to fetch files:', e); }
  },

  setCurrentModel: async (slug) => {
    // 旧モデルへの pending save をキャンセル（切り替え後に旧データで上書きされるのを防ぐ）
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      saveTimeout = null;
    }
    set({ isModelLoading: true });
    try {
      const injectedData = (window as any).__MODSCAPE_DATA__;
      let data;
      if (injectedData?.models) {
        const model = injectedData.models.find((m: any) => m.slug === slug);
        data = model?.schema;
      } else {
        const res = await fetch(`/api/model?model=${slug}`);
        data = await res.json();
      }
      set({ schema: normalizeSchema(data), currentModelSlug: slug, selectedTableId: null, selectedEdgeId: null, selectedAnnotationId: null, error: null, isModelLoading: false });
      get().syncToYamlInput();
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('model', slug);
      window.history.replaceState(null, '', `${window.location.pathname}?${searchParams.toString()}`);
    } catch (e) { console.error('Failed to set model:', e); set({ isModelLoading: false }); }
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
      // lin-{srcId}-{tgtId}-{i}  (srcId and tgtId may contain hyphens so use first/last)
      return { relationship: { from: { table: parts[1] }, to: { table: parts[2] }, type: 'lineage' as any }, index: -1, kind: 'lineage' as const };
    }
    if (!selectedEdgeId.startsWith('er-')) return null;
    const index = parseInt(selectedEdgeId.split('-')[1]);
    const relationship = schema.relationships?.[index];
    if (!relationship) return null;
    return { relationship, index, kind: 'er' as const };
  },

  getSelectedAnnotation: () => {
    const { schema, selectedAnnotationId } = get();
    if (!schema || !selectedAnnotationId || !schema.annotations) return null;
    return schema.annotations.find(a => a.id === selectedAnnotationId) || null;
  },

  calculateAutoLayout: () => {
    const { schema } = get();
    if (!schema) return;

    const NODE_W = 280, NODE_H = 160;
    const NODE_SEP = 60, RANK_SEP = 120;
    const DOMAIN_PAD = 60, DOMAIN_GAP = 120;

    // Collect all edges (relationships + lineage)
    const allEdges: { from: string; to: string }[] = [];
    (schema.relationships || []).forEach(r => allEdges.push({ from: r.from.table, to: r.to.table }));
    schema.tables.forEach(t => {
      (t.lineage?.upstream || []).forEach(upId => allEdges.push({ from: upId, to: t.id }));
    });

    // Run dagre on a subset of tables, return center positions
    function layoutGroup(tableIds: string[]): Record<string, { x: number; y: number }> {
      const g = new dagre.graphlib.Graph();
      g.setGraph({ rankdir: 'LR', nodesep: NODE_SEP, ranksep: RANK_SEP });
      g.setDefaultEdgeLabel(() => ({}));
      tableIds.forEach(id => g.setNode(id, { width: NODE_W, height: NODE_H }));
      allEdges.forEach(e => {
        if (tableIds.includes(e.from) && tableIds.includes(e.to)) g.setEdge(e.from, e.to);
      });
      dagre.layout(g);
      const result: Record<string, { x: number; y: number }> = {};
      tableIds.forEach(id => { const n = g.node(id); result[id] = { x: n.x, y: n.y }; });
      return result;
    }

    // Bounding box (top-left origin) from center positions
    function bbox(pos: Record<string, { x: number; y: number }>) {
      const xs = Object.values(pos).map(p => p.x);
      const ys = Object.values(pos).map(p => p.y);
      return {
        x1: Math.min(...xs) - NODE_W / 2,
        y1: Math.min(...ys) - NODE_H / 2,
        w: Math.max(...xs) - Math.min(...xs) + NODE_W,
        h: Math.max(...ys) - Math.min(...ys) + NODE_H,
      };
    }

    const newLayout: Record<string, any> = {};
    let cursorX = 0;

    // Layout each domain group independently, place side by side
    for (const domain of (schema.domains || [])) {
      const tableIds = domain.tables.filter(id => schema.tables.some(t => t.id === id));
      if (tableIds.length === 0) continue;

      const positions = layoutGroup(tableIds);
      const bb = bbox(positions);
      const domW = bb.w + DOMAIN_PAD * 2;
      const domH = bb.h + DOMAIN_PAD * 2;

      // Domain absolute position (top-left)
      newLayout[domain.id] = { x: cursorX, y: 0, width: domW, height: domH };

      // Tables: absolute canvas coordinates (cursorX offset applied)
      for (const [id, pos] of Object.entries(positions)) {
        newLayout[id] = {
          x: cursorX + pos.x - bb.x1 + DOMAIN_PAD,
          y: pos.y - bb.y1 + DOMAIN_PAD,
          parentId: domain.id,  // semantic metadata for domain membership
        };
      }

      cursorX += domW + DOMAIN_GAP;
    }

    // Standalone tables (not in any domain)
    const domainTableIds = new Set((schema.domains || []).flatMap(d => d.tables));
    const standaloneIds = schema.tables.map(t => t.id).filter(id => !domainTableIds.has(id));
    if (standaloneIds.length > 0) {
      const positions = layoutGroup(standaloneIds);
      const bb = bbox(positions);
      for (const [id, pos] of Object.entries(positions)) {
        newLayout[id] = { x: cursorX + pos.x - bb.x1, y: pos.y - bb.y1 };
      }
    }

    set({ schema: { ...schema, layout: newLayout } });
    get().syncToYamlInput();
    get().saveSchema();
  }
}));
