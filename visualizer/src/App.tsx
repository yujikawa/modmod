import { useState, useCallback, useEffect } from 'react'
import ReactFlow, { 
  Background, 
  Controls, 
  type Node, 
  type Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useStore } from './store/useStore'
import TableNode from './components/TableNode'
import DetailPanel from './components/DetailPanel'

const nodeTypes = {
  table: TableNode,
}

function App() {
  const [yamlInput, setYamlInput] = useState('')
  const { 
    schema, 
    error, 
    parseAndSetSchema, 
    setSelectedTableId, 
    setSchema,
    updateNodePosition,
    saveLayout
  } = useStore()
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Consistent detection
  const isCliMode = (window as any).MODMOD_CLI_MODE === true;
  const hasInjectedData = !!(window as any).__MODMOD_DATA__;
  const isStandalone = !isCliMode && !hasInjectedData;

  // Initial Data & File Watching Sync
  useEffect(() => {
    if (isCliMode) {
      fetch('/api/model')
        .then(res => res.json())
        .then(data => {
          setSchema(data);
          // Also sync to textarea for editing
          import('js-yaml').then(yaml => {
            setYamlInput(yaml.dump(data, { indent: 2 }));
          });
        })
        .catch(err => console.error('CLI fetch error:', err));

      if ((import.meta as any).hot) {
        (import.meta as any).hot.on('model-update', (data: any) => {
          setSchema(data);
          import('js-yaml').then(yaml => {
            setYamlInput(yaml.dump(data, { indent: 2 }));
          });
        });
      }
    } else if (hasInjectedData) {
      const data = (window as any).__MODMOD_DATA__;
      setSchema(data);
    }
  }, [isCliMode, hasInjectedData, setSchema]);

  // Sync Schema to React Flow
  useEffect(() => {
    if (!schema) return

    const newNodes = schema.tables.map((table, index) => ({
      id: table.id,
      type: 'table',
      position: schema.layout?.[table.id] || { x: index * 300, y: 100 },
      data: { table },
    })) as Node[]

    const newEdges = (schema.relationships || []).map((rel, index) => ({
      id: `e-${index}`,
      source: rel.from.table,
      target: rel.to.table,
      label: rel.type,
      animated: true,
    })) as Edge[]

    setNodes(newNodes)
    setEdges(newEdges)
  }, [schema, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeDragStop = useCallback((_: any, node: Node) => {
    if (!isCliMode) return;
    updateNodePosition(node.id, node.position.x, node.position.y);
    saveLayout();
  }, [isCliMode, updateNodePosition, saveLayout]);

  const handleParse = async () => {
    parseAndSetSchema(yamlInput);
    
    // If in CLI mode, we also want to save the YAML content back to the file
    if (isCliMode) {
      try {
        await fetch('/api/save-yaml', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ yaml: yamlInput })
        });
      } catch (e) {
        console.error('Failed to save YAML to file:', e);
      }
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100" style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#020617', color: '#f1f5f9' }}>
      {/* Sidebar */}
      <div className="flex h-full w-1/3 flex-col border-r border-slate-800 bg-slate-900" style={{ display: 'flex', flexDirection: 'column', width: '33.33%', height: '100%', borderRight: '1px solid #1e293b', backgroundColor: '#0f172a' }}>
        <div className="border-b border-slate-800 p-4" style={{ padding: '1rem', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="text-xl font-bold text-white" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>ModMod Visualizer</h1>
            {isCliMode && (
              <span style={{ padding: '2px 8px', backgroundColor: 'rgba(22, 101, 52, 0.4)', color: '#4ade80', fontSize: '10px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #166534' }}>LIVE</span>
            )}
          </div>
          <p className="text-sm text-slate-400" style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px' }}>
            {isCliMode ? 'CLI Editor Mode' : (hasInjectedData ? 'Static Viewer' : 'Paste your YAML definition below')}
          </p>
        </div>

        {/* Input Area (Standalone and CLI Editor) */}
        {(isStandalone || isCliMode) && (
          <div className="flex flex-1 flex-col gap-2 overflow-hidden p-4" style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
            <textarea
              className="flex-1 rounded border border-slate-700 bg-slate-800 p-4 font-mono text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ flex: 1, width: '100%', padding: '1rem', backgroundColor: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '0.375rem', fontFamily: 'monospace', outline: 'none', resize: 'none' }}
              placeholder="tables: ..."
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
            />
            <div className="flex justify-end pt-2" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button 
                onClick={handleParse}
                className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 shadow-lg"
                style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 500, cursor: 'pointer', border: 'none' }}
              >
                {isCliMode ? 'Save & Update' : 'Parse YAML'}
              </button>
            </div>
            {error && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'rgba(69, 10, 10, 0.5)', border: '1px solid #7f1d1d', borderRadius: '0.375rem', color: '#f87171', fontSize: '0.75rem' }}>
                {error}
              </div>
            )}
            {isCliMode && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(30, 58, 138, 0.2)', border: '1px solid rgba(30, 58, 138, 0.5)', borderRadius: '0.375rem', fontSize: '11px', fontStyle: 'italic', color: '#93c5fd' }}>
                Editing here will update the local file. Drag entities to save layout.
              </div>
            )}
          </div>
        )}

        {/* Summary Area (Injected only) */}
        {hasInjectedData && schema && (
          <div className="flex flex-1 flex-col overflow-hidden p-4" style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500" style={{ marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>Model Summary</div>
            <div className="flex-1 space-y-2 overflow-auto" style={{ flex: 1, overflowY: 'auto' }}>
              {schema.tables.map(t => (
                <div key={t.id} className="rounded border border-slate-800 bg-slate-800/50 p-2 text-sm shadow-sm" style={{ padding: '0.5rem', border: '1px solid #1e293b', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '0.375rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  {t.name} <span className="text-[10px] text-slate-500" style={{ fontSize: '10px', color: '#64748b' }}>({t.columns.length} columns)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Area */}
      <div className="relative flex-1" style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedTableId(node.id)}
          onPaneClick={() => setSelectedTableId(null)}
          fitView
        >
          <Background color="#334155" gap={20} />
          <Controls />
        </ReactFlow>
        <DetailPanel />
      </div>
    </div>
  )
}

export default App
