import { memo } from 'react'
import { Handle, Position, type NodeProps, NodeResizer } from 'reactflow'
import type { Table } from '../types/schema'
import { useStore } from '../store/useStore'

const TYPE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  fact: { color: '#f87171', icon: '📊', label: 'FACT' },
  dimension: { color: '#60a5fa', icon: '🏷️', label: 'DIM' },
  hub: { color: '#fbbf24', icon: '🌐', label: 'HUB' },
  link: { color: '#34d399', icon: '🔗', label: 'LINK' },
  satellite: { color: '#a78bfa', icon: '🛰️', label: 'SAT' },
  mart: { color: '#f5700b', icon: '📈', label: 'MART' }
};

const TableNode = ({ id, data, selected }: NodeProps<{ table: Table }>) => {
  const { table } = data
  const { 
    updateNodeDimensions, 
    hoveredColumnId,
    showER,
    showLineage
  } = useStore()

  const isActuallySelected = selected;
  const hasColumns = table.columns && table.columns.length > 0;
  const layer = table.appearance?.layer;
  
  // Disable connections when both modes are active to prevent ambiguity
  const isEditingDisabled = showER && showLineage;
  
  // Resolve appearance
  const typeConfig = table.appearance?.type ? TYPE_CONFIG[table.appearance.type] : null;
  const themeColor = table.appearance?.color || typeConfig?.color || '#334155';
  const icon = table.appearance?.icon || typeConfig?.icon || '';
  
  // Advanced Labels
  let typeLabel = typeConfig?.label || '';
  const subType = table.appearance?.sub_type;
  const scd = table.appearance?.scd;

  if (table.appearance?.type === 'fact' && subType) {
    const strategyMap: Record<string, string> = {
      transaction: 'Trans.',
      periodic: 'Periodic',
      accumulating: 'Accum.',
      factless: 'Factless'
    };
    typeLabel = `FACT (${strategyMap[subType] || subType})`;
  } else if (table.appearance?.type && subType) {
    // Generic display for Dim, Hub, Link, Sat, etc.
    typeLabel = `${table.appearance.type.toUpperCase()} (${subType})`;
  } else if (table.appearance?.type) {
    typeLabel = table.appearance.type.toUpperCase();
  }

  // Append SCD if present
  if (scd) {
    const scdLabel = `SCD ${scd.replace('type', 'T')}`;
    typeLabel = typeLabel ? `${typeLabel} / ${scdLabel}` : scdLabel;
  }

  const onResizeEnd = (_: any, params: { width: number; height: number }) => {
    updateNodeDimensions(id, params.width, params.height)
  }

  return (
    <div 
      style={{ 
        width: '100%',
        height: '100%',
        minWidth: '220px', 
        position: 'relative',
        cursor: 'default'
      }}
    >
      <NodeResizer
        color="#3b82f6"
        isVisible={isActuallySelected}
        minWidth={220}
        minHeight={40}
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

      {/* Layer Floating Tab */}
      {layer && (
        <div style={{
          position: 'absolute',
          top: '-18px',
          left: '0',
          fontSize: '9px',
          fontWeight: 900,
          color: '#94a3b8',
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          padding: '1px 6px',
          borderRadius: '4px 4px 0 0',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          border: '1px solid #334155',
          borderBottom: 'none',
          pointerEvents: 'none',
          zIndex: 1
        }}>
          {layer}
        </div>
      )}
      
      {/* ER Top Handle */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id={`${id}-target`} 
        style={{ 
          background: '#94a3b8', 
          width: '8px', 
          height: '8px', 
          zIndex: 10, 
          opacity: showER ? 1 : 0,
          pointerEvents: (showER && !isEditingDisabled) ? 'all' : 'none'
        }} 
      />

      {/* Lineage Handles (Sides) */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-lineage-target`}
        style={{ top: '50%', left: '-4px', background: '#3b82f6', width: '10px', height: '10px', zIndex: 20, opacity: showLineage ? 1 : 0, pointerEvents: (showLineage && !isEditingDisabled) ? 'all' : 'none' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-lineage-source`}
        style={{ top: '50%', right: '-4px', background: '#3b82f6', width: '10px', height: '10px', zIndex: 20, opacity: showLineage ? 1 : 0, pointerEvents: (showLineage && !isEditingDisabled) ? 'all' : 'none' }}
      />
      
      <div 
        style={{ 
          width: '100%',
          height: '100%',
          backgroundColor: '#1e293b', 
          borderLeft: `2px solid ${isActuallySelected ? '#3b82f6' : '#334155'}`,
          borderRight: `2px solid ${isActuallySelected ? '#3b82f6' : '#334155'}`,
          borderBottom: `2px solid ${isActuallySelected ? '#3b82f6' : '#334155'}`,
          borderTop: `4px solid ${themeColor}`,
          borderRadius: layer ? '0 8px 8px 8px' : '8px',
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
            padding: '10px 12px', 
            backgroundColor: 'rgba(15, 23, 42, 0.8)', 
            borderBottom: hasColumns ? '1px solid #334155' : 'none', 
            flexShrink: 0,
            cursor: 'grab'
          }}
        >
          {/* Top Row: Icon and ID */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            {icon && <span style={{ fontSize: '14px' }}>{icon}</span>}
            <div style={{ 
              fontSize: '10px', 
              color: '#94a3b8', 
              textTransform: 'uppercase', 
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {table.id}
              <span style={{ opacity: 0.5, fontSize: '9px' }}>({table.columns?.length || 0})</span>
            </div>
          </div>

          {/* Primary Row: Table Name */}
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#ffffff',
            lineHeight: '1.2',
            wordBreak: 'break-all'
          }}>
            {table.name}
          </div>

          {/* Metadata Row: Type, Sub-type, and SCD (Moved here) */}
          {typeLabel && (
            <div style={{ 
              fontSize: '9px', 
              fontWeight: 700, 
              color: themeColor,
              marginTop: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              opacity: 0.9
            }}>
              {typeLabel}
            </div>
          )}
        </div>
        
        {/* Columns - Non-draggable area */}
        {hasColumns && (
          <div className="nodrag" style={{ padding: '0', overflowY: 'auto', flex: 1, cursor: 'default' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <tbody>
                {table.columns!.map((col, index) => (
                  <tr 
                    key={col.id} 
                    className="column-row"
                    style={{ 
                      borderBottom: '1px solid #334155',
                      backgroundColor: hoveredColumnId === col.id ? 'rgba(30, 58, 138, 0.6)' : 'transparent',
                      position: 'relative'
                    }}
                  >
                    <td style={{ 
                      padding: '6px 12px', 
                      fontWeight: 500, 
                      color: '#e2e8f0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '350px',
                      position: 'relative'
                    }}>
                      <Handle
                        type="target"
                        position={Position.Left}
                        id={`${id}-${col.id}-target`}
                        className="column-handle"
                        style={{ left: '-4px', opacity: 0, pointerEvents: (showER && !isEditingDisabled) ? 'all' : 'none' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#475569', marginRight: '6px', fontSize: '9px', fontFamily: 'monospace', width: '14px', textAlign: 'right' }}>{index + 1}.</span>
                        {col.logical?.isPrimaryKey && <span style={{ color: '#eab308', marginRight: '4px' }}>🔑</span>}
                        {col.logical?.isForeignKey && <span style={{ marginRight: '4px' }}>🔩</span>}
                        {col.logical?.isPartitionKey && <span style={{ marginRight: '4px' }}>📂</span>}
                        {col.logical?.isMetadata && <span style={{ marginRight: '4px' }} title="Metadata/Audit Column">🕒</span>}
                        {col.logical?.additivity === 'fully' && <span style={{ color: '#4ade80', marginRight: '4px' }} title="Fully Additive">Σ</span>}
                        {col.logical?.additivity === 'semi' && <span style={{ color: '#fbbf24', marginRight: '4px' }} title="Semi-Additive">Σ~</span>}
                        {col.logical?.additivity === 'non' && <span style={{ color: '#f87171', marginRight: '4px' }} title="Non-Additive">⊘</span>}
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
                      maxWidth: '150px',
                      position: 'relative'
                    }}>
                      {col.logical?.type || 'Unknown'}
                      <Handle
                        type="source"
                        position={Position.Right}
                        id={`${id}-${col.id}-source`}
                        className="column-handle"
                        style={{ right: '-4px', opacity: 0, pointerEvents: (showER && !isEditingDisabled) ? 'all' : 'none' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ER Bottom Handle */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id={`${id}-source`} 
        style={{ 
          background: '#94a3b8', 
          width: '8px', 
          height: '8px', 
          zIndex: 10, 
          opacity: showER ? 1 : 0,
          pointerEvents: (showER && !isEditingDisabled) ? 'all' : 'none'
        }} 
      />
    </div>
  )
}

export default memo(TableNode)
