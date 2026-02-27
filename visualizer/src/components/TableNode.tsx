import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { Table } from '../types/schema'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { cn } from '../lib/utils'
import { useStore } from '../store/useStore'

const TableNode = ({ data, selected }: NodeProps<{ table: Table }>) => {
  const { table } = data
  const hoveredColumnId = useStore(state => state.hoveredColumnId)

  return (
    <Card className={cn(
      "min-w-[200px] border-2 transition-all bg-slate-800 border-slate-700",
      selected ? "border-blue-500 ring-2 ring-blue-500/50" : "border-slate-700"
    )}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-slate-400" />
      
      <CardHeader className="p-3 bg-slate-900/50 border-b border-slate-700">
        <CardTitle className="text-sm font-bold flex flex-col text-slate-100">
          <span>{table.name}</span>
          <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider">
            {table.id}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <table className="w-full text-[11px]">
          <tbody>
            {table.columns.map((col) => (
              <tr 
                key={col.id} 
                className={cn(
                  "border-b border-slate-700 last:border-0 transition-colors",
                  hoveredColumnId === col.id ? "bg-blue-900/50" : "hover:bg-slate-700/50"
                )}
              >
                <td className="px-3 py-1 font-medium text-slate-200">
                  {col.logical.isPrimaryKey && <span className="text-yellow-500 mr-1">🔑</span>}
                  {col.logical.name}
                </td>
                <td className="px-3 py-1 text-slate-400 text-right italic">
                  {col.logical.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-slate-400" />
    </Card>
  )
}

export default memo(TableNode)
