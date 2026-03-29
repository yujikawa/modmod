import { useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { yaml } from '@codemirror/lang-yaml'
import { oneDark } from '@codemirror/theme-one-dark'
import { Transaction } from '@codemirror/state'

const EditorTab = () => {
  const {
    error,
    isCliMode,
    yamlInput,
    savingStatus,
    theme,
    currentModelSlug
  } = useStore()

  const editorRef = useRef<ReactCodeMirrorRef>(null)

  // Sync store -> viewer on any yamlInput change
  useEffect(() => {
    if (!editorRef.current?.view) return;
    const view = editorRef.current.view;
    const currentDoc = view.state.doc.toString();
    if (currentDoc === yamlInput) return;
    view.dispatch({
      changes: { from: 0, to: currentDoc.length, insert: yamlInput },
      annotations: Transaction.addToHistory.of(false)
    });
  }, [yamlInput])

  // Clear content on file switch
  useEffect(() => {
    if (!editorRef.current?.view) return;
    const view = editorRef.current.view;
    const currentDoc = view.state.doc.toString();
    view.dispatch({
      changes: { from: 0, to: currentDoc.length, insert: yamlInput },
      annotations: Transaction.addToHistory.of(false)
    });
  }, [currentModelSlug])

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
      </div>

      <div className={`relative flex-1 flex flex-col min-h-0 border rounded-md overflow-hidden transition-colors ${
        theme === 'dark' ? 'border-slate-700 bg-[#282c34]' : 'border-slate-200 bg-white'
      }`}>
        <CodeMirror
          ref={editorRef}
          value={yamlInput}
          height="100%"
          theme={theme === 'dark' ? oneDark : 'light'}
          extensions={[yaml()]}
          readOnly={true}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: false,
          }}
          className="flex-1 text-sm overflow-auto"
        />

        {error && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-900/90 border border-red-500/50 rounded-md text-red-100 text-xs flex gap-2 items-start z-10 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-1 shrink-0">
        <div className="text-[10px] text-slate-500 italic">
          {isCliMode
            ? 'Read-only view. Edit YAML directly in your editor.'
            : 'Read-only view. Use the canvas to make changes.'}
        </div>
      </div>
    </div>
  )
}

export default EditorTab
