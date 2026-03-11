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
import AnnotationNode from './components/AnnotationNode'
import DetailPanel from './components/DetailPanel'
import Sidebar from './components/Sidebar/Sidebar'
import RightPanel from './components/RightPanel/RightPanel'
import PresentationOverlay from './components/PresentationOverlay'
import SelectionToolbar from './components/SelectionToolbar'
import ButtonEdge from './components/ButtonEdge'
import LineageEdge from './components/LineageEdge'
import AnnotationEdge from './components/AnnotationEdge'

const nodeTypes = {
  table: TableNode,
  domain: DomainNode,
  annotation: AnnotationNode,
}

const edgeTypes = {
  button: ButtonEdge,
  lineage: LineageEdge,
  annotation: AnnotationEdge,
}

function Flow() {
  const { 
    schema, 
    setSelectedTableId, 
    selectedTableId,
    selectedEdgeId,
    setSelectedEdgeId,
    selectedAnnotationId,
    setSelectedAnnotationId,
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
    toggleAnnotationSelection,
    showER,
    showLineage,
    showAnnotations,
    addLineage,
    setConnectionStartHandle,
    addTable,
    addDomain,
    addAnnotation,
    updateAnnotation,
    theme,
    currentModelSlug,
    isPresentationMode,
    setIsPresentationMode,
    pathFinderResult
  } = useStore()
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { fitView, getViewport, setViewport, screenToFlowPosition, getNodes } = useReactFlow()
  const [edgeSyncTrigger, setEdgeSyncTrigger] = useState(0)
  const lastLoadedModel = useRef<string | null>(null)

  const isConnectionLocked = showER && showLineage
  const isViewingDisabled = !showER && !showLineage

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Exit Presentation Mode on Escape
      if (e.key === 'Escape') {
        if (isPresentationMode) {
          setIsPresentationMode(false);
          return;
        }
        setSelectedTableId(null);
        setSelectedEdgeId(null);
        setSelectedAnnotationId(null);
        return;
      }

      const activeEl = document.activeElement;
      const isTyping = 
        activeEl?.tagName === 'INPUT' || 
        activeEl?.tagName === 'TEXTAREA' || 
        (activeEl as HTMLElement)?.isContentEditable ||
        activeEl?.closest('.cm-editor') || // CodeMirror 6 container
        activeEl?.closest('.cm-content') || // CodeMirror 6 content
        activeEl?.closest('[role="dialog"]') || // Modals/Dialogs
        activeEl?.closest('.sidebar-content'); // Additional safeguard for our panels

      if (isTyping) return;
      
      // Prevention of continuous creation on long press
      if (e.repeat) return;

      const key = e.key.toLowerCase();

      // Object Creation Shortcuts
      if (key === 't' || key === 'd' || key === 's') {
        const center = screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });

        if (key === 't') {
          addTable(center.x - 160, center.y - 125);
        } else if (key === 'd') {
          addDomain(center.x - 300, center.y - 200);
        } else if (key === 's') {
          if (!showAnnotations) {
            useStore.getState().setShowAnnotations(true);
          }
          addAnnotation({ x: center.x - 60, y: center.y - 40 });
        }
        return;
      }

      if (selectedTableId || selectedEdgeId || selectedAnnotationId) return;

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
  }, [setSelectedTableId, setSelectedEdgeId, setSelectedAnnotationId, getViewport, setViewport, selectedTableId, selectedEdgeId, selectedAnnotationId, isPresentationMode, setIsPresentationMode]);

  // Handle focusNodeId changes
  useEffect(() => {
    if (focusNodeId) {
      fitView({ nodes: [{ id: focusNodeId }], duration: 800, padding: 0.5 });
      setFocusNodeId(null);
    }
  }, [focusNodeId, fitView, setFocusNodeId]);

  // Sync Nodes
  useEffect(() => {
    if (!schema) return

    const newNodes: Node[] = []
    const TABLE_WIDTH = 320;
    const TABLE_HEIGHT = 250;
    const DOMAIN_PADDING = 60;
    const GRID_COLS = 3;
    const currentFlowNodes = getNodes();

    if (schema.domains) {
      const DOMAIN_GRID_COLS = 2;
      const DOMAIN_X_GAP = 1600;
      const DOMAIN_Y_GAP = 1200;

      schema.domains.forEach((domain, dIndex) => {
        const tableCount = domain.tables.length;
        const rows = Math.ceil(tableCount / GRID_COLS);
        const cols = Math.min(tableCount, GRID_COLS);
        const autoWidth = Math.max(2, cols) * TABLE_WIDTH + DOMAIN_PADDING;
        const autoHeight = Math.max(1.5, rows) * TABLE_HEIGHT + DOMAIN_PADDING;
        const layout = schema.layout?.[domain.id];
        const currentNode = currentFlowNodes.find(n => n.id === domain.id);
        const dRow = Math.floor(dIndex / DOMAIN_GRID_COLS);
        const dCol = dIndex % DOMAIN_GRID_COLS;
        const x = layout?.x ?? currentNode?.position.x ?? (dCol * DOMAIN_X_GAP);
        const y = layout?.y ?? currentNode?.position.y ?? (dRow * DOMAIN_Y_GAP);
        const width = layout?.width ?? autoWidth;
        const height = layout?.height ?? autoHeight;

        newNodes.push({
          id: domain.id,
          type: 'domain',
          position: { x, y },
          style: { width, height, pointerEvents: domain.isLocked ? 'none' : 'auto' },
          selected: domain.id === selectedTableId,
          draggable: !domain.isLocked,
          selectable: !domain.isLocked,
          deletable: !domain.isLocked,
          dragHandle: domain.isLocked ? undefined : '.domain-drag-handle',
          data: { label: domain.name, color: domain.color, isLocked: domain.isLocked },
        });

        domain.tables.forEach((tableId, tIndex) => {
          const table = schema.tables.find(t => t.id === tableId);
          if (!table) return;
          const localRow = Math.floor(tIndex / GRID_COLS);
          const localCol = tIndex % GRID_COLS;
          const tableLayout = schema.layout?.[table.id];
          const currentTableNode = currentFlowNodes.find(n => n.id === table.id);
          const tx = tableLayout?.x ?? currentTableNode?.position.x ?? (localCol * TABLE_WIDTH + DOMAIN_PADDING / 2);
          const ty = tableLayout?.y ?? currentTableNode?.position.y ?? (localRow * TABLE_HEIGHT + DOMAIN_PADDING / 2);
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

    const domainTableIds = new Set(schema.domains?.flatMap(d => d.tables) || []);
    const topLevelTables = schema.tables.filter(t => !domainTableIds.has(t.id));

    topLevelTables.forEach((table, index) => {
      const tableLayout = schema.layout?.[table.id];
      const currentTableNode = currentFlowNodes.find(n => n.id === table.id);
      const lx = tableLayout?.x ?? currentTableNode?.position.x ?? (index * 300);
      const ly = tableLayout?.y ?? currentTableNode?.position.y ?? 100;
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

    if (showAnnotations && schema.annotations) {
      schema.annotations.forEach(annotation => {
        let x = annotation.offset.x;
        let y = annotation.offset.y;
        let parentNode = undefined;

        if (annotation.targetId) {
          const targetNode = newNodes.find(n => n.id === annotation.targetId);
          if (targetNode) {
            x = targetNode.position.x + annotation.offset.x;
            y = targetNode.position.y + annotation.offset.y;
            parentNode = targetNode.parentNode;
          }
        }

        newNodes.push({
          id: annotation.id,
          type: 'annotation',
          position: { x, y },
          selected: annotation.id === selectedAnnotationId,
          data: { annotation },
          parentNode,
        });
      });
    }

    // Apply Path Highlighting to Nodes
    if (pathFinderResult) {
      newNodes.forEach(node => {
        const isPartOfPath = pathFinderResult.nodeIds.includes(node.id);
        node.style = {
          ...node.style,
          opacity: isPartOfPath ? 1 : 0.1,
          pointerEvents: isPartOfPath ? 'all' : 'none',
          transition: 'opacity 0.5s ease-in-out'
        };
        if (isPartOfPath) {
          node.zIndex = 1000;
        }
      });
    }

    setNodes(newNodes)

    if (lastLoadedModel.current !== currentModelSlug) {
      const timer = setTimeout(() => {
        fitView({ duration: 400, padding: 0.2 });
        window.dispatchEvent(new Event('resize'));
        setEdgeSyncTrigger(v => v + 1);
      }, 400);
      lastLoadedModel.current = currentModelSlug;
      return () => clearTimeout(timer);
    } else {
      setEdgeSyncTrigger(v => v + 1);
    }
  }, [schema, setNodes, fitView, currentModelSlug, showAnnotations, selectedTableId, selectedAnnotationId, pathFinderResult])

  // Sync Store Selection
  useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => ({
        ...node,
        selected: node.id === selectedTableId || node.id === selectedAnnotationId
      }))
    )
  }, [selectedTableId, selectedAnnotationId, setNodes])

  // Sync Edges
  useEffect(() => {
    if (!schema) return
    const newEdges: Edge[] = [];

    if (showER && schema.relationships) {
      const HIGHLIGHT_STYLE = { stroke: theme === 'dark' ? '#f1f5f9' : '#0f172a', strokeWidth: 5 };
      const PATH_STYLE = { stroke: '#3b82f6', strokeWidth: 8 }; 
      const NORMAL_STYLE = { stroke: theme === 'dark' ? '#94a3b8' : '#64748b', strokeWidth: 3 };

      const erEdges = schema.relationships.map((rel, index) => {
        const edgeId = `e-${index}`;
        const isPartOfPath = pathFinderResult?.edgeIds.includes(edgeId);
        const isConnectedToSelectedTable = selectedTableId === rel.from.table || selectedTableId === rel.to.table;
        const isDirectlySelected = selectedEdgeId === edgeId;
        const isHighlighted = isConnectedToSelectedTable || isDirectlySelected;
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
          data: { isConnectedToSelectedTable, isDirectlySelected, label: rel.type },
          selected: isDirectlySelected,
          animated: isPartOfPath || false,
          style: {
            ...(isPartOfPath ? PATH_STYLE : (isHighlighted ? HIGHLIGHT_STYLE : NORMAL_STYLE)),
            opacity: pathFinderResult ? (isPartOfPath ? 1 : 0.1) : 1
          },
          zIndex: isPartOfPath ? 100 : (isHighlighted ? 10 : 1),
        }
      });
      newEdges.push(...erEdges);
    }

    if (showLineage) {
      schema.tables.forEach(table => {
        if (table.lineage?.upstream) {
          table.lineage.upstream.forEach((upstreamId, index) => {
            const edgeId = `lin-${upstreamId}-${table.id}-${index}`;
            const isPartOfPath = pathFinderResult?.edgeIds.includes(edgeId);
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
              animated: true,
              markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6', width: 20, height: 20 },
              style: {
                ...(isPartOfPath ? { stroke: '#3b82f6', strokeWidth: 8 } : {}),
                opacity: pathFinderResult ? (isPartOfPath ? 1 : 0.1) : 1
              },
              zIndex: isPartOfPath ? 110 : (isHighlighted ? 15 : 2), 
            });
          });
        }
      });
    }

    if (showAnnotations && schema.annotations) {
      schema.annotations.forEach(annotation => {
        if (annotation.type === 'callout' && annotation.targetId) {
          newEdges.push({
            id: `e-ann-${annotation.id}`,
            source: annotation.id,
            target: annotation.targetId,
            type: 'annotation',
            zIndex: 0,
          });
        }
      });
    }

    setEdges(newEdges);
  }, [schema, selectedTableId, selectedEdgeId, setEdges, showER, showLineage, showAnnotations, theme, edgeSyncTrigger, pathFinderResult])

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        const isLinConnection = params.sourceHandle?.includes('lin-') || params.targetHandle?.includes('lin-');
        if (isLinConnection) {
          addLineage(params.source, params.target);
          return;
        }
        let finalSource = params.source;
        let finalTarget = params.target;
        let finalSourceHandle = params.sourceHandle;
        let finalTargetHandle = params.targetHandle;
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
    deletedEdges.forEach(edge => removeEdge(edge.source, edge.target));
  }, [removeEdge]);

  const onPaneClick = useCallback(() => {
    setSelectedTableId(null);
    setSelectedEdgeId(null);
    setSelectedAnnotationId(null);
  }, [setSelectedTableId, setSelectedEdgeId, setSelectedAnnotationId]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node.type === 'annotation') {
      toggleAnnotationSelection(node.id);
    } else {
      toggleTableSelection(node.id);
    }
  }, [toggleTableSelection, toggleAnnotationSelection]);

  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    toggleEdgeSelection(edge.id);
  }, [toggleEdgeSelection]);

  const onConnectStart = useCallback((_: any, { nodeId, handleId, handleType }: any) => {
    setConnectionStartHandle({ nodeId, handleId, handleType });
  }, [setConnectionStartHandle]);

  const onConnectEnd = useCallback(() => {
    setConnectionStartHandle(null);
  }, [setConnectionStartHandle]);

  const onNodeDrag = useCallback((_: any, node: Node) => {
    if (node.type === 'table' || node.type === 'domain') {
      setNodes(nds => nds.map(n => {
        if (n.type === 'annotation') {
          const ann = schema?.annotations?.find(a => a.id === n.id);
          if (ann && ann.targetId === node.id) {
            return {
              ...n,
              position: {
                x: node.position.x + ann.offset.x,
                y: node.position.y + ann.offset.y
              }
            };
          }
        }
        return n;
      }));
    }
  }, [schema, setNodes]);

  const onNodeDragStop = useCallback((_: any, node: Node) => {
    if (!isCliMode) return;
    if (node.type === 'annotation') {
      const annotation = schema?.annotations?.find(a => a.id === node.id);
      if (annotation) {
        if (annotation.targetId) {
          const targetNode = nodes.find(n => n.id === annotation.targetId);
          if (targetNode) {
            const newOffset = {
              x: node.position.x - targetNode.position.x,
              y: node.position.y - targetNode.position.y
            };
            updateAnnotation(node.id, { offset: newOffset });
          }
        } else {
          updateAnnotation(node.id, { offset: { x: node.position.x, y: node.position.y } });
        }
      }
      return;
    }
    const parentId = node.parentNode;
    updateNodePosition(node.id, node.position.x, node.position.y, parentId);
  }, [isCliMode, updateNodePosition, updateAnnotation, schema, nodes]);

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
    if (nodes.length > 1) {
      setSelectedTableId(null);
      setSelectedEdgeId(null);
      setSelectedAnnotationId(null);
    }
  }, [setSelectedTableId, setSelectedEdgeId, setSelectedAnnotationId]);

  const onNodeDoubleClick = useCallback(() => {
    // No-op to prevent unexpected expansion
  }, []);

  const onEdgeDoubleClick = useCallback(() => {
    // No-op to prevent unexpected expansion
  }, []);

  const isValidConnection = useCallback((connection: Connection) => {
    return connection.source !== connection.target;
  }, []);

  return (
    <div className="flex-1 relative h-full flex flex-col overflow-hidden">
      <div className="flex-1 relative">
        {!isPresentationMode && <SelectionToolbar />}
        <PresentationOverlay />
        
        {/* Badges ... (Omitting inner badge JSX for brevity, but they stay) */}
        {isConnectionLocked && (
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
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
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

      {/* Bottom: Detail Panel (Hidden in Presentation Mode) */}
      {!isPresentationMode && <DetailPanel />}
    </div>
  )
}

function App() {
  const { 
    isCliMode, 
    fetchAvailableFiles, 
    setCurrentModel, 
    setSchema,
    theme,
    isPresentationMode
  } = useStore()

  const hasInjectedData = !!(window as any).__MODSCAPE_DATA__;

  useEffect(() => {
    if (isCliMode) {
      fetchAvailableFiles().then(() => {
        const params = new URLSearchParams(window.location.search)
        const modelSlug = params.get('model')
        if (modelSlug) setCurrentModel(modelSlug)
        else fetch('/api/model').then(res => res.json()).then(data => setSchema(data));
      });
      if ((import.meta as any).hot) (import.meta as any).hot.on('model-update', (data: any) => setSchema(data));
      return;
    }
    if (hasInjectedData) {
      const data = (window as any).__MODSCAPE_DATA__;
      if (data && data.models && data.models.length > 0) {
        fetchAvailableFiles().then(() => {
          const params = new URLSearchParams(window.location.search)
          const modelSlug = params.get('model')
          if (modelSlug) setCurrentModel(modelSlug)
          else {
            setSchema(data.models[0].schema);
            if (data.models[0].slug) setCurrentModel(data.models[0].slug);
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
        {/* Left Column: Sidebar (Editor) */}
        {!isPresentationMode && <Sidebar />}

        {/* Middle Column: Main Container (Canvas + DetailPanel) */}
        <Flow />

        {/* Right Column: Entities Panel */}
        {!isPresentationMode && <RightPanel />}
      </div>
    </ReactFlowProvider>
  )
}

export default App
