import { useState } from 'react'
import { useStore } from '../store/useStore'
import { X, Plus, Trash2, Tag as TagIcon, Table as TableIcon, Layers, Database } from 'lucide-react'
import type { Table, Column, SampleData } from '../types/schema'

const TYPE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  fact: { color: '#f87171', icon: '📊', label: 'FACT' },
  dimension: { color: '#60a5fa', icon: '🏷️', label: 'DIM' },
  hub: { color: '#fbbf24', icon: '🌐', label: 'HUB' },
  link: { color: '#34d399', icon: '🔗', label: 'LINK' },
  satellite: { color: '#a78bfa', icon: '🛰️', label: 'SAT' }
};

const DetailPanel = () => {
  const { 
    selectedTableId, 
    getSelectedTable, 
    getSelectedDomain,
    setSelectedTableId, 
    updateTable,
    updateDomain 
  } = useStore()
  
  const table = getSelectedTable()
  const domain = getSelectedDomain()
  
  const [activeTab, setActiveTab] = useState('conceptual')
  const [tagInput, setTagInput] = useState('')

  if (!selectedTableId) return null
  if (!table && !domain) return null

  // --- Domain Editor Rendering ---
  if (domain) {
    return (
      <div 
        className="bg-slate-900 border-t border-slate-800 shadow-2xl z-50 flex flex-col text-slate-100"
        style={{ 
          height: '35vh', 
          maxHeight: '400px',
          minHeight: '200px',
          backgroundColor: '#0f172a', 
          borderTop: `2px solid ${domain.color || '#3b82f6'}`,
          display: 'flex', 
          flexDirection: 'column',
          color: '#f1f5f9',
          boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.4)',
          fontFamily: 'sans-serif'
        }}
      >
        {/* Panel Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', borderBottom: '1px solid #1e293b', backgroundColor: '#020617' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <Layers size={18} style={{ color: domain.color || '#3b82f6' }} />
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
    { id: 'logical', label: 'Logical', icon: <Layers size={14} /> },
    { id: 'physical', label: 'Physical', icon: <Database size={14} /> },
    { id: 'sample', label: 'Sample Data', icon: <TableIcon size={14} /> }
  ]

  const typeConfig = table!.appearance?.type ? TYPE_CONFIG[table!.appearance.type] : null;
  const themeColor = table!.appearance?.color || typeConfig?.color || '#334155';
  const icon = table!.appearance?.icon || typeConfig?.icon || '';
  const typeLabel = typeConfig?.label || '';

  const handleUpdateTable = (updates: Partial<Table>) => {
    updateTable(table!.id, updates);
  };

  const handleAddColumn = () => {
    const newCol: Column = {
      id: `col_${Date.now()}`,
      logical: { name: 'New Column', type: 'String', description: '' },
      physical: { name: '', type: 'VARCHAR(255)', constraints: [] }
    };
    handleUpdateTable({ columns: [...(table!.columns || []), newCol] });
  };

  const handleRemoveColumn = (colId: string) => {
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

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = table!.conceptual?.tags || [];
    handleUpdateTable({
      conceptual: {
        ...table!.conceptual,
        tags: currentTags.filter(t => t !== tagToRemove)
      }
    });
  };

  const handleUpdateSampleData = (updates: Partial<SampleData>) => {
    const currentSample = table!.sampleData || { columns: [], rows: [] };
    handleUpdateTable({ 
      sampleData: { ...currentSample, ...updates } 
    });
  };

  const handleAddSampleRow = () => {
    const currentSample = table!.sampleData || { columns: [], rows: [] };
    const newRow = new Array(currentSample.columns.length).fill('');
    handleUpdateSampleData({ rows: [...currentSample.rows, newRow] });
  };

  const handleRemoveSampleRow = (index: number) => {
    const currentSample = table!.sampleData || { columns: [], rows: [] };
    const newRows = currentSample.rows.filter((_, i) => i !== index);
    handleUpdateSampleData({ rows: newRows });
  };

  const handleUpdateSampleCell = (rowIndex: number, colIndex: number, value: any) => {
    const currentSample = table!.sampleData || { columns: [], rows: [] };
    const newRows = [...currentSample.rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;
    handleUpdateSampleData({ rows: newRows });
  };

  const handleAddSampleColumn = (colId: string) => {
    const currentSample = table!.sampleData || { columns: [], rows: [] };
    if (currentSample.columns.includes(colId)) return;
    
    const newCols = [...currentSample.columns, colId];
    const newRows = currentSample.rows.map(row => [...row, '']);
    handleUpdateSampleData({ columns: newCols, rows: newRows });
  };

  const handleRemoveSampleColumn = (colId: string) => {
    const currentSample = table!.sampleData || { columns: [], rows: [] };
    const colIndex = currentSample.columns.indexOf(colId);
    if (colIndex === -1) return;

    const newCols = currentSample.columns.filter(c => c !== colId);
    const newRows = currentSample.rows.map(row => row.filter((_, i) => i !== colIndex));
    handleUpdateSampleData({ columns: newCols, rows: newRows });
  };

  return (
    <div 
      className="bg-slate-900 border-t border-slate-800 shadow-2xl z-50 flex flex-col text-slate-100"
      style={{ 
        height: '45vh', 
        maxHeight: '600px',
        minHeight: '300px',
        backgroundColor: '#0f172a', 
        borderTop: `2px solid ${themeColor}`,
        display: 'flex', 
        flexDirection: 'column',
        color: '#f1f5f9',
        boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.4)',
        fontFamily: 'sans-serif'
      }}
    >
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', borderBottom: '1px solid #1e293b', backgroundColor: '#020617' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                value={table!.name}
                onChange={(e) => handleUpdateTable({ name: e.target.value })}
                title="Logical Table Name"
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
              {typeLabel && (
                <span style={{ 
                  fontSize: '9px', 
                  fontWeight: 800, 
                  padding: '1px 5px', 
                  borderRadius: '3px', 
                  backgroundColor: `${themeColor}20`, 
                  color: themeColor,
                  border: `1px solid ${themeColor}40`,
                  textTransform: 'uppercase'
                }}>
                  {typeLabel}
                </span>
              )}
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>{table!.id}</p>
          </div>
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
            onClick={() => setActiveTab(tab.id)}
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
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {table!.conceptual?.tags?.map(tag => (
                  <span key={tag} className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-400"><X size={12} /></button>
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
                    <th style={{ padding: '10px 16px', color: '#64748b', width: '30%' }}>Logical Name</th>
                    <th style={{ padding: '10px 16px', color: '#64748b', width: '20%' }}>Type</th>
                    <th style={{ padding: '10px 16px', color: '#64748b', width: '40%' }}>Description</th>
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
                        <button onClick={() => handleRemoveColumn(col.id)} className="text-red-500/50 hover:text-red-500 p-1 transition-colors">
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
                <select 
                  className="bg-slate-800 border border-slate-700 text-xs rounded px-2 outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.value) handleAddSampleColumn(e.target.value);
                    e.target.value = '';
                  }}
                  value=""
                >
                  <option value="">+ Add Column</option>
                  {(table!.columns || []).filter(c => !table!.sampleData?.columns.includes(c.id)).map(c => (
                    <option key={c.id} value={c.id}>{c.logical?.name || c.id}</option>
                  ))}
                </select>
                <button onClick={handleAddSampleRow} className="flex items-center gap-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs transition-colors">
                  <Plus size={14} /> Add Row
                </button>
              </div>
            </div>

            {!table!.sampleData || table!.sampleData.columns.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-lg border border-dashed border-slate-700">
                <p className="text-sm text-slate-500 italic mb-4">No sample data structure defined.</p>
                <button 
                  onClick={() => handleUpdateTable({ sampleData: { columns: (table!.columns || []).slice(0,3).map(c => c.id), rows: [['Sample 1', 'Sample 2', 'Sample 3']] } })}
                  className="text-blue-500 hover:underline text-xs"
                >Auto-generate from first 3 columns</button>
              </div>
            ) : (
              <div className="flex-1 overflow-auto border border-slate-800 rounded-lg">
                <table className="w-full border-collapse text-xs">
                  <thead className="sticky top-0 bg-slate-950 z-10 border-bottom border-slate-800">
                    <tr>
                      {table!.sampleData.columns.map((colId) => {
                        const col = table!.columns?.find(c => c.id === colId);
                        return (
                          <th key={colId} className="p-3 text-left border-r border-slate-800 min-w-[140px]">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-slate-200">{col?.logical?.name || colId}</span>
                                <span className="text-[10px] text-blue-400 font-mono italic">
                                  {col?.physical?.name || col?.logical?.name?.toLowerCase().replace(/ /g, '_') || colId}
                                </span>
                              </div>
                              <button onClick={() => handleRemoveSampleColumn(colId)} className="text-slate-600 hover:text-red-400 p-0.5"><X size={10} /></button>
                            </div>
                          </th>
                        );
                      })}
                      <th className="w-10 bg-slate-950"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {table!.sampleData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-slate-800 hover:bg-slate-800/30">
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="p-0 border-r border-slate-800">
                            <input 
                              value={String(cell)}
                              onChange={(e) => handleUpdateSampleCell(rowIndex, colIndex, e.target.value)}
                              className="w-full bg-transparent border-none p-3 outline-none focus:bg-slate-800 text-slate-300 font-mono"
                            />
                          </td>
                        ))}
                        <td className="p-2 text-center">
                          <button onClick={() => handleRemoveSampleRow(rowIndex)} className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
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
