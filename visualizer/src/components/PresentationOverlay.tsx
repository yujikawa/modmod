import { useStore } from '../store/useStore'
import { X } from 'lucide-react'

const PresentationOverlay = () => {
  const { isPresentationMode, setIsPresentationMode, theme } = useStore()

  if (!isPresentationMode) return null

  return (
    <div className="fixed top-6 right-6 z-[100] flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
      <button
        onClick={() => setIsPresentationMode(false)}
        className={`p-2.5 rounded-full border shadow-2xl backdrop-blur-md transition-all hover:rotate-90 active:scale-90 ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
            : 'bg-white/80 border-slate-200 text-slate-500 hover:text-slate-900'
        }`}
        title="Exit Presentation Mode (Esc)"
      >
        <X size={20} />
      </button>
    </div>
  )
}

export default PresentationOverlay
