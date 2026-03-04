import { Layout, Grid, Trash2, Tag, Layers, Database, GitGraph, Network, X, Eye, Plus } from 'lucide-react'
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
    showER,
    showLineage,
    setShowER,
    setShowLineage,
    setSelectedTableId,
    setSelectedEdgeId
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
  }

  const handleClearSelection = () => {
    setSelectedTableId(null)
    setSelectedEdgeId(null)
  }

  return (
    <>
      {/* 1. Permanent Vertical Toolbox (Left side - Top aligned to avoid DetailPanel collision) */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex flex-col bg-slate-900/85 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden w-14">
          
          {/* View Section */}
          <div className="flex flex-col items-center py-3 gap-2">
            <div className="flex flex-col items-center text-[8px] font-bold text-slate-500 uppercase tracking-tighter opacity-80">
              <Eye size={12} />
              <span>View</span>
            </div>
            <div className="flex flex-col gap-1 px-1.5 w-full">
              <button
                onClick={() => setShowER(!showER)}
                className={`flex items-center justify-center w-full aspect-square rounded-xl transition-all ${
                  showER 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-transparent'
                }`}
                title={showER ? "Hide ER Relationships" : "Show ER Relationships"}
              >
                <Network size={20} />
              </button>
              <button
                onClick={() => setShowLineage(!showLineage)}
                className={`flex items-center justify-center w-full aspect-square rounded-xl transition-all ${
                  showLineage 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-transparent'
                }`}
                title={showLineage ? "Hide Data Lineage" : "Show Data Lineage"}
              >
                <GitGraph size={20} />
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 mx-2" />

          {/* Add Section */}
          <div className="flex flex-col items-center py-3 gap-2">
            <div className="flex flex-col items-center text-[8px] font-bold text-slate-500 uppercase tracking-tighter opacity-80">
              <Plus size={12} />
              <span>Add</span>
            </div>
            <div className="flex flex-col gap-1 px-1.5 w-full">
              <button
                onClick={() => addDomain(100, 100)}
                className="flex items-center justify-center w-full aspect-square text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all group"
                title="Add new Domain"
              >
                <Layout size={20} />
              </button>
              
              <button
                onClick={() => addTable(200, 200)}
                className="flex items-center justify-center w-full aspect-square text-slate-500 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-all group"
                title="Add new Table"
              >
                <Grid size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Contextual Selection Bar (Top Right) */}
      {activeSelection && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-2xl p-1.5 px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4 mr-1">
            {table && <Database size={16} className="text-emerald-400" />}
            {domain && <Layers size={16} className="text-blue-400" />}
            {relationshipData && (
              ((relationshipData.relationship.type as any) === 'lineage') 
                ? <GitGraph size={16} className="text-blue-400" />
                : <Tag size={16} className="text-amber-400" />
            )}
            
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Selected {table ? 'Table' : domain ? 'Domain' : (((relationshipData?.relationship.type as any) === 'lineage') ? 'Lineage' : 'Relation')}
              </span>
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[180px]">
                {table ? table.name : domain ? domain.name : relationshipData ? `${relationshipData.relationship.from.table} → ${relationshipData.relationship.to.table}` : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              className="flex items-center justify-center w-8 h-8 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all group"
              title="Delete Selected (Del)"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={handleClearSelection}
              className="flex items-center justify-center w-8 h-8 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-lg transition-all"
              title="Clear Selection"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CanvasToolbar
