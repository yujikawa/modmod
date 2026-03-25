import { useState, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { Search, ArrowUpRight, Database } from 'lucide-react'
import type { Table, Column } from '../../types/schema'

const MAX_RESULTS = 50

interface SearchResult {
  table: Table
  column: Column
}

function matchesKeyword(value: string | undefined, keyword: string): boolean {
  if (!value) return false
  return value.toLowerCase().includes(keyword)
}

function searchModel(tables: Table[], keyword: string): SearchResult[] {
  const kw = keyword.toLowerCase().trim()
  if (!kw) return []

  const results: SearchResult[] = []

  for (const table of tables) {
    if (results.length >= MAX_RESULTS) break

    const tableMatches =
      matchesKeyword(table.name, kw) ||
      matchesKeyword(table.logical_name, kw) ||
      matchesKeyword(table.physical_name, kw) ||
      matchesKeyword(table.conceptual?.description, kw)

    for (const column of table.columns ?? []) {
      if (results.length >= MAX_RESULTS) break

      const columnMatches =
        matchesKeyword(column.id, kw) ||
        matchesKeyword(column.logical?.name, kw) ||
        matchesKeyword(column.logical?.description, kw) ||
        matchesKeyword(column.physical?.name, kw) ||
        (column.logical as any)?.tags?.some((tag: string) =>
          tag.toLowerCase().includes(kw)
        )

      if (tableMatches || columnMatches) {
        results.push({ table, column })
      }
    }
  }

  return results
}

const InformationSearchTab = () => {
  const { schema, theme, setSelectedTableId, setFocusNodeId } = useStore()
  const [query, setQuery] = useState('')

  const results = useMemo(
    () => searchModel(schema?.tables ?? [], query),
    [schema, query]
  )

  const handleSelect = (tableId: string) => {
    setSelectedTableId(tableId)
    setFocusNodeId(tableId)
  }

  const textMuted = theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
  const textBody = theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
  const cardClass =
    theme === 'dark'
      ? 'bg-slate-800/40 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/60'
      : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 shadow-sm'

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4">
      {/* Search input */}
      <div className="relative mb-4 shrink-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tables and columns..."
          className={`w-full pl-9 pr-4 py-2 rounded-md text-sm transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
          }`}
        />
      </div>

      {/* Results */}
      <div className="flex-1 space-y-2 overflow-auto pr-1">
        {/* No query — placeholder */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <Database size={48} className="mb-4 text-slate-400" />
            <p className="text-sm font-medium">Search tables and columns by name, description, or tags.</p>
          </div>
        )}

        {/* Query with no results */}
        {query && results.length === 0 && (
          <div className="text-center py-10 text-slate-500 italic text-sm">
            No results found for "{query}"
          </div>
        )}

        {/* Result list */}
        {results.map(({ table, column }, idx) => (
          <button
            key={`${table.id}-${column.id}-${idx}`}
            onClick={() => handleSelect(table.id)}
            className={`w-full p-3 text-left rounded-lg border transition-all group relative ${cardClass}`}
          >
            {/* Table name hierarchy */}
            <div className="mb-1.5">
              {/* Conceptual name — largest */}
              <p className={`text-sm font-semibold leading-tight truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {table.name}
              </p>
              {/* Logical name — medium */}
              {table.logical_name && (
                <p className={`text-xs leading-tight truncate ${textBody}`}>
                  {table.logical_name}
                </p>
              )}
              {/* Physical name — smallest */}
              {table.physical_name && (
                <p className={`text-[10px] leading-tight truncate font-mono ${textMuted}`}>
                  {table.physical_name}
                </p>
              )}
            </div>

            {/* Column info */}
            <div className={`flex items-baseline gap-1.5 text-xs ${textBody}`}>
              <span className="font-medium truncate max-w-[120px]">
                {column.logical?.name ?? column.id}
              </span>
              {column.logical?.description && (
                <>
                  <span className={textMuted}>—</span>
                  <span className={`truncate flex-1 ${textMuted}`}>
                    {column.logical.description}
                  </span>
                </>
              )}
            </div>

            <ArrowUpRight
              size={12}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"
            />
          </button>
        ))}

        {/* Truncation notice */}
        {query && results.length === MAX_RESULTS && (
          <p className={`text-center text-[10px] py-2 ${textMuted}`}>
            Showing top {MAX_RESULTS} results. Refine your search to narrow down.
          </p>
        )}
      </div>
    </div>
  )
}

export default InformationSearchTab
