import { Trash2, X, Database, Layout, GitGraph, Tag } from 'lucide-react'
import { useStore } from '../store/useStore'

const SelectionToolbar = () => {
  const { 
    getSelectedTable, 
    getSelectedDomain, 
    getSelectedRelationship,
    removeNode,
    removeEdge,
    setSelectedTableId,
    setSelectedEdgeId,
    setSelectedAnnotationId,
    theme
  } = useStore()

  const table = getSelectedTable()
  const domain = getSelectedDomain()
  const relationshipData = getSelectedRelationship()

  const activeSelection = table || domain || relationshipData

  if (!activeSelection) return null

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
    setSelectedAnnotationId(null)
  }

  return (
    <div className={`absolute top-4 right-4 z-10 flex items-center gap-3 border rounded-xl shadow-2xl p-1.5 px-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
      theme === 'dark' ? 'bg-slate-900/90 backdrop-blur-md border-blue-500/30' : 'bg-white/90 backdrop-blur-md border-blue-200 shadow-blue-500/5'
    }`}>
      <div className={`flex items-center gap-2 border-r pr-4 mr-1 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
        {table && <Database size={16} className="text-emerald-500" />}
        {domain && <Layout size={16} className="text-blue-500" />}
        {relationshipData && (
          ((relationshipData.relationship.type as any) === 'lineage') 
            ? <GitGraph size={16} className="text-blue-400" />
            : <Tag size={16} className="text-amber-500" />
        )}
        
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Selected {table ? 'Table' : domain ? 'Domain' : (((relationshipData?.relationship.type as any) === 'lineage') ? 'Lineage' : 'Relation')}
          </span>
          <span className={`text-xs font-semibold truncate max-w-[180px] ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
            {table ? table.name : domain ? domain.name : relationshipData ? `${relationshipData.relationship.from.table} → ${relationshipData.relationship.to.table}` : ''}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="flex items-center justify-center w-8 h-8 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all group"
          title="Delete Selected (Del)"
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={handleClearSelection}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
            theme === 'dark' ? 'hover:bg-slate-800 text-slate-500 hover:text-slate-300' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
          }`}
          title="Clear Selection"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default SelectionToolbar
