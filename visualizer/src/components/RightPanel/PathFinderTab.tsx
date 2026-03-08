import { useState, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { 
  Search, 
  GitGraph, 
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { findShortestPath, type PathStep } from '../../lib/graph'

const PathFinderTab = () => {
  const { 
    schema, 
    theme,
    setPathFinderResult,
    setFocusNodeId
  } = useStore()

  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [path, setPath] = useState<PathStep[] | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const tables = useMemo(() => schema?.tables || [], [schema])

  const handleFindPath = () => {
    if (!schema || !fromId || !toId) return
    
    const result = findShortestPath(schema, fromId, toId)
    setPath(result)
    setHasSearched(true)

    if (result) {
      const nodeIds = Array.from(new Set([fromId, ...result.map(s => s.to)]))
      const edgeIds = result.map(s => s.edge.id)
      setPathFinderResult({ nodeIds, edgeIds })
    } else {
      setPathFinderResult(null)
    }
  }

  const clearPath = () => {
    setPath(null)
    setHasSearched(false)
    setPathFinderResult(null)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4">
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">From Table</label>
          <select 
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className={`w-full p-2 rounded-md text-sm border shadow-sm focus:ring-1 focus:ring-blue-500/50 outline-none ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <option value="">Select source...</option>
            {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">To Table</label>
          <select 
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className={`w-full p-2 rounded-md text-sm border shadow-sm focus:ring-1 focus:ring-blue-500/50 outline-none ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <option value="">Select target...</option>
            {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button 
            onClick={handleFindPath}
            disabled={!fromId || !toId}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${
              (!fromId || !toId)
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-95'
            }`}
          >
            <Search size={14} />
            FIND PATH
          </button>
          {hasSearched && (
            <button 
              onClick={clearPath}
              className={`p-2 rounded-md border transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${
                theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-1">
        {hasSearched && !path && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle size={32} className="text-slate-300 mb-2" />
            <p className="text-sm text-slate-500 italic">No path found between these tables.</p>
          </div>
        )}

        {path && (
          <div className="space-y-1">
            <div className={`p-3 rounded-lg border border-l-4 border-l-blue-500 mb-4 ${
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-blue-50/50 border-blue-100'
            }`}>
              <p className="text-xs font-medium text-slate-500">Path found with <span className="font-bold text-blue-500">{path.length}</span> steps</p>
            </div>

            <div className="relative pl-4 space-y-0">
              <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />
              
              {/* Start Node */}
              <div className="relative mb-4">
                <div className="absolute -left-[15px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                <button 
                  onClick={() => setFocusNodeId(fromId)}
                  className="text-xs font-bold hover:text-blue-500 transition-colors"
                >
                  {tables.find(t => t.id === fromId)?.name}
                </button>
              </div>

              {/* Steps */}
              {path.map((step, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center gap-2 my-2 py-1 px-2 rounded bg-slate-100 dark:bg-slate-800/50 w-fit">
                    {step.edge.type === 'er' ? (
                      <Database size={10} className="text-emerald-500" />
                    ) : (
                      <GitGraph size={10} className="text-blue-400" />
                    )}
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                      {step.edge.type === 'er' ? `ER (${step.edge.metadata.type})` : 'Lineage'}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[15px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900" />
                    <button 
                      onClick={() => setFocusNodeId(step.to)}
                      className="text-xs font-bold hover:text-blue-500 transition-colors"
                    >
                      {tables.find(t => t.id === step.to)?.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PathFinderTab
