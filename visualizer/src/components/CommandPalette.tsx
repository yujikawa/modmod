import { memo, useState, useEffect, useRef, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { useShallow } from 'zustand/react/shallow'
import {
  Command,
  Search,
  ChevronRight,
  Check,
  Info,
  Plus,
  Sun,
  Maximize,
  Zap,
  MousePointer2,
  Move
} from 'lucide-react'

const CommandPalette = memo(() => {
  const {
    schema,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    executePipeline,
    setHighlightedNodeIds,
    setFocusNodeId,
    theme
  } = useStore(useShallow((s) => ({
    schema: s.schema,
    isCommandPaletteOpen: s.isCommandPaletteOpen,
    setIsCommandPaletteOpen: s.setIsCommandPaletteOpen,
    executePipeline: s.executePipeline,
    setHighlightedNodeIds: s.setHighlightedNodeIds,
    setFocusNodeId: s.setFocusNodeId,
    theme: s.theme,
  })))

  const [input, setInput] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info', msg: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // 1. Pipeline Analysis: Real-time calculation of stages
  const pipeline = useMemo(() => {
    if (!input.trim()) return { stages: [], outputIds: [] }
    return executePipeline(input, true) // previewOnly = true
  }, [input, executePipeline])

  // 2. Advanced Suggestions logic (Context-aware)
  const suggestions = useMemo(() => {
    if (!schema) return []
    const val = input.trim().toLowerCase()

    // --- CASE A: Empty State ---
    if (!val) {
      return [
        { id: 'select', label: 'Select tables...', icon: <MousePointer2 size={14} />, desc: 'select [pattern] or select *', action: () => setInput('select ') },
        { id: 'search', label: 'Find table...', icon: <Search size={14} />, desc: 'Jump to entity', action: () => setInput('search ') },
        { id: 'add-table', label: 'Add table...', icon: <Plus size={14} />, desc: 'Create a new table node', action: () => setInput('add table ') },
        { id: 'add-domain', label: 'Add domain...', icon: <Plus size={14} />, desc: 'Create a new domain container', action: () => setInput('add domain ') },
        { id: 'add-consumer', label: 'Add consumer...', icon: <Plus size={14} />, desc: 'Create a downstream consumer node', action: () => setInput('add consumer ') },
        { id: 'fit', label: 'Fit View', icon: <Maximize size={14} />, desc: 'Show entire model', action: () => handleExecute('fit') },
        { id: 'theme', label: 'Switch Theme', icon: <Sun size={14} />, desc: 'Toggle dark/light mode', action: () => setInput('theme ') },
      ]
    }

    // --- CASE B: Contextual Argument Suggestions (Inside Pipeline) ---
    const stages = input.split('|')
    const lastStage = stages[stages.length - 1]
    const tokens = lastStage.trim().split(/\s+/)
    const cmd = tokens[0].toLowerCase()
    const prefix = stages.slice(0, -1).join('|') + (stages.length > 1 ? '|' : '')

    // select <query>
    if (cmd === 'select') {
      const tableQuery = tokens.slice(1).join(' ').toLowerCase()
      return (schema.tables || [])
        .filter(t => t.id.toLowerCase().includes(tableQuery) || t.name.toLowerCase().includes(tableQuery))
        .slice(0, 8)
        .map(t => ({
          id: t.id,
          label: t.name,
          icon: <Search size={14} />,
          desc: `Table: ${t.id}`,
          action: () => setInput(`${prefix} select ${t.id}`)
        }))
    }

    // mv <query> or mv ... to <query>
    if (cmd === 'mv') {
      const toIndex = tokens.findIndex(t => t.toLowerCase() === 'to')
      const domainQuery = toIndex > -1 ? tokens.slice(toIndex + 1).join(' ').toLowerCase() : tokens.slice(1).join(' ').toLowerCase()
      const cmdPart = toIndex > -1 ? tokens.slice(0, toIndex + 1).join(' ') : 'mv'

      return (schema.domains || [])
        .filter(d => d.id.toLowerCase().includes(domainQuery) || d.name.toLowerCase().includes(domainQuery))
        .slice(0, 8)
        .map(d => ({
          id: d.id,
          label: d.name,
          icon: <Move size={14} />,
          desc: `Domain: ${d.id}`,
          action: () => setInput(`${prefix} ${cmdPart} ${d.id}`)
        }))
    }

    // theme <query>
    if (cmd === 'theme') {
      const themeQuery = tokens.slice(1).join(' ').toLowerCase()
      return ['dark', 'light']
        .filter(m => m.includes(themeQuery))
        .map(m => ({
          id: m,
          label: m,
          icon: <Sun size={14} />,
          desc: 'UI Appearance',
          action: () => setInput(`${prefix} theme ${m}`)
        }))
    }

    // search <query> (Implicit or explicit)
    if (cmd === 'search' || cmd === 'find' || (!['mv', 'add', 'select', 'theme', 'fit'].includes(cmd))) {
      const searchQuery = cmd === 'search' || cmd === 'find' ? tokens.slice(1).join(' ').toLowerCase() : lastStage.trim().toLowerCase()
      return (schema.tables || [])
        .filter(t => t.id.toLowerCase().includes(searchQuery) || t.name.toLowerCase().includes(searchQuery))
        .slice(0, 10)
        .map(t => ({
          id: t.id,
          label: `Go to ${t.name}`,
          icon: <Search size={14} />,
          desc: t.id,
          action: () => {
            if (cmd === 'search' || cmd === 'find' || stages.length === 1) {
              setFocusNodeId(t.id);
              setIsCommandPaletteOpen(false);
            } else {
              setInput(`${prefix} select ${t.id}`)
            }
          }
        }))
    }

    return []
  }, [schema, input, setFocusNodeId, setIsCommandPaletteOpen])

  // 3. Highlight nodes in pipeline
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setHighlightedNodeIds(pipeline.outputIds)
    } else {
      setHighlightedNodeIds([])
    }
  }, [isCommandPaletteOpen, pipeline.outputIds, setHighlightedNodeIds])

  // Automatic scrolling
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

  const handleExecute = (overrideInput?: string) => {
    const finalInput = overrideInput || input
    if (!finalInput.trim()) return

    // Simple one-off UI commands
    if (finalInput === 'fit') {
      ;(window as any).__modscapeFitView?.()
      showFeedback('success', 'View fitted')
      return
    }

    // Execute via engine
    const result = executePipeline(finalInput, false)
    if (result.stages.length > 0 && result.stages.every(s => s.status === 'success')) {
      showFeedback('success', 'Pipeline executed successfully')
    } else {
      const errorStage = result.stages.find(s => s.status === 'error')
      if (errorStage) showFeedback('info', errorStage.message)
    }
  }

  const showFeedback = (type: 'success' | 'info', msg: string) => {
    setFeedback({ type, msg })
    setTimeout(() => {
      setFeedback(null)
      if (type === 'success') {
        setInput('')
      }
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
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestions.length > 0 && suggestions[selectedIndex]) {
        suggestions[selectedIndex].action()
      }
    }
    else if (e.key === 'Enter') {
      e.preventDefault()
      handleExecute()
    }
  }

  if (!isCommandPaletteOpen) return null

  return (
    <div className={`fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-[2px] animate-in fade-in duration-200 ${theme === 'dark' ? 'bg-slate-950/20' : 'bg-white/20'
      }`}>
      <div className="absolute inset-0" onClick={() => setIsCommandPaletteOpen(false)} />

      <div className={`relative w-full max-w-2xl rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border-2 overflow-hidden animate-in slide-in-from-top-4 duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
        {/* Input Header */}
        <div className={`flex items-center px-4 py-4 gap-3 border-b ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-100'
          }`}>
          <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
            <Command size={18} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="select * | mv Core | stack v"
            className={`flex-1 bg-transparent border-none outline-none text-lg font-bold tracking-tight ${theme === 'dark' ? 'placeholder-slate-600' : 'placeholder-slate-400'
              }`}
            value={input}
            onChange={(e) => { setInput(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-black border ${theme === 'dark' ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>ESC</kbd>
        </div>

        {/* Feedback / Plan Area */}
        {feedback ? (
          <div className={`px-4 py-6 flex flex-col items-center justify-center gap-3 animate-in zoom-in-95 duration-200 ${feedback.type === 'success' ? 'text-emerald-500' : 'text-blue-500'
            }`}>
            <div className={`p-3 rounded-full ${feedback.type === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
              {feedback.type === 'success' ? <Check size={32} /> : <Info size={32} />}
            </div>
            <span className="text-sm font-black uppercase tracking-widest">{feedback.msg}</span>
          </div>
        ) : (
          <>
            {/* Pipeline Plan */}
            {input.trim() && (
              <div className={`px-4 py-4 border-b flex flex-col gap-3 ${theme === 'dark' ? 'bg-slate-950/20' : 'bg-slate-50/50'
                }`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Execution Plan</h4>
                  <Zap size={12} className="text-blue-500 animate-pulse" />
                </div>
                <div className="flex flex-col gap-2">
                  {pipeline.stages.length > 0 ? (
                    pipeline.stages.map((stage, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${stage.status === 'success' ? 'bg-emerald-500/20 text-emerald-500' :
                          stage.status === 'active' ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500'
                          }`}>
                          {i + 1}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider">{stage.command}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{stage.message}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-slate-500 italic">Parsing command...</div>
                  )}
                </div>
              </div>
            )}

            {/* Suggestions or Working Set */}
            <div className="flex flex-col">
              {suggestions.length > 0 && (
                <div ref={listRef} className="max-h-[300px] overflow-auto py-2 border-b border-slate-800/30">
                  {suggestions.map((s, i) => (
                    <div
                      key={`${s.id}-${i}`}
                      className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${selectedIndex === i ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-600')
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
                      {selectedIndex === i && <ChevronRight size={14} className="opacity-50" />}
                    </div>
                  ))}
                </div>
              )}

              {input.includes('|') && (
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Working Set ({pipeline.outputIds.length})</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-auto">
                    {pipeline.outputIds.length > 0 ? (
                      pipeline.outputIds.map(id => (
                        <div key={id} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${theme === 'dark' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
                          }`}>
                          {id}
                        </div>
                      ))
                    ) : (
                      <div className="text-[10px] text-slate-500 italic">No tables in current scope</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className={`px-4 py-3 border-t flex items-center justify-between ${theme === 'dark' ? 'bg-slate-950/30 border-slate-800/50' : 'bg-slate-50/50 border-slate-100'
          }`}>
          <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase">
            <div className="flex items-center gap-1">
              <kbd className={`px-1 rounded border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className={`px-1 rounded border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>Tab</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className={`px-1 rounded border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>Enter</kbd>
              <span>Execute</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${pipeline.outputIds.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{pipeline.outputIds.length} target entities</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CommandPalette
