/**
 * CytoscapeCanvas — Canvas-based graph renderer replacing React Flow.
 *
 * Architecture:
 * - Cytoscape.js renders edges (ER + lineage) on HTML5 Canvas
 * - cytoscape-dom-node plugin positions DOM containers for each node
 * - React portals render TableCard inside those DOM containers
 * - Domain backgrounds are positioned divs updated on cy 'pan zoom' events
 * - Annotations are overlay divs updated on 'pan zoom' events
 */

import { useEffect, useRef, useCallback } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { useStore } from '../store/useStore'
import { useShallow } from 'zustand/react/shallow'
import TableCard from './TableCard'
import { yamlToElements } from '../lib/cytoscapeElements'
import type { Schema } from '../types/schema'

// ── Cytoscape imports — use dynamic cast to avoid verbatimModuleSyntax conflict ─
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CyInstance = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CyFactory = ((opts?: unknown) => CyInstance) & { use: (ext: unknown) => void }

// Dynamic imports bypass verbatimModuleSyntax restrictions on export= modules
import cytoscapeModule from 'cytoscape'
import cytoscapeDagreModule from 'cytoscape-dagre'
import cytoscapeDomNodeModule from 'cytoscape-dom-node'

const cytoscape = cytoscapeModule as unknown as CyFactory

// Register extensions once at module load
cytoscape.use(cytoscapeDagreModule as unknown as (cy: unknown) => void)
cytoscape.use(cytoscapeDomNodeModule as unknown as (cy: unknown) => void)

// Zoom below this threshold uses native Cytoscape canvas rendering (no React DOM)
const LOW_ZOOM_THRESHOLD = 0.12

// ── Cytoscape base stylesheet ──────────────────────────────────────────
function buildCytoscapeStyle(theme: 'dark' | 'light', lowZoom = false) {
  const erStroke = theme === 'dark' ? '#94a3b8' : '#64748b'
  return [
    {
      selector: 'node',
      style: {
        shape: 'rectangle',
        // Low-zoom: show native colored boxes; normal: transparent (DOM card renders)
        'background-opacity': lowZoom ? 0.85 : 0,
        'background-color': lowZoom ? 'data(typeColor)' : '#000',
        'border-width': lowZoom ? 1 : 0,
        'border-color': lowZoom ? (theme === 'dark' ? '#ffffff33' : '#00000022') : '#000',
        width: 280,
        height: 160,
      },
    },
    {
      selector: 'edge.er-edge',
      style: {
        'curve-style': 'bezier',
        'line-color': erStroke,
        // ER edges: no arrow (relationship lines, not directional flow)
        'target-arrow-shape': 'none',
        'source-arrow-shape': 'none',
        width: 2,
        label: 'data(label)',
        'font-size': 10,
        'font-weight': 600,
        color: erStroke,
        'text-background-color': theme === 'dark' ? '#1e293b' : '#ffffff',
        'text-background-opacity': 0.9,
        'text-background-padding': '2px',
      },
    },
    {
      selector: 'edge.er-edge.highlighted',
      style: {
        'line-color': theme === 'dark' ? '#f1f5f9' : '#0f172a',
        width: 4,
      },
    },
    {
      selector: 'edge.er-edge.path-highlighted',
      style: {
        'line-color': '#3b82f6',
        width: 6,
      },
    },
    {
      selector: 'edge.lineage-edge',
      style: {
        'curve-style': 'bezier',
        'line-style': 'dashed',
        'line-color': '#3b82f6',
        'target-arrow-color': '#3b82f6',
        'target-arrow-shape': 'triangle',
        'arrow-scale': 1.2,
        width: 2,
      },
    },
    {
      selector: 'edge.lineage-edge.path-highlighted',
      style: { width: 6 },
    },
    {
      selector: 'edge.dimmed',
      style: { opacity: 0.1 },
    },
  ]
}

// ── Domain background renderer (visual only, no interaction) ───────────
function renderDomainBackgrounds(
  cy: CyInstance,
  schema: Schema,
  container: HTMLDivElement
) {
  container.innerHTML = ''
  if (!schema.domains?.length) return

  const zoom: number = cy.zoom()
  const pan: { x: number; y: number } = cy.pan()
  const PAD = 24

  schema.domains.forEach((domain) => {
    const memberNodes = cy.nodes().filter((n: CyInstance) => domain.tables.includes(n.id()))
    if (memberNodes.length === 0) return

    const bb = memberNodes.boundingBox({})
    const sx = (bb.x1 - PAD) * zoom + pan.x
    const sy = (bb.y1 - PAD) * zoom + pan.y
    const sw = (bb.w + PAD * 2) * zoom
    const sh = (bb.h + PAD * 2) * zoom

    const div = document.createElement('div')
    div.style.cssText = `
      position: absolute;
      left: ${sx}px;
      top: ${sy}px;
      width: ${sw}px;
      height: ${sh}px;
      background: ${domain.color ?? 'rgba(99,102,241,0.07)'};
      border: 1.5px dashed rgba(99,102,241,0.3);
      border-radius: 12px;
      pointer-events: none;
    `
    const label = document.createElement('div')
    label.textContent = domain.name
    label.style.cssText = `
      position: absolute;
      top: 6px;
      left: 10px;
      font-size: ${Math.max(10, 12 * zoom)}px;
      font-weight: 700;
      opacity: 0.5;
      pointer-events: none;
      white-space: nowrap;
      overflow: hidden;
      color: inherit;
    `
    div.appendChild(label)
    container.appendChild(div)
  })
}

// ── Domain drag handle renderer (z-index: 25, above canvas) ─────────────
// Background divs (bgDiv, z-index:0) are behind the Cytoscape canvas and
// cannot receive pointer events. Handles are rendered in a separate high-z
// layer so they remain interactive regardless of canvas stacking.
function renderDomainHandles(
  cy: CyInstance,
  schema: Schema,
  container: HTMLDivElement,
  theme: 'dark' | 'light',
  onDomainDragEnd: (domainId: string, dx: number, dy: number) => void
) {
  container.innerHTML = ''
  if (!schema.domains?.length) return

  const zoom: number = cy.zoom()
  const pan: { x: number; y: number } = cy.pan()
  const PAD = 24

  schema.domains.forEach((domain) => {
    const memberNodes = cy.nodes().filter((n: CyInstance) => domain.tables.includes(n.id()))
    if (memberNodes.length === 0) return

    const bb = memberNodes.boundingBox({})
    const handleX = (bb.x1 - PAD) * zoom + pan.x
    const handleY = (bb.y1 - PAD) * zoom + pan.y

    const badge = document.createElement('div')
    const badgeBg = theme === 'dark' ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.9)'
    const borderColor = domain.color ?? 'rgba(99,102,241,0.4)'
    badge.style.cssText = `
      position: absolute;
      left: ${handleX}px;
      top: ${handleY}px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: ${Math.max(3, 4 * zoom)}px ${Math.max(6, 8 * zoom)}px;
      background: ${badgeBg};
      border: 1.5px solid ${borderColor};
      border-radius: 6px;
      font-size: ${Math.max(10, 12 * zoom)}px;
      font-weight: 700;
      color: ${theme === 'dark' ? '#e2e8f0' : '#1e293b'};
      cursor: grab;
      user-select: none;
      pointer-events: auto;
      white-space: nowrap;
      box-shadow: 0 1px 4px rgba(0,0,0,0.15);
      z-index: 1;
    `
    badge.textContent = `⠿ ${domain.name}`

    badge.addEventListener('mousedown', (startEvt) => {
      startEvt.preventDefault()
      startEvt.stopPropagation()
      badge.style.cursor = 'grabbing'

      const startX = startEvt.clientX
      const startY = startEvt.clientY
      const initialPositions = new Map<string, { x: number; y: number }>()
      memberNodes.forEach((n: CyInstance) => {
        const pos: { x: number; y: number } = n.position()
        initialPositions.set(n.id() as string, { x: pos.x, y: pos.y })
      })
      let lastDx = 0
      let lastDy = 0

      const onMouseMove = (moveEvt: MouseEvent) => {
        const currentZoom: number = cy.zoom()
        lastDx = (moveEvt.clientX - startX) / currentZoom
        lastDy = (moveEvt.clientY - startY) / currentZoom
        memberNodes.forEach((n: CyInstance) => {
          const init = initialPositions.get(n.id() as string)!
          n.position({ x: init.x + lastDx, y: init.y + lastDy })
        })
      }

      const onMouseUp = () => {
        badge.style.cursor = 'grab'
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
        onDomainDragEnd(domain.id, lastDx, lastDy)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    })

    container.appendChild(badge)
  })
}

// ── Annotation overlay renderer ─────────────────────────────────────────
function renderAnnotations(
  cy: CyInstance,
  schema: Schema,
  container: HTMLDivElement,
  theme: 'dark' | 'light',
  onAnnotationDragEnd: (id: string, newOffset: { x: number; y: number }) => void
) {
  container.innerHTML = ''
  if (!schema.annotations?.length) return

  const zoom: number = cy.zoom()
  const pan: { x: number; y: number } = cy.pan()

  schema.annotations.forEach((ann) => {
    let absX: number
    let absY: number

    if (ann.targetId) {
      const targetNode = cy.getElementById(ann.targetId)
      if (targetNode.length === 0) return
      const pos: { x: number; y: number } = targetNode.position()
      absX = (pos.x + ann.offset.x) * zoom + pan.x
      absY = (pos.y + ann.offset.y) * zoom + pan.y
    } else {
      absX = ann.offset.x * zoom + pan.x
      absY = ann.offset.y * zoom + pan.y
    }

    const bgColor = ann.color ?? (theme === 'dark' ? '#1e293b' : '#fef9c3')
    const div = document.createElement('div')
    div.style.cssText = `
      position: absolute;
      left: ${absX}px;
      top: ${absY}px;
      min-width: ${120 * zoom}px;
      max-width: ${240 * zoom}px;
      padding: ${8 * zoom}px ${12 * zoom}px;
      background: ${bgColor};
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: ${8 * zoom}px;
      font-size: ${12 * zoom}px;
      line-height: 1.4;
      cursor: grab;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      white-space: pre-wrap;
      user-select: none;
    `
    div.textContent = ann.text

    // ── Annotation drag ────────────────────────────────────────────────
    div.addEventListener('mousedown', (startEvt) => {
      startEvt.preventDefault()
      startEvt.stopPropagation()
      div.style.cursor = 'grabbing'
      const startScreenX = startEvt.clientX
      const startScreenY = startEvt.clientY
      const startOffsetX = ann.offset.x
      const startOffsetY = ann.offset.y

      const onMouseMove = (moveEvt: MouseEvent) => {
        const currentZoom: number = cy.zoom()
        const dx = (moveEvt.clientX - startScreenX) / currentZoom
        const dy = (moveEvt.clientY - startScreenY) / currentZoom
        div.style.left = (absX + (moveEvt.clientX - startScreenX)) + 'px'
        div.style.top = (absY + (moveEvt.clientY - startScreenY)) + 'px'
        void dx; void dy // used in mouseup
      }

      const onMouseUp = (upEvt: MouseEvent) => {
        div.style.cursor = 'grab'
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
        const currentZoom: number = cy.zoom()
        const dx = (upEvt.clientX - startScreenX) / currentZoom
        const dy = (upEvt.clientY - startScreenY) / currentZoom
        onAnnotationDragEnd(ann.id, { x: startOffsetX + dx, y: startOffsetY + dy })
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    })

    container.appendChild(div)
  })
}

// ── Main component ────────────────────────────────────────────────────
interface CytoscapeCanvasProps {
  onNodeClick: (id: string) => void
  onEdgeClick: (edgeData: {
    id: string
    kind: string
    source: string
    target: string
    fromColumn?: string
    toColumn?: string
    relType?: string
  }) => void
  onPaneClick: () => void
  onAddTableAt: (x: number, y: number) => void
  onAddDomainAt: (x: number, y: number) => void
  onAddAnnotationAt: (x: number, y: number) => void
  onFitView: (fitFn: () => void) => void
  onFocusNode: (focusFn: (id: string) => void) => void
  onAutoLayout: (layoutFn: () => void) => void
}

export default function CytoscapeCanvas({
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  onAddTableAt,
  onAddDomainAt,
  onAddAnnotationAt,
  onFitView,
  onFocusNode,
  onAutoLayout,
}: CytoscapeCanvasProps) {
  const {
    schema,
    selectedTableId,
    selectedTableIds,
    highlightedNodeIds,
    pathFinderResult,
    isPresentationMode,
    showER,
    showLineage,
    showAnnotations,
    theme,
    hoveredColumnId,
    updateNodePosition,
    updateNodesPosition,
    updateAnnotation,
  } = useStore(
    useShallow((s) => ({
      schema: s.schema,
      selectedTableId: s.selectedTableId,
      selectedTableIds: s.selectedTableIds,
      highlightedNodeIds: s.highlightedNodeIds,
      pathFinderResult: s.pathFinderResult,
      isPresentationMode: s.isPresentationMode,
      showER: s.showER,
      showLineage: s.showLineage,
      showAnnotations: s.showAnnotations,
      theme: s.theme,
      hoveredColumnId: s.hoveredColumnId,
      updateNodePosition: s.updateNodePosition,
      updateNodesPosition: s.updateNodesPosition,
      updateAnnotation: s.updateAnnotation,
    }))
  )

  const cyContainerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<CyInstance>(null)
  const domBgRef = useRef<HTMLDivElement | null>(null)
  const domAnnRef = useRef<HTMLDivElement | null>(null)
  const domHandleRef = useRef<HTMLDivElement | null>(null) // domain drag handles (z-index: 25)
  const rootMapRef = useRef<Map<string, Root>>(new Map())
  const zoomRef = useRef<number>(1)
  const lowZoomRef = useRef<boolean>(false)
  const rafIdRef = useRef<number | null>(null)

  // Mutable refs for state used inside stable callbacks
  const selectedIdRef = useRef<string | null>(null)
  const selectedIdsRef = useRef<string[]>([])
  const highlightedIdsRef = useRef<string[]>([])
  const hoveredNodeIdRef = useRef<string | null>(null)
  const presentationModeRef = useRef<boolean>(false)
  const themeRef = useRef<'dark' | 'light'>(theme)
  const hoveredColumnIdRef = useRef<string | null>(null)
  const schemaRef = useRef<Schema | null>(null)
  const showAnnotationsRef = useRef<boolean>(showAnnotations)
  const onNodeClickRef = useRef(onNodeClick)

  // Keep refs in sync
  useEffect(() => { showAnnotationsRef.current = showAnnotations }, [showAnnotations])
  useEffect(() => { onNodeClickRef.current = onNodeClick }, [onNodeClick])

  // ── updateAllCards: re-render visible TableCard portals (RAF-debounced) ──
  const updateAllCards = useCallback(() => {
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null
      const cy = cyRef.current
      if (!cy) return
      // Skip React rendering entirely in low-zoom mode
      if (lowZoomRef.current) return

      const zoom = zoomRef.current
      const ext = cy.extent() as { x1: number; y1: number; x2: number; y2: number }
      // Pre-render nodes slightly outside the viewport so they appear instantly on pan
      const PAD = 400

      cy.nodes().forEach((node: CyInstance) => {
        const table = node.data('table')
        if (!table) return
        const id: string = node.id()
        const root = rootMapRef.current.get(id)
        if (!root) return

        // Viewport culling: skip nodes outside viewport + padding
        const pos: { x: number; y: number } = node.position()
        if (
          pos.x < ext.x1 - PAD || pos.x > ext.x2 + PAD ||
          pos.y < ext.y1 - PAD || pos.y > ext.y2 + PAD
        ) return

        const isSelected =
          selectedIdRef.current === id || selectedIdsRef.current.includes(id)
        const isHovered = hoveredNodeIdRef.current === id
        const isHighlighted = highlightedIdsRef.current.includes(id)
        const isAnythingHighlighted =
          highlightedIdsRef.current.length > 0 || presentationModeRef.current
        const isDimmed = isAnythingHighlighted && !isSelected && !isHighlighted

        root.render(
          <TableCard
            table={table}
            isSelected={isSelected}
            isDimmed={isDimmed}
            isHighlighted={isHighlighted}
            isHovered={isHovered}
            zoom={zoom}
            theme={themeRef.current}
            hoveredColumnId={hoveredColumnIdRef.current}
          />
        )
      })
    })
  }, [])

  // ── Domain drag end callback ─────────────────────────────────────────
  // All layout coords are absolute. Save the domain entry and all member node
  // positions using their actual Cytoscape positions after the drag.
  // Works even when layout: {} (no prior entries).
  const onDomainDragEnd = useCallback(
    (domainId: string, dx: number, dy: number) => {
      const schema = useStore.getState().schema
      if (!schema) return
      const domain = schema.domains?.find((d) => d.id === domainId)
      if (!domain) return
      const cy = cyRef.current
      if (!cy) return

      const updates: { id: string; x: number; y: number }[] = []

      // Domain entry: shift existing or create from dx/dy
      const domLayout = schema.layout?.[domainId]
      updates.push({ id: domainId, x: (domLayout?.x ?? 0) + dx, y: (domLayout?.y ?? 0) + dy })

      // Member nodes: read actual Cytoscape positions after the drag
      domain.tables.forEach((tableId) => {
        const cyNode = cy.getElementById(tableId)
        if (cyNode && cyNode.length > 0) {
          const pos: { x: number; y: number } = cyNode.position()
          updates.push({ id: tableId, x: pos.x, y: pos.y })
        }
      })

      updateNodesPosition(updates)
    },
    [updateNodesPosition]
  )

  // Stable ref so the event handler inside renderDomainBackgrounds always calls the latest version
  const onDomainDragEndRef = useRef(onDomainDragEnd)
  useEffect(() => { onDomainDragEndRef.current = onDomainDragEnd }, [onDomainDragEnd])

  // ── Annotation drag end callback ─────────────────────────────────────
  const onAnnotationDragEnd = useCallback(
    (id: string, newOffset: { x: number; y: number }) => {
      updateAnnotation(id, { offset: newOffset })
    },
    [updateAnnotation]
  )
  const onAnnotationDragEndRef = useRef(onAnnotationDragEnd)
  useEffect(() => { onAnnotationDragEndRef.current = onAnnotationDragEnd }, [onAnnotationDragEnd])

  // ── Initialize Cytoscape (mount only) ───────────────────────────────
  useEffect(() => {
    if (!cyContainerRef.current || cyRef.current) return

    const container = cyContainerRef.current
    container.style.position = 'relative'

    // Domain background overlay (behind Cytoscape canvas)
    const bgDiv = document.createElement('div')
    bgDiv.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:0;'
    container.insertBefore(bgDiv, container.firstChild)
    domBgRef.current = bgDiv

    // Annotation overlay (above canvas)
    const annDiv = document.createElement('div')
    annDiv.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:20;'

    // Domain drag handle layer — ABOVE canvas + DOM nodes; handles have pointer-events:auto
    const handleDiv = document.createElement('div')
    handleDiv.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:25;'
    container.appendChild(annDiv)
    domAnnRef.current = annDiv
    container.appendChild(handleDiv)
    domHandleRef.current = handleDiv

    const cy: CyInstance = cytoscape({
      container,
      elements: [],
      style: buildCytoscapeStyle(themeRef.current),
      minZoom: 0.05,
      maxZoom: 3,
      boxSelectionEnabled: true,
      userZoomingEnabled: true,
      userPanningEnabled: true,
    })

    cyRef.current = cy
    zoomRef.current = cy.zoom()
    // Expose cy instance for external access (ActivityBar, etc.)
    ;(window as any).__modscapeCy = cy

    // Init cytoscape-dom-node plugin
    cy.domNode()

    // ── Interaction events ────────────────────────────────────────
    cy.on('tap', 'node', (evt: CyInstance) => {
      onNodeClick(evt.target.id())
    })

    cy.on('tap', 'edge', (evt: CyInstance) => {
      const d = evt.target.data()
      onEdgeClick({
        id: evt.target.id(),
        kind: d.kind,
        source: d.source,
        target: d.target,
        fromColumn: d.fromColumn,
        toColumn: d.toColumn,
        relType: d.relType,
      })
    })

    cy.on('tap', (evt: CyInstance) => {
      if (evt.target === cy) onPaneClick()
    })

    cy.on('dragfree', 'node', (evt: CyInstance) => {
      const pos: { x: number; y: number } = evt.target.position()
      updateNodePosition(evt.target.id(), pos.x, pos.y)
    })

    // Hover: highlight hovered node and connected nodes/edges
    cy.on('mouseover', 'node', (evt: CyInstance) => {
      const node = evt.target
      hoveredNodeIdRef.current = node.id()
      const connectedEdges = node.connectedEdges()
      const connectedNodes = connectedEdges.connectedNodes().not(node)
      const highlightIds: string[] = connectedNodes.map((n: CyInstance) => n.id())
      useStore.getState().setHighlightedNodeIds(highlightIds)
    })
    cy.on('mouseout', 'node', () => {
      hoveredNodeIdRef.current = null
      useStore.getState().setHighlightedNodeIds([])
    })

    // Box selection → store multi-select
    cy.on('boxselect', 'node', () => {
      const selectedIds: string[] = cy
        .nodes(':selected')
        .map((n: CyInstance) => n.id() as string)
      useStore.getState().setSelectedTableIds(selectedIds)
    })

    // Update overlays on viewport change
    const updateOverlays = () => {
      if (domBgRef.current && schemaRef.current) {
        renderDomainBackgrounds(cy, schemaRef.current, domBgRef.current)
      }
      if (domHandleRef.current && schemaRef.current) {
        renderDomainHandles(cy, schemaRef.current, domHandleRef.current, themeRef.current, onDomainDragEndRef.current)
      }
      if (domAnnRef.current && schemaRef.current && showAnnotationsRef.current) {
        renderAnnotations(cy, schemaRef.current, domAnnRef.current, themeRef.current, onAnnotationDragEndRef.current)
      }
    }
    cy.on('pan zoom', updateOverlays)
    cy.on('drag', 'node', updateOverlays)

    cy.on('zoom', () => {
      const z: number = cy.zoom()
      const wasLow = lowZoomRef.current
      const isLow = z < LOW_ZOOM_THRESHOLD
      zoomRef.current = z
      lowZoomRef.current = isLow

      // Switch stylesheet when crossing the threshold
      if (wasLow !== isLow) {
        cy.style(buildCytoscapeStyle(themeRef.current, isLow))
      }
      if (!isLow) updateAllCards()
    })

    // Pan: re-render newly visible nodes
    cy.on('pan', updateAllCards)

    return () => {
      rootMapRef.current.forEach((root) => root.unmount())
      rootMapRef.current.clear()
      cy.destroy()
      cyRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Mount only

  // ── Sync schema → Cytoscape elements ────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current
    if (!cy || !schema) return

    schemaRef.current = schema
    const elements = yamlToElements(schema)
    const existingIds = new Set<string>(
      cy.elements().map((el: CyInstance) => el.id() as string)
    )
    const newIds = new Set<string>(elements.map((el) => el.data.id as string))

    // Remove stale elements
    cy.elements().forEach((el: CyInstance) => {
      if (!newIds.has(el.id())) {
        if (el.isNode()) {
          const root = rootMapRef.current.get(el.id())
          if (root) {
            root.unmount()
            rootMapRef.current.delete(el.id())
          }
        }
        el.remove()
      }
    })

    // Add or update elements
    elements.forEach((elDef) => {
      const id = elDef.data.id as string
      if (existingIds.has(id)) {
        const el = cy.getElementById(id)
        el.data(elDef.data)
        // Update position if schema layout changed (e.g., after auto-layout)
        if (elDef.position) {
          el.position(elDef.position)
        }
      } else {
        // For table nodes, create DOM container BEFORE cy.add() so that
        // cytoscape-dom-node's 'add' handler finds data.dom already set.
        const isTableNode = !!elDef.data.table
        let domContainer: HTMLDivElement | null = null
        let elToAdd = elDef
        if (isTableNode) {
          domContainer = document.createElement('div')
          domContainer.style.cssText = 'position:absolute;box-sizing:border-box;min-width:220px;'

          // cytoscape-dom-node overlays can intercept mouse events before they reach
          // the Cytoscape canvas, preventing Cytoscape's built-in drag detection.
          // We implement drag manually on the DOM container instead.
          domContainer.addEventListener('mousedown', (startEvt: MouseEvent) => {
            if (startEvt.button !== 0) return
            startEvt.stopPropagation() // prevent canvas pan
            startEvt.preventDefault()

            const cyEl = cyRef.current?.getElementById(id)
            if (!cyEl || cyEl.length === 0) return

            const startX = startEvt.clientX
            const startY = startEvt.clientY
            const initPos: { x: number; y: number } = { ...cyEl.position() }
            let moved = false

            const onMouseMove = (moveEvt: MouseEvent) => {
              const zoom: number = cyRef.current?.zoom() ?? 1
              const dx = (moveEvt.clientX - startX) / zoom
              const dy = (moveEvt.clientY - startY) / zoom
              if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true
              cyEl.position({ x: initPos.x + dx, y: initPos.y + dy })
            }

            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove)
              window.removeEventListener('mouseup', onMouseUp)
              if (moved) {
                const pos: { x: number; y: number } = cyEl.position()
                useStore.getState().updateNodePosition(id, pos.x, pos.y)
              } else {
                // Tap: delegate to node click handler
                onNodeClickRef.current(id)
              }
            }

            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener('mouseup', onMouseUp)
          })

          elToAdd = { ...elDef, data: { ...elDef.data, dom: domContainer } }
        }
        cy.add(elToAdd)
        if (isTableNode && domContainer) {
          const root = createRoot(domContainer)
          rootMapRef.current.set(id, root)
        }
      }
    })

    // Edge visibility
    cy.edges('.er-edge').style('display', showER ? 'element' : 'none')
    cy.edges('.lineage-edge').style('display', showLineage ? 'element' : 'none')

    // Update overlays
    if (domBgRef.current) renderDomainBackgrounds(cy, schema, domBgRef.current)
    if (domHandleRef.current) renderDomainHandles(cy, schema, domHandleRef.current, theme, onDomainDragEndRef.current)
    if (domAnnRef.current) {
      if (showAnnotations) renderAnnotations(cy, schema, domAnnRef.current, theme, onAnnotationDragEndRef.current)
      else domAnnRef.current.innerHTML = ''
    }

    updateAllCards()
  }, [schema, showER, showLineage, showAnnotations, theme, updateAllCards])

  // ── Sync selection / highlight → cards + edge styles ────────────────
  useEffect(() => {
    selectedIdRef.current = selectedTableId
    selectedIdsRef.current = selectedTableIds
    highlightedIdsRef.current = highlightedNodeIds
    presentationModeRef.current = isPresentationMode
    themeRef.current = theme
    hoveredColumnIdRef.current = hoveredColumnId

    const cy = cyRef.current
    if (!cy) return

    if (pathFinderResult) {
      const pathEdgeSet = new Set(pathFinderResult.edgeIds)
      cy.edges().forEach((edge: CyInstance) => {
        if (pathEdgeSet.has(edge.id())) {
          edge.addClass('path-highlighted')
          edge.removeClass('dimmed highlighted')
        } else {
          edge.addClass('dimmed')
          edge.removeClass('path-highlighted highlighted')
        }
      })
    } else {
      cy.edges().forEach((edge: CyInstance) => {
        edge.removeClass('path-highlighted dimmed')
        if (selectedTableId) {
          const connected =
            edge.source().id() === selectedTableId ||
            edge.target().id() === selectedTableId
          if (connected) edge.addClass('highlighted')
          else edge.removeClass('highlighted')
        } else {
          edge.removeClass('highlighted')
        }
      })
    }

    updateAllCards()
  }, [
    selectedTableId,
    selectedTableIds,
    highlightedNodeIds,
    isPresentationMode,
    pathFinderResult,
    theme,
    hoveredColumnId,
    updateAllCards,
  ])

  // ── Expose canvas API to parent ──────────────────────────────────────
  useEffect(() => {
    const fitFn = () => { cyRef.current?.fit(undefined, 40) }
    onFitView(fitFn)
    ;(window as any).__modscapeFitView = fitFn
  }, [onFitView])

  useEffect(() => {
    onFocusNode((id: string) => {
      const cy = cyRef.current
      if (!cy) return
      const node = cy.getElementById(id)
      if (node.length === 0) return
      cy.animate({ fit: { eles: node, padding: 120 }, duration: 800, easing: 'ease-in-out' })
    })
  }, [onFocusNode])

  useEffect(() => {
    onAutoLayout(() => {
      const cy = cyRef.current
      if (!cy) return
      const layout = cy.layout({
        name: 'dagre',
        rankDir: 'LR',
        nodeSep: 40,
        rankSep: 120,
        animate: true,
        animationDuration: 500,
      })
      layout.on('layoutstop', () => {
        cy.nodes().forEach((node: CyInstance) => {
          const pos: { x: number; y: number } = node.position()
          updateNodePosition(node.id(), pos.x, pos.y)
        })
      })
      layout.run()
    })
  }, [onAutoLayout, updateNodePosition])

  // ── Keyboard shortcuts (canvas-level: T, D, S, arrows) ──────────────
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    const cy = cyRef.current
    if (!cy) return { x: 0, y: 0 }
    const pan: { x: number; y: number } = cy.pan()
    const zoom: number = cy.zoom()
    return { x: (screenX - pan.x) / zoom, y: (screenY - pan.y) / zoom }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      const isTyping =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable ||
        activeEl?.closest('.cm-editor') ||
        activeEl?.closest('.sidebar-content')
      if (isTyping || e.repeat) return

      const key = e.key.toLowerCase()
      if (key === 't' || key === 'd' || key === 's') {
        e.preventDefault()
        const center = screenToCanvas(window.innerWidth / 2, window.innerHeight / 2)
        if (key === 't') onAddTableAt(center.x - 160, center.y - 125)
        else if (key === 'd') onAddDomainAt(center.x - 300, center.y - 200)
        else onAddAnnotationAt(center.x - 60, center.y - 40)
        return
      }

      if (e.key.startsWith('Arrow')) {
        const cy = cyRef.current
        if (!cy) return
        const STEP = 100
        const pan: { x: number; y: number } = cy.pan()
        if (e.key === 'ArrowUp') cy.pan({ x: pan.x, y: pan.y + STEP })
        else if (e.key === 'ArrowDown') cy.pan({ x: pan.x, y: pan.y - STEP })
        else if (e.key === 'ArrowLeft') cy.pan({ x: pan.x + STEP, y: pan.y })
        else if (e.key === 'ArrowRight') cy.pan({ x: pan.x - STEP, y: pan.y })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screenToCanvas, onAddTableAt, onAddDomainAt, onAddAnnotationAt])

  return <div ref={cyContainerRef} style={{ width: '100%', height: '100%' }} />
}
