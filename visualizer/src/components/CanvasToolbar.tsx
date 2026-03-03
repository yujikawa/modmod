import { Layout, Grid, Trash2, Tag, Layers, Database, Plus, GitGraph, Network } from 'lucide-react'
import { useStore } from '../store/useStore'

const CanvasToolbar = () => {
  const { 
    addTable, 
    addDomain, 
    getSelectedTable, 
    getSelectedDomain, 
    getSelectedRelationship,
    removeNode,
    removeEdge,
    saveLayout,
    showER,
    showLineage,
    setShowER,
    setShowLineage
  } = useStore()

  const table = getSelectedTable()
  const domain = getSelectedDomain()
  const relationshipData = getSelectedRelationship()

  const activeSelection = table || domain || relationshipData

  const handleDelete = () => {
    if (table) {
      removeNode(table.id)
    } else if (domain) {
      removeNode(domain.id)
    } else if (relationshipData) {
      removeEdge(relationshipData.relationship.from.table, relationshipData.relationship.to.table)
    }
    saveLayout()
  }

  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10 items-center">
      {/* View Mode Toggle (Independent) */}
      <div className="flex bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl p-1 overflow-hidden mr-2">
        <button
          onClick={() => setShowER(!showER)}
          className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all ${
            showER 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
          }`}
          title="Toggle ER (Relationships)"
        >
          <Network size={14} />
          <span>ER</span>
        </button>
        <button
          onClick={() => setShowLineage(!showLineage)}
          className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all ${
            showLineage 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
          }`}
          title="Toggle Lineage (Data Flow)"
        >
          <GitGraph size={14} />
          <span>Lineage</span>
        </button>
      </div>

      {/* Contextual Selection Bar */}
      {activeSelection && (
        <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-blue-500/30 rounded-lg shadow-2xl p-1 px-3 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-3 mr-1">
            {table && <Database size={14} className="text-emerald-400" />}
            {domain && <Layers size={14} className="text-blue-400" />}
            {relationshipData && (
              (relationshipData.relationship.type as any) === 'lineage' 
                ? <GitGraph size={14} className="text-blue-400" />
                : <Tag size={14} className="text-amber-400" />
            )}
            
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {table ? 'Table' : domain ? 'Domain' : ((relationshipData?.relationship.type as any) === 'lineage' ? 'Lineage' : 'Relationship')}
            </span>
          </div>

          <div className="max-w-[200px] truncate">
            <span className="text-xs font-semibold text-slate-200">
              {table ? table.name : domain ? domain.name : relationshipData ? `${relationshipData.relationship.from.table} → ${relationshipData.relationship.to.table}` : ''}
            </span>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center justify-center p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-md transition-all group"
            title="Delete Selected (Del)"
          >
            <Trash2 size={14} className="group-active:scale-90 transition-transform" />
          </button>
        </div>
      )}

      {/* Add Controls */}
      <div className="flex bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl p-1 overflow-hidden">
        <button
          onClick={() => addDomain(100, 100)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-all group"
          title="Add new Domain"
        >
          <Layout size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <span>Domain</span>
          <Plus size={12} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
        </button>
        
        <div className="w-[1px] bg-slate-700 mx-1 my-1" />
        
        <button
          onClick={() => addTable(200, 200)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-all group"
          title="Add new Table"
        >
          <Grid size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Table</span>
          <Plus size={12} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
        </button>
      </div>
    </div>
  )
}

export default CanvasToolbar
