import { useStore } from '../store/useStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { X } from 'lucide-react'
import SampleDataGrid from './SampleDataGrid'

const DetailPanel = () => {
  const { selectedTableId, getSelectedTable, setSelectedTableId } = useStore()
  const table = getSelectedTable()

  if (!selectedTableId || !table) return null

  return (
    <div className="absolute bottom-0 left-1/3 right-0 h-1/2 bg-slate-900 border-t border-slate-800 shadow-2xl z-50 flex flex-col transition-transform animate-in slide-in-from-bottom duration-300 text-slate-100">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950">
        <div>
          <h2 className="text-lg font-bold text-white">{table.name}</h2>
          <p className="text-xs text-slate-400 uppercase tracking-wider">{table.id}</p>
        </div>
        <button 
          onClick={() => setSelectedTableId(null)}
          className="p-1 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>
      
      <Tabs defaultValue="conceptual" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 border-b border-slate-800 bg-slate-900">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger 
              value="conceptual" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 px-0 py-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Conceptual
            </TabsTrigger>
            <TabsTrigger 
              value="logical"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 px-0 py-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Logical
            </TabsTrigger>
            <TabsTrigger 
              value="physical"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 px-0 py-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Physical
            </TabsTrigger>
            <TabsTrigger 
              value="sample"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 px-0 py-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Sample Data
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full bg-slate-900">
            <TabsContent value="conceptual" className="p-4 m-0">
              <div className="space-y-4">
                <section>
                  <h3 className="text-sm font-semibold text-slate-200 mb-2">Description</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {table.conceptual?.description || "No description provided."}
                  </p>
                </section>
                {table.conceptual?.tags && (
                  <section>
                    <h3 className="text-sm font-semibold text-slate-200 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {table.conceptual.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-900/30 text-blue-300 text-xs font-medium rounded border border-blue-800/50 uppercase tracking-tight">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="logical" className="p-4 m-0">
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-950 border-b border-slate-800 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-slate-200">Name</th>
                      <th className="px-4 py-2 font-semibold text-slate-200">Type</th>
                      <th className="px-4 py-2 font-semibold text-slate-200">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-900/50">
                    {table.columns.map(col => (
                      <tr key={col.id} className="border-b border-slate-800 last:border-0 text-slate-400">
                        <td className="px-4 py-2 font-medium text-slate-200">
                          {col.logical.isPrimaryKey && <span className="mr-1 text-yellow-500">🔑</span>}
                          {col.logical.name}
                        </td>
                        <td className="px-4 py-2 text-slate-400 italic font-mono text-xs">{col.logical.type}</td>
                        <td className="px-4 py-2 text-slate-500 text-xs">{col.logical.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="physical" className="p-4 m-0">
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-950 border-b border-slate-800 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-slate-200">Physical Name</th>
                      <th className="px-4 py-2 font-semibold text-slate-200">DB Type</th>
                      <th className="px-4 py-2 font-semibold text-slate-200">Constraints</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-900/50">
                    {table.columns.map(col => (
                      <tr key={col.id} className="border-b border-slate-800 last:border-0 text-slate-400">
                        <td className="px-4 py-2 font-mono text-xs text-slate-200">
                          {col.physical?.name || col.logical.name.toLowerCase().replace(/ /g, '_')}
                        </td>
                        <td className="px-4 py-2 text-slate-400 font-mono text-xs uppercase">
                          {col.physical?.type || col.logical.type}
                        </td>
                        <td className="px-4 py-2 text-slate-500 text-xs">
                          {col.physical?.constraints?.join(', ') || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="sample" className="p-4 m-0">
              {table.sampleData ? (
                <SampleDataGrid table={table} sampleData={table.sampleData} />
              ) : (
                <div className="text-sm text-slate-400 italic">No sample data available for this table.</div>
              )}
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  )
}

export default DetailPanel
