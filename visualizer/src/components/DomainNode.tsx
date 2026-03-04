import { memo } from 'react'
import { type NodeProps, NodeResizer } from 'reactflow'
import { useStore } from '../store/useStore'

const DomainNode = ({ id, data, selected }: NodeProps) => {
  const { 
    updateNodeDimensions
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
      style={{
        width: '100%',
        height: '100%',
        border: `2px dashed ${isActuallySelected ? '#3b82f6' : '#334155'}`,
        borderRadius: '12px',
        padding: '10px',
        position: 'relative',
        color: '#94a3b8',
        pointerEvents: 'all', 
        cursor: 'default'
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
          color: '#f1f5f9',
          whiteSpace: 'nowrap',
          pointerEvents: 'all',
          cursor: 'grab',
          padding: '2px 8px',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '4px 4px 0 0'
        }}
      >
        {data.label}
      </div>
    </div>
  )
}

export default memo(DomainNode)
