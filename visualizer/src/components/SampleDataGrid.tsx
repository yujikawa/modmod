import type { Table as TableType, SampleData } from '../types/schema'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table'
import { useStore } from '../store/useStore'

interface SampleDataGridProps {
  table: TableType;
  sampleData: SampleData;
}

const SampleDataGrid = ({ table, sampleData }: SampleDataGridProps) => {
  const setHoveredColumnId = useStore(state => state.setHoveredColumnId)

  // Map column IDs to logical names for headers
  const getHeaderName = (colId: string) => {
    const col = table.columns.find(c => c.id === colId)
    return col ? col.logical.name : colId
  }

  return (
    <div className="border border-slate-800 rounded-md overflow-hidden bg-slate-900">
      <Table>
        <TableHeader className="bg-slate-950 sticky top-0 z-10 border-b border-slate-800">
          <TableRow className="hover:bg-transparent border-b-0">
            {sampleData.columns.map((colId) => (
              <TableHead 
                key={colId} 
                onMouseEnter={() => setHoveredColumnId(colId)}
                onMouseLeave={() => setHoveredColumnId(null)}
                className="font-bold text-slate-100 border-r border-slate-800 last:border-0 hover:bg-slate-800 transition-colors cursor-default"
              >
                {getHeaderName(colId)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleData.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-slate-800/50 border-b border-slate-800 last:border-0">
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="border-r border-slate-800 last:border-0 py-2 text-slate-300">
                  <div className="max-w-[200px] truncate text-xs font-mono" title={String(cell)}>
                    {String(cell)}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default SampleDataGrid
