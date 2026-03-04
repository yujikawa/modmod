import { useEffect, useState, useRef, useCallback } from 'react'
import { useStore } from '../../store/useStore'
import { AlertCircle, Save, Play, CheckCircle2, Loader2, Info } from 'lucide-react'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { yaml } from '@codemirror/lang-yaml'
import { oneDark } from '@codemirror/theme-one-dark'

const EditorTab = () => {
  const { 
    error, 
    isCliMode, 
    yamlInput,
    setYamlInput,
    parseAndSetSchema,
    isAutoSaveEnabled,
    setIsAutoSaveEnabled,
    savingStatus,
    saveSchema,
    lastUpdateSource
  } = useStore()

  const [localYaml, setLocalYaml] = useState(yamlInput)
  const timerRef = useRef<any>(null)
  const editorRef = useRef<ReactCodeMirrorRef>(null)

  // Sync store -> editor (for visual edits)
  useEffect(() => {
    if (lastUpdateSource === 'visual' && editorRef.current?.view) {
      const view = editorRef.current.view;
      const currentDoc = view.state.doc.toString();
      
      if (currentDoc !== yamlInput) {
        // Dispatch as a transaction that adds to history
        view.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: yamlInput },
          userEvent: 'visual-edit'
        });
        setLocalYaml(yamlInput);
      }
    }
  }, [yamlInput, lastUpdateSource])

  // Handle local changes (typing or undo/redo in editor)
  const handleChange = useCallback((value: string) => {
    setLocalYaml(value)
    
    // Auto-parse with debounce
    if (timerRef.current) clearTimeout(timerRef.current)
    
    timerRef.current = setTimeout(() => {
      setYamlInput(value) 
      parseAndSetSchema(value)
    }, 300)
  }, [setYamlInput, parseAndSetSchema])

  const handleManualApply = async () => {
    parseAndSetSchema(localYaml);
    if (isCliMode) {
      await saveSchema(true); // Force save
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-3 overflow-hidden p-4 pt-2 h-full">
      <div className="flex items-center justify-between px-1">
        {!isCliMode ? (
          <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-md">
            <AlertCircle size={12} className="text-blue-400" />
            <span className="text-[10px] text-blue-300 font-medium uppercase tracking-tight">Sandbox Mode</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div 
                className={`relative w-7 h-4 rounded-full transition-colors ${isAutoSaveEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                onClick={() => setIsAutoSaveEnabled(!isAutoSaveEnabled)}
              >
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isAutoSaveEnabled ? 'translate-x-3' : 'translate-x-0'}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-400 uppercase tracking-widest">Auto-save</span>
            </label>
            
            <div className="flex items-center gap-1.5 min-w-[60px]">
              {savingStatus === 'saving' && (
                <div className="flex items-center gap-1 text-slate-400 animate-pulse">
                  <Loader2 size={10} className="animate-spin" />
                  <span className="text-[9px] font-bold uppercase">Saving</span>
                </div>
              )}
              {savingStatus === 'saved' && (
                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 size={10} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Saved</span>
                </div>
              )}
              {savingStatus === 'error' && (
                <div className="flex items-center gap-1 text-red-400">
                  <AlertCircle size={10} />
                  <span className="text-[9px] font-bold uppercase">Error</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-1 text-slate-600" title="Pro Tip: Use Ctrl+Z to undo visual changes!">
          <Info size={12} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">Undo Support Active</span>
        </div>
      </div>
      
      <div className="relative flex-1 flex flex-col min-h-0 border border-slate-700 rounded-md overflow-hidden bg-[#282c34]">
        <CodeMirror
          ref={editorRef}
          value={localYaml}
          height="100%"
          theme={oneDark}
          extensions={[yaml()]}
          onChange={handleChange}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
          }}
          className="flex-1 text-sm overflow-auto"
        />
        
        {error && (localYaml === yamlInput) && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-900/90 border border-red-500/50 rounded-md text-red-100 text-xs flex gap-2 items-start z-10 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-1 shrink-0">
        <div className="text-[10px] text-slate-500 italic">
          {isCliMode ? (isAutoSaveEnabled ? 'Changes save automatically' : 'Click save to update file') : 'Changes reset on reload'}
        </div>
        <button 
          onClick={handleManualApply}
          disabled={savingStatus === 'saving'}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all shadow-lg shrink-0 ${
            isCliMode 
              ? (isAutoSaveEnabled ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-700 text-white') 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isCliMode ? <Save size={16} /> : <Play size={16} />}
          {isCliMode ? 'Save & Update' : 'Apply Changes'}
        </button>
      </div>
    </div>
  )
}

export default EditorTab
