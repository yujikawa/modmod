import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { Search, Hash, Layers, ArrowUpRight } from 'lucide-react'

const EntitiesTab = () => {
  const { schema, setSelectedTableId, setFocusNodeId } = useStore()
  const [search, setSearch] = useState('')

  if (!schema) return null

  const filteredTables = schema.tables.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.id.toLowerCase().includes(search.toLowerCase())
  )

  const filteredDomains = schema.domains?.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.id.toLowerCase().includes(search.toLowerCase())
  ) || []

  const handleFocus = (id: string) => {
    setSelectedTableId(id);
    setFocusNodeId(id);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 pt-2">
      {/* Search Bar */}
      <div className="relative mb-4 shrink-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entities..."
          className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm"
        />
      </div>

      <div className="flex-1 space-y-6 overflow-auto pr-1">
        {/* Domains Section */}
        {filteredDomains.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2 px-1">
              <Layers size={12} className="text-slate-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Domains</h3>
            </div>
            <div className="space-y-1">
              {filteredDomains.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleFocus(d.id)}
                  className="w-full flex items-center justify-between group p-2 text-sm rounded border border-transparent hover:bg-slate-800/50 hover:border-slate-700/50 text-slate-300 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: d.color || '#3b82f6' }}
                    />
                    <span className="font-medium group-hover:text-blue-400">{d.name}</span>
                  </div>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Tables Section */}
        <section>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Hash size={12} className="text-slate-500" />
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tables</h3>
          </div>
          <div className="space-y-1">
            {filteredTables.map(t => (
              <button
                key={t.id}
                onClick={() => handleFocus(t.id)}
                className="w-full flex items-center justify-between group p-2 text-sm rounded border border-transparent hover:bg-slate-800/50 hover:border-slate-700/50 text-slate-300 transition-all text-left"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="truncate font-medium group-hover:text-blue-400">{t.name}</span>
                  <span className="text-[10px] text-slate-500 shrink-0">({t.columns?.length || 0})</span>
                </div>
                <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity" />
              </button>
            ))}
          </div>
        </section>
        
        {filteredTables.length === 0 && filteredDomains.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500 italic">No entities found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EntitiesTab
