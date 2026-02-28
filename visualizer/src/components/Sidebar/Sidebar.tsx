import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import EditorTab from './EditorTab'
import EntitiesTab from './EntitiesTab'
import SidebarToggle from './SidebarToggle'
import FileSelector from './FileSelector'
import { useStore } from '../../store/useStore'
import { Edit3, ListTree } from 'lucide-react'
import logo from '/favicon.svg?url' // Use ?url to get the string path

const Sidebar = () => {
  const { isSidebarOpen, activeTab, setActiveTab, isCliMode } = useStore()

  return (
    <div 
      className={`relative h-full flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out shadow-2xl z-50 ${
        isSidebarOpen ? 'w-[400px]' : 'w-[50px]'
      }`}
    >
      <SidebarToggle />

      {/* Header */}
      <div className={`p-4 border-b border-slate-800 flex items-center justify-between ${!isSidebarOpen && 'hidden'}`}>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Modscape Logo" className="w-5 h-5 rounded-md" />
          <h1 className="text-base font-bold text-white tracking-tight">Modscape</h1>
        </div>
        {isCliMode && (
          <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded uppercase">
            Live
          </span>
        )}
      </div>

      {/* Multi-file selector */}
      <div className="mt-4">
        {isSidebarOpen && <FileSelector />}
      </div>

      {/* Tabs Content */}
      <Tabs 
        value={activeTab} 
        onValueChange={(v) => setActiveTab(v as 'editor' | 'entities')}
        className={`flex-1 flex flex-col overflow-hidden ${!isSidebarOpen && 'items-center py-4'}`}
      >
        <div className={`px-4 pt-4 ${!isSidebarOpen && 'px-0'}`}>
          <TabsList className={`w-full bg-slate-800/50 p-1 border border-slate-700/50 ${!isSidebarOpen && 'flex-col h-auto w-10 gap-2 p-0 bg-transparent border-none'}`}>
            <TabsTrigger 
              value="editor" 
              className={`flex-1 gap-2 ${!isSidebarOpen && 'w-9 h-9 p-0 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white shadow-sm transition-all'}`}
              title="Editor"
            >
              <Edit3 size={14} />
              {isSidebarOpen && <span>Editor</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="entities" 
              className={`flex-1 gap-2 ${!isSidebarOpen && 'w-9 h-9 p-0 rounded-md bg-slate-800/50 hover:bg-slate-800 text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white shadow-sm transition-all'}`}
              title="Entities"
            >
              <ListTree size={14} />
              {isSidebarOpen && <span>Entities</span>}
            </TabsTrigger>
          </TabsList>
        </div>

        {isSidebarOpen && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <TabsContent value="editor" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden">
              <EditorTab />
            </TabsContent>
            <TabsContent value="entities" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden">
              <EntitiesTab />
            </TabsContent>
          </div>
        )}
      </Tabs>

      {/* Footer / Status */}
      {isSidebarOpen && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/20">
          <p className="text-[10px] text-slate-500 text-center font-medium">
            Modscape v0.1.0
          </p>
        </div>
      )}
    </div>
  )
}

export default Sidebar
