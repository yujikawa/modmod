import { memo, useEffect, useState } from 'react'
import { Handle, Position, type NodeProps, NodeResizer, useUpdateNodeInternals } from 'reactflow'
import type { Table } from '../types/schema'
import { useStore } from '../store/useStore'

const TYPE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  fact: { color: '#f87171', icon: '📊', label: 'FACT' },
  dimension: { color: '#60a5fa', icon: '🏷️', label: 'DIM' },
  hub: { color: '#fbbf24', icon: '🌐', label: 'HUB' },
  link: { color: '#34d399', icon: '🔗', label: 'LINK' },
  satellite: { color: '#a78bfa', icon: '🛰️', label: 'SAT' },
  mart: { color: '#f5700b', icon: '📈', label: 'MART' },
  table: { color: '#64748b', icon: '📋', label: 'TABLE' }
};

const TableNode = ({ id, data, selected }: NodeProps<{ table: Table }>) => {
  const { table } = data
  const [isNew, setIsNew] = useState(true)
  const updateNodeInternals = useUpdateNodeInternals()

  useEffect(() => {
    // Notify React Flow that handles might have shifted due to dynamic header content
    updateNodeInternals(id)
    const timer = setTimeout(() => setIsNew(false), 1000)
    return () => clearTimeout(timer)
  }, [id, table.name, table.logical_name, table.physical_name, table.columns, updateNodeInternals])

  const { 
    updateNodeDimensions, 
    hoveredColumnId,
    showER,
    showLineage,
    connectionStartHandle,
    theme,
    isPresentationMode,
    selectedTableId,
    selectedAnnotationId
  } = useStore()

  const isActuallySelected = selected;
  const isAnythingSelected = !!(selectedTableId || selectedAnnotationId);
  const shouldDim = isPresentationMode && isAnythingSelected && !isActuallySelected;
  const hasColumns = table.columns && table.columns.length > 0;
  
  // Disable connections when both modes are active to prevent ambiguity
  const isConnectionLocked = showER && showLineage;
  
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
    if (isConnectionLocked && isVisible) {
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
        cursor: 'default',
        opacity: shouldDim ? 0.3 : 1,
        zIndex: isActuallySelected ? 50 : 0,
        transition: 'opacity 0.5s ease-in-out, z-index 0.3s'
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

      {/* Index Tab (Entity Type) */}
      {typeLabel && (
        <div 
          style={{
            position: 'absolute',
            top: '-12px',
            left: '12px',
            height: '14px',
            padding: '0 6px',
            backgroundColor: themeColor,
            color: '#ffffff',
            fontSize: '8px',
            fontWeight: 900,
            borderRadius: '4px 4px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
            zIndex: 1
          }}
        >
          {typeLabel}
        </div>
      )}

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
            padding: '12px', 
            backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(241, 245, 249, 0.9)', 
            borderBottom: hasColumns ? '1px solid var(--border-main)' : 'none', 
            flexShrink: 0,
            cursor: 'grab',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          {/* Layer 1: Conceptual Name (Primary) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 800, 
              color: 'var(--text-primary)',
              lineHeight: '1.2',
              wordBreak: 'break-all'
            }}>
              {table.name}
            </div>
          </div>

          {/* Layer 2: Logical Name (Secondary) - Hidden if redundant */}
          {table.logical_name && table.logical_name !== table.name && (
            <div style={{ 
              fontSize: '11px', 
              fontWeight: 500,
              color: 'var(--text-secondary)',
              paddingLeft: icon ? '26px' : '0',
              opacity: 0.8
            }}>
              {table.logical_name}
            </div>
          )}

          {/* Layer 3: Physical Name (Technical) */}
          <div 
            title={table.physical_name || table.id}
            style={{ 
              fontSize: '9px', 
              color: theme === 'dark' ? '#94a3b8' : '#64748b', 
              fontFamily: 'monospace',
              letterSpacing: '0.02em',
              paddingLeft: icon ? '26px' : '0',
              marginTop: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}
          >
            {table.physical_name || table.id}
          </div>
        </div>
        
        {/* Columns - Non-draggable area */}
        {hasColumns && (
          <div className="nodrag" style={{ padding: '0', overflowY: 'auto', flex: 1, cursor: 'default' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <tbody>
                {table.columns!.map((col, index) => {
                  const logicalName = col.logical?.name || col.id;
                  const physicalName = col.physical?.name || col.id;
                  const showPhysical = logicalName !== physicalName;

                  return (
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
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--text-secondary)', marginRight: '6px', fontSize: '9px', fontFamily: 'monospace', width: '14px', textAlign: 'right', opacity: 0.6, marginTop: '2px' }}>{index + 1}.</span>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              {col.logical?.isPrimaryKey && <span style={{ color: '#eab308' }}>🔑</span>}
                              {col.logical?.isForeignKey && <span style={{ opacity: 0.8 }}>🔩</span>}
                              {col.logical?.isPartitionKey && <span style={{ opacity: 0.8 }}>📂</span>}
                              {col.logical?.isMetadata && <span style={{ opacity: 0.8 }} title="Metadata/Audit Column">🕒</span>}
                              {col.logical?.additivity === 'fully' && <span style={{ color: '#4ade80' }} title="Fully Additive">Σ</span>}
                              {col.logical?.additivity === 'semi' && <span style={{ color: '#fbbf24' }} title="Semi-Additive">Σ~</span>}
                              {col.logical?.additivity === 'non' && <span style={{ color: '#f87171' }} title="Non-Additive">⊘</span>}
                              <span className="truncate" title={logicalName}>
                                {logicalName}
                              </span>
                            </div>
                            {showPhysical && (
                              <div 
                                style={{ 
                                  fontSize: '8px', 
                                  fontFamily: 'monospace', 
                                  opacity: 0.6,
                                  marginTop: '1px',
                                  paddingLeft: '2px'
                                }}
                                className="truncate"
                                title={physicalName}
                              >
                                {physicalName}
                              </div>
                            )}
                          </div>
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
                        maxWidth: '120px',
                        position: 'relative',
                        verticalAlign: 'top',
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
                  );
                })}
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
