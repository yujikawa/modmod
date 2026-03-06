import { memo, useEffect, useState } from 'react'
import { type NodeProps, NodeResizer } from 'reactflow'
import { useStore } from '../store/useStore'
import { Lock, Unlock } from 'lucide-react'

const DomainNode = ({ id, data, selected }: NodeProps) => {
  const [isNew, setIsNew] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const { 
    updateNodeDimensions,
    theme,
    toggleDomainLock
  } = useStore()

  const isActuallySelected = selected;
  const isLocked = data.isLocked;
  const color = data.color || '#1e293b';
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
        transition: 'border-color 0.3s, opacity 0.3s',
        opacity: isLocked ? 0.8 : 1
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
          cursor: isLocked ? 'default' : 'grab'
        }}
      />
      
      <div
        className={isLocked ? "domain-locked-handle" : "domain-drag-handle"}
        style={{
          position: 'absolute',
          top: '-25px',
          left: '0',
          fontSize: '14px',
          fontWeight: 'bold',
          color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
          whiteSpace: 'nowrap',
          pointerEvents: 'all', // Handle is always clickable
          cursor: isLocked ? 'default' : 'grab',
          padding: '2px 8px',
          backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.9)',
          borderRadius: '4px 4px 0 0',
          transition: 'color 0.3s, background-color 0.3s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>{data.label}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleDomainLock(id);
          }}
          className={`p-0.5 rounded transition-colors ${
            isLocked 
              ? 'text-amber-500 hover:text-amber-400' 
              : 'text-slate-400 hover:text-white'
          }`}
          title={isLocked ? "Unlock Domain" : "Lock Domain (Prevents selection/movement)"}
        >
          {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
        </button>
      </div>
    </div>
  )
}

export default memo(DomainNode)
