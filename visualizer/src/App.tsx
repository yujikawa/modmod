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
  const { schema, error, parseAndSetSchema, setSelectedTableId } = useStore()
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Update nodes and edges when schema changes
  useEffect(() => {
    if (!schema) return

    const newNodes = schema.tables.map((table, index) => ({
      id: table.id,
      type: 'table',
      position: { x: index * 300, y: 100 },
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

  const handleParse = () => {
    parseAndSetSchema(yamlInput)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-100 bg-slate-950">
      {/* Sidebar for YAML input */}
      <div className="w-1/3 h-full border-r border-slate-800 bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900">
          <h1 className="text-xl font-bold text-white">ModMod Visualizer</h1>
          <p className="text-sm text-slate-400">Paste your YAML definition below</p>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-2">
          <textarea
            className="flex-1 p-4 font-mono text-sm border border-slate-700 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none bg-slate-800 text-slate-100"
            placeholder="tables: ..."
            value={yamlInput}
            onChange={(e) => setYamlInput(e.target.value)}
          />
          {error && (
            <div className="p-2 text-xs text-red-400 bg-red-950/50 border border-red-900 rounded">
              {error}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button 
            onClick={handleParse}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium shadow-lg"
          >
            Parse YAML
          </button>
        </div>
      </div>

      {/* Main Area for Diagram */}
      <div className="flex-1 h-full relative bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
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
