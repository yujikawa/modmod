import { useCallback, useEffect, useState, useRef } from 'react'
import ReactFlow, { 
  Background, 
  Controls, 
  type Node, 
  type Edge,
  useNodesState,
  useEdgesState,
  type Connection,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  SelectionMode
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useStore } from './store/useStore'
import TableNode from './components/TableNode'
import DomainNode from './components/DomainNode'
import DetailPanel from './components/DetailPanel'
import Sidebar from './components/Sidebar/Sidebar'
import CanvasToolbar from './components/CanvasToolbar'
import ButtonEdge from './components/ButtonEdge'
import LineageEdge from './components/LineageEdge'

const nodeTypes = {
  table: TableNode,
  domain: DomainNode,
}

const edgeTypes = {
  button: ButtonEdge,
  lineage: LineageEdge,
}

function Flow() {
  const { 
    schema, 
    setSelectedTableId, 
    selectedTableId,
    selectedEdgeId,
    setSelectedEdgeId,
    updateNodePosition,
    updateNodesPosition,
    isCliMode,
    focusNodeId,
    setFocusNodeId,
    addRelationship,
    removeNode,
    removeEdge,
    toggleTableSelection,
    toggleEdgeSelection,
    showER,
    showLineage,
    addLineage,
    setConnectionStartHandle,
    theme,
    currentModelSlug
  } = useStore()
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { fitView, getViewport, setViewport } = useReactFlow()
  const [edgeSyncTrigger, setEdgeSyncTrigger] = useState(0)
  const lastLoadedModel = useRef<string | null>(null)

  const isEditingDisabled = showER && showLineage
  const isViewingDisabled = !showER && !showLineage

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Clear selection on Escape
      if (e.key === 'Escape') {
        setSelectedTableId(null);
        setSelectedEdgeId(null);
        return;
      }

      // 2. Pan canvas with arrow keys
      // Guard: Don't pan if typing in an input, textarea, or CodeMirror
      const activeEl = document.activeElement;
      const isTyping = activeEl?.tagName === 'INPUT' || 
                       activeEl?.tagName === 'TEXTAREA' || 
                       activeEl?.hasAttribute('contenteditable') ||
                       activeEl?.classList.contains('cm-content');

      if (isTyping) return;

      // Guard: Only pan if nothing is selected (prevents conflict with node nudging)
      if (selectedTableId || selectedEdgeId) return;

      if (e.key.startsWith('Arrow')) {
        const { x, y, zoom } = getViewport();
        const MOVE_STEP = 100;

        if (e.key === 'ArrowUp') {
          setViewport({ x, y: y + MOVE_STEP, zoom }, { duration: 150 });
        } else if (e.key === 'ArrowDown') {
          setViewport({ x, y: y - MOVE_STEP, zoom }, { duration: 150 });
        } else if (e.key === 'ArrowLeft') {
          setViewport({ x: x + MOVE_STEP, y, zoom }, { duration: 150 });
        } else if (e.key === 'ArrowRight') {
          setViewport({ x: x - MOVE_STEP, y, zoom }, { duration: 150 });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedTableId, setSelectedEdgeId, getViewport, setViewport, selectedTableId, selectedEdgeId]);

  // Handle focusNodeId changes
  useEffect(() => {
    if (focusNodeId) {
      fitView({ 
        nodes: [{ id: focusNodeId }], 
        duration: 800, 
        padding: 0.5 
      });
      // Reset focusNodeId after focusing
      setFocusNodeId(null);
    }
  }, [focusNodeId, fitView, setFocusNodeId]);

  // Sync Nodes (including selection state)
  useEffect(() => {
    if (!schema) return

    const newNodes: Node[] = []
    const TABLE_WIDTH = 320;
    const TABLE_HEIGHT = 250;
    const DOMAIN_PADDING = 60;
    const GRID_COLS = 3;

    // 1. Generate Domain Nodes and their Tables
    if (schema.domains) {
      const DOMAIN_GRID_COLS = 2; // Arrange domains in 2 columns
      const DOMAIN_X_GAP = 1600;
      const DOMAIN_Y_GAP = 1200;

      schema.domains.forEach((domain, dIndex) => {
        const tableCount = domain.tables.length;
        const rows = Math.ceil(tableCount / GRID_COLS);
        const cols = Math.min(tableCount, GRID_COLS);

        // Dynamic Size Calculation
        const autoWidth = Math.max(2, cols) * TABLE_WIDTH + DOMAIN_PADDING;
        const autoHeight = Math.max(1.5, rows) * TABLE_HEIGHT + DOMAIN_PADDING;

        const layout = schema.layout?.[domain.id];

        // Domain Grid Positioning
        const dRow = Math.floor(dIndex / DOMAIN_GRID_COLS);
        const dCol = dIndex % DOMAIN_GRID_COLS;
        const x = layout?.x ?? (dCol * DOMAIN_X_GAP);
        const y = layout?.y ?? (dRow * DOMAIN_Y_GAP);

        const width = layout?.width ?? autoWidth;
        const height = layout?.height ?? autoHeight;

        newNodes.push({
          id: domain.id,
          type: 'domain',
          position: { x, y },
          style: { 
            width, 
            height,
            pointerEvents: domain.isLocked ? 'none' : 'auto' // FORCE transparency at the wrapper level
          },
          selected: domain.id === selectedTableId,
          draggable: !domain.isLocked,
          selectable: !domain.isLocked,
          deletable: !domain.isLocked,
          dragHandle: domain.isLocked ? undefined : '.domain-drag-handle',
          data: { 
            label: domain.name, 
            color: domain.color,
            isLocked: domain.isLocked 
          },
        });

        // Generate Table Nodes for this domain
        domain.tables.forEach((tableId, tIndex) => {
          const table = schema.tables.find(t => t.id === tableId);
          if (!table) return;

          const localRow = Math.floor(tIndex / GRID_COLS);
          const localCol = tIndex % GRID_COLS;

          const tableLayout = schema.layout?.[table.id];
          const tx = tableLayout?.x ?? (localCol * TABLE_WIDTH + DOMAIN_PADDING / 2);
          const ty = tableLayout?.y ?? (localRow * TABLE_HEIGHT + DOMAIN_PADDING / 2);
          
          // Apply default height if many columns and no manual resize
          const defaultHeight = (table.columns && table.columns.length > 10) ? 350 : undefined;
          const nodeHeight = tableLayout?.height ?? defaultHeight;

          newNodes.push({
            id: table.id,
            type: 'table',
            position: { x: tx, y: ty },
            style: { 
              ...(tableLayout?.width ? { width: tableLayout.width } : {}),
              ...(nodeHeight ? { height: nodeHeight } : {})
            },
            selected: table.id === selectedTableId,
            dragHandle: '.table-drag-handle',
            data: { table },
            parentNode: domain.id,
            extent: 'parent',
          });
        });
      });
    }

    // 2. Generate Top-level Table Nodes (Not in any domain)
    const domainTableIds = new Set(schema.domains?.flatMap(d => d.tables) || []);
    const topLevelTables = schema.tables.filter(t => !domainTableIds.has(t.id));

    topLevelTables.forEach((table, index) => {
      const tableLayout = schema.layout?.[table.id];
      const lx = tableLayout?.x ?? (index * 300);
      const ly = tableLayout?.y ?? 100;
      
      // Apply default height if many columns and no manual resize
      const defaultHeight = (table.columns && table.columns.length > 10) ? 350 : undefined;
      const nodeHeight = tableLayout?.height ?? defaultHeight;

      newNodes.push({
        id: table.id,
        type: 'table',
        position: { x: lx, y: ly },
        style: { 
          ...(tableLayout?.width ? { width: tableLayout.width } : {}),
          ...(nodeHeight ? { height: nodeHeight } : {})
        },
        selected: table.id === selectedTableId,
        dragHandle: '.table-drag-handle',
        data: { table },
      });
    });

    setNodes(newNodes)

    // Robust Snapping Booster: 
    // Wait for nodes to finish layout rendering, then trigger fitView and a edge re-sync.
    // We only trigger fitView (zooming out to see everything) on the INITIAL LOAD of a model
    // to prevent annoying viewport jumps during drags and edits.
    if (lastLoadedModel.current !== currentModelSlug) {
      const timer = setTimeout(() => {
        fitView({ duration: 400, padding: 0.2 });
        window.dispatchEvent(new Event('resize'));
        // Trigger a secondary edge sync to catch finalized handle positions
        setEdgeSyncTrigger(v => v + 1);
      }, 400);
      lastLoadedModel.current = currentModelSlug;
      return () => clearTimeout(timer);
    } else {
      // For incremental updates (drags, edits), just re-sync edges without jumping the camera.
      setEdgeSyncTrigger(v => v + 1);
    }
  }, [schema, setNodes, fitView, currentModelSlug])

  // Sync Store Selection to React Flow nodes state (without recreating all nodes)
  useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => ({
        ...node,
        selected: node.id === selectedTableId
      }))
    )
  }, [selectedTableId, setNodes])

  // Sync Edges with dynamic highlighting
  useEffect(() => {
    if (!schema) return
    
    const newEdges: Edge[] = [];

    // 1. Generate ER Edges
    if (showER && schema.relationships) {
      const HIGHLIGHT_STYLE = { stroke: theme === 'dark' ? '#f1f5f9' : '#0f172a', strokeWidth: 5 };
      const NORMAL_STYLE = { stroke: theme === 'dark' ? '#94a3b8' : '#64748b', strokeWidth: 3 };

      const erEdges = schema.relationships.map((rel, index) => {
        const edgeId = `e-${index}`;
        const isConnectedToSelectedTable = selectedTableId === rel.from.table || selectedTableId === rel.to.table;
        const isDirectlySelected = selectedEdgeId === edgeId;
        const isHighlighted = isConnectedToSelectedTable || isDirectlySelected;
        
        // Explicit Handle Mapping
        const sourceHandle = rel.from.column 
          ? `${rel.from.table}-${rel.from.column}-er-source-right` 
          : `${rel.from.table}-er-source-bottom`;
        
        const targetHandle = rel.to.column 
          ? `${rel.to.table}-${rel.to.column}-er-target-left` 
          : `${rel.to.table}-er-target-top`;

        return {
          id: edgeId,
          source: rel.from.table,
          sourceHandle,
          target: rel.to.table,
          targetHandle,
          type: 'button',
          data: { 
            isConnectedToSelectedTable,
            isDirectlySelected,
            label: rel.type 
          },
          selected: isDirectlySelected,
          animated: false,
          style: isHighlighted ? HIGHLIGHT_STYLE : NORMAL_STYLE,
          zIndex: isHighlighted ? 10 : 1,
        }
      });
      newEdges.push(...erEdges);
    }

    // 2. Generate Lineage Edges
    if (showLineage) {
      schema.tables.forEach(table => {
        if (table.lineage?.upstream) {
          table.lineage.upstream.forEach((upstreamId, index) => {
            const edgeId = `lin-${upstreamId}-${table.id}-${index}`;
            const isConnectedToSelected = selectedTableId === table.id || selectedTableId === upstreamId;
            const isDirectlySelected = selectedEdgeId === edgeId;
            const isHighlighted = isConnectedToSelected || isDirectlySelected;

            newEdges.push({
              id: edgeId,
              source: upstreamId,
              target: table.id,
              sourceHandle: `${upstreamId}-lin-source-right`,
              targetHandle: `${table.id}-lin-target-left`,
              type: 'lineage',
              data: { isHighlighted },
              selected: isDirectlySelected,
              animated: true, // Lineage always flows
              markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6', width: 20, height: 20 },
              zIndex: isHighlighted ? 15 : 2, 
            });
          });
        }
      });
    }

    setEdges(newEdges);
  }, [schema, selectedTableId, selectedEdgeId, setEdges, showER, showLineage, theme, edgeSyncTrigger])

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        // 1. Handle Lineage
        const isLinConnection = params.sourceHandle?.includes('lin-') || params.targetHandle?.includes('lin-');
        
        if (isLinConnection) {
          // Lineage only makes sense from source-right to target-left
          // But we'll accept any lineage handle to lineage handle
          addLineage(params.source, params.target);
          return;
        }

        // 2. Handle ER (Bidirectional & Multi-directional Support)
        let finalSource = params.source;
        let finalTarget = params.target;
        let finalSourceHandle = params.sourceHandle;
        let finalTargetHandle = params.targetHandle;

        // If user connects from a 'target' handle to a 'source' handle, swap them
        // This allows dragging FROM a PK/FK TO another PK/FK in any order.
        const isSourceTargetRole = params.sourceHandle?.includes('target');
        const isTargetSourceRole = params.targetHandle?.includes('source');

        if (isSourceTargetRole || isTargetSourceRole) {
          finalSource = params.target;
          finalTarget = params.source;
          finalSourceHandle = params.targetHandle;
          finalTargetHandle = params.sourceHandle;
        }

        addRelationship(finalSource, finalTarget, finalSourceHandle, finalTargetHandle);
      }
    },
    [addRelationship, addLineage]
  )

  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    deletedNodes.forEach(node => removeNode(node.id));
  }, [removeNode]);

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    deletedEdges.forEach(edge => {
      // Edge ID is e-INDEX, but removeEdge needs source and target
      removeEdge(edge.source, edge.target);
    });
  }, [removeEdge]);

  const onPaneClick = useCallback(() => {
    setSelectedTableId(null);
    setSelectedEdgeId(null);
  }, [setSelectedTableId, setSelectedEdgeId]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    toggleTableSelection(node.id);
  }, [toggleTableSelection]);

  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    toggleEdgeSelection(edge.id);
  }, [toggleEdgeSelection]);

  const onConnectStart = useCallback((_: any, { nodeId, handleId, handleType }: any) => {
    setConnectionStartHandle({ nodeId, handleId, handleType });
  }, [setConnectionStartHandle]);

  const onConnectEnd = useCallback(() => {
    setConnectionStartHandle(null);
  }, [setConnectionStartHandle]);

  const onNodeDragStop = useCallback((_: any, node: Node) => {
    if (!isCliMode) return;

    // Domain assignment is now explicit via the Detail Panel.
    // We preserve the current parentId if it exists.
    const parentId = node.parentNode;

    updateNodePosition(node.id, node.position.x, node.position.y, parentId);
  }, [isCliMode, updateNodePosition]);

  const onSelectionDragStop = useCallback((_: any, nodes: Node[]) => {
    if (!isCliMode) return;

    const updates = nodes.map(node => ({
      id: node.id,
      x: node.position.x,
      y: node.position.y,
      parentId: node.parentNode
    }));

    updateNodesPosition(updates);
  }, [isCliMode, updateNodesPosition]);

  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    // If multiple nodes are selected, clear the detail panel focus
    if (nodes.length > 1) {
      setSelectedTableId(null);
      setSelectedEdgeId(null);
    }
  }, [setSelectedTableId, setSelectedEdgeId]);

  const isValidConnection = useCallback((connection: Connection) => {
    // Allow any connection as long as it's between different nodes
    return connection.source !== connection.target;
  }, []);

  return (
    <div className="flex-1 relative h-full">
      <CanvasToolbar />
      
      {/* Read-Only Badge */}
      {isEditingDisabled && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 text-center pointer-events-none">
          <div className="flex flex-col items-center">
            <div className={`flex items-center gap-2 px-4 py-1.5 backdrop-blur-md rounded-full shadow-xl border transition-colors ${
              theme === 'dark' ? 'bg-slate-950/60 border-amber-500/50' : 'bg-white/60 border-amber-500/40'
            }`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>Connections Locked</span>
              <div className={`w-px h-3 ${theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-500/30'}`} />
              <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-amber-400/70' : 'text-amber-600/70'}`}>ER & Lineage active</span>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Connections Guidance Badge */}
      {isViewingDisabled && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 text-center pointer-events-none">
          <div className="flex flex-col items-center">
            <div className={`flex items-center gap-2 px-4 py-1.5 backdrop-blur-md rounded-full shadow-xl border transition-colors ${
              theme === 'dark' ? 'bg-slate-950/60 border-blue-500/50' : 'bg-white/60 border-blue-500/40'
            }`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Connections Hidden</span>
              <div className={`w-px h-3 ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/30'}`} />
              <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-blue-400/70' : 'text-blue-600/70'}`}>Enable a View Mode to draw edges</span>
            </div>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onSelectionChange={onSelectionChange}
        onSelectionDragStop={onSelectionDragStop}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionRadius={30}
        deleteKeyCode={['Backspace', 'Delete']}
        selectionMode={SelectionMode.Partial}
        selectionOnDrag={true}
        selectionKeyCode="Shift"
        selectNodesOnDrag={true}
        fitView
      >
        <Background color={theme === 'dark' ? '#334155' : '#e2e8f0'} gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  )
}

function App() {
  const { 
    isCliMode, 
    fetchAvailableFiles, 
    setCurrentModel, 
    setSchema,
    theme
  } = useStore()

  // Consistent detection for injected data
  const hasInjectedData = !!(window as any).__MODSCAPE_DATA__;

  // Initial Data Load
  useEffect(() => {
    // 1. CLI Mode (Live updates)
    if (isCliMode) {
      fetchAvailableFiles().then(() => {
        const params = new URLSearchParams(window.location.search)
        const modelSlug = params.get('model')
        if (modelSlug) {
          setCurrentModel(modelSlug)
        } else {
          fetch('/api/model')
            .then(res => res.json())
            .then(data => setSchema(data));
        }
      });

      if ((import.meta as any).hot) {
        (import.meta as any).hot.on('model-update', (data: any) => {
          setSchema(data);
        });
      }
      return;
    }

    // 2. Static Build (Injected data)
    if (hasInjectedData) {
      const data = (window as any).__MODSCAPE_DATA__;
      
      if (data && data.models && data.models.length > 0) {
        fetchAvailableFiles().then(() => {
          const params = new URLSearchParams(window.location.search)
          const modelSlug = params.get('model')
          
          if (modelSlug) {
            setCurrentModel(modelSlug)
          } else {
            // Use first model by default
            setSchema(data.models[0].schema);
            // Also set current slug so FileSelector/Sidebar know which one is active
            if (data.models[0].slug) {
              // We need a way to set the slug without triggering a fetch
              // Since setCurrentModel usually fetches, let's ensure store handles this.
              setCurrentModel(data.models[0].slug);
            }
          }
        });
      }
    }
  }, [isCliMode, hasInjectedData, fetchAvailableFiles, setCurrentModel, setSchema]);

  return (
    <ReactFlowProvider>
      <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <Sidebar />

        {/* Main Area (Right Section) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <Flow />
          {/* Bottom: Detail Panel (L-Shape Integration) */}
          <DetailPanel />
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default App
