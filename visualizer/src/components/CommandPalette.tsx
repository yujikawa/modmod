import { useState, useEffect, useRef, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { Command, Search, Move, ChevronRight, Check, Info, MousePointer2, Layers } from 'lucide-react'

const CommandPalette = () => {
  const { 
    schema, 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen,
    selectedTableIds,
    bulkAssignTablesToDomain,
    setFocusNodeId,
    theme 
  } = useStore()

  const [input, setInput] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info', msg: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Base command definitions
  const baseCommands = [
    { id: 'cmd-mv-selected', label: 'Move selected to...', cmd: 'mv ', icon: <MousePointer2 size={14} />, desc: 'Assign selected tables to a domain' },
    { id: 'cmd-mv-bulk', label: 'Bulk move by pattern...', cmd: 'mv * to ', icon: <Layers size={14} />, desc: 'mv [pattern] to [domain]' },
    { id: 'cmd-search', label: 'Find table...', cmd: 'search ', icon: <Search size={14} />, desc: 'Search and focus on a table' },
  ]

  // Command Parser Logic
  const parsedCommand = useMemo(() => {
    const val = input.toLowerCase().trim()
    if (!val) return null

    if (val.startsWith('mv ')) {
      const parts = val.split(' ')
      const hasTo = parts.includes('to')
      
      if (hasTo) {
        const toIndex = parts.indexOf('to')
        const pattern = parts.slice(1, toIndex).join(' ')
        const domainId = parts.slice(toIndex + 1).join(' ')
        return { type: 'mv-bulk', pattern, domainId }
      } else {
        const domainId = parts.slice(1).join(' ')
        return { type: 'mv-selected', domainId }
      }
    }

    if (val.startsWith('search ') || val.startsWith('find ')) {
        const query = val.split(' ').slice(1).join(' ')
        return { type: 'search', query }
    }

    return { type: 'unknown', val }
  }, [input])

  // Suggestions logic
  const suggestions = useMemo(() => {
    if (!schema) return []

    // 1. Initial State: Show base commands
    if (!input) {
        return baseCommands.map(c => ({ 
            id: c.id, 
            label: c.label, 
            icon: c.icon, 
            desc: c.desc,
            action: () => setInput(c.cmd)
        }))
    }

    // 2. Command in progress: Show specific targets
    if (parsedCommand) {
        if (parsedCommand.type === 'mv-selected' || parsedCommand.type === 'mv-bulk') {
            const query = (parsedCommand as any).domainId || ''
            return (schema.domains || [])
                .map(d => d.id)
                .filter(id => id.toLowerCase().includes(query.toLowerCase()))
                .map(id => ({ 
                    id, 
                    label: `Move to ${id}`, 
                    icon: <Move size={14} />,
                    desc: parsedCommand.type === 'mv-bulk' ? `Pattern: ${(parsedCommand as any).pattern}` : 'Move selected objects',
                    action: () => handleExecute(id)
                }))
        }

        if (parsedCommand.type === 'search') {
            const query = (parsedCommand as any).query || ''
            return (schema.tables || [])
                .map(t => t.id)
                .filter(id => id.toLowerCase().includes(query.toLowerCase()))
                .map(id => ({ 
                    id, 
                    label: `Go to ${id}`, 
                    icon: <Search size={14} />,
                    desc: 'Focus on canvas',
                    action: () => handleExecute(id)
                }))
        }
    }

    return []
  }, [schema, input, parsedCommand])

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setInput('')
      setFeedback(null)
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [isCommandPaletteOpen])

  const handleExecute = (suggestionId?: string) => {
    // If we're selecting a base command from the list
    const currentSuggestion = suggestions[selectedIndex]
    if (currentSuggestion && !input) {
        currentSuggestion.action()
        return
    }

    if (!parsedCommand) return

    if (parsedCommand.type === 'mv-selected') {
      const domainId = suggestionId || (parsedCommand as any).domainId
      if (selectedTableIds.length > 0 && domainId) {
        bulkAssignTablesToDomain(selectedTableIds, domainId)
        showFeedback('success', `${selectedTableIds.length} tables moved to ${domainId}`)
        setInput('')
      } else if (selectedTableIds.length === 0) {
        showFeedback('info', 'No tables selected. Select tables on canvas first.')
      }
    } else if (parsedCommand.type === 'mv-bulk') {
      const domainId = suggestionId || (parsedCommand as any).domainId
      const pattern = (parsedCommand as any).pattern
      if (pattern && domainId) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$', 'i')
        const matchedIds = (schema?.tables || []).filter(t => regex.test(t.id)).map(t => t.id)
        if (matchedIds.length > 0) {
          bulkAssignTablesToDomain(matchedIds, domainId)
          showFeedback('success', `${matchedIds.length} tables moved to ${domainId}`)
          setInput('')
        } else {
          showFeedback('info', `No tables match "${pattern}"`)
        }
      }
    } else if (parsedCommand.type === 'search') {
        const tableId = suggestionId || (suggestions[0]?.id)
        if (tableId) {
            setFocusNodeId(tableId)
            setIsCommandPaletteOpen(false)
        }
    }
  }

  const showFeedback = (type: 'success' | 'info', msg: string) => {
    setFeedback({ type, msg })
    setTimeout(() => {
        setFeedback(null)
        if (type === 'success') setIsCommandPaletteOpen(false)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % (suggestions.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + (suggestions.length || 1)) % (suggestions.length || 1))
    } else if (e.key === 'Enter') {
      if (suggestions[selectedIndex]) {
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
      {/* Backdrop to close */}
      <div className="absolute inset-0" onClick={() => setIsCommandPaletteOpen(false)} />
      
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border-2 overflow-hidden animate-in slide-in-from-top-4 duration-300 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`flex items-center px-4 py-4 gap-3 border-b ${
          theme === 'dark' ? 'border-slate-800/50' : 'border-slate-100'
        }`}>
          <Command size={20} className="text-blue-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or select from below..."
            className={`flex-1 bg-transparent border-none outline-none text-base font-bold ${
              theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
            value={input}
            onChange={(e) => { setInput(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-1.5">
            <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-black border ${
              theme === 'dark' ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>ESC</kbd>
          </div>
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className={`px-4 py-3 flex items-center gap-2 animate-in slide-in-from-left-2 ${
            feedback.type === 'success' 
              ? (theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
              : (theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600')
          }`}>
            {feedback.type === 'success' ? <Check size={14} /> : <Info size={14} />}
            <span className="text-xs font-bold uppercase tracking-widest">{feedback.msg}</span>
          </div>
        )}

        {/* Suggestions List */}
        {!feedback && (
          <div className="max-h-[400px] overflow-auto py-2">
            {suggestions.length > 0 ? (
              suggestions.map((s, i) => (
                <div
                  key={s.id}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedIndex === i 
                      ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600')
                      : (theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-600')
                  }`}
                  onClick={() => s.action()}
                >
                  <div className="flex items-center gap-3">
                    <div className={selectedIndex === i ? 'text-white' : 'text-slate-500'}>
                      {s.icon}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold">{s.label}</span>
                        {(s as any).desc && <span className={`text-[10px] ${selectedIndex === i ? 'text-blue-100' : 'text-slate-500'}`}>{(s as any).desc}</span>}
                    </div>
                  </div>
                  {selectedIndex === i && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black opacity-50 uppercase">Enter</span>
                        <ChevronRight size={14} className="opacity-50" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              input && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-slate-500 font-medium italic">No matches found for "{input}"</p>
                </div>
              )
            )}
          </div>
        )}

        {/* Status Bar */}
        <div className={`px-4 py-2 border-t flex items-center justify-between ${
            theme === 'dark' ? 'bg-slate-950/30 border-slate-800/50' : 'bg-slate-50/50 border-slate-100'
        }`}>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                    <kbd className="px-1 rounded border border-slate-700 bg-slate-800">↑↓</kbd>
                    <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                    <kbd className="px-1 rounded border border-slate-700 bg-slate-800">Enter</kbd>
                    <span>Select</span>
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
