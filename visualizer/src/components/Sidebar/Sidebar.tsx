import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import EditorTab from './EditorTab'
import EntitiesTab from './EntitiesTab'
import FileSelector from './FileSelector'
import ActivityBar from './ActivityBar'
import { useStore } from '../../store/useStore'
import { 
  Edit3,
  ListTree
} from 'lucide-react'
import logo from '/favicon.svg?url'

const Sidebar = () => {
  const { 
    isSidebarOpen, 
    activeTab, 
    setActiveTab,
    isCliMode, 
    theme
  } = useStore()

  return (
    <div 
      className={`relative h-full flex flex-row transition-all duration-300 ease-in-out shadow-2xl z-50 ${
        isSidebarOpen ? 'w-[456px]' : 'w-14'
      }`}
    >
      {/* 1. Main Content Panel (Left) */}
      <div 
        className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${
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

        {/* File Selector */}
        <div className="mt-4">
          <FileSelector />
        </div>

        {/* Tabs Content */}
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as 'editor' | 'entities')}
          className={`flex-1 flex flex-col overflow-hidden mt-4`}
        >
          <div className={`px-4`}>
            <TabsList className={`w-full p-1 border ${
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100 border-slate-200'
            }`}>
              <TabsTrigger 
                value="editor" 
                className={`flex-1 gap-2 ${
                  theme === 'dark' 
                    ? 'text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white' 
                    : 'text-slate-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm'
                }`}
              >
                <Edit3 size={14} />
                <span>Editor</span>
              </TabsTrigger>
              <TabsTrigger 
                value="entities" 
                className={`flex-1 gap-2 ${
                  theme === 'dark' 
                    ? 'text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white' 
                    : 'text-slate-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm'
                }`}
              >
                <ListTree size={14} />
                <span>Entities</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <TabsContent value="editor" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden">
              <EditorTab />
            </TabsContent>
            <TabsContent value="entities" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden">
              <EntitiesTab />
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className={`p-3 border-t flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-800 bg-slate-950/20' : 'border-slate-100 bg-slate-50/50'
        }`}>
          <p className="text-[10px] text-slate-500 font-medium px-1">
            Modscape v1.0.10
          </p>
        </div>
      </div>

      {/* 2. Activity Bar (Right - Always Visible & Fused) */}
      <ActivityBar />
    </div>
  )
}

export default Sidebar
