import { useState } from 'react'
import { Layout, Grid, Trash2, Tag, Database, GitGraph, Network, X, Eye, Plus, CircleHelp, Command, Undo2, Redo2, MousePointer2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useReactFlow } from 'reactflow'

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

  const { screenToFlowPosition } = useReactFlow()
  const [showHelp, setShowHelp] = useState(false)

  const isEditingDisabled = showER && showLineage

  const handleAddDomain = () => {
    if (isEditingDisabled) return
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
    addDomain(center.x - 300, center.y - 200)
  }

  const handleAddTable = () => {
    if (isEditingDisabled) return
    const center = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
    addTable(center.x - 160, center.y - 125)
  }

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
      {/* 1. Permanent Vertical Toolbox (Left side) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
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
                title={showER ? "Hide ER Relationships" : "Show ER Relationships (Disables editing if Lineage is also ON)"}
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
                title={showLineage ? "Hide Data Lineage" : "Show Data Lineage (Disables editing if ER is also ON)"}
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
                onClick={handleAddDomain}
                className="flex items-center justify-center w-full aspect-square text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all group"
                title="Add new Domain"
              >
                <Layout size={20} />
              </button>
              
              <button
                onClick={handleAddTable}
                className="flex items-center justify-center w-full aspect-square text-slate-500 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-all group"
                title="Add new Table"
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 mx-2" />

          {/* Help Section */}
          <div className="flex flex-col items-center py-3">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                showHelp ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
              title="Keyboard Shortcuts & Help"
            >
              <CircleHelp size={20} />
            </button>
          </div>
        </div>

        {/* Shortcut Guide Overlay */}
        {showHelp && (
          <div className="flex flex-col bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-5 w-64 animate-in zoom-in-95 fade-in duration-200 origin-top-left">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <Command size={16} className="text-blue-400" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Shortcuts</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-400">
                  <Undo2 size={14} />
                  <span className="text-xs font-medium">Undo</span>
                </div>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">Ctrl Z</kbd>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-400">
                  <Redo2 size={14} />
                  <span className="text-xs font-medium">Redo</span>
                </div>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">Ctrl Y</kbd>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-400">
                  <Trash2 size={14} />
                  <span className="text-xs font-medium text-red-400/80">Delete</span>
                </div>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300 text-red-400/80">Del</kbd>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-400">
                  <X size={14} />
                  <span className="text-xs font-medium">Clear Focus</span>
                </div>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">Esc</kbd>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-400">
                  <MousePointer2 size={14} />
                  <span className="text-xs font-medium">Multi-select</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Shift + Drag</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] text-slate-500 italic leading-relaxed">
              * Edits are saved to local YAML files in real-time if Auto-save is enabled.
            </div>
          </div>
        )}
      </div>

      {/* 2. Contextual Selection Bar (Top Right) */}
      {activeSelection && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-2xl p-1.5 px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4 mr-1">
            {table && <Database size={16} className="text-emerald-400" />}
            {domain && <Layout size={16} className="text-blue-400" />}
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
