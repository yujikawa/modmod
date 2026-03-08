import { useStore } from '../store/useStore'
import { Camera, X, Check } from 'lucide-react'
import { useState } from 'react'
import { toPng } from 'html-to-image'

const PresentationOverlay = () => {
  const { isPresentationMode, setIsPresentationMode, theme } = useStore()
  const [isCapturing, setIsCapturing] = useState(false)
  const [showSuccess, setShowCheck] = useState(false)

  if (!isPresentationMode) return null

  const handleSnapshot = async () => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!viewport) return

    setIsCapturing(true)
    try {
      // Small delay to ensure any hover effects are cleared
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const dataUrl = await toPng(viewport, {
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
        pixelRatio: 2,
        quality: 1,
      })

      const link = document.createElement('a')
      link.download = `modscape-snapshot-${new Date().toISOString().split('T')[0]}.png`
      link.href = dataUrl
      link.click()

      // Visual feedback
      setShowCheck(true)
      setTimeout(() => setShowCheck(false), 2000)
    } catch (err) {
      console.error('Failed to take snapshot:', err)
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="fixed top-6 right-6 z-[100] flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Snapshot Button */}
      <button
        onClick={handleSnapshot}
        disabled={isCapturing}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-2xl backdrop-blur-md transition-all active:scale-95 ${
          showSuccess 
            ? 'bg-emerald-500 border-emerald-400 text-white' 
            : theme === 'dark' 
              ? 'bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800' 
              : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
        title="Take Snapshot (PNG)"
      >
        {showSuccess ? (
          <>
            <Check size={18} className="animate-in zoom-in duration-300" />
            <span className="text-xs font-bold uppercase tracking-wider">Saved</span>
          </>
        ) : (
          <>
            <Camera size={18} className={isCapturing ? 'animate-pulse' : ''} />
            <span className="text-xs font-bold uppercase tracking-wider">Snapshot</span>
          </>
        )}
      </button>

      {/* Exit Button */}
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
