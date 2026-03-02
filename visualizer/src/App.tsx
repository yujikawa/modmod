import { useCallback, useEffect, useMemo } from 'react'
import ReactFlow, { 
  Background, 
  Controls, 
  type Node, 
  type Edge,
  useNodesState,
  useEdgesState,
  type Connection,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useStore } from './store/useStore'
import TableNode from './components/TableNode'
import DomainNode from './components/DomainNode'
import DetailPanel from './components/DetailPanel'
import Sidebar from './components/Sidebar/Sidebar'
import CanvasToolbar from './components/CanvasToolbar'
import ButtonEdge from './components/ButtonEdge'

const nodeTypes = {
  table: TableNode,
  domain: DomainNode,
}

const edgeTypes = {
  button: ButtonEdge,
}

const HIGHLIGHT_STYLE = { stroke: '#4ade80', strokeWidth: 3 };
const NORMAL_STYLE = { stroke: '#334155', strokeWidth: 1 };

function Flow() {
  const { 
    schema, 
    setSelectedTableId, 
    selectedTableId,
    selectedEdgeId,
    setSelectedEdgeId,
    updateNodePosition,
    saveLayout,
    isCliMode,
    focusNodeId,
    setFocusNodeId,
    addEdge: createEdge,
    removeNode
  } = useStore()
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { setCenter, getNode } = useReactFlow()

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

  // Sync Nodes
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
          dragHandle: '.domain-drag-handle',
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

          newNodes.push({
            id: table.id,
            type: 'table',
            position: { x: tx, y: ty },
            style: tableLayout?.width ? { width: tableLayout.width, height: tableLayout.height } : undefined,
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
      const layout = schema.layout?.[table.id] || { x: index * 300, y: 100 };
      
      newNodes.push({
        id: table.id,
        type: 'table',
        position: { x: layout.x, y: layout.y },
        style: layout?.width ? { width: layout.width, height: layout.height } : undefined,
        dragHandle: '.table-drag-handle',
        data: { table },
      });
    });

    setNodes(newNodes)
  }, [schema, setNodes])

  // Sync Edges with dynamic highlighting
  const currentEdges = useMemo(() => {
    if (!schema || !schema.relationships) return []
    
    return schema.relationships.map((rel, index) => {
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
        animated: isHighlighted,
        style: isHighlighted ? HIGHLIGHT_STYLE : NORMAL_STYLE,
        zIndex: isHighlighted ? 10 : 1,
      }
    }) as Edge[]
  }, [schema, selectedTableId, selectedEdgeId])

  useEffect(() => {
    setEdges(currentEdges)
  }, [currentEdges, setEdges])

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        createEdge(params.source, params.target);
      }
    },
    [createEdge]
  )

  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    deletedNodes.forEach(node => removeNode(node.id));
    saveLayout();
  }, [removeNode, saveLayout]);

  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }: { nodes: Node[], edges: Edge[] }) => {
    if (selectedNodes.length > 0) {
      setSelectedTableId(selectedNodes[0].id);
      setSelectedEdgeId(null);
    } else if (selectedEdges.length > 0) {
      setSelectedEdgeId(selectedEdges[0].id);
      setSelectedTableId(null);
    } else {
      setSelectedTableId(null);
      setSelectedEdgeId(null);
    }
  }, [setSelectedTableId, setSelectedEdgeId]);

  const onNodeDragStop = useCallback((_: any, node: Node) => {
    if (!isCliMode) return;

    // Detect if this is a table dropped into a domain
    let parentId = node.parentNode;
    
    if (node.type === 'table') {
      // Find domains that contain this node's current center position
      const nodeCenterX = node.position.x + (node.width || 0) / 2;
      const nodeCenterY = node.position.y + (node.height || 0) / 2;

      const domains = nodes.filter(n => n.type === 'domain' && n.id !== node.id);
      const targetDomain = domains.find(d => {
        const dx = d.position.x;
        const dy = d.position.y;
        const dw = d.width || 600;
        const dh = d.height || 400;
        return (
          nodeCenterX >= dx && 
          nodeCenterX <= dx + dw && 
          nodeCenterY >= dy && 
          nodeCenterY <= dy + dh
        );
      });

      parentId = targetDomain ? targetDomain.id : undefined;
    }

    updateNodePosition(node.id, node.position.x, node.position.y, parentId);
    saveLayout();
  }, [isCliMode, updateNodePosition, saveLayout, nodes]);

  return (
    <div className="flex-1 relative h-full">
      <CanvasToolbar />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
