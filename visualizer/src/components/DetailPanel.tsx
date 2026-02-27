import { useState } from 'react'
import { useStore } from '../store/useStore'
import { X } from 'lucide-react'
import SampleDataGrid from './SampleDataGrid'

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

  return (
    <div 
      style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: '33.33%', 
        right: 0, 
        height: '50%', 
        backgroundColor: '#0f172a', 
        borderTop: '1px solid #1e293b', 
        zIndex: 1000, 
        display: 'flex', 
        flexDirection: 'column',
        color: '#f1f5f9',
        boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.3)',
        fontFamily: 'sans-serif'
      }}
    >
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #1e293b', backgroundColor: '#020617' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{table.name}</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>{table.id}</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTableId(null);
          }}
          style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '50%' }}
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Custom Tabs List */}
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
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {activeTab === 'conceptual' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>Description</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
                {table.conceptual?.description || "No description provided."}
              </p>
            </section>
            {table.conceptual?.tags && table.conceptual.tags.length > 0 && (
              <section>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>Tags</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {table.conceptual.tags.map(tag => (
                    <span key={tag} style={{ padding: '2px 10px', backgroundColor: 'rgba(30, 58, 138, 0.3)', color: '#93c5fd', fontSize: '11px', borderRadius: '4px', border: '1px solid rgba(30, 58, 138, 0.5)', textTransform: 'uppercase' }}>
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
              <div style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>No logical columns defined yet.</div>
            ) : (
              <div style={{ border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', textAlign: 'left' }}>
                    <tr>
                      <th style={{ padding: '10px 16px', fontWeight: 600, color: '#e2e8f0' }}>Name</th>
                      <th style={{ padding: '10px 16px', fontWeight: 600, color: '#e2e8f0' }}>Type</th>
                      <th style={{ padding: '10px 16px', fontWeight: 600, color: '#e2e8f0' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns!.map(col => (
                      <tr key={col.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 500, color: '#e2e8f0' }}>
                          {col.logical?.isPrimaryKey && <span style={{ marginRight: '6px' }}>🔑</span>}
                          {col.logical?.name || col.id}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#94a3b8', fontStyle: 'italic', fontFamily: 'monospace', fontSize: '12px' }}>{col.logical?.type || 'Unknown'}</td>
                        <td style={{ padding: '10px 16px', color: '#64748b', fontSize: '12px' }}>{col.logical?.description || '-'}</td>
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
              <div style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>No physical columns defined yet.</div>
            ) : (
              <div style={{ border: '1px solid #1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', textAlign: 'left' }}>
                    <tr>
                      <th style={{ padding: '10px 16px', fontWeight: 600, color: '#e2e8f0' }}>Physical Name</th>
                      <th style={{ padding: '10px 16px', fontWeight: 600, color: '#e2e8f0' }}>DB Type</th>
                      <th style={{ padding: '10px 16px', fontWeight: 600, color: '#e2e8f0' }}>Constraints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns!.map(col => (
                      <tr key={col.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#e2e8f0' }}>
                          {col.physical?.name || col.logical?.name.toLowerCase().replace(/ /g, '_') || col.id}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '12px', textTransform: 'uppercase' }}>
                          {col.physical?.type || col.logical?.type || 'Unknown'}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#64748b', fontSize: '12px' }}>
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
              <div style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>No sample data available for this table.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailPanel
