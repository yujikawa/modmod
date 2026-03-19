import { memo, useEffect, useState } from 'react'
import { type NodeProps, NodeResizer } from 'reactflow'
import { useStore } from '../store/useStore'
import { useShallow } from 'zustand/react/shallow'
import { Lock, Unlock, GripVertical } from 'lucide-react'

const DomainNode = ({ id, data, selected }: NodeProps) => {
  const [isNew, setIsNew] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const {
    updateNodeDimensions,
    theme,
    toggleDomainLock,
    isPresentationMode,
    selectedTableId,
    selectedAnnotationId
  } = useStore(useShallow((s) => ({
    updateNodeDimensions: s.updateNodeDimensions,
    theme: s.theme,
    toggleDomainLock: s.toggleDomainLock,
    isPresentationMode: s.isPresentationMode,
    selectedTableId: s.selectedTableId,
    selectedAnnotationId: s.selectedAnnotationId,
  })))

  const isActuallySelected = selected;
  const isAnythingSelected = !!(selectedTableId || selectedAnnotationId);
  const shouldDim = isPresentationMode && isAnythingSelected && !isActuallySelected;
  const isLocked = data.isLocked;
  const color = data.color || '#3b82f6';
  
  // Calculate distinct background color for the tab based on theme and domain color
  const tabBgColor = theme === 'dark' 
    ? 'rgba(15, 23, 42, 0.98)' 
    : 'rgba(255, 255, 255, 0.98)';
  
  const accentColor = color; // Domain's specific color (Blue, Green, etc.)
  
  const hasAlpha = color.startsWith('rgba') || color.startsWith('hsla') || (color.startsWith('#') && color.length > 7);
  const opacity = hasAlpha ? 1 : 0.5;

  const onResizeEnd = (_: any, params: { width: number; height: number }) => {
    updateNodeDimensions(id, params.width, params.height)
  }

  return (
    <div
      className={isNew ? 'animate-creation' : ''}
      style={{
        width: '100%',
        height: '100%',
        border: isLocked 
          ? `2px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'}` 
          : `2px dashed ${isActuallySelected ? '#3b82f6' : (theme === 'dark' ? '#334155' : '#cbd5e1')}`,
        borderRadius: '12px',
        padding: '10px',
        position: 'relative',
        color: 'var(--text-secondary)',
        cursor: 'default',
        transition: 'border-color 0.3s, opacity 0.5s ease-in-out, z-index 0.3s',
        opacity: shouldDim ? 0.2 : (isLocked ? 0.8 : 1),
        zIndex: isActuallySelected ? 40 : -1,
        willChange: 'transform'
      }}
    >
      {!isLocked && (
        <NodeResizer
          color="#3b82f6"
          isVisible={isActuallySelected}
          minWidth={200}
          minHeight={150}
          onResizeEnd={onResizeEnd}
          handleStyle={{ 
            width: 14, 
            height: 14, 
            borderRadius: '50%', 
            backgroundColor: '#3b82f6', 
            border: '2px solid #ffffff',
            zIndex: 100
          }}
        />
      )}
      
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: color,
          opacity: opacity,
          borderRadius: '10px',
          zIndex: -1,
          cursor: 'default'
        }}
      />
      
      <div
        className={isLocked ? "domain-locked-handle" : "domain-drag-handle"}
        style={{
          position: 'absolute',
          top: '-30px',
          left: '0',
          fontSize: '13px',
          fontWeight: 'bold',
          color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
          whiteSpace: 'nowrap',
          pointerEvents: 'all', 
          cursor: isLocked ? 'default' : 'grab',
          padding: '4px 12px 4px 10px',
          backgroundColor: tabBgColor,
          borderRadius: '6px 6px 0 0',
          border: `1px solid ${isActuallySelected ? '#3b82f6' : (theme === 'dark' ? '#334155' : '#cbd5e1')}`,
          borderLeft: `4px solid ${accentColor}`, // STRONG color indicator on the left
          borderBottom: 'none',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: theme === 'dark' ? '0 -4px 12px rgba(0,0,0,0.4)' : '0 -2px 8px rgba(0,0,0,0.08)',
          zIndex: 10
        }}
      >
        {!isLocked && <GripVertical size={14} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} />}
        <span className="truncate max-w-[200px]">{data.label}</span>
        
        <div className={`w-px h-3 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleDomainLock(id);
          }}
          className={`p-0.5 rounded transition-colors ${
            isLocked 
              ? 'text-amber-500 hover:text-amber-400' 
              : 'text-slate-400 hover:text-blue-500'
          }`}
          title={isLocked ? "Unlock Domain" : "Lock Domain"}
        >
          {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
        </button>
      </div>
    </div>
  )
}

export default memo(DomainNode)
