import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { X, Plus, Trash2, Tag as TagIcon, Table as TableIcon, Database } from 'lucide-react'
import type { Table, Column } from '../types/schema'

const TYPE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  fact: { color: '#f87171', icon: '📊', label: 'FACT' },
  dimension: { color: '#60a5fa', icon: '🏷️', label: 'DIM' },
  hub: { color: '#fbbf24', icon: '🌐', label: 'HUB' },
  link: { color: '#34d399', icon: '🔗', label: 'LINK' },
  satellite: { color: '#a78bfa', icon: '🛰️', label: 'SAT' },
  mart: { color: '#f5700b', icon: '📈', label: 'MART' }
};

const DetailPanel = () => {
  const { 
    schema,
    selectedTableId, 
    selectedEdgeId,
    getSelectedTable, 
    getSelectedDomain,
    getSelectedRelationship,
    setSelectedTableId, 
    setSelectedEdgeId,
    updateTable,
    updateDomain,
    updateRelationship,
    assignTableToDomain
  } = useStore()
  
  const table = getSelectedTable()
  const domain = getSelectedDomain()
  const relationshipData = getSelectedRelationship()
  
  const [activeTab, setActiveTab] = useState('conceptual')
  const [tagInput, setTagInput] = useState('')
  const [panelHeight, setPanelHeight] = useState(400) // Default height in pixels
  const [isResizing, setIsResizing] = useState(false)

  // Use simple effect for global mouse move to handle resizing
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = window.innerHeight - e.clientY;
      // Constraint height between 150px and 90% of window height
      setPanelHeight(Math.max(150, Math.min(newHeight, window.innerHeight * 0.9)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!selectedTableId && !selectedEdgeId) return null
  if (!table && !domain && !relationshipData) return null

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'ns-resize';
  };

  // Helper to prevent event propagation to React Flow canvas
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    e.stopPropagation();
  };

  // Common Wrapper Style
  const panelStyle: React.CSSProperties = {
    height: `${panelHeight}px`,
    maxHeight: '90vh',
    minHeight: '150px',
    backgroundColor: '#0f172a', 
    borderTop: '2px solid #3b82f6',
    display: 'flex', 
    flexDirection: 'column',
    color: '#f1f5f9',
    boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.4)',
    fontFamily: 'sans-serif',
    position: 'relative'
  };

  // --- Relationship Editor Rendering ---
  if (relationshipData) {
    const { relationship, index } = relationshipData;
    return (
      <div 
        className="bg-slate-900 border-t border-slate-800 shadow-2xl z-50 flex flex-col text-slate-100"
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
        onPointerDown={stopPropagation}
        style={panelStyle}
      >
        {/* Resize Handle */}
        <div 
          onMouseDown={startResizing}
          style={{
            position: 'absolute',
            top: '-4px',
            left: 0,
            right: 0,
            height: '8px',
            cursor: 'ns-resize',
            zIndex: 60
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', borderBottom: '1px solid #1e293b', backgroundColor: '#020617' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <Database size={18} style={{ color: '#3b82f6' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Relationship</span>
                <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '3px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', textTransform: 'uppercase' }}>
                  EDGE
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>
                {relationship.from.table}{relationship.from.column ? `.${relationship.from.column}` : ''} → {relationship.to.table}{relationship.to.column ? `.${relationship.to.column}` : ''}
              </p>
            </div>
          </div>
          <button onClick={() => setSelectedEdgeId(null)} style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="grid grid-cols-2 gap-8">
              <section>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Relationship Type</h3>
                <select 
                  value={relationship.type || 'one-to-many'}
                  onChange={(e) => updateRelationship(index, { type: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm p-2.5 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="one-to-one">One-to-One</option>
                  <option value="one-to-many">One-to-Many</option>
                  <option value="many-to-one">Many-to-One</option>
                  <option value="many-to-many">Many-to-Many</option>
                </select>
              </section>

              <section>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cardinality (Metadata)</h3>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                  Mapping established from <strong>{relationship.from.table}</strong> to <strong>{relationship.to.table}</strong>.
                </div>
              </section>
            </div>
            
            <section>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Source/Target Details</h3>
              <div className="flex gap-4 items-center bg-slate-800/50 p-3 rounded border border-slate-800">
                <div className="flex-1">
                  <div className="text-[10px] text-slate-500 uppercase">From Table</div>
                  <div className="text-sm font-bold text-blue-400">{relationship.from.table}</div>
                  <div className="text-[10px] text-slate-500">Column: {relationship.from.column || '(Table level)'}</div>
                </div>
                <div className="text-slate-600">→</div>
                <div className="flex-1">
                  <div className="text-[10px] text-slate-500 uppercase">To Table</div>
                  <div className="text-sm font-bold text-blue-400">{relationship.to.table}</div>
                  <div className="text-[10px] text-slate-500">Column: {relationship.to.column || '(Table level)'}</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
  if (domain) {
    return (
      <div 
        className="bg-slate-900 border-t border-slate-800 shadow-2xl z-50 flex flex-col text-slate-100"
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
        onPointerDown={stopPropagation}
        style={{ ...panelStyle, borderTopColor: domain.color || '#3b82f6' }}
      >
        {/* Resize Handle */}
        <div 
          onMouseDown={startResizing}
          style={{
            position: 'absolute',
            top: '-4px',
            left: 0,
            right: 0,
            height: '8px',
            cursor: 'ns-resize',
            zIndex: 60
          }}
        />
        {/* Panel Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', borderBottom: '1px solid #1e293b', backgroundColor: '#020617' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <Database size={18} style={{ color: domain.color || '#3b82f6' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  value={domain.name}
                  onChange={(e) => updateDomain(domain.id, { name: e.target.value })}
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    color: '#ffffff', 
                    backgroundColor: 'transparent', 
                    border: 'none',
                    borderBottom: '1px solid transparent',
                    padding: '2px 0',
                    outline: 'none',
                    width: 'fit-content',
                    minWidth: '200px'
                  }}
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderBottom = '1px solid #3b82f6'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderBottom = '1px solid transparent'}
                />
                <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '3px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', textTransform: 'uppercase' }}>
                  DOMAIN
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>{domain.id}</p>
            </div>
          </div>
          <button onClick={() => setSelectedTableId(null)} style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Domain Description</h3>
              <textarea 
                value={domain.description || ''}
                onChange={(e) => updateDomain(domain.id, { description: e.target.value })}
                placeholder="What is the purpose of this domain?"
                style={{ 
                  width: '100%', 
                  minHeight: '80px',
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155', 
                  borderRadius: '6px',
                  padding: '12px',
                  color: '#e2e8f0',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </section>

            <section>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Domain Theme Color</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="color" 
                  value={domain.color?.startsWith('rgba') ? '#3b82f6' : (domain.color || '#3b82f6')} 
                  onChange={(e) => updateDomain(domain.id, { color: e.target.value })}
                  style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent' }}
                />
                <input 
                  value={domain.color || ''}
                  onChange={(e) => updateDomain(domain.id, { color: e.target.value })}
                  placeholder="e.g. #3b82f6 or rgba(...)"
                  className="bg-slate-800 border border-slate-700 text-slate-300 font-mono text-sm p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none flex-1"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // --- Table Editor Rendering ---
  const tabs = [
    { id: 'conceptual', label: 'Conceptual', icon: <TagIcon size={14} /> },
    { id: 'logical', label: 'Logical', icon: <Database size={14} /> },
    { id: 'physical', label: 'Physical', icon: <Database size={14} /> },
    { id: 'sample', label: 'Sample Data', icon: <TableIcon size={14} /> }
  ]

  const typeConfig = table!.appearance?.type ? TYPE_CONFIG[table!.appearance.type] : null;
  const themeColor = table!.appearance?.color || typeConfig?.color || '#334155';
  const icon = table!.appearance?.icon || typeConfig?.icon || '';
  
  // Advanced Labels
  let typeLabel = typeConfig?.label || '';
  const subType = table!.appearance?.sub_type;
  const scd = table!.appearance?.scd;

  if (table!.appearance?.type === 'fact' && subType) {
    const strategyMap: Record<string, string> = {
      transaction: 'Trans.',
      periodic: 'Periodic',
      accumulating: 'Accum.',
      factless: 'Factless'
    };
    typeLabel = `FACT (${strategyMap[subType] || subType})`;
  } else if (table!.appearance?.type && subType) {
    typeLabel = `${table!.appearance.type.toUpperCase()} (${subType})`;
  } else if (table!.appearance?.type) {
    typeLabel = table!.appearance.type.toUpperCase();
  }

  if (scd) {
    const scdLabel = `SCD ${scd.replace('type', 'T')}`;
    typeLabel = typeLabel ? `${typeLabel} / ${scdLabel}` : scdLabel;
  }

  const handleUpdateTable = (updates: Partial<Table>) => {
    updateTable(table!.id, updates);
  };

  const handleAddColumn = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCol: Column = {
      id: `col_${Date.now()}`,
      logical: { name: 'New Column', type: 'String', description: '' },
      physical: { name: '', type: 'VARCHAR(255)', constraints: [] }
    };
    handleUpdateTable({ columns: [...(table!.columns || []), newCol] });
  };

  const handleRemoveColumn = (e: React.MouseEvent, colId: string) => {
    e.stopPropagation();
    const newColumns = table!.columns?.filter(col => col.id !== colId) || [];
    handleUpdateTable({ columns: newColumns });
  };

  const handleUpdateLogicalColumn = (colId: string, updates: Partial<NonNullable<Column['logical']>>) => {
    const newColumns: Column[] = table!.columns?.map(col => {
      if (col.id === colId) {
        return { 
          ...col, 
          logical: { 
            name: col.logical?.name || col.id,
            type: col.logical?.type || 'String',
            ...col.logical, 
            ...updates 
          } 
        };
      }
      return col;
    }) || [];
    handleUpdateTable({ columns: newColumns });
  };

  const handleUpdatePhysicalColumn = (colId: string, updates: Partial<NonNullable<Column['physical']>>) => {
    const newColumns: Column[] = table!.columns?.map(col => {
      if (col.id === colId) {
        return { 
          ...col, 
          physical: { 
            ...col.physical, 
            ...updates 
          } 
        };
      }
      return col;
    }) || [];
    handleUpdateTable({ columns: newColumns });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      const currentTags = table!.conceptual?.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        handleUpdateTable({
          conceptual: {
            ...table!.conceptual,
            tags: [...currentTags, tagInput.trim()]
          }
        });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (e: React.MouseEvent, tagToRemove: string) => {
    e.stopPropagation();
    const currentTags = table!.conceptual?.tags || [];
    handleUpdateTable({
      conceptual: {
        ...table!.conceptual,
        tags: currentTags.filter(t => t !== tagToRemove)
      }
    });
  };

  const handleUpdateSampleData = (newSample: any[][]) => {
    handleUpdateTable({ sampleData: newSample });
  };

  const handleAddSampleRow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentSample = table!.sampleData || [];
    const colCount = table!.columns?.length || 0;
    const newRow = new Array(colCount).fill('');
    handleUpdateSampleData([...currentSample, newRow]);
  };

  const handleRemoveSampleRow = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const currentSample = table!.sampleData || [];
    const newRows = currentSample.filter((_, i) => i !== index);
    handleUpdateSampleData(newRows);
  };

  const handleUpdateSampleCell = (rowIndex: number, colIndex: number, value: any) => {
    const currentSample = [...(table!.sampleData || [])];
    if (!currentSample[rowIndex]) return;
    
    const newRow = [...currentSample[rowIndex]];
    newRow[colIndex] = value;
    currentSample[rowIndex] = newRow;
    handleUpdateSampleData(currentSample);
  };

  return (
    <div 
      className="bg-slate-900 border-t border-slate-800 shadow-2xl z-50 flex flex-col text-slate-100"
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
      style={{ ...panelStyle, borderTopColor: themeColor }}
    >
      {/* Resize Handle */}
      <div 
        onMouseDown={startResizing}
        style={{
          position: 'absolute',
          top: '-4px',
          left: 0,
          right: 0,
          height: '8px',
          cursor: 'ns-resize',
          zIndex: 60
        }}
      />
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #1e293b', backgroundColor: '#020617' }}>
        <div style={{ flex: 1 }}>
          {/* Top Row: Icon, ID, and Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
            <span style={{ 
              fontSize: '11px', 
              color: '#94a3b8', 
              textTransform: 'uppercase', 
              fontFamily: 'monospace',
              letterSpacing: '0.05em'
            }}>
              {table!.id}
            </span>
            {typeLabel && (
              <span style={{ 
                fontSize: '9px', 
                fontWeight: 800, 
                padding: '1px 5px', 
                borderRadius: '3px', 
                backgroundColor: `${themeColor}30`, 
                color: themeColor, 
                border: `1px solid ${themeColor}50`,
                textTransform: 'uppercase'
              }}>
                {typeLabel}
              </span>
            )}
          </div>

          {/* Primary Row: Editable Table Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              value={table!.name}
              onChange={(e) => handleUpdateTable({ name: e.target.value })}
              title="Logical Table Name"
              style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#ffffff', 
                backgroundColor: 'transparent', 
                border: 'none',
                borderBottom: '1px solid transparent',
                padding: '2px 0',
                outline: 'none',
                width: '100%',
                maxWidth: '500px'
              }}
              onFocus={(e) => (e.target as HTMLInputElement).style.borderBottom = '1px solid #3b82f6'}
              onBlur={(e) => (e.target as HTMLInputElement).style.borderBottom = '1px solid transparent'}
            />
          </div>
        </div>

        {/* Quick Access Metadata Selectors */}
        <div style={{ display: 'flex', gap: '8px', marginRight: '16px' }}>
          <select 
            value={table!.appearance?.sub_type || ''}
            onChange={(e) => handleUpdateTable({ appearance: { ...table!.appearance, sub_type: (e.target.value || undefined) as any } })}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded outline-none"
            title="Table Sub-type"
          >
            <option value="">- Sub-type -</option>
            <option value="transaction">Transaction</option>
            <option value="periodic">Periodic Snapshot</option>
            <option value="accumulating">Accumulating Snapshot</option>
            <option value="factless">Factless</option>
            <option value="conformed">Conformed</option>
            <option value="junk">Junk</option>
            <option value="degenerate">Degenerate</option>
          </select>
          
          <select 
            value={table!.appearance?.scd || ''}
            onChange={(e) => handleUpdateTable({ appearance: { ...table!.appearance, scd: (e.target.value || undefined) as any } })}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded outline-none"
            title="SCD Type"
          >
            <option value="">- SCD Type -</option>
            <option value="type0">SCD Type 0</option>
            <option value="type1">SCD Type 1</option>
            <option value="type2">SCD Type 2</option>
            <option value="type3">SCD Type 3</option>
            <option value="type4">SCD Type 4</option>
            <option value="type5">SCD Type 5</option>
            <option value="type6">SCD Type 6</option>
            <option value="type7">SCD Type 7</option>
          </select>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTableId(null);
          }}
          style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '50%' }}
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', padding: '0 20px', borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab(tab.id);
            }}
            style={{ 
              padding: '12px 0', 
              backgroundColor: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent', 
              color: activeTab === tab.id ? '#60a5fa' : '#94a3b8',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px 20px' }}>
        {activeTab === 'conceptual' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Description</h3>
              <textarea 
                value={table!.conceptual?.description || ''}
                onChange={(e) => handleUpdateTable({ 
                  conceptual: { ...table!.conceptual, description: e.target.value } 
                })}
                placeholder="Enter business description..."
                style={{ 
                  width: '100%', 
                  minHeight: '100px',
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155', 
                  borderRadius: '6px',
                  padding: '12px',
                  color: '#e2e8f0',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </section>
            
            <section>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Domain Assignment</h3>
              <select 
                value={schema?.domains?.find(d => d.tables.includes(table!.id))?.id || ''}
                onChange={(e) => assignTableToDomain(table!.id, e.target.value || null)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm p-2 rounded outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">- No Domain -</option>
                {schema?.domains?.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
                ))}
              </select>
            </section>
            
            <section>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {table!.conceptual?.tags?.map(tag => (
                  <span key={tag} className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs">
                    {tag}
                    <button onClick={(e) => handleRemoveTag(e, tag)} className="hover:text-red-400"><X size={12} /></button>
                  </span>
                ))}
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="+ New Tag"
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: '1px dashed #334155', 
                      borderRadius: '16px',
                      padding: '4px 12px',
                      fontSize: '11px',
                      color: '#e2e8f0',
                      outline: 'none',
                      width: '100px'
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        )}
        
        {activeTab === 'logical' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Logical Model</h3>
              <button onClick={handleAddColumn} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors">
                <Plus size={14} /> Add Column
              </button>
            </div>
            
            <div style={{ border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', textAlign: 'left' }}>
                  <tr>
                    <th style={{ padding: '10px 16px', color: '#64748b', width: '35%' }}>Logical Name</th>
                    <th style={{ padding: '10px 16px', color: '#64748b', width: '15%' }}>Role</th>
                    <th style={{ padding: '10px 16px', color: '#64748b', width: '15%' }}>Type</th>
                    <th style={{ padding: '10px 16px', color: '#64748b', width: '30%' }}>Description</th>
                    <th style={{ padding: '10px 16px', width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {(table!.columns || []).map(col => (
                    <tr key={col.id} style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a' }}>
                      <td style={{ padding: '6px 16px' }}>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpdateLogicalColumn(col.id, { isPrimaryKey: !col.logical?.isPrimaryKey })}
                            title="Primary Key"
                            className={`transition-opacity ${col.logical?.isPrimaryKey ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}
                          >🔑</button>
                          <input 
                            value={col.logical?.name || col.id}
                            onChange={(e) => handleUpdateLogicalColumn(col.id, { name: e.target.value })}
                            className="bg-transparent border-none text-slate-100 w-full outline-none p-1 focus:bg-slate-800 rounded"
                          />
                        </div>
                      </td>
                      <td style={{ padding: '6px 16px' }}>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpdateLogicalColumn(col.id, { isMetadata: !col.logical?.isMetadata })}
                            title="Metadata/Audit"
                            className={`transition-opacity text-sm ${col.logical?.isMetadata ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}
                          >🕒</button>
                          <select
                            value={col.logical?.additivity || ''}
                            onChange={(e) => handleUpdateLogicalColumn(col.id, { additivity: (e.target.value || undefined) as any })}
                            title="Additivity (for Measures)"
                            style={{ fontSize: '10px' }}
                            className="bg-slate-800 border border-slate-700 text-slate-400 p-1 rounded outline-none"
                          >
                            <option value="">-</option>
                            <option value="fully">Σ (Full)</option>
                            <option value="semi">Σ~ (Semi)</option>
                            <option value="non">⊘ (Non)</option>
                          </select>
                        </div>
                      </td>
                      <td style={{ padding: '6px 16px' }}>
                        <input 
                          value={col.logical?.type || ''}
                          onChange={(e) => handleUpdateLogicalColumn(col.id, { type: e.target.value })}
                          placeholder="Type..."
                          className="bg-transparent border-none text-slate-400 font-mono text-[11px] w-full outline-none p-1 focus:bg-slate-800 rounded"
                        />
                      </td>
                      <td style={{ padding: '6px 16px' }}>
                        <input 
                          value={col.logical?.description || ''}
                          onChange={(e) => handleUpdateLogicalColumn(col.id, { description: e.target.value })}
                          placeholder="Description..."
                          className="bg-transparent border-none text-slate-500 text-[11px] w-full outline-none p-1 focus:bg-slate-800 rounded"
                        />
                      </td>
                      <td style={{ padding: '6px 16px', textAlign: 'right' }}>
                        <button onClick={(e) => handleRemoveColumn(e, col.id)} className="text-red-500/50 hover:text-red-500 p-1 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'physical' && (
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Physical Mappings</h3>
              </div>
              
              <div style={{ border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', textAlign: 'left' }}>
                    <tr>
                      <th style={{ padding: '10px 16px', color: '#64748b', width: '25%' }}>Logical Column</th>
                      <th style={{ padding: '10px 16px', color: '#64748b', width: '30%' }}>DB Column Name</th>
                      <th style={{ padding: '10px 16px', color: '#64748b', width: '20%' }}>DB Type</th>
                      <th style={{ padding: '10px 16px', color: '#64748b', width: '25%' }}>Constraints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(table!.columns || []).map(col => (
                      <tr key={col.id} style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a' }}>
                        <td style={{ padding: '6px 16px', color: '#94a3b8', borderRight: '1px solid #1e293b' }}>
                          <div className="text-[11px] font-medium truncate" title={col.logical?.name || col.id}>
                            {col.logical?.name || col.id}
                          </div>
                        </td>
                        <td style={{ padding: '6px 16px' }}>
                          <input 
                            value={col.physical?.name || ''}
                            onChange={(e) => handleUpdatePhysicalColumn(col.id, { name: e.target.value })}
                            placeholder={col.logical?.name.toLowerCase().replace(/ /g, '_')}
                            className="bg-transparent border-none text-blue-400 font-mono text-[11px] w-full outline-none p-1 focus:bg-slate-800 rounded"
                          />
                        </td>
                        <td style={{ padding: '6px 16px' }}>
                          <input 
                            value={col.physical?.type || ''}
                            onChange={(e) => handleUpdatePhysicalColumn(col.id, { type: e.target.value })}
                            placeholder={col.logical?.type.toUpperCase()}
                            className="bg-transparent border-none text-slate-400 font-mono text-[11px] w-full outline-none p-1 focus:bg-slate-800 rounded"
                          />
                        </td>
                        <td style={{ padding: '6px 16px' }}>
                          <input 
                            value={col.physical?.constraints?.join(', ') || ''}
                            onChange={(e) => handleUpdatePhysicalColumn(col.id, { constraints: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            placeholder="e.g. NOT NULL"
                            className="bg-transparent border-none text-slate-500 text-[11px] w-full outline-none p-1 focus:bg-slate-800 rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'sample' && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sample Data Editor</h3>
              <div className="flex gap-2">
                <button 
                  onClick={handleAddSampleRow} 
                  disabled={!table!.columns || table!.columns.length === 0}
                  className={`flex items-center gap-2 px-3 py-1.5 text-white rounded text-xs transition-colors ${
                    (!table!.columns || table!.columns.length === 0) 
                      ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Plus size={14} /> Add Row
                </button>
              </div>
            </div>

            {!table!.columns || table!.columns.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-lg border border-dashed border-slate-800">
                <TableIcon size={32} className="text-slate-700 mb-4" />
                <p className="text-sm text-slate-400 mb-1">No columns defined yet.</p>
                <p className="text-xs text-slate-500 italic">Add columns in the "Logical" tab first to enable sample data.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto border border-slate-800 rounded-lg">
                <table className="w-full border-collapse text-xs">
                  <thead className="sticky top-0 bg-slate-950 z-10 border-bottom border-slate-800">
                    <tr>
                      {(table!.columns || []).map((col) => {
                        return (
                          <th key={col.id} className="p-3 text-left border-r border-slate-800 min-w-[140px]">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-slate-200">{col?.logical?.name || col.id}</span>
                              <span className="text-[10px] text-blue-400 font-mono italic">
                                {col?.physical?.name || col?.logical?.name?.toLowerCase().replace(/ /g, '_') || col.id}
                              </span>
                            </div>
                          </th>
                        );
                      })}
                      <th className="w-10 bg-slate-950"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(table!.sampleData || []).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-slate-800 hover:bg-slate-800/30">
                        {(table!.columns || []).map((col, colIndex) => (
                          <td key={col.id} className="p-0 border-r border-slate-800">
                            <input 
                              value={String(row[colIndex] ?? '')}
                              onChange={(e) => handleUpdateSampleCell(rowIndex, colIndex, e.target.value)}
                              className="w-full bg-transparent border-none p-3 outline-none focus:bg-slate-800 text-slate-300 font-mono"
                            />
                          </td>
                        ))}
                        <td className="p-2 text-center">
                          <button onClick={(e) => handleRemoveSampleRow(e, rowIndex)} className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
                    {(!table!.sampleData || table!.sampleData.length === 0) && (
                      <tr>
                        <td 
                          colSpan={(table!.columns?.length || 0) + 1} 
                          className="p-8 text-center text-slate-500 italic bg-slate-900/20"
                        >
                          No rows defined. Click "Add Row" to start.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailPanel
