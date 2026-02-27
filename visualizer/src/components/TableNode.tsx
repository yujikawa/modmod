import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { Table } from '../types/schema'
import { useStore } from '../store/useStore'

const TableNode = ({ data, selected }: NodeProps<{ table: Table }>) => {
  const { table } = data
  const hoveredColumnId = useStore(state => state.hoveredColumnId)

  return (
    <div 
      style={{ 
        minWidth: '220px', 
        backgroundColor: '#1e293b', 
        border: `2px solid ${selected ? '#3b82f6' : '#334155'}`,
        borderRadius: '8px',
        overflow: 'hidden',
        color: '#f1f5f9',
        boxShadow: selected ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontFamily: 'sans-serif'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8', width: '8px', height: '8px' }} />
      
      {/* Header */}
      <div style={{ padding: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid #334155' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>{table.name}</div>
        <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginTop: '2px' }}>{table.id}</div>
      </div>
      
      {/* Columns */}
      <div style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <tbody>
            {table.columns.map((col) => (
              <tr 
                key={col.id} 
                style={{ 
                  borderBottom: '1px solid #334155',
                  backgroundColor: hoveredColumnId === col.id ? 'rgba(30, 58, 138, 0.6)' : 'transparent'
                }}
              >
                <td style={{ padding: '6px 12px', fontWeight: 500, color: '#e2e8f0' }}>
                  {col.logical.isPrimaryKey && <span style={{ color: '#eab308', marginRight: '4px' }}>🔑</span>}
                  {col.logical.name}
                </td>
                <td style={{ padding: '6px 12px', textAlign: 'right', fontStyle: 'italic', color: '#94a3b8' }}>
                  {col.logical.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8', width: '8px', height: '8px' }} />
    </div>
  )
}

export default memo(TableNode)
