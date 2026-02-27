import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { AlertCircle, Save, Play } from 'lucide-react'

const EditorTab = () => {
  const { 
    schema, 
    error, 
    isCliMode, 
    parseAndSetSchema 
  } = useStore()
  
  const [yamlInput, setYamlInput] = useState('')

  // Load initial data
  useEffect(() => {
    if (schema) {
      import('js-yaml').then(yaml => {
        setYamlInput(yaml.dump(schema, { indent: 2 }));
      });
    }
  }, [schema]);

  const handleParse = async () => {
    parseAndSetSchema(yamlInput);
    if (isCliMode) {
      try {
        await fetch('/api/save-yaml', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ yaml: yamlInput })
        });
      } catch (e) {
        console.error('Failed to save YAML to file:', e);
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-3 overflow-hidden p-4 pt-2 h-full">
      {!isCliMode && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-md shrink-0">
          <AlertCircle size={14} className="text-blue-400" />
          <span className="text-[11px] text-blue-300 font-medium">Sandbox Mode (Temporary)</span>
        </div>
      )}
      
      <div className="relative flex-1 flex flex-col min-h-0">
        <textarea
          className="flex-1 w-full p-4 bg-slate-800/50 text-slate-100 border border-slate-700 rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none shadow-inner"
          placeholder="tables: ..."
          value={yamlInput}
          onChange={(e) => setYamlInput(e.target.value)}
        />
        
        {error && (
          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-xs flex gap-2 items-start shrink-0">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-1 shrink-0">
        <div className="text-[10px] text-slate-500 italic">
          {isCliMode ? 'Saves to local file' : 'Changes reset on reload'}
        </div>
        <button 
          onClick={handleParse}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all shadow-lg shrink-0 ${
            isCliMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
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
