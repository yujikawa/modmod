import { useState, useEffect, useRef, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { useReactFlow } from 'reactflow'
import { 
  Command, 
  Search, 
  Move, 
  ChevronRight, 
  Check, 
  Info, 
  Plus, 
  Sun,
  Maximize,
  LayoutTemplate
} from 'lucide-react'

const CommandPalette = () => {
  const { 
    schema, 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen,
    selectedTableIds,
    setSelectedTableIds,
    bulkAssignTablesToDomain,
    setFocusNodeId,
    addTable,
    addDomain,
    toggleTheme,
    calculateAutoLayout,
    theme 
  } = useStore()

  const { fitView } = useReactFlow()
  const [input, setInput] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info', msg: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // 1. Parser: Understand what the user is typing
  const parsed = useMemo(() => {
    const val = input.trim()
    const lowVal = val.toLowerCase()
    if (!val) return { type: 'empty' }

    if (lowVal === 'fit') return { type: 'fit' }
    if (lowVal === 'layout' || lowVal === 'auto') return { type: 'layout' }
    if (lowVal === 'clear' || lowVal === 'cls') return { type: 'clear' }

    if (lowVal.startsWith('mv ')) {
      const parts = val.split(/\s+/)
      const toIndex = parts.findIndex(p => p.toLowerCase() === 'to')
      if (toIndex > -1) {
        return { type: 'mv-bulk', pattern: parts.slice(1, toIndex).join(' '), domainId: parts.slice(toIndex + 1).join(' ') }
      }
      return { type: 'mv-selected', domainId: parts.slice(1).join(' ') }
    }

    if (lowVal.startsWith('add table ')) return { type: 'add-table', name: val.substring(10).trim() }
    if (lowVal.startsWith('add domain ')) return { type: 'add-domain', name: val.substring(11).trim() }
    if (lowVal.startsWith('theme ')) return { type: 'theme', mode: lowVal.split(/\s+/)[1] }
    if (lowVal.startsWith('search ')) return { type: 'search', query: val.substring(7).trim() }
    if (lowVal.startsWith('find ')) return { type: 'search', query: val.substring(5).trim() }

    return { type: 'search', query: val, isImplicit: true }
  }, [input])

  // 2. Suggestions
  const suggestions = useMemo(() => {
    if (!schema) return []

    if (parsed.type === 'empty') {
      return [
        { id: 'search', label: 'Find table...', icon: <Search size={14} />, desc: 'Search and jump to entity', action: () => setInput('search ') },
        { id: 'add-table', label: 'Add table...', icon: <Plus size={14} />, desc: 'Create a new table node', action: () => setInput('add table ') },
        { id: 'add-domain', label: 'Add domain...', icon: <Plus size={14} />, desc: 'Create a new domain container', action: () => setInput('add domain ') },
        { id: 'mv', label: 'Move tables...', icon: <Move size={14} />, desc: 'Move selected or by pattern (mv * to ...)', action: () => setInput('mv ') },
        { id: 'layout', label: 'Auto Layout', icon: <LayoutTemplate size={14} />, desc: 'Organize canvas', action: () => handleExecute({ type: 'layout' }) },
        { id: 'fit', label: 'Fit View', icon: <Maximize size={14} />, desc: 'Show entire model', action: () => handleExecute({ type: 'fit' }) },
        { id: 'theme', label: 'Switch Theme', icon: <Sun size={14} />, desc: 'Toggle dark/light mode', action: () => setInput('theme ') },
      ]
    }

    if (parsed.type === 'search') {
      const q = (parsed as any).query.toLowerCase()
      return schema.tables
        .filter(t => t.id.toLowerCase().includes(q) || t.name.toLowerCase().includes(q))
        .slice(0, 15)
        .map(t => ({
          id: t.id,
          label: `Go to ${t.name}`,
          icon: <Search size={14} />,
          desc: t.id,
          action: () => { setFocusNodeId(t.id); setIsCommandPaletteOpen(false); }
        }))
    }

    if (parsed.type === 'mv-selected' || parsed.type === 'mv-bulk') {
      const q = (parsed as any).domainId.toLowerCase()
      const isBulk = parsed.type === 'mv-bulk'
      const domainSuggestions = (schema.domains || [])
        .filter(d => d.id.toLowerCase().includes(q))
        .map(d => ({
          id: d.id,
          label: `Move to ${d.name}`,
          icon: <Move size={14} />,
          desc: isBulk ? `Pattern: ${(parsed as any).pattern}` : `${selectedTableIds.length} tables selected`,
          action: () => handleExecute({ ...parsed, domainId: d.id })
        }))
      
      if (!isBulk && selectedTableIds.length === 0) {
          return [{ id: 'hint', label: 'No tables selected', icon: <Info size={14} />, desc: 'Select tables on canvas first', action: () => {} }]
      }
      return domainSuggestions
    }

    if (parsed.type === 'theme') {
      const q = (parsed as any).mode || ''
      return ['dark', 'light']
        .filter(m => m.includes(q))
        .map(m => ({
          id: m,
          label: `Switch to ${m} mode`,
          icon: <Sun size={14} />,
          desc: 'UI Theme',
          action: () => { if (theme !== m) toggleTheme(); setIsCommandPaletteOpen(false); }
        }))
    }

    if (parsed.type === 'add-table' || parsed.type === 'add-domain') {
        const name = (parsed as any).name
        return [{
            id: 'exec',
            label: `Create ${parsed.type === 'add-table' ? 'table' : 'domain'} "${name || '...'}"`,
            icon: <Plus size={14} />,
            desc: 'Press Enter to create at center',
            action: () => handleExecute(parsed)
        }]
    }

    return []
  }, [schema, parsed, selectedTableIds, theme])

  // Automatic scrolling when index changes
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex])

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setInput('')
      setFeedback(null)
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [isCommandPaletteOpen])

  const handleExecute = (cmdOverride?: any) => {
    const cmd = cmdOverride || parsed
    
    switch (cmd.type) {
      case 'fit':
        fitView({ duration: 800 })
        showFeedback('success', 'View fitted')
        break
      case 'layout':
        calculateAutoLayout()
        showFeedback('success', 'Auto layout applied')
        break
      case 'clear':
        setSelectedTableIds([])
        showFeedback('success', 'Selection cleared')
        break
      case 'search':
        if (suggestions[selectedIndex]?.id !== 'hint') {
            suggestions[selectedIndex]?.action()
        }
        break
      case 'mv-selected':
        if (selectedTableIds.length > 0 && cmd.domainId) {
          bulkAssignTablesToDomain(selectedTableIds, cmd.domainId)
          showFeedback('success', `${selectedTableIds.length} tables moved to ${cmd.domainId}`)
        } else if (selectedTableIds.length === 0) {
          showFeedback('info', 'First, select tables on canvas')
        }
        break
      case 'mv-bulk':
        if (cmd.pattern && cmd.domainId) {
          const regex = new RegExp('^' + cmd.pattern.replace(/\*/g, '.*') + '$', 'i')
          const matchedIds = (schema?.tables || []).filter(t => regex.test(t.id)).map(t => t.id)
          if (matchedIds.length > 0) {
            bulkAssignTablesToDomain(matchedIds, cmd.domainId)
            showFeedback('success', `${matchedIds.length} tables moved to ${cmd.domainId}`)
          } else {
            showFeedback('info', `No tables match "${cmd.pattern}"`)
          }
        }
        break
      case 'add-table':
        if (cmd.name) {
          addTable(400, 300, cmd.name)
          showFeedback('success', `Table "${cmd.name}" created`)
        }
        break
      case 'add-domain':
        if (cmd.name) {
          addDomain(400, 300, cmd.name)
          showFeedback('success', `Domain "${cmd.name}" created`)
        }
        break
    }
  }

  const showFeedback = (type: 'success' | 'info', msg: string) => {
    setFeedback({ type, msg })
    setTimeout(() => {
      setFeedback(null)
      if (type === 'success') setIsCommandPaletteOpen(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Escape') setIsCommandPaletteOpen(false)
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % (suggestions.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + (suggestions.length || 1)) % (suggestions.length || 1))
    } else if (e.key === 'Enter') {
      if (suggestions[selectedIndex] && parsed.type !== 'add-table' && parsed.type !== 'add-domain') {
        suggestions[selectedIndex].action()
      } else {
        handleExecute()
      }
    }
  }

  if (!isCommandPaletteOpen) return null

  return (
    <div className={`fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-[2px] animate-in fade-in duration-200 ${
      theme === 'dark' ? 'bg-slate-950/20' : 'bg-white/20'
    }`}>
      <div className="absolute inset-0" onClick={() => setIsCommandPaletteOpen(false)} />
      
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border-2 overflow-hidden animate-in slide-in-from-top-4 duration-300 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`flex items-center px-4 py-4 gap-3 border-b ${
          theme === 'dark' ? 'border-slate-800/50' : 'border-slate-100'
        }`}>
          <Command size={20} className="text-blue-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type anything to search or a command (mv, add, theme...)"
            className={`flex-1 bg-transparent border-none outline-none text-base font-bold ${
              theme === 'dark' ? 'placeholder-slate-500' : 'placeholder-slate-400'
            }`}
            value={input}
            onChange={(e) => { setInput(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-black border ${
            theme === 'dark' ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}>ESC</kbd>
        </div>

        {feedback && (
          <div className={`px-4 py-3 flex items-center gap-2 animate-in slide-in-from-left-2 ${
            feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
          }`}>
            {feedback.type === 'success' ? <Check size={14} /> : <Info size={14} />}
            <span className="text-xs font-bold uppercase tracking-widest">{feedback.msg}</span>
          </div>
        )}

        {!feedback && (
          <div ref={listRef} className="max-h-[400px] overflow-auto py-2 scroll-smooth">
            {suggestions.length > 0 ? (
              suggestions.map((s, i) => (
                <div
                  key={s.id}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedIndex === i ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-600')
                  }`}
                  onClick={() => s.action()}
                >
                  <div className="flex items-center gap-3">
                    <div className={selectedIndex === i ? 'text-white' : 'text-slate-500'}>{s.icon}</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{s.label}</span>
                      {s.desc && <span className={`text-[10px] ${selectedIndex === i ? 'text-blue-100' : 'text-slate-500'}`}>{s.desc}</span>}
                    </div>
                  </div>
                  {selectedIndex === i && s.id !== 'hint' && <ChevronRight size={14} className="opacity-50" />}
                </div>
              ))
            ) : (
              input && (
                <div className="px-4 py-8 text-center text-slate-500 italic text-sm">No matches found. Try searching for a table name.</div>
              )
            )}
          </div>
        )}

        <div className={`px-4 py-2 border-t flex items-center justify-between ${
          theme === 'dark' ? 'bg-slate-950/30 border-slate-800/50' : 'bg-slate-50/50 border-slate-100'
        }`}>
          <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase">
            <div className="flex items-center gap-1">
              <kbd className={`px-1 rounded border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className={`px-1 rounded border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>Enter</kbd>
              <span>Execute</span>
            </div>
          </div>
          {selectedTableIds.length > 0 && (
            <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest animate-pulse">
              {selectedTableIds.length} objects targetable
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
