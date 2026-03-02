import { Plus, Layout, Grid } from 'lucide-react'
import { useStore } from '../store/useStore'

const CanvasToolbar = () => {
  const { addTable, addDomain } = useStore()

  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <div className="flex bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl p-1 overflow-hidden">
        <button
          onClick={() => addDomain(100, 100)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-all group"
          title="Add new Domain"
        >
          <Layout size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <span>Domain</span>
        </button>
        
        <div className="w-[1px] bg-slate-700 mx-1 my-1" />
        
        <button
          onClick={() => addTable(200, 200)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-all group"
          title="Add new Table"
        >
          <Grid size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Table</span>
        </button>
      </div>

      {/* Quick Add Indicator */}
      <div className="bg-blue-600 rounded-lg p-2 shadow-lg flex items-center justify-center">
        <Plus size={18} className="text-white" />
      </div>
    </div>
  )
}

export default CanvasToolbar
