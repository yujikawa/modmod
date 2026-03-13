import { useState, useEffect, useRef, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { ArrowRight, Zap, Info, Network, GitGraph, ChevronDown, Check } from 'lucide-react'
import type { Relationship } from '../../types/schema'

const QuickConnectTab = () => {
  const { 
    schema, 
    bulkAddRelationship,
    theme 
  } = useStore()

  const [mode, setMode] = useState<'er' | 'lineage'>('er')
  const [sourceInput, setSourceInput] = useState('')
  const [targetInput, setTargetInput] = useState('')
  const [relType, setRelType] = useState<Relationship['type'] | 'lineage'>('one-to-many')
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false)
  const [showTargetSuggestions, setShowTargetSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)

  const sourceRef = useRef<HTMLInputElement>(null)
  const targetRef = useRef<HTMLInputElement>(null)

  // Generate suggestions based on mode
  const allSuggestions = useMemo(() => {
    if (!schema) return []
    const suggestions: string[] = []
    schema.tables.forEach(table => {
      suggestions.push(table.id)
      if (mode === 'er') {
        table.columns?.forEach(col => {
          suggestions.push(`${table.id}.${col.id}`)
        })
      }
    })
    return suggestions
  }, [schema, mode])

  const filteredSourceSuggestions = useMemo(() => {
    if (!sourceInput) return []
    return allSuggestions.filter(s => s.toLowerCase().includes(sourceInput.toLowerCase())).slice(0, 8)
  }, [sourceInput, allSuggestions])

  const filteredTargetSuggestions = useMemo(() => {
    const currentTarget = targetInput.toLowerCase()
    const suggestions = allSuggestions.filter(s => s.toLowerCase().includes(currentTarget))
    if (mode === 'er' && currentTarget.includes('.')) {
      const colPart = currentTarget.split('.')[1] || ''
      suggestions.unshift(`*.${colPart}`)
    }
    return suggestions.slice(0, 8)
  }, [targetInput, allSuggestions, mode])

  useEffect(() => {
    sourceRef.current?.focus()
  }, [])

  const handleApply = () => {
    if (!sourceInput || !targetInput) return
    const parts = sourceInput.split('.')
    const sourceTable = parts[0]
    const sourceColumn = parts[1]
    bulkAddRelationship({ table: sourceTable, column: sourceColumn }, targetInput, relType)
    
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 1500)

    setTargetInput('')
    targetRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent, field: 'source' | 'target') => {
    const suggestions = field === 'source' ? filteredSourceSuggestions : filteredTargetSuggestions
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % (suggestions.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + (suggestions.length || 1)) % (suggestions.length || 1))
    } else if (e.key === 'Enter') {
      if (suggestions[selectedIndex]) {
        if (field === 'source') {
          setSourceInput(suggestions[selectedIndex])
          setShowSourceSuggestions(false)
          targetRef.current?.focus()
        } else {
          setTargetInput(suggestions[selectedIndex])
          setShowTargetSuggestions(false)
        }
      } else if (field === 'target' && sourceInput && targetInput) {
        handleApply()
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 overflow-auto sidebar-content">
      <div className="flex flex-col gap-4">
        {/* Source Input + Mode Toggle */}
        <section className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Source</label>
            <div className={`flex rounded-full p-0.5 border ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button 
                onClick={() => { setMode('er'); setRelType('one-to-many'); }}
                className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  mode === 'er' 
                    ? (theme === 'dark' ? 'bg-slate-700 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm') 
                    : 'text-[9px] font-bold text-slate-500 hover:text-slate-400 uppercase tracking-tighter'
                }`}
              >
                <Network size={10} />
                <span className="text-[9px] font-black uppercase tracking-tighter">ER</span>
              </button>
              <button 
                onClick={() => { setMode('lineage'); setRelType('lineage'); }}
                className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  mode === 'lineage' 
                    ? (theme === 'dark' ? 'bg-slate-700 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm') 
                    : 'text-[9px] font-bold text-slate-500 hover:text-slate-400 uppercase tracking-tighter'
                }`}
              >
                <GitGraph size={10} />
                <span className="text-[9px] font-black uppercase tracking-tighter">Flow</span>
              </button>
            </div>
          </div>
          <input
            ref={sourceRef}
            type="text"
            placeholder={mode === 'er' ? "table.column" : "table_id"}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold outline-none transition-all border-2 border-transparent ${
              theme === 'dark' ? 'bg-slate-800 text-white placeholder-slate-600 focus:border-blue-500/50' : 'bg-slate-50 text-slate-900 focus:border-blue-500/30'
            }`}
            value={sourceInput}
            onChange={(e) => { setSourceInput(e.target.value); setShowSourceSuggestions(true); setSelectedIndex(0); }}
            onFocus={() => setShowSourceSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
            onKeyDown={(e) => handleKeyDown(e, 'source')}
          />
          {showSourceSuggestions && filteredSourceSuggestions.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl border-2 overflow-hidden z-[110] ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              {filteredSourceSuggestions.map((s, i) => (
                <div
                  key={s}
                  className={`px-4 py-2 text-xs font-bold cursor-pointer ${
                    selectedIndex === i ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600')
                  }`}
                  onMouseDown={() => { setSourceInput(s); targetRef.current?.focus(); }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Connector Visual */}
        <section className="flex justify-center -my-2 relative z-10">
          <div className={`flex items-center gap-3 px-3 py-1 rounded-full border shadow-sm ${
            theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
          }`}>
            {mode === 'er' ? (
              <select
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-blue-500"
                value={relType}
                onChange={(e) => setRelType(e.target.value as any)}
              >
                <option value="one-to-many">1 : N</option>
                <option value="one-to-one">1 : 1</option>
                <option value="many-to-one">N : 1</option>
                <option value="many-to-many">N : N</option>
              </select>
            ) : (
              <ChevronDown size={14} className="text-blue-500 animate-pulse" />
            )}
            <div className="w-px h-3 bg-slate-700/50" />
            <ArrowRight size={12} className="text-slate-500" />
          </div>
        </section>

        {/* Target Input */}
        <section className="relative">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Target</label>
          <input
            ref={targetRef}
            type="text"
            placeholder={mode === 'er' ? "target.column or *.column" : "target_table"}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold outline-none transition-all border-2 border-transparent ${
              theme === 'dark' ? 'bg-slate-800 text-white placeholder-slate-600 focus:border-blue-500/50' : 'bg-slate-50 text-slate-900 focus:border-blue-500/30'
            }`}
            value={targetInput}
            onChange={(e) => { setTargetInput(e.target.value); setShowTargetSuggestions(true); setSelectedIndex(0); }}
            onFocus={() => setShowTargetSuggestions(true)}
            onBlur={() => setTimeout(() => setShowTargetSuggestions(false), 200)}
            onKeyDown={(e) => handleKeyDown(e, 'target')}
          />
          {showTargetSuggestions && filteredTargetSuggestions.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl border-2 overflow-hidden z-[110] ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              {filteredTargetSuggestions.map((s, i) => (
                <div
                  key={s}
                  className={`px-4 py-2 text-xs font-bold cursor-pointer ${
                    selectedIndex === i ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600')
                  }`}
                  onMouseDown={() => { setTargetInput(s); }}
                >
                  <div className="flex items-center justify-between">
                    <span>{s}</span>
                    {s.startsWith('*') && <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase">Bulk</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={handleApply}
          className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group ${
            isSuccess ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSuccess ? <Check size={14} /> : <Zap size={14} className="group-hover:animate-bounce" />}
          {isSuccess ? 'Connected!' : 'Connect Objects'}
        </button>
        
        <div className="flex items-center justify-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-tight text-center">
          <Info size={10} className="text-blue-500 shrink-0" />
          <span>Tip: Use <kbd className={`px-1.5 py-0.5 rounded font-bold ${theme === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-slate-200 text-blue-700'}`}>*.id</kbd> for bulk linking</span>
        </div>
      </div>
    </div>
  )
}

export default QuickConnectTab
