import { memo, useEffect, useState } from 'react'
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
  const [isNew, setIsNew] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const { 
    updateNodeDimensions, 
    hoveredColumnId,
    showER,
    showLineage,
    connectionStartHandle,
    theme
  } = useStore()

  const isActuallySelected = selected;
  const hasColumns = table.columns && table.columns.length > 0;
  
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
    typeLabel = `${table.appearance.type.toUpperCase()} (${subType})`;
  } else if (table.appearance?.type) {
    typeLabel = table.appearance.type.toUpperCase();
  }

  if (scd) {
    const scdLabel = `SCD ${scd.replace('type', 'T')}`;
    typeLabel = typeLabel ? `${typeLabel} / ${scdLabel}` : scdLabel;
  }

  const onResizeEnd = (_: any, params: { width: number; height: number }) => {
    updateNodeDimensions(id, params.width, params.height)
  }

  // Helper to determine handle state - STRICT VERSION
  const getHandleClass = (handleType: string, isER: boolean) => {
    if (!connectionStartHandle) return '';
    
    const isSourceNode = connectionStartHandle.nodeId === id;
    const startingHandleType = connectionStartHandle.handleType; // 'source' or 'target'
    const isStartingER = !connectionStartHandle.handleId?.includes('lin-');

    // 1. Same Node check (cannot connect to self)
    if (isSourceNode) return 'handle-dim';

    // 2. Type Mismatch check (ER cannot connect to Lineage)
    if (isER !== isStartingER) return 'handle-dim';

    // 3. Match logic (Source must connect to Target, and vice versa)
    if (startingHandleType === 'source' && handleType === 'target') return 'handle-pulse';
    if (startingHandleType === 'target' && handleType === 'source') return 'handle-pulse';

    return 'handle-dim';
  };

  // Helper to determine handle style
  const getHandleStyle = (baseColor: string, isVisible: boolean): React.CSSProperties => {
    if (isEditingDisabled && isVisible) {
      return {
        background: '#ef4444', // Red-500 for locked state
        cursor: 'not-allowed',
        border: '1px solid #7f1d1d'
      };
    }
    return { background: baseColor, cursor: 'crosshair' };
  };

  return (
    <div 
      className={isNew ? 'animate-creation' : ''}
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

      {/* ER Top Handle (Target only) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id={`${id}-er-target-top`} 
        className={getHandleClass('target', true)}
        style={{ 
          ...getHandleStyle(theme === 'dark' ? '#94a3b8' : '#64748b', showER),
          width: '8px', 
          height: '8px', 
          zIndex: 10, 
          opacity: showER ? 1 : 0,
          pointerEvents: showER ? 'all' : 'none'
        }} 
      />

      {/* Lineage Left Handle (Target only) */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-lin-target-left`}
        className={getHandleClass('target', false)}
        style={{ 
          ...getHandleStyle('#3b82f6', showLineage),
          top: '50%', left: '-4px', width: '10px', height: '10px', zIndex: 20, 
          opacity: showLineage ? 1 : 0, 
          pointerEvents: showLineage ? 'all' : 'none' 
        }}
      />
      
      {/* Lineage Right Handle (Source only) */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-lin-source-right`}
        className={getHandleClass('source', false)}
        style={{ 
          ...getHandleStyle('#3b82f6', showLineage),
          top: '50%', right: '-4px', width: '10px', height: '10px', zIndex: 20, 
          opacity: showLineage ? 1 : 0, 
          pointerEvents: showLineage ? 'all' : 'none' 
        }}
      />
      
      <div 
        style={{ 
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--node-bg)', 
          borderLeft: `2px solid ${isActuallySelected ? '#3b82f6' : 'var(--border-main)'}`,
          borderRight: `2px solid ${isActuallySelected ? '#3b82f6' : 'var(--border-main)'}`,
          borderBottom: `2px solid ${isActuallySelected ? '#3b82f6' : 'var(--border-main)'}`,
          borderTop: `4px solid ${themeColor}`,
          borderRadius: '8px',
          overflow: 'hidden',
          color: 'var(--text-primary)',
          boxShadow: isActuallySelected 
            ? '0 0 0 4px rgba(59, 130, 246, 0.2)' 
            : (theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 12px -2px rgba(0, 0, 0, 0.1)'),
          fontFamily: 'sans-serif',
          display: 'flex',
          flexDirection: 'column',
          transition: 'background-color 0.3s, border-color 0.3s, color 0.3s'
        }}
      >
        {/* Header - Drag Handle */}
        <div 
          className="table-drag-handle"
          style={{ 
            padding: '10px 12px', 
            backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(241, 245, 249, 0.9)', 
            borderBottom: hasColumns ? '1px solid var(--border-main)' : 'none', 
            flexShrink: 0,
            cursor: 'grab'
          }}
        >
          {/* Top Row: Icon and ID */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            {icon && <span style={{ fontSize: '14px' }}>{icon}</span>}
            <div style={{ 
              fontSize: '10px', 
              color: 'var(--text-secondary)', 
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
            color: 'var(--text-primary)',
            lineHeight: '1.2',
            wordBreak: 'break-all'
          }}>
            {table.name}
          </div>

          {/* Metadata Row: Type, Sub-type, and SCD */}
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
                      borderBottom: '1px solid var(--border-main)',
                      backgroundColor: hoveredColumnId === col.id 
                        ? (theme === 'dark' ? 'rgba(30, 58, 138, 0.6)' : 'rgba(191, 219, 254, 0.4)') 
                        : 'transparent',
                      position: 'relative'
                    }}
                  >
                    <td style={{ 
                      padding: '6px 12px', 
                      fontWeight: 500, 
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '350px',
                      position: 'relative'
                    }}>
                      {/* ER Column Target (Left) */}
                      <Handle
                        type="target"
                        position={Position.Left}
                        id={`${id}-${col.id}-er-target-left`}
                        className={`column-handle ${getHandleClass('target', true)}`}
                        style={{ 
                          ...getHandleStyle('#3b82f6', showER),
                          left: '-4px', opacity: 0, pointerEvents: showER ? 'all' : 'none' 
                        }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)', marginRight: '6px', fontSize: '9px', fontFamily: 'monospace', width: '14px', textAlign: 'right', opacity: 0.6 }}>{index + 1}.</span>
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
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '150px',
                      position: 'relative',
                      opacity: 0.8
                    }}>
                      {col.logical?.type || 'Unknown'}
                      {/* ER Column Source (Right) */}
                      <Handle
                        type="source"
                        position={Position.Right}
                        id={`${id}-${col.id}-er-source-right`}
                        className={`column-handle ${getHandleClass('source', true)}`}
                        style={{ 
                          ...getHandleStyle('#3b82f6', showER),
                          right: '-4px', opacity: 0, pointerEvents: showER ? 'all' : 'none' 
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ER Bottom Handle (Source only) */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id={`${id}-er-source-bottom`} 
        className={getHandleClass('source', true)}
        style={{ 
          ...getHandleStyle(theme === 'dark' ? '#94a3b8' : '#64748b', showER),
          width: '8px', 
          height: '8px', 
          zIndex: 10, 
          opacity: showER ? 1 : 0,
          pointerEvents: showER ? 'all' : 'none'
        }} 
      />
    </div>
  )
}

export default memo(TableNode)
