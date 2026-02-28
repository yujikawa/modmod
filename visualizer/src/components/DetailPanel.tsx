import { useState } from 'react'
import { useStore } from '../store/useStore'
import { X } from 'lucide-react'
import SampleDataGrid from './SampleDataGrid'

const TYPE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  fact: { color: '#f87171', icon: '📊', label: 'FACT' },
  dimension: { color: '#60a5fa', icon: '🏷️', label: 'DIM' },
  hub: { color: '#fbbf24', icon: '🌐', label: 'HUB' },
  link: { color: '#34d399', icon: '🔗', label: 'LINK' },
  satellite: { color: '#a78bfa', icon: '🛰️', label: 'SAT' }
};

const DetailPanel = () => {
  const { selectedTableId, getSelectedTable, setSelectedTableId } = useStore()
  const table = getSelectedTable()
  const [activeTab, setActiveTab] = useState('conceptual')

  if (!selectedTableId || !table) return null

  const tabs = [
    { id: 'conceptual', label: 'Conceptual' },
    { id: 'logical', label: 'Logical' },
    { id: 'physical', label: 'Physical' },
    { id: 'sample', label: 'Sample Data' }
  ]

  const hasColumns = table.columns && table.columns.length > 0;

  // Resolve appearance for DetailPanel header
  const typeConfig = table.appearance?.type ? TYPE_CONFIG[table.appearance.type] : null;
  const themeColor = table.appearance?.color || typeConfig?.color || '#334155';
  const icon = table.appearance?.icon || typeConfig?.icon || '';
  const typeLabel = typeConfig?.label || '';

  return (
    <div 
      className="bg-slate-900 border-t border-slate-800 shadow-2xl z-50 flex flex-col text-slate-100"
      style={{ 
        height: '35vh', // Fixed height for L-shape
        maxHeight: '400px',
        minHeight: '200px',
        backgroundColor: '#0f172a', 
        borderTop: `2px solid ${themeColor}`, // Reduced from 4px to 2px
        display: 'flex', 
        flexDirection: 'column',
        color: '#f1f5f9',
        boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.3)',
        fontFamily: 'sans-serif'
      }}
    >
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', borderBottom: '1px solid #1e293b', backgroundColor: '#020617' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{table.name}</h2>
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
            <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>{table.id}</p>
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
      
      {/* Custom Tabs List */}
      <div style={{ display: 'flex', gap: '24px', padding: '0 20px', borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              padding: '10px 0', 
              backgroundColor: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent', 
              color: activeTab === tab.id ? '#60a5fa' : '#94a3b8',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content Area - Scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px 20px' }}>
        {activeTab === 'conceptual' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <section>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>Description</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                {table.conceptual?.description || "No description provided."}
              </p>
            </section>
            {table.conceptual?.tags && table.conceptual.tags.length > 0 && (
              <section>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>Tags</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {table.conceptual.tags.map(tag => (
                    <span key={tag} style={{ padding: '2px 10px', backgroundColor: 'rgba(30, 58, 138, 0.3)', color: '#93c5fd', fontSize: '10px', borderRadius: '4px', border: '1px solid rgba(30, 58, 138, 0.5)', textTransform: 'uppercase' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
        
        {activeTab === 'logical' && (
          <div>
            {!hasColumns ? (
              <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>No logical columns defined yet.</div>
            ) : (
              <div style={{ border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', textAlign: 'left' }}>
                    <tr>
                      <th style={{ padding: '8px 16px', fontWeight: 600, color: '#e2e8f0' }}>Name</th>
                      <th style={{ padding: '8px 16px', fontWeight: 600, color: '#e2e8f0' }}>Type</th>
                      <th style={{ padding: '8px 16px', fontWeight: 600, color: '#e2e8f0' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns!.map(col => (
                      <tr key={col.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '8px 16px', fontWeight: 500, color: '#e2e8f0' }}>
                          {col.logical?.isPrimaryKey && <span style={{ marginRight: '6px' }}>🔑</span>}
                          {col.logical?.name || col.id}
                        </td>
                        <td style={{ padding: '8px 16px', color: '#94a3b8', fontStyle: 'italic', fontFamily: 'monospace', fontSize: '11px' }}>{col.logical?.type || 'Unknown'}</td>
                        <td style={{ padding: '8px 16px', color: '#64748b', fontSize: '11px' }}>{col.logical?.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'physical' && (
          <div>
            {!hasColumns ? (
              <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>No physical columns defined yet.</div>
            ) : (
              <div style={{ border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', textAlign: 'left' }}>
                    <tr>
                      <th style={{ padding: '8px 16px', fontWeight: 600, color: '#e2e8f0' }}>Physical Name</th>
                      <th style={{ padding: '8px 16px', fontWeight: 600, color: '#e2e8f0' }}>DB Type</th>
                      <th style={{ padding: '8px 16px', fontWeight: 600, color: '#e2e8f0' }}>Constraints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns!.map(col => (
                      <tr key={col.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '8px 16px', fontFamily: 'monospace', fontSize: '11px', color: '#e2e8f0' }}>
                          {col.physical?.name || col.logical?.name.toLowerCase().replace(/ /g, '_') || col.id}
                        </td>
                        <td style={{ padding: '8px 16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase' }}>
                          {col.physical?.type || col.logical?.type || 'Unknown'}
                        </td>
                        <td style={{ padding: '8px 16px', color: '#64748b', fontSize: '11px' }}>
                          {col.physical?.constraints?.join(', ') || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'sample' && (
          <div>
            {table.sampleData ? (
              <SampleDataGrid table={table} sampleData={table.sampleData} />
            ) : (
              <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>No sample data available for this table.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailPanel
