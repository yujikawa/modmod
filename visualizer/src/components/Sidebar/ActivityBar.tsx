import { useStore } from '../../store/useStore'
import { 
  Tag, 
  Grid, 
  Layout, 
  Network, 
  GitGraph, 
  LayoutTemplate, 
  Sun, 
  Moon,
  Lock,
  Plus,
  ChevronLeft,
  Play
} from 'lucide-react'
import { useReactFlow } from 'reactflow'
import logo from '/favicon.svg?url'

const ActivityBar = () => {
  const { 
    isSidebarOpen,
    setIsSidebarOpen,
    isPresentationMode,
    setIsPresentationMode,
    showER,
    setShowER,
    showLineage,
    setShowLineage,
    showAnnotations,
    setShowAnnotations,
    addTable,
    addDomain,
    addAnnotation,
    calculateAutoLayout,
    theme,
    toggleTheme,
    getSelectedTable,
    getSelectedDomain
  } = useStore()

  const { screenToFlowPosition } = useReactFlow()
  
  const isEditingDisabled = showER && showLineage
  const table = getSelectedTable()
  const domain = getSelectedDomain()

  const handleAddDomain = () => {
    if (isEditingDisabled) return
    const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    addDomain(center.x - 300, center.y - 200)
  }

  const handleAddTable = () => {
    if (isEditingDisabled) return
    const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    addTable(center.x - 160, center.y - 125)
  }

  const handleAddAnnotation = () => {
    const target = table || domain
    const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    
    if (!showAnnotations) setShowAnnotations(true)

    if (target) {
      addAnnotation({ x: 50, y: -50 }, target.id, table ? 'table' : 'domain')
    } else {
      addAnnotation({ x: center.x - 60, y: center.y - 40 })
    }
  }

  const iconClass = (isActive: boolean, activeColor: string = 'text-blue-500') => `
    flex items-center justify-center w-10 h-10 rounded-xl transition-all relative group
    ${isActive 
      ? `bg-blue-600/10 ${activeColor} shadow-inner` 
      : theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
    }
  `

  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute left-14 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60] border border-slate-700 shadow-xl">
      {text}
      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
    </div>
  )

  return (
    <div className={`w-14 h-full flex flex-col items-center py-4 border-l transition-colors z-50 ${
      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      {/* Toggle Button: ChevronLeft if open, Logo if closed */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`mb-6 p-2 rounded-xl transition-all ${
          theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-white hover:shadow-md text-slate-500 hover:text-slate-900'
        }`}
      >
        {isSidebarOpen ? (
          <ChevronLeft size={20} />
        ) : (
          <img src={logo} alt="Logo" className="w-6 h-6 rounded-md shadow-lg" />
        )}
      </button>

      {/* View Section */}
      <div className="flex flex-col items-center mb-4 gap-2">
        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter opacity-80 mb-1">
          View
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setShowER(!showER)} className={iconClass(showER, 'text-emerald-500')}>
            <Network size={20} />
            <Tooltip text={showER ? "Hide ER" : "Show ER"} />
          </button>
          <button onClick={() => setShowLineage(!showLineage)} className={iconClass(showLineage, 'text-blue-500')}>
            <GitGraph size={20} />
            <Tooltip text={showLineage ? "Hide Lineage" : "Show Lineage"} />
          </button>
          <button onClick={() => setShowAnnotations(!showAnnotations)} className={iconClass(showAnnotations, 'text-amber-500')}>
            <Tag size={20} />
            <Tooltip text={showAnnotations ? "Hide Annotations" : "Show Annotations"} />
          </button>
        </div>
      </div>

      <div className={`w-8 border-t mb-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`} />

      {/* Add Section */}
      <div className="flex flex-col items-center mb-4 gap-2">
        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter opacity-80 mb-1">
          Add
        </div>
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleAddDomain} 
            disabled={isEditingDisabled}
            className={iconClass(false, 'text-blue-400')}
          >
            <Layout size={20} className={isEditingDisabled ? 'opacity-40' : ''} />
            {isEditingDisabled && <Lock size={10} className="absolute bottom-1 right-1 text-slate-500" />}
            <Tooltip text="Add Domain" />
          </button>
          <button 
            onClick={handleAddTable} 
            disabled={isEditingDisabled}
            className={iconClass(false, 'text-emerald-400')}
          >
            <Grid size={20} className={isEditingDisabled ? 'opacity-40' : ''} />
            {isEditingDisabled && <Lock size={10} className="absolute bottom-1 right-1 text-slate-500" />}
            <Tooltip text="Add Table" />
          </button>
          <button onClick={handleAddAnnotation} className={iconClass(false, 'text-amber-400')}>
            <div className="relative">
              <Tag size={20} />
              <Plus size={10} className="absolute -bottom-1 -right-1 text-amber-500 font-bold stroke-[3px]" />
            </div>
            <Tooltip text="Add Sticky Note" />
          </button>
        </div>
      </div>

      <div className={`w-8 border-t mb-6 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`} />

      <div className="mt-auto flex flex-col gap-2">
        <button onClick={() => setIsPresentationMode(true)} className={iconClass(isPresentationMode, 'text-purple-500')}>
          <Play size={20} />
          <Tooltip text="Presentation Mode" />
        </button>
        <button onClick={() => calculateAutoLayout()} className={iconClass(false)}>
          <LayoutTemplate size={20} />
          <Tooltip text="Auto Layout" />
        </button>
        <button onClick={toggleTheme} className={iconClass(false)}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <Tooltip text={theme === 'dark' ? "Light Mode" : "Dark Mode"} />
        </button>
      </div>
    </div>
  )
}

export default ActivityBar
