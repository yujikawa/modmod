import { memo, useEffect, useState } from 'react'
import { type NodeProps, NodeResizer } from 'reactflow'
import { useStore } from '../store/useStore'

const DomainNode = ({ id, data, selected }: NodeProps) => {
  const [isNew, setIsNew] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const { 
    updateNodeDimensions,
    theme
  } = useStore()

  const isActuallySelected = selected;
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
        border: `2px dashed ${isActuallySelected ? '#3b82f6' : (theme === 'dark' ? '#334155' : '#cbd5e1')}`,
        borderRadius: '12px',
        padding: '10px',
        position: 'relative',
        color: 'var(--text-secondary)',
        pointerEvents: 'all', 
        cursor: 'default',
        transition: 'border-color 0.3s'
      }}
    >
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
      
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: color,
          opacity: opacity,
          borderRadius: '10px',
          zIndex: -1,
          cursor: 'grab'
        }}
      />
      
      <div
        className="domain-drag-handle"
        style={{
          position: 'absolute',
          top: '-25px',
          left: '0',
          fontSize: '14px',
          fontWeight: 'bold',
          color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
          whiteSpace: 'nowrap',
          pointerEvents: 'all',
          cursor: 'grab',
          padding: '2px 8px',
          backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.9)',
          borderRadius: '4px 4px 0 0',
          transition: 'color 0.3s, background-color 0.3s'
        }}
      >
        {data.label}
      </div>
    </div>
  )
}

export default memo(DomainNode)
