import { useState } from 'react'
import { Layout, Grid, Trash2, Tag, Database, GitGraph, Network, X, Eye, Plus, CircleHelp, Command, Undo2, Redo2, Lock, Move, LayoutTemplate, MousePointer2 } from 'lucide-react'
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
    setSelectedEdgeId,
    calculateAutoLayout,
    theme
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
        <div className={`flex flex-col border rounded-2xl shadow-2xl overflow-hidden w-14 transition-colors ${
          theme === 'dark' ? 'bg-slate-900/85 backdrop-blur-md border-slate-700' : 'bg-white/90 backdrop-blur-md border-slate-200'
        }`}>
          
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
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                    : theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title={showER ? "Hide ER Relationships" : "Show ER Relationships (Disables editing if Lineage is also ON)"}
              >
                <Network size={20} />
              </button>
              <button
                onClick={() => setShowLineage(!showLineage)}
                className={`flex items-center justify-center w-full aspect-square rounded-xl transition-all ${
                  showLineage 
                    ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' 
                    : theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title={showLineage ? "Hide Data Lineage" : "Show Data Lineage (Disables editing if ER is also ON)"}
              >
                <GitGraph size={20} />
              </button>
            </div>
          </div>

          <div className={`mx-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`} />

          {/* Add Section */}
          <div className="flex flex-col items-center py-3 gap-2">
            <div className="flex flex-col items-center text-[8px] font-bold text-slate-500 uppercase tracking-tighter opacity-80">
              <Plus size={12} />
              <span>Add</span>
            </div>
            <div className="flex flex-col gap-1 px-1.5 w-full">
              <button
                onClick={handleAddDomain}
                className={`flex items-center justify-center w-full aspect-square rounded-xl transition-all group relative ${
                  isEditingDisabled 
                    ? 'opacity-40 cursor-not-allowed text-slate-500' 
                    : theme === 'dark' ? 'text-slate-500 hover:text-blue-400 hover:bg-slate-800' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
                }`}
                title={isEditingDisabled ? "Addition locked while ER & Lineage are both active" : "Add new Domain"}
              >
                <Layout size={20} />
                {isEditingDisabled && <Lock size={10} className="absolute bottom-1 right-1 text-slate-500" />}
              </button>
              
              <button
                onClick={handleAddTable}
                className={`flex items-center justify-center w-full aspect-square rounded-xl transition-all group relative ${
                  isEditingDisabled 
                    ? 'opacity-40 cursor-not-allowed text-slate-500' 
                    : theme === 'dark' ? 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800' : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                }`}
                title={isEditingDisabled ? "Addition locked while ER & Lineage are both active" : "Add new Table"}
              >
                <Grid size={20} />
                {isEditingDisabled && <Lock size={10} className="absolute bottom-1 right-1 text-slate-500" />}
              </button>
            </div>
          </div>

          <div className={`mx-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`} />

          {/* Format Section */}
          <div className="flex flex-col items-center py-3 gap-2">
            <div className="flex flex-col items-center text-[8px] font-bold text-slate-500 uppercase tracking-tighter opacity-80">
              <LayoutTemplate size={12} />
              <span>Format</span>
            </div>
            <div className="flex flex-col gap-1 px-1.5 w-full">
              <button
                onClick={() => calculateAutoLayout()}
                className={`flex items-center justify-center w-full aspect-square rounded-xl transition-all group ${
                  theme === 'dark' ? 'text-slate-500 hover:text-blue-400 hover:bg-slate-800' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                }`}
                title="Auto-format Layout (Relation-driven flow)"
              >
                <LayoutTemplate size={20} />
              </button>
            </div>
          </div>

          <div className={`mx-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`} />

          {/* Help Section */}
          <div className="flex flex-col items-center py-3">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                showHelp 
                  ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white shadow-md shadow-blue-500/20') 
                  : (theme === 'dark' ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600')
              }`}
              title="Keyboard Shortcuts & Help"
            >
              <CircleHelp size={20} />
            </button>
          </div>
        </div>

        {/* Shortcut Guide Overlay */}
        {showHelp && (
          <div className={`flex flex-col border rounded-2xl shadow-2xl p-5 w-64 animate-in zoom-in-95 fade-in duration-200 origin-top-left ${
            theme === 'dark' ? 'bg-slate-900/95 backdrop-blur-xl border-slate-700' : 'bg-white/95 backdrop-blur-xl border-slate-200'
          }`}>
            <div className={`flex items-center gap-2 mb-4 border-b pb-3 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
              <Command size={16} className="text-blue-500" />
              <h4 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Shortcuts</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-500">
                  <Undo2 size={14} />
                  <span className="text-xs font-medium">Undo</span>
                </div>
                <kbd className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Ctrl Z</kbd>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-500">
                  <Redo2 size={14} />
                  <span className="text-xs font-medium">Redo</span>
                </div>
                <kbd className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Ctrl Y</kbd>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-500">
                  <Trash2 size={14} />
                  <span className="text-xs font-medium text-red-500/80">Delete</span>
                </div>
                <kbd className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300 text-red-400/80' : 'bg-slate-50 border-slate-200 text-red-600/80'}`}>Del</kbd>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-500">
                  <X size={14} />
                  <span className="text-xs font-medium">Clear Focus</span>
                </div>
                <kbd className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Esc</kbd>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-500">
                  <Move size={14} />
                  <span className="text-xs font-medium">Pan Canvas</span>
                </div>
                <span className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Arrow Keys</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-slate-500">
                  <MousePointer2 size={14} />
                  <span className="text-xs font-medium">Multi-select</span>
                </div>
                <span className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>Shift + Drag</span>
              </div>
            </div>

            <div className={`mt-5 pt-3 border-t text-[10px] text-slate-400 italic leading-relaxed ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
              * Edits are saved to local YAML files in real-time if Auto-save is enabled.
            </div>
          </div>
        )}
      </div>

      {/* 2. Contextual Selection Bar (Top Right) */}
      {activeSelection && (
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
      )}
    </>
  )
}

export default CanvasToolbar
