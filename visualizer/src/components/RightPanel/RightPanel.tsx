import { memo } from 'react'
import { useStore } from '../../store/useStore'
import { useShallow } from 'zustand/react/shallow'
import {
  ListTree,
  ChevronRight,
  ChevronLeft,
  Route,
  MessageSquare,
  Play,
  Sun,
  Moon,
} from 'lucide-react'
import TablesTab from './TablesTab'
import PathFinderTab from './PathFinderTab'
import NoteSearchTab from './NoteSearchTab'

const RightPanel = memo(() => {
  const {
    isRightPanelOpen,
    setIsRightPanelOpen,
    activeRightPanelTab,
    setActiveRightPanelTab,
    theme,
    isPresentationMode,
    setIsPresentationMode,
    toggleTheme,
  } = useStore(useShallow((s) => ({
    isRightPanelOpen: s.isRightPanelOpen,
    setIsRightPanelOpen: s.setIsRightPanelOpen,
    activeRightPanelTab: s.activeRightPanelTab,
    setActiveRightPanelTab: s.setActiveRightPanelTab,
    theme: s.theme,
    isPresentationMode: s.isPresentationMode,
    setIsPresentationMode: s.setIsPresentationMode,
    toggleTheme: s.toggleTheme,
  })))

  const iconClass = (isActive: boolean) => `
    flex items-center justify-center w-10 h-10 rounded-xl transition-all relative group
    ${isActive 
      ? 'bg-blue-600/10 text-blue-500 shadow-inner' 
      : theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
    }
  `

  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute right-14 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60] border border-slate-700 shadow-xl">
      {text}
      <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-slate-800" />
    </div>
  )

  return (
    <div 
      className={`relative h-full flex flex-row transition-all duration-300 ease-in-out shadow-2xl z-50 ${
        isRightPanelOpen ? 'w-[456px]' : 'w-14'
      }`}
    >
      {/* 1. Activity Bar (Right side of the Right Panel - Always Visible) */}
      <div className={`w-14 h-full flex flex-col items-center py-4 border-l transition-colors z-50 ${
        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <button 
          onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
          className={`mb-6 p-2 rounded-xl transition-all ${
            theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-white hover:shadow-md text-slate-500 hover:text-slate-900'
          }`}
        >
          {isRightPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className="flex flex-col gap-2 mb-6">
          <button 
            onClick={() => { setActiveRightPanelTab('tables'); setIsRightPanelOpen(true); }} 
            className={iconClass(activeRightPanelTab === 'tables' && isRightPanelOpen)}
          >
            <ListTree size={20} />
            <Tooltip text="Tables & Entities" />
          </button>
          
          <button 
            onClick={() => { setActiveRightPanelTab('path'); setIsRightPanelOpen(true); }} 
            className={iconClass(activeRightPanelTab === 'path' && isRightPanelOpen)}
          >
            <Route size={20} />
            <Tooltip text="Path Finder" />
          </button>

          <button 
            onClick={() => { setActiveRightPanelTab('notes'); setIsRightPanelOpen(true); }} 
            className={iconClass(activeRightPanelTab === 'notes' && isRightPanelOpen)}
          >
            <MessageSquare size={20} />
            <Tooltip text="Note Search" />
          </button>
        </div>

        <div className="mt-auto flex flex-col gap-2 pb-2">
          <button
            onClick={() => setIsPresentationMode(true)}
            className={iconClass(isPresentationMode)}
          >
            <Play size={20} />
            <Tooltip text="Presentation Mode" />
          </button>
          <button onClick={toggleTheme} className={iconClass(false)}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <Tooltip text={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} />
          </button>
        </div>
      </div>

      {/* 2. Content Panel (Left side of the Right Panel) */}
      <div 
        className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 sidebar-content ${
          theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        } ${
          isRightPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ width: isRightPanelOpen ? '400px' : '0px' }}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <h2 className={`text-sm font-bold tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {activeRightPanelTab === 'tables' && 'Tables'}
            {activeRightPanelTab === 'path' && 'Path Finder'}
            {activeRightPanelTab === 'notes' && 'Note Search'}
          </h2>
        </div>

        {/* Tab Content */}
        {activeRightPanelTab === 'tables' && <TablesTab />}
        {activeRightPanelTab === 'path' && <PathFinderTab />}
        {activeRightPanelTab === 'notes' && <NoteSearchTab />}
      </div>
    </div>
  )
})

export default RightPanel
