import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { Table } from '../types/schema'
import { useStore } from '../store/useStore'

const TYPE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  fact: { color: '#f87171', icon: '📊', label: 'FACT' },
  dimension: { color: '#60a5fa', icon: '🏷️', label: 'DIM' },
  hub: { color: '#fbbf24', icon: '🌐', label: 'HUB' },
  link: { color: '#34d399', icon: '🔗', label: 'LINK' },
  satellite: { color: '#a78bfa', icon: '🛰️', label: 'SAT' }
};

const TableNode = ({ data, selected }: NodeProps<{ table: Table }>) => {
  const { table } = data
  const hoveredColumnId = useStore(state => state.hoveredColumnId)

  const hasColumns = table.columns && table.columns.length > 0;
  
  // Resolve appearance
  const typeConfig = table.appearance?.type ? TYPE_CONFIG[table.appearance.type] : null;
  const themeColor = table.appearance?.color || typeConfig?.color || '#334155';
  const icon = table.appearance?.icon || typeConfig?.icon || '';
  const typeLabel = typeConfig?.label || '';

  return (
    <div 
      style={{ 
        minWidth: '220px', 
        maxWidth: '550px', // Increased from 400px to accommodate roughly 64 chars
        backgroundColor: '#1e293b', 
        // 3辺（左・右・下）のみを選択状態に応じて色変え
        borderLeft: `2px solid ${selected ? '#3b82f6' : '#334155'}`,
        borderRight: `2px solid ${selected ? '#3b82f6' : '#334155'}`,
        borderBottom: `2px solid ${selected ? '#3b82f6' : '#334155'}`,
        // 上辺だけは常にテーマカラーを優先し、少し太く（4px）する
        borderTop: `4px solid ${themeColor}`,
        borderRadius: '8px',
        overflow: 'hidden',
        color: '#f1f5f9',
        boxShadow: selected ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontFamily: 'sans-serif'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8', width: '8px', height: '8px' }} />
      
      {/* Header */}
      <div style={{ padding: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderBottom: hasColumns ? '1px solid #334155' : 'none' }}>
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
      
      {/* Columns - Render only if they exist */}
      {hasColumns && (
        <div style={{ padding: '0' }}>
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
                    maxWidth: '350px' // Proportionally increased
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
                    maxWidth: '150px' // Proportionally increased
                  }}>
                    {col.logical?.type || 'Unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8', width: '8px', height: '8px' }} />
    </div>
  )
}

export default memo(TableNode)
