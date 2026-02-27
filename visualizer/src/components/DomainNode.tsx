import { memo } from 'react'
import { type NodeProps, NodeResizer } from 'reactflow'
import { useStore } from '../store/useStore'

const DomainNode = ({ id, data, selected }: NodeProps) => {
  const { updateNodeDimensions, saveLayout } = useStore()

  const onResizeEnd = (_: any, params: { width: number; height: number }) => {
    updateNodeDimensions(id, params.width, params.height)
    saveLayout()
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: data.color || 'rgba(30, 41, 59, 0.1)',
        border: `2px dashed ${selected ? '#3b82f6' : '#334155'}`,
        borderRadius: '12px',
        padding: '10px',
        position: 'relative',
        color: '#94a3b8',
        pointerEvents: 'none', 
      }}
    >
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
