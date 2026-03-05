import { useCallback, useEffect } from 'react'
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
  MarkerType
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
    setConnectionStartHandle
  } = useStore()
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { setCenter, getNode } = useReactFlow()

  const isEditingDisabled = showER && showLineage

  // Handle focusNodeId changes
  useEffect(() => {
    if (focusNodeId) {
      const node = getNode(focusNodeId)
      if (node) {
        const x = node.position.x + (node.width || 0) / 2
        const y = node.position.y + (node.height || 0) / 2
        setCenter(x, y, { zoom: 1.2, duration: 800 })
      }
      // Reset focusNodeId after focusing
      setFocusNodeId(null)
    }
  }, [focusNodeId, getNode, setCenter, setFocusNodeId])

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
          style: { width, height },
          selected: domain.id === selectedTableId,
          data: { label: domain.name, color: domain.color },
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
  }, [schema, setNodes])

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
      const HIGHLIGHT_STYLE = { stroke: '#f1f5f9', strokeWidth: 5 }; // Silver-White (Slate-100)
      const NORMAL_STYLE = { stroke: '#94a3b8', strokeWidth: 3 }; // Silver-Slate (Slate-400)

      const erEdges = schema.relationships.map((rel, index) => {
        const edgeId = `e-${index}`;
        const isConnectedToSelectedTable = selectedTableId === rel.from.table || selectedTableId === rel.to.table;
        const isDirectlySelected = selectedEdgeId === edgeId;
        const isHighlighted = isConnectedToSelectedTable || isDirectlySelected;
        
        return {
          id: edgeId,
          source: rel.from.table,
          target: rel.to.table,
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
              sourceHandle: `${upstreamId}-lineage-source`,
              targetHandle: `${table.id}-lineage-target`,
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
  }, [schema, selectedTableId, selectedEdgeId, setEdges, showER, showLineage])

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        // 1. Handle Lineage
        const isLineage = params.sourceHandle?.includes('lineage') || params.targetHandle?.includes('lineage');
        
        if (isLineage) {
          // For lineage, we assume source -> target is the flow
          addLineage(params.source, params.target);
          return;
        }

        // 2. Handle ER (Bidirectional Support)
        // If user connects from a 'target' handle to a 'source' handle, swap them
        let finalSource = params.source;
        let finalTarget = params.target;
        let finalSourceHandle = params.sourceHandle;
        let finalTargetHandle = params.targetHandle;

        const isSourceTargetRole = params.sourceHandle?.includes('target');
        const isTargetSourceRole = params.targetHandle?.includes('source');

        if (isSourceTargetRole || isTargetSourceRole) {
          // Swap logic
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

  const onSelectionChange = useCallback(() => {
    // We handle selection via onNodeClick and onEdgeClick to support toggle behavior.
  }, []);

  const isValidConnection = useCallback((connection: Connection) => {
    // Allow any connection as long as it's between different nodes
    return connection.source !== connection.target;
  }, []);

  return (
    <div className="flex-1 relative h-full">
      <CanvasToolbar />
      
      {/* Read-Only Badge */}
      {isEditingDisabled && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/90 backdrop-blur-md text-slate-950 rounded-full shadow-2xl border border-amber-400/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Connections Locked</span>
              <div className="w-px h-3 bg-slate-900/20" />
              <span className="text-[10px] font-medium text-slate-800">Viewing ER & Lineage simultaneously</span>
            </div>
            <p className="mt-1 text-[9px] font-bold text-amber-500 uppercase tracking-tighter drop-shadow-md">
              Table editing and movement still active
            </p>
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
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionRadius={30}
        deleteKeyCode={['Backspace', 'Delete']}
        selectNodesOnDrag={true}
        fitView
      >
        <Background color="#334155" gap={20} />
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
    setSchema
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
      
      // Handle multi-file static build
      if (data && data.isMultiFile && data.models) {
        fetchAvailableFiles().then(() => {
          const params = new URLSearchParams(window.location.search)
          const modelSlug = params.get('model')
          if (modelSlug) {
            setCurrentModel(modelSlug)
          } else {
            // Use first model by default
            setSchema(data.models[0].schema);
            setCurrentModel(data.models[0].slug);
          }
        });
      } else if (data && data.schema) {
        setSchema(data.schema);
      } else {
        setSchema(data);
      }
    }
  }, [isCliMode, hasInjectedData, fetchAvailableFiles, setCurrentModel, setSchema]);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
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
