import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '../../store/useStore'

const SidebarToggle = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useStore()

  return (
    <button
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-[60] flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-xl"
      aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
    >
      {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
    </button>
  )
}

export default SidebarToggle
