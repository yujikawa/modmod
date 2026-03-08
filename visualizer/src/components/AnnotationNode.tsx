import { memo, useState, useEffect, useMemo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { Annotation } from '../types/schema'
import { useStore } from '../store/useStore'
import { Trash2 } from 'lucide-react'

// Track IDs that have already performed the entrance animation in this session
const animatedIds = new Set<string>();

// Helper to determine the best contrast color (black or white) based on background brightness
const getContrastColor = (hexColor: string, theme: 'dark' | 'light'): string => {
  if (!hexColor) return theme === 'dark' ? '#f1f5f9' : '#92400e';
  
  // Standard hex to RGB conversion
  let r = 0, g = 0, b = 0;
  if (hexColor.startsWith('#')) {
    if (hexColor.length === 4) {
      r = parseInt(hexColor[1] + hexColor[1], 16);
      g = parseInt(hexColor[2] + hexColor[2], 16);
      b = parseInt(hexColor[3] + hexColor[3], 16);
    } else {
      r = parseInt(hexColor.substring(1, 3), 16);
      g = parseInt(hexColor.substring(3, 5), 16);
      b = parseInt(hexColor.substring(5, 7), 16);
    }
  } else if (hexColor.startsWith('rgba') || hexColor.startsWith('rgb')) {
    const values = hexColor.match(/\d+/g);
    if (values) {
      r = parseInt(values[0]);
      g = parseInt(values[1]);
      b = parseInt(values[2]);
    }
  } else {
    // Default fallback for named colors or variables
    return theme === 'dark' ? '#f1f5f9' : '#1e293b';
  }

  // Calculate relative luminance (human eye perception)
  // Formula: 0.299*R + 0.587*G + 0.114*B
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // If luminance is high (bright color), use dark text. Otherwise use white.
  return luminance > 0.55 ? '#1e293b' : '#ffffff'; 
};

const AnnotationNode = ({ id, data, selected }: NodeProps<{ annotation: Annotation }>) => {
  const { annotation } = data
  const { 
    updateAnnotation, 
    removeAnnotation, 
    theme,
    isPresentationMode,
    selectedTableId,
    selectedAnnotationId
  } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(annotation.text)
  const [isNew, setIsNew] = useState(!animatedIds.has(id))

  // Stable random rotation based on ID
  const rotation = useMemo(() => {
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return (seed % 30 - 15) / 10 // -1.5 to 1.5 degrees
  }, [id])

  useEffect(() => {
    setText(annotation.text)
  }, [annotation.text])

  useEffect(() => {
    if (isNew) {
      animatedIds.add(id)
      const timer = setTimeout(() => setIsNew(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [id, isNew])

  const handleBlur = () => {
    setIsEditing(false)
    if (text !== annotation.text) {
      updateAnnotation(annotation.id, { text })
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeAnnotation(annotation.id)
  }

  const bgColor = annotation.color || (theme === 'dark' ? '#334155' : '#fef3c7')
  const textColor = getContrastColor(bgColor, theme)
  const borderColor = selected ? '#3b82f6' : 'transparent'

  const isActuallySelected = selected;
  const isAnythingSelected = !!(selectedTableId || selectedAnnotationId);
  const shouldDim = isPresentationMode && isAnythingSelected && !isActuallySelected;

  return (
    <div 
      className={`relative group ${isNew ? 'animate-creation' : ''}`}
      style={{
        padding: '12px 12px 20px 12px',
        backgroundColor: bgColor,
        borderRadius: '2px', // Sticky note sharp corners
        border: `2px solid ${borderColor}`,
        boxShadow: selected
          ? '0 0 0 4px rgba(59, 130, 246, 0.2), 0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        minWidth: '140px',
        maxWidth: '280px',
        transform: `rotate(${rotation}deg)`,
        transition: 'background-color 0.3s, color 0.3s, opacity 0.5s ease-in-out, border-color 0.2s',
        cursor: isEditing ? 'text' : 'grab',
        color: textColor,
        opacity: shouldDim ? 0.2 : 1,
        zIndex: isActuallySelected ? 50 : 0
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
      {/* Connector Handle (Invisible but functional) */}
      <Handle
        type="source"
        position={Position.Top}
        id={`${id}-source`}
        style={{ background: 'transparent', border: 'none', top: '50%', left: '50%', pointerEvents: 'none' }}
      />

      {/* Toolbar (Delete) - Theme aware colors */}
      <div className={`absolute -top-10 right-0 gap-1 shadow-xl border rounded-lg p-1 z-10 animate-in fade-in zoom-in duration-200 ${
        selected ? 'flex' : 'hidden group-hover:flex'
      } ${
        theme === 'dark' 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <button 
          onClick={handleDelete}
          className={`p-1.5 rounded-md transition-colors ${
            theme === 'dark'
              ? 'hover:bg-red-500/20 text-slate-400 hover:text-red-400'
              : 'hover:bg-red-50 text-slate-400 hover:text-red-500'
          }`}
          title="Delete Annotation"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div 
        className="custom-scrollbar"
        style={{ 
          maxHeight: '240px', 
          overflowY: 'auto',
          paddingRight: '4px'
        }}
      >
        {isEditing ? (
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            className="w-full bg-transparent border-none outline-none resize-none font-sans text-sm leading-relaxed"
            style={{ height: 'auto', minHeight: '80px', color: 'inherit' }}
          />
        ) : (
          <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap break-words pr-1">
            {annotation.text || <span className="opacity-40 italic">Double-click to edit...</span>}
          </div>
        )}
      </div>

      {/* Dog-ear Effect (Bottom-Right) */}
      <div 
        className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)`,
        }}
      >
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(225deg, transparent 50%, ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'} 50%)`,
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
          }}
        />
      </div>
    </div>
  )
}

export default memo(AnnotationNode)
