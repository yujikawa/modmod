import EditorTab from './EditorTab'
import FileSelector from './FileSelector'
import ActivityBar from './ActivityBar'
import { useStore } from '../../store/useStore'
import logo from '/favicon.svg?url'

const Sidebar = () => {
  const { isSidebarOpen, isCliMode, theme } = useStore()

  return (
    <div 
      className={`relative h-full flex flex-row border-r transition-all duration-300 ease-in-out shadow-2xl z-50 ${
        isSidebarOpen ? 'w-[456px]' : 'w-14'
      } ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      {/* 1. Main Content Panel (Left) */}
      <div 
        className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 sidebar-content ${
          theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        } ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ width: isSidebarOpen ? '400px' : '0px' }}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Modscape Logo" className="w-5 h-5 rounded-md" />
            <h1 className={`text-base font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Modscape</h1>
            {isCliMode && (
              <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold rounded uppercase ml-1">
                Live
              </span>
            )}
          </div>
        </div>

        {/* Multi-file selector */}
        <div className="mt-4">
          <FileSelector />
        </div>

        {/* Editor Content (Dedicated) */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden mt-4">
          <div className="px-4 py-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">YAML Editor</h3>
          </div>
          <EditorTab />
        </div>

        {/* Footer */}
        <div className={`p-3 border-t flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-800 bg-slate-950/20' : 'border-slate-100 bg-slate-50/50'
        }`}>
          <p className="text-[10px] text-slate-500 font-medium px-1">
            Modscape v1.1.1
          </p>
        </div>
      </div>

      {/* 2. Activity Bar (Right) */}
      <ActivityBar />
    </div>
  )
}

export default Sidebar
