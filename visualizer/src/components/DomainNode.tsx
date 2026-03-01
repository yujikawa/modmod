import { memo } from 'react'
import { type NodeProps, NodeResizer } from 'reactflow'
import { useStore } from '../store/useStore'

const DomainNode = ({ id, data, selected }: NodeProps) => {
  const { updateNodeDimensions, saveLayout } = useStore()

  const color = data.color || '#1e293b';
  // If the color string seems to already have an alpha channel (rgba, hsla, or #RRGGBBAA), 
  // we use opacity 1 to respect it. Otherwise, we apply 0.5 as the default.
  const hasAlpha = color.startsWith('rgba') || color.startsWith('hsla') || (color.startsWith('#') && color.length > 7);
  const opacity = hasAlpha ? 1 : 0.5;

  const onResizeEnd = (_: any, params: { width: number; height: number }) => {
    updateNodeDimensions(id, params.width, params.height)
    saveLayout()
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: `2px dashed ${selected ? '#3b82f6' : '#334155'}`,
        borderRadius: '12px',
        padding: '10px',
        position: 'relative',
        color: '#94a3b8',
        pointerEvents: 'none', 
      }}
    >
      {/* Semi-transparent Background Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: color,
          opacity: opacity,
          borderRadius: '10px',
          zIndex: -1,
        }}
      />
      <NodeResizer
        color="#3b82f6"
        isVisible={selected}
        minWidth={200}
        minHeight={150}
        onResizeEnd={onResizeEnd}
      />
      <div
        style={{
          position: 'absolute',
          top: '-25px',
          left: '0',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#f1f5f9',
          whiteSpace: 'nowrap',
          pointerEvents: 'all' 
        }}
      >
        {data.label}
      </div>
    </div>
  )
}

export default memo(DomainNode)
