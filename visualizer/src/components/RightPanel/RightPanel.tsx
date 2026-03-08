import { useStore } from '../../store/useStore'
import { 
  ListTree,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  HelpCircle,
  Search,
  ChevronLeft
} from 'lucide-react'
import { useState, useMemo } from 'react'
import type { Table } from '../../types/schema'

const RightPanel = () => {
  const { 
    schema, 
    isRightPanelOpen, 
    setIsRightPanelOpen, 
    theme,
    setSelectedTableId,
    setFocusNodeId
  } = useStore()

  const [search, setSearch] = useState('')
  const [collapsedDomains, setCollapsedDomains] = useState<Set<string>>(new Set())

  const toggleDomain = (id: string) => {
    const newCollapsed = new Set(collapsedDomains)
    if (newCollapsed.has(id)) {
      newCollapsed.delete(id)
    } else {
      newCollapsed.add(id)
    }
    setCollapsedDomains(newCollapsed)
  }

  const handleFocus = (id: string) => {
    setSelectedTableId(id);
    setFocusNodeId(id);
  }

  // Grouping Logic (Mirrored from EntitiesTab)
  const groupedData = useMemo(() => {
    if (!schema) return { domains: [], unassigned: [] }

    const domainMap: Record<string, Table[]> = {}
    const assignedTableIds = new Set<string>()

    schema.domains?.forEach(d => { domainMap[d.id] = [] })

    schema.tables.forEach(table => {
      const parentDomain = schema.domains?.find(d => d.tables.includes(table.id))
      const matchesSearch = table.name.toLowerCase().includes(search.toLowerCase()) || 
                           table.id.toLowerCase().includes(search.toLowerCase())

      if (matchesSearch) {
        if (parentDomain) {
          domainMap[parentDomain.id].push(table)
          assignedTableIds.add(table.id)
        }
      }
    })

    const filteredDomains = (schema.domains || []).filter(d => {
      const hasMatchingTables = domainMap[d.id].length > 0
      const domainMatchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                                 d.id.toLowerCase().includes(search.toLowerCase())
      return hasMatchingTables || (domainMatchesSearch && search !== '')
    }).map(d => ({
      ...d,
      tables: domainMap[d.id]
    }))

    const unassignedTables = schema.tables.filter(t => {
      const isMatch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                     t.id.toLowerCase().includes(search.toLowerCase())
      return isMatch && !assignedTableIds.has(t.id) && !schema.domains?.some(d => d.tables.includes(t.id))
    })

    return { domains: filteredDomains, unassigned: unassignedTables }
  }, [schema, search])

  const iconClass = (isActive: boolean) => `
    flex items-center justify-center w-10 h-10 rounded-xl transition-all relative group
    ${isActive 
      ? 'bg-blue-600/10 text-blue-500 shadow-inner' 
      : theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
    }
  `

  return (
    <div 
      className={`relative h-full flex flex-row transition-all duration-300 ease-in-out shadow-2xl z-50 ${
        isRightPanelOpen ? 'w-[456px]' : 'w-14'
      }`}
    >
      {/* 1. Activity Bar (Right side of the Right Panel - Always Visible) */}
      <div className={`w-14 h-full flex flex-col items-center py-4 border-l transition-colors z-50 ${
        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <button 
          onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
          className={`mb-6 p-2 rounded-xl transition-all ${
            theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-white hover:shadow-md text-slate-500 hover:text-slate-900'
          }`}
        >
          {isRightPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className="flex flex-col gap-2 mb-6">
          <button 
            onClick={() => setIsRightPanelOpen(true)}
            className={iconClass(isRightPanelOpen)}
          >
            <ListTree size={20} />
            <div className="absolute right-14 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60] border border-slate-700 shadow-xl">
              Entities
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-slate-800" />
            </div>
          </button>
        </div>
      </div>

      {/* 2. Content Panel (Right side of the Right Panel) */}
      <div 
        className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${
          theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        } ${
          isRightPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ width: isRightPanelOpen ? '400px' : '0px' }}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <h2 className={`text-base font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Entities</h2>
        </div>

        {/* Search & List */}
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          <div className="relative mb-4 shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entities..."
              className={`w-full pl-9 pr-4 py-2 rounded-md text-sm transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
              }`}
            />
          </div>

          <div className="flex-1 space-y-4 overflow-auto pr-1">
            {/* Domains Group */}
            {groupedData.domains.map(d => {
              const isCollapsed = collapsedDomains.has(d.id)
              return (
                <section key={d.id} className="flex flex-col">
                  <div 
                    className={`flex items-center justify-between group px-1 py-1.5 cursor-pointer rounded transition-colors ${
                      theme === 'dark' ? 'hover:bg-slate-800/30' : 'hover:bg-slate-100'
                    }`}
                    onClick={() => toggleDomain(d.id)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {isCollapsed ? <ChevronRight size={12} className="text-slate-500" /> : <ChevronDown size={12} className="text-slate-500" />}
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color || '#3b82f6' }} />
                      <h3 className={`text-[10px] font-bold uppercase tracking-wider truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{d.name}</h3>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${theme === 'dark' ? 'text-slate-600 bg-slate-800/50' : 'text-slate-400 bg-slate-100'}`}>{d.tables.length}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleFocus(d.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-blue-500 text-slate-500 transition-all"><ArrowUpRight size={12} /></button>
                  </div>
                  {!isCollapsed && (
                    <div className={`ml-4 mt-1 space-y-0.5 border-l pl-2 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                      {d.tables.map(t => (
                        <button key={t.id} onClick={() => handleFocus(t.id)} className={`w-full flex items-center justify-between group p-1.5 text-xs rounded border border-transparent transition-all text-left ${theme === 'dark' ? 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200' : 'hover:bg-blue-50 text-slate-500 hover:text-blue-600'}`}>
                          <span className="truncate">{t.name}</span>
                          <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                      {d.tables.length === 0 && <div className="p-2 text-[10px] text-slate-500 italic">No tables</div>}
                    </div>
                  )}
                </section>
              )
            })}

            {/* Unassigned Group */}
            {groupedData.unassigned.length > 0 && (
              <section className="flex flex-col">
                <div 
                  className={`flex items-center justify-between group px-1 py-1.5 cursor-pointer rounded transition-colors ${
                    theme === 'dark' ? 'hover:bg-slate-800/30' : 'hover:bg-slate-100'
                  }`}
                  onClick={() => toggleDomain('unassigned')}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {collapsedDomains.has('unassigned') ? <ChevronRight size={12} className="text-slate-500" /> : <ChevronDown size={12} className="text-slate-500" />}
                    <HelpCircle size={12} className="text-slate-500 shrink-0" />
                    <h3 className={`text-[10px] font-bold uppercase tracking-wider truncate ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Unassigned</h3>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${theme === 'dark' ? 'text-slate-600 bg-slate-800/50' : 'text-slate-400 bg-slate-100'}`}>{groupedData.unassigned.length}</span>
                  </div>
                </div>
                {!collapsedDomains.has('unassigned') && (
                  <div className={`ml-4 mt-1 space-y-0.5 border-l pl-2 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                    {groupedData.unassigned.map(t => (
                      <button key={t.id} onClick={() => handleFocus(t.id)} className={`w-full flex items-center justify-between group p-1.5 text-xs rounded border border-transparent transition-all text-left ${theme === 'dark' ? 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200' : 'hover:bg-blue-50 text-slate-500 hover:text-blue-600'}`}>
                        <span className="truncate">{t.name}</span>
                        <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightPanel
