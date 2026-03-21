import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from './store/useStore'
import { useShallow } from 'zustand/react/shallow'
import CytoscapeCanvas from './components/CytoscapeCanvas'
import DetailPanel from './components/DetailPanel'
import Sidebar from './components/Sidebar/Sidebar'
import RightPanel from './components/RightPanel/RightPanel'
import CommandPalette from './components/CommandPalette'
import PresentationOverlay from './components/PresentationOverlay'
import SelectionToolbar from './components/SelectionToolbar'

// ── Flow (Canvas area) ────────────────────────────────────────────────
function Flow() {
  const {
    schema,
    setSelectedTableId,
    selectedTableId,
    selectedEdgeId,
    setSelectedEdgeId,
    selectedAnnotationId,
    setSelectedAnnotationId,
    focusNodeId,
    setFocusNodeId,
    removeNode,
    removeEdge,
    showER,
    showLineage,
    showAnnotations,
    addTable,
    addDomain,
    addAnnotation,
    theme,
    isPresentationMode,
    setIsPresentationMode,
    refreshModelData,
    fetchAvailableFiles,
    isModelLoading,
    isCliMode,
    distributeSelectedTables,
    selectedTableIds,
    toggleTableSelection,
    toggleEdgeSelection,
  } = useStore(useShallow(s => ({
    schema: s.schema,
    setSelectedTableId: s.setSelectedTableId,
    selectedTableId: s.selectedTableId,
    selectedEdgeId: s.selectedEdgeId,
    setSelectedEdgeId: s.setSelectedEdgeId,
    selectedAnnotationId: s.selectedAnnotationId,
    setSelectedAnnotationId: s.setSelectedAnnotationId,
    focusNodeId: s.focusNodeId,
    setFocusNodeId: s.setFocusNodeId,
    removeNode: s.removeNode,
    removeEdge: s.removeEdge,
    showER: s.showER,
    showLineage: s.showLineage,
    showAnnotations: s.showAnnotations,
    addTable: s.addTable,
    addDomain: s.addDomain,
    addAnnotation: s.addAnnotation,
    theme: s.theme,
    isPresentationMode: s.isPresentationMode,
    setIsPresentationMode: s.setIsPresentationMode,
    refreshModelData: s.refreshModelData,
    fetchAvailableFiles: s.fetchAvailableFiles,
    isModelLoading: s.isModelLoading,
    isCliMode: s.isCliMode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    distributeSelectedTables: (s as any).distributeSelectedTables as ((dir: string) => void) | undefined,
    selectedTableIds: s.selectedTableIds,
    toggleTableSelection: s.toggleTableSelection,
    toggleEdgeSelection: s.toggleEdgeSelection,
  })))

  const isConnectionLocked = showER && showLineage
  const isViewingDisabled = !showER && !showLineage

  // Callbacks exposed by CytoscapeCanvas
  const fitViewFnRef = useRef<(() => void) | null>(null)
  const focusNodeFnRef = useRef<((id: string) => void) | null>(null)
  const autoLayoutFnRef = useRef<(() => void) | null>(null)

  const handleFitView = useCallback((fn: () => void) => {
    fitViewFnRef.current = fn
  }, [])
  const handleFocusNode = useCallback((fn: (id: string) => void) => {
    focusNodeFnRef.current = fn
  }, [])
  const handleAutoLayout = useCallback((fn: () => void) => {
    autoLayoutFnRef.current = fn
  }, [])

  // WebSocket live sync
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const reconnectDelayRef = useRef<number>(1000)

  useEffect(() => {
    if (!isCliMode) return

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const ws = new WebSocket(`${protocol}//${window.location.host}`)

      ws.onopen = () => {
        reconnectDelayRef.current = 1000
      }
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'update') refreshModelData()
          else if (data.type === 'files_changed') fetchAvailableFiles()
        } catch (_) {}
      }
      ws.onclose = () => {
        wsRef.current = null
        if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 1.5, 30000)
          connect()
        }, reconnectDelayRef.current)
      }
      ws.onerror = () => ws.close()
      wsRef.current = ws
    }

    connect()
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current)
    }
  }, [isCliMode, refreshModelData, fetchAvailableFiles])

  // Handle focusNodeId → focus in canvas
  useEffect(() => {
    if (focusNodeId && focusNodeFnRef.current) {
      focusNodeFnRef.current(focusNodeId)
      setFocusNodeId(null)
    }
  }, [focusNodeId, setFocusNodeId])

  // Expose fit-view trigger (e.g. from toolbar)
  useEffect(() => {
    ;(window as any).__modscapeFitView = () => fitViewFnRef.current?.()
  }, [])

  // Keyboard shortcuts (canvas-agnostic: Escape, K, /, L, V, H, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPresentationMode) { setIsPresentationMode(false); return }
        setSelectedTableId(null)
        setSelectedEdgeId(null)
        setSelectedAnnotationId(null)
        return
      }

      const activeEl = document.activeElement
      const isTyping =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable ||
        activeEl?.closest('.cm-editor') ||
        activeEl?.closest('.sidebar-content')
      if (isTyping || e.repeat) return

      const key = e.key.toLowerCase()

      if (key === '/' ) {
        e.preventDefault()
        useStore.getState().setIsRightPanelOpen(true)
        useStore.getState().setActiveRightPanelTab('tables')
        return
      }

      if (key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        useStore.getState().setIsCommandPaletteOpen(!useStore.getState().isCommandPaletteOpen)
        return
      }

      if (key === 'l') {
        e.preventDefault()
        const currentTab = useStore.getState().activeTab
        useStore.getState().setActiveTab(currentTab === 'connect' ? 'editor' : 'connect')
        useStore.getState().setIsSidebarOpen(true)
        return
      }

      if ((key === 'v' || key === 'h') && selectedTableIds.length > 1) {
        e.preventDefault()
        distributeSelectedTables?.(key === 'v' ? 'vertical' : 'horizontal')
        return
      }

      if ((e.key === 'Backspace' || e.key === 'Delete') && !selectedTableId && !selectedAnnotationId) {
        if (selectedEdgeId) {
          const rel = schema?.relationships?.find((_, i) => `er-${i}` === selectedEdgeId)
          if (rel) removeEdge(rel.from.table, rel.to.table)
          setSelectedEdgeId(null)
        }
        return
      }

      if ((e.key === 'Backspace' || e.key === 'Delete') && (selectedTableId || selectedAnnotationId)) {
        const id = selectedTableId || selectedAnnotationId
        if (id) {
          removeNode(id)
          setSelectedTableId(null)
          setSelectedAnnotationId(null)
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    isPresentationMode, setIsPresentationMode,
    setSelectedTableId, setSelectedEdgeId, setSelectedAnnotationId,
    selectedTableId, selectedEdgeId, selectedAnnotationId,
    selectedTableIds, distributeSelectedTables,
    schema, removeNode, removeEdge,
  ])

  // ── CytoscapeCanvas callbacks ─────────────────────────────────────
  const handleNodeClick = useCallback((id: string) => {
    toggleTableSelection(id)
  }, [toggleTableSelection])

  const handleEdgeClick = useCallback((edgeData: {
    id: string; kind: string; source: string; target: string;
    fromColumn?: string; toColumn?: string; relType?: string
  }) => {
    toggleEdgeSelection(edgeData.id)
  }, [toggleEdgeSelection])

  const handlePaneClick = useCallback(() => {
    setSelectedTableId(null)
    setSelectedEdgeId(null)
    setSelectedAnnotationId(null)
  }, [setSelectedTableId, setSelectedEdgeId, setSelectedAnnotationId])

  const handleAddTable = useCallback((x: number, y: number) => {
    addTable(x, y)
  }, [addTable])

  const handleAddDomain = useCallback((x: number, y: number) => {
    addDomain(x, y)
  }, [addDomain])

  const handleAddAnnotation = useCallback((x: number, y: number) => {
    if (!showAnnotations) useStore.getState().setShowAnnotations(true)
    addAnnotation({ x, y })
  }, [addAnnotation, showAnnotations])

  return (
    <div className="flex-1 relative h-full flex flex-col overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        {!isPresentationMode && <SelectionToolbar />}
        <PresentationOverlay />
        <CommandPalette />

        {/* Status badges */}
        {isConnectionLocked && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className={`flex items-center gap-2 px-4 py-1.5 backdrop-blur-md rounded-full shadow-xl border ${
              theme === 'dark' ? 'bg-slate-950/60 border-amber-500/50' : 'bg-white/60 border-amber-500/40'
            }`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>Connections Locked</span>
              <div className={`w-px h-3 ${theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-500/30'}`} />
              <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-amber-400/70' : 'text-amber-600/70'}`}>ER &amp; Lineage active</span>
            </div>
          </div>
        )}

        {isViewingDisabled && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className={`flex items-center gap-2 px-4 py-1.5 backdrop-blur-md rounded-full shadow-xl border ${
              theme === 'dark' ? 'bg-slate-950/60 border-blue-500/50' : 'bg-white/60 border-blue-500/40'
            }`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Connections Hidden</span>
              <div className={`w-px h-3 ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/30'}`} />
              <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-blue-400/70' : 'text-blue-600/70'}`}>Enable a View Mode to draw edges</span>
            </div>
          </div>
        )}

        {isModelLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, zIndex: 10, pointerEvents: 'none' }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, borderTopColor: theme === 'dark' ? '#60a5fa' : '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 13, color: theme === 'dark' ? '#94a3b8' : '#64748b', fontWeight: 500 }}>Loading model…</span>
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {schema && (
          <CytoscapeCanvas
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            onAddTableAt={handleAddTable}
            onAddDomainAt={handleAddDomain}
            onAddAnnotationAt={handleAddAnnotation}
            onFitView={handleFitView}
            onFocusNode={handleFocusNode}
            onAutoLayout={handleAutoLayout}
          />
        )}
      </div>

      {!isPresentationMode && <DetailPanel />}
    </div>
  )
}

// ── App root ──────────────────────────────────────────────────────────
function App() {
  const [mounted, setMounted] = useState(false)
  const {
    isCliMode,
    fetchAvailableFiles,
    setCurrentModel,
    setSchema,
    theme,
    isPresentationMode,
  } = useStore()

  const hasInjectedData = !!(window as any).__MODSCAPE_DATA__

  useEffect(() => {
    if (isCliMode) {
      fetchAvailableFiles().then(() => {
        const params = new URLSearchParams(window.location.search)
        const modelSlug = params.get('model')
        if (modelSlug) setCurrentModel(modelSlug)
        else fetch('/api/model').then(res => res.json()).then(data => setSchema(data))
      })
      if ((import.meta as any).hot) {
        ;(import.meta as any).hot.on('model-update', (data: any) => setSchema(data))
      }
      setMounted(true)
      return
    }
    if (hasInjectedData) {
      const data = (window as any).__MODSCAPE_DATA__
      if (data?.models?.length > 0) {
        fetchAvailableFiles().then(() => {
          const params = new URLSearchParams(window.location.search)
          const modelSlug = params.get('model')
          if (modelSlug) setCurrentModel(modelSlug)
          else {
            setSchema(data.models[0].schema)
            if (data.models[0].slug) setCurrentModel(data.models[0].slug)
          }
        })
      }
    }
    setMounted(true)
  }, [isCliMode, hasInjectedData, fetchAvailableFiles, setCurrentModel, setSchema])

  if (!mounted) return null

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {!isPresentationMode && <Sidebar />}
      <Flow />
      {!isPresentationMode && <RightPanel />}
    </div>
  )
}

export default App
