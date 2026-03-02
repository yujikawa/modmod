import { memo } from 'react'
import { Handle, Position, type NodeProps, NodeResizer } from 'reactflow'
import type { Table } from '../types/schema'
import { useStore } from '../store/useStore'
import { X } from 'lucide-react'

const TYPE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  fact: { color: '#f87171', icon: '📊', label: 'FACT' },
  dimension: { color: '#60a5fa', icon: '🏷️', label: 'DIM' },
  hub: { color: '#fbbf24', icon: '🌐', label: 'HUB' },
  link: { color: '#34d399', icon: '🔗', label: 'LINK' },
  satellite: { color: '#a78bfa', icon: '🛰️', label: 'SAT' }
};

const TableNode = ({ id, data, selected }: NodeProps<{ table: Table }>) => {
  const { table } = data
  const { 
    updateNodeDimensions, 
    saveLayout, 
    hoveredColumnId, 
    removeNode,
    selectedTableId,
    setSelectedTableId
  } = useStore()

  const isActuallySelected = selected || selectedTableId === id;
  const hasColumns = table.columns && table.columns.length > 0;
  
  // Resolve appearance
  const typeConfig = table.appearance?.type ? TYPE_CONFIG[table.appearance.type] : null;
  const themeColor = table.appearance?.color || typeConfig?.color || '#334155';
  const icon = table.appearance?.icon || typeConfig?.icon || '';
  const typeLabel = typeConfig?.label || '';

  const onResizeEnd = (_: any, params: { width: number; height: number }) => {
    updateNodeDimensions(id, params.width, params.height)
    saveLayout()
  }

  // Handle manual selection on click
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTableId(id);
  };

  return (
    <div 
      onClick={handleNodeClick}
      style={{ 
        width: '100%',
        height: '100%',
        minWidth: '220px', 
        minHeight: '100px',
        position: 'relative',
        cursor: 'default'
      }}
    >
      <NodeResizer
        color="#3b82f6"
        isVisible={isActuallySelected}
        minWidth={220}
        minHeight={100}
        onResizeEnd={onResizeEnd}
        handleStyle={{ 
          width: 12, 
          height: 12, 
          borderRadius: '50%', 
          backgroundColor: '#3b82f6', 
          border: '2px solid #ffffff',
          zIndex: 100
        }}
      />
      
      {isActuallySelected && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeNode(id);
          }}
          style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            width: '28px',
            height: '28px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ffffff',
            cursor: 'pointer',
            zIndex: 1001,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            transition: 'transform 0.1s ease',
          }}
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag start when clicking delete
          title="Delete Table"
        >
          <X size={16} />
        </button>
      )}
      
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8', width: '8px', height: '8px', zIndex: 10 }} />
      
      <div 
        style={{ 
          width: '100%',
          height: '100%',
          backgroundColor: '#1e293b', 
          borderLeft: `2px solid ${isActuallySelected ? '#3b82f6' : '#334155'}`,
          borderRight: `2px solid ${isActuallySelected ? '#3b82f6' : '#334155'}`,
          borderBottom: `2px solid ${isActuallySelected ? '#3b82f6' : '#334155'}`,
          borderTop: `4px solid ${themeColor}`,
          borderRadius: '8px',
          overflow: 'hidden',
          color: '#f1f5f9',
          boxShadow: isActuallySelected ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          fontFamily: 'sans-serif',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header - Drag Handle */}
        <div 
          className="table-drag-handle"
          style={{ 
            padding: '12px', 
            backgroundColor: 'rgba(15, 23, 42, 0.8)', 
            borderBottom: hasColumns ? '1px solid #334155' : 'none', 
            flexShrink: 0,
            cursor: 'grab'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              {icon && <span style={{ fontSize: '14px', flexShrink: 0 }}>{icon}</span>}
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {table.name}
              </div>
            </div>
            {typeLabel && (
              <div style={{ 
                fontSize: '9px', 
                fontWeight: 800, 
                padding: '2px 6px', 
                borderRadius: '4px', 
                backgroundColor: `${themeColor}20`, 
                color: themeColor,
                border: `1px solid ${themeColor}40`,
                flexShrink: 0,
                marginLeft: '8px'
              }}>
                {typeLabel}
              </div>
            )}
          </div>
          <div style={{ 
            fontSize: '10px', 
            color: '#94a3b8', 
            textTransform: 'uppercase', 
            marginTop: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {table.id}
          </div>
        </div>
        
        {/* Columns - Non-draggable area */}
        {hasColumns && (
          <div className="nodrag" style={{ padding: '0', overflowY: 'auto', flex: 1, cursor: 'default' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <tbody>
                {table.columns!.map((col) => (
                  <tr 
                    key={col.id} 
                    style={{ 
                      borderBottom: '1px solid #334155',
                      backgroundColor: hoveredColumnId === col.id ? 'rgba(30, 58, 138, 0.6)' : 'transparent'
                    }}
                  >
                    <td style={{ 
                      padding: '6px 12px', 
                      fontWeight: 500, 
                      color: '#e2e8f0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '350px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {col.logical?.isPrimaryKey && <span style={{ color: '#eab308', marginRight: '4px' }}>🔑</span>}
                        {col.logical?.isForeignKey && <span style={{ marginRight: '4px' }}>🔩</span>}
                        {col.logical?.isPartitionKey && <span style={{ marginRight: '4px' }}>📂</span>}
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {col.logical?.name || col.id}
                        </span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      textAlign: 'right', 
                      fontStyle: 'italic', 
                      color: '#94a3b8',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '150px'
                    }}>
                      {col.logical?.type || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8', width: '8px', height: '8px', zIndex: 10 }} />
    </div>
  )
}

export default memo(TableNode)
