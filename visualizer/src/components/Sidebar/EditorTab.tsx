import { useEffect, useState, useRef, useCallback } from 'react'
import { useStore } from '../../store/useStore'
import { AlertCircle, CheckCircle2, Loader2, Info, Undo2, Redo2 } from 'lucide-react'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { yaml } from '@codemirror/lang-yaml'
import { oneDark } from '@codemirror/theme-one-dark'
import { Transaction } from '@codemirror/state'
import { undo, redo } from '@codemirror/commands'

const EditorTab = () => {
  const { 
    error, 
    isCliMode, 
    yamlInput,
    setYamlInput,
    parseAndSetSchema,
    savingStatus,
    lastUpdateSource,
    theme,
    currentModelSlug
  } = useStore()

  const [localYaml, setLocalYaml] = useState(yamlInput)
  const timerRef = useRef<any>(null)
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const isFirstLoadRef = useRef(true)

  // Clear history on file switch
  useEffect(() => {
    if (!editorRef.current?.view) return;
    const view = editorRef.current.view;
    const currentDoc = view.state.doc.toString();
    
    view.dispatch({
      changes: { from: 0, to: currentDoc.length, insert: yamlInput },
      annotations: Transaction.addToHistory.of(false)
    });
    setLocalYaml(yamlInput);
  }, [currentModelSlug])

  // Sync store -> editor (for visual or remote edits)
  useEffect(() => {
    if (!editorRef.current?.view) return;
    const view = editorRef.current.view;
    const currentDoc = view.state.doc.toString();

    // 1. Initial Load: Set content without adding to history
    if (isFirstLoadRef.current && yamlInput) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: yamlInput },
        annotations: Transaction.addToHistory.of(false)
      });
      setLocalYaml(yamlInput);
      isFirstLoadRef.current = false;
      return;
    }

    // 2. Subsequent External or Visual Edits: Sync if user is not typing
    if (lastUpdateSource !== 'user' && currentDoc !== yamlInput) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: yamlInput },
        userEvent: 'remote-edit'
      });
      setLocalYaml(yamlInput);
    }
  }, [yamlInput, lastUpdateSource])

  const handleChange = useCallback((value: string) => {
    setLocalYaml(value)
    if (!value || value.trim() === '') return;

    if (timerRef.current) clearTimeout(timerRef.current)
    
    timerRef.current = setTimeout(() => {
      setYamlInput(value) 
      parseAndSetSchema(value)
    }, 300)
  }, [setYamlInput, parseAndSetSchema])

  const handleUndo = () => {
    if (editorRef.current?.view) {
      undo(editorRef.current.view);
    }
  };

  const handleRedo = () => {
    if (editorRef.current?.view) {
      redo(editorRef.current.view);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-3 overflow-hidden p-4 pt-2 h-full sidebar-content">
      <div className="flex items-center justify-between px-1">
        {!isCliMode ? (
          <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-md">
            <AlertCircle size={12} className="text-blue-400" />
            <span className="text-[10px] text-blue-300 font-medium uppercase tracking-tight">Sandbox Mode</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Auto-sync active
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 min-w-[60px]">
              {savingStatus === 'saving' && (
                <div className="flex items-center gap-1 text-slate-400 animate-pulse">
                  <Loader2 size={10} className="animate-spin" />
                  <span className="text-[9px] font-bold uppercase">Saving</span>
                </div>
              )}
              {savingStatus === 'saved' && (
                <div className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 size={10} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Saved</span>
                </div>
              )}
              {savingStatus === 'error' && (
                <div className="flex items-center gap-1 text-red-500">
                  <AlertCircle size={10} />
                  <span className="text-[9px] font-bold uppercase">Error</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <div className={`flex rounded-lg p-0.5 border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100 border-slate-200'}`}>
            <button 
              onClick={handleUndo}
              className={`p-1.5 rounded-md transition-all active:scale-95 ${
                theme === 'dark' ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-100' : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <div className={`w-px h-4 self-center mx-0.5 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-200'}`} />
            <button 
              onClick={handleRedo}
              className={`p-1.5 rounded-md transition-all active:scale-95 ${
                theme === 'dark' ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-100' : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-600 cursor-help" title="Pro Tip: Use Ctrl+Z to undo visual changes!">
            <Info size={12} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Undo Active</span>
          </div>
        </div>
      </div>
      
      <div className={`relative flex-1 flex flex-col min-h-0 border rounded-md overflow-hidden transition-colors ${
        theme === 'dark' ? 'border-slate-700 bg-[#282c34]' : 'border-slate-200 bg-white'
      }`}>
        <CodeMirror
          ref={editorRef}
          value={localYaml}
          height="100%"
          theme={theme === 'dark' ? oneDark : 'light'}
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
          {isCliMode 
            ? 'Changes are automatically reflected and saved to file.' 
            : 'Changes are reflected instantly but reset on reload.'}
        </div>
      </div>
    </div>
  )
}

export default EditorTab
