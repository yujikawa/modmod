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
        'curve-style': 'round-taxi',
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
    // ER edge: connected to selected node
    {
      selector: 'edge.er-edge.highlighted',
      style: {
        'line-color': '#84cc16',
        width: 3,
        'overlay-color': '#84cc16',
        'overlay-opacity': 0.15,
        'overlay-padding': 4,
      },
    },
    // ER edge: edge itself selected
    {
      selector: 'edge.er-edge:selected',
      style: {
        'line-color': '#84cc16',
        width: 4,
        'overlay-color': '#84cc16',
        'overlay-opacity': 0.25,
        'overlay-padding': 6,
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
    // Lineage edge: connected to selected node
    {
      selector: 'edge.lineage-edge.highlighted',
      style: {
        'line-color': '#f97316',
        'target-arrow-color': '#f97316',
        width: 3,
        'overlay-color': '#f97316',
        'overlay-opacity': 0.15,
        'overlay-padding': 4,
      },
    },
    // Lineage edge: edge itself selected
    {
      selector: 'edge.lineage-edge:selected',
      style: {
        'line-color': '#f97316',
        'target-arrow-color': '#f97316',
        width: 4,
        'overlay-color': '#f97316',
        'overlay-opacity': 0.2,
        'overlay-padding': 6,
      },
    },
    {
      selector: 'edge.lineage-edge.path-highlighted',
      style: { width: 6, 'line-color': '#f97316', 'target-arrow-color': '#f97316' },
    },
    {
      selector: 'edge.dimmed',
      style: { opacity: 0.1 },
    },
  ]
}

// ── Domain bounding box helper ──────────────────────────────────────────
// Cytoscape's boundingBox() uses the stylesheet node size (width:280, height:160),
// but DOM containers can be much taller when tables have many columns.
// This helper expands y2 to cover the actual rendered DOM height.
const NODE_HALF_H = 80 // half of stylesheet height 160
function getDomainBB(memberNodes: any, zoom: number) {
  const bb = memberNodes.boundingBox({})
  let y2: number = bb.y2
  memberNodes.forEach((n: CyInstance) => {
    const domEl: HTMLElement | undefined = n.data('dom')
    if (domEl && domEl.offsetHeight > 0) {
      const actualY2 = (n.position('y') as number) - NODE_HALF_H + domEl.offsetHeight / zoom
      if (actualY2 > y2) y2 = actualY2
    }
  })
  return { x1: bb.x1 as number, y1: bb.y1 as number, y2, w: bb.w as number, h: y2 - (bb.y1 as number) }
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

    let sx: number, sy: number, sw: number, sh: number
    if (memberNodes.length === 0) {
      // Empty domain: use layout entry if available, otherwise show a placeholder
      const layoutEntry = schema.layout?.[domain.id]
      const cx = layoutEntry?.x ?? 0
      const cy2 = layoutEntry?.y ?? 0
      const w = 300
      const h = 120
      sx = (cx - PAD) * zoom + pan.x
      sy = (cy2 - PAD) * zoom + pan.y
      sw = (w + PAD * 2) * zoom
      sh = (h + PAD * 2) * zoom
    } else {
      const bb = getDomainBB(memberNodes, zoom)
      sx = (bb.x1 - PAD) * zoom + pan.x
      sy = (bb.y1 - PAD) * zoom + pan.y
      sw = (bb.w + PAD * 2) * zoom
      sh = (bb.h + PAD * 2) * zoom
    }

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
    label.textContent = memberNodes.length === 0 ? `${domain.name} (empty)` : domain.name
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
// cannot receive pointer events. A transparent header strip matching the
// domain frame's top edge is placed in this high-z layer to act as the
// drag target, so the visible domain label doubles as the handle.
function renderDomainHandles(
  cy: CyInstance,
  schema: Schema,
  container: HTMLDivElement,
  bgContainer: HTMLDivElement,
  _theme: 'dark' | 'light',
  onDomainDragEnd: (domainId: string, dx: number, dy: number) => void,
  onDomainClick: (id: string) => void,
) {
  container.innerHTML = ''
  if (!schema.domains?.length) return

  const zoom: number = cy.zoom()
  const pan: { x: number; y: number } = cy.pan()
  const PAD = 24
  const HEADER_H = Math.max(24, 32 * zoom)

  schema.domains.forEach((domain) => {
    const memberNodes = cy.nodes().filter((n: CyInstance) => domain.tables.includes(n.id()))

    let sx: number, sy: number, sw: number
    if (memberNodes.length === 0) {
      const layoutEntry = schema.layout?.[domain.id]
      const cx = layoutEntry?.x ?? 0
      const cy2 = layoutEntry?.y ?? 0
      sx = (cx - PAD) * zoom + pan.x
      sy = (cy2 - PAD) * zoom + pan.y
      sw = (300 + PAD * 2) * zoom
    } else {
      const bb = getDomainBB(memberNodes, zoom)
      sx = (bb.x1 - PAD) * zoom + pan.x
      sy = (bb.y1 - PAD) * zoom + pan.y
      sw = (bb.w + PAD * 2) * zoom
    }

    // Transparent header strip — same position as the domain label in the background
    const handle = document.createElement('div')
    handle.style.cssText = `
      position: absolute;
      left: ${sx}px;
      top: ${sy}px;
      width: ${sw}px;
      height: ${HEADER_H}px;
      cursor: grab;
      user-select: none;
      pointer-events: auto;
      border-radius: 12px 12px 0 0;
    `

    handle.addEventListener('mousedown', (startEvt) => {
      startEvt.preventDefault()
      startEvt.stopPropagation()

      const startX = startEvt.clientX
      const startY = startEvt.clientY
      const handleInitLeft = parseFloat(handle.style.left)
      const handleInitTop = parseFloat(handle.style.top)
      const initialPositions = new Map<string, { x: number; y: number }>()
      memberNodes.forEach((n: CyInstance) => {
        const pos: { x: number; y: number } = n.position()
        initialPositions.set(n.id() as string, { x: pos.x, y: pos.y })
      })
      let lastDx = 0
      let lastDy = 0
      let moved = false

      const onMouseMove = (moveEvt: MouseEvent) => {
        const screenDx = moveEvt.clientX - startX
        const screenDy = moveEvt.clientY - startY
        if (Math.abs(screenDx) > 3 || Math.abs(screenDy) > 3) {
          moved = true
          handle.style.cursor = 'grabbing'
        }
        if (!moved) return
        const currentZoom: number = cy.zoom()
        lastDx = screenDx / currentZoom
        lastDy = screenDy / currentZoom
        memberNodes.forEach((n: CyInstance) => {
          const init = initialPositions.get(n.id() as string)!
          n.position({ x: init.x + lastDx, y: init.y + lastDy })
        })
        handle.style.left = (handleInitLeft + screenDx) + 'px'
        handle.style.top = (handleInitTop + screenDy) + 'px'
        renderDomainBackgrounds(cy, schema, bgContainer)
      }

      const onMouseUp = () => {
        handle.style.cursor = 'grab'
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
        if (!moved) {
          onDomainClick(domain.id)
        } else {
          onDomainDragEnd(domain.id, lastDx, lastDy)
        }
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    })

    container.appendChild(handle)
  })
}


// ── Annotation overlay renderer ─────────────────────────────────────────
function renderAnnotations(
  cy: CyInstance,
  schema: Schema,
  container: HTMLDivElement,
  theme: 'dark' | 'light',
  onAnnotationDragEnd: (id: string, newOffset: { x: number; y: number }) => void,
  onAnnotationClick: (id: string) => void,
  selectedAnnotationId: string | null,
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

    const isSelected = selectedAnnotationId === ann.id
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
      border: ${isSelected ? '2px solid #3b82f6' : '1px solid rgba(0,0,0,0.1)'};
      border-radius: ${8 * zoom}px;
      font-size: ${12 * zoom}px;
      line-height: 1.4;
      cursor: grab;
      box-shadow: ${isSelected ? '0 0 0 3px rgba(59,130,246,0.3)' : '0 2px 8px rgba(0,0,0,0.12)'};
      white-space: pre-wrap;
      user-select: none;
      pointer-events: auto;
    `
    div.textContent = ann.text

    // ── Annotation drag + click (tap vs drag detection) ─────────────────
    div.addEventListener('mousedown', (startEvt) => {
      startEvt.preventDefault()
      startEvt.stopPropagation()
      const startScreenX = startEvt.clientX
      const startScreenY = startEvt.clientY
      const startOffsetX = ann.offset.x
      const startOffsetY = ann.offset.y
      let moved = false

      const onMouseMove = (moveEvt: MouseEvent) => {
        const dx = moveEvt.clientX - startScreenX
        const dy = moveEvt.clientY - startScreenY
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          moved = true
          div.style.cursor = 'grabbing'
        }
        if (moved) {
          div.style.left = (absX + dx) + 'px'
          div.style.top = (absY + dy) + 'px'
        }
      }

      const onMouseUp = (upEvt: MouseEvent) => {
        div.style.cursor = 'grab'
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
        if (!moved) {
          onAnnotationClick(ann.id)
        } else {
          const currentZoom: number = cy.zoom()
          const dx = (upEvt.clientX - startScreenX) / currentZoom
          const dy = (upEvt.clientY - startScreenY) / currentZoom
          onAnnotationDragEnd(ann.id, { x: startOffsetX + dx, y: startOffsetY + dy })
        }
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
  onAnnotationClick: (id: string) => void
  onDomainClick: (id: string) => void
  onAddTableAt: (x: number, y: number) => void
  onAddDomainAt: (x: number, y: number) => void
  onAddAnnotationAt: (x: number, y: number) => void
  onFitView: (fitFn: () => void) => void
  onFocusNode: (focusFn: (id: string) => void) => void
  onEdgeCreated: (kind: 'lineage' | 'er', sourceId: string, targetId: string) => void
  onAutoLayout: (fn: () => void) => void
}

export default function CytoscapeCanvas({
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  onAnnotationClick,
  onDomainClick,
  onAddTableAt,
  onAddDomainAt,
  onAddAnnotationAt,
  onFitView,
  onFocusNode,
  onEdgeCreated,
  onAutoLayout,
}: CytoscapeCanvasProps) {
  const {
    schema,
    selectedTableId,
    selectedTableIds,
    selectedAnnotationId,
    highlightedNodeIds,
    pathFinderResult,
    isPresentationMode,
    showER,
    showLineage,
    showAnnotations,
    isCompactMode,
    theme,
    hoveredColumnId,
    updateNodePosition,
    updateNodesPosition,
    updateAnnotation,
    connectMode,
  } = useStore(
    useShallow((s) => ({
      schema: s.schema,
      selectedTableId: s.selectedTableId,
      selectedTableIds: s.selectedTableIds,
      selectedAnnotationId: s.selectedAnnotationId,
      highlightedNodeIds: s.highlightedNodeIds,
      pathFinderResult: s.pathFinderResult,
      isPresentationMode: s.isPresentationMode,
      showER: s.showER,
      showLineage: s.showLineage,
      showAnnotations: s.showAnnotations,
      isCompactMode: s.isCompactMode,
      theme: s.theme,
      hoveredColumnId: s.hoveredColumnId,
      updateNodePosition: s.updateNodePosition,
      updateNodesPosition: s.updateNodesPosition,
      updateAnnotation: s.updateAnnotation,
      connectMode: s.connectMode,
    }))
  )

  const cyContainerRef = useRef<HTMLDivElement>(null)
  const minimapCanvasRef = useRef<HTMLCanvasElement>(null)
  const cyRef = useRef<CyInstance>(null)
  const domBgRef = useRef<HTMLDivElement | null>(null)
  const domAnnRef = useRef<HTMLDivElement | null>(null)
  const domHandleRef = useRef<HTMLDivElement | null>(null) // domain drag handles (z-index: 25)
  const rootMapRef = useRef<Map<string, Root>>(new Map())
  const domContainerMapRef = useRef<Map<string, HTMLDivElement>>(new Map())
  const zoomRef = useRef<number>(1)
  const lowZoomRef = useRef<boolean>(false)
  const rafIdRef = useRef<number | null>(null)

  // Mutable refs for state used inside stable callbacks
  const selectedIdRef = useRef<string | null>(null)
  const selectedIdsRef = useRef<string[]>([])
  const highlightedIdsRef = useRef<string[]>([])
  const hoveredNodeIdRef = useRef<string | null>(null)
  const connectPendingSourceRef = useRef<string | null>(null)
  const presentationModeRef = useRef<boolean>(false)
  const themeRef = useRef<'dark' | 'light'>(theme)
  const hoveredColumnIdRef = useRef<string | null>(null)
  const isCompactModeRef = useRef<boolean>(isCompactMode)
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
        const isDimmed = isAnythingHighlighted && !isSelected && !isHighlighted && !isHovered
        const currentConnectMode = useStore.getState().connectMode
        const isPendingSource = connectPendingSourceRef.current === id
        const isConnectMode = !!currentConnectMode

        root.render(
          <TableCard
            table={table}
            isSelected={isSelected}
            isDimmed={isDimmed}
            isHighlighted={isHighlighted}
            isHovered={isHovered}
            isPendingSource={isPendingSource}
            isConnectMode={isConnectMode}
            zoom={zoom}
            theme={themeRef.current}
            hoveredColumnId={hoveredColumnIdRef.current}
            isCompact={isCompactModeRef.current}
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

  const onDomainClickRef = useRef(onDomainClick)
  useEffect(() => { onDomainClickRef.current = onDomainClick }, [onDomainClick])

  // ── Annotation drag end callback ─────────────────────────────────────
  const onAnnotationDragEnd = useCallback(
    (id: string, newOffset: { x: number; y: number }) => {
      updateAnnotation(id, { offset: newOffset })
    },
    [updateAnnotation]
  )
  const onAnnotationDragEndRef = useRef(onAnnotationDragEnd)
  useEffect(() => { onAnnotationDragEndRef.current = onAnnotationDragEnd }, [onAnnotationDragEnd])

  const onAnnotationClickRef = useRef(onAnnotationClick)
  useEffect(() => { onAnnotationClickRef.current = onAnnotationClick }, [onAnnotationClick])

  const selectedAnnotationIdRef = useRef(selectedAnnotationId)
  useEffect(() => {
    selectedAnnotationIdRef.current = selectedAnnotationId
    const cy = cyRef.current
    if (!cy || !domAnnRef.current || !schemaRef.current || !showAnnotations) return
    renderAnnotations(cy, schemaRef.current, domAnnRef.current, themeRef.current, onAnnotationDragEndRef.current, onAnnotationClickRef.current, selectedAnnotationId)
  }, [selectedAnnotationId, showAnnotations])

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
      wheelSensitivity: 1.0,
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
      const id: string = evt.target.id()
      const mode = useStore.getState().connectMode
      if (mode) {
        const pending = connectPendingSourceRef.current
        if (!pending) {
          // 1st click: set as source
          connectPendingSourceRef.current = id
          updateAllCards()
        } else if (pending === id) {
          // clicked same node: cancel
          connectPendingSourceRef.current = null
          updateAllCards()
        } else {
          // 2nd click: create edge
          onEdgeCreated(mode, pending, id)
          connectPendingSourceRef.current = null
        }
        return
      }
      onNodeClick(id)
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
      if (useStore.getState().connectMode) return
      const node = evt.target
      hoveredNodeIdRef.current = node.id()
      const connectedEdges = node.connectedEdges()
      const connectedNodes = connectedEdges.connectedNodes().not(node)
      const highlightIds: string[] = connectedNodes.map((n: CyInstance) => n.id())
      useStore.getState().setHighlightedNodeIds(highlightIds)
    })
    cy.on('mouseout', 'node', () => {
      if (useStore.getState().connectMode) return
      hoveredNodeIdRef.current = null
      useStore.getState().setHighlightedNodeIds([])
    })

    // Box / lasso selection → sync to store
    // Debounced: lasso over 1000 nodes fires boxselect 1000 times; batch into one update.
    let boxSelectTimer: ReturnType<typeof setTimeout> | null = null
    cy.on('boxselect', 'node', () => {
      if (boxSelectTimer) clearTimeout(boxSelectTimer)
      boxSelectTimer = setTimeout(() => {
        boxSelectTimer = null
        const selectedIds: string[] = cy
          .nodes(':selected')
          .map((n: CyInstance) => n.id() as string)
        useStore.getState().setSelectedTableIds(selectedIds)
      }, 50)
    })

    // Update overlays on viewport change
    const updateOverlays = () => {
      if (domBgRef.current && schemaRef.current) {
        renderDomainBackgrounds(cy, schemaRef.current, domBgRef.current)
      }
      if (domHandleRef.current && domBgRef.current && schemaRef.current) {
        renderDomainHandles(cy, schemaRef.current, domHandleRef.current, domBgRef.current, themeRef.current, onDomainDragEndRef.current, onDomainClickRef.current)
      }
      if (domAnnRef.current && schemaRef.current && showAnnotationsRef.current) {
        renderAnnotations(cy, schemaRef.current, domAnnRef.current, themeRef.current, onAnnotationDragEndRef.current, onAnnotationClickRef.current, selectedAnnotationIdRef.current)
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
          // Explicitly remove DOM container to prevent orphaned elements
          // intercepting mouse events after YAML switch
          const domContainer = domContainerMapRef.current.get(el.id())
          if (domContainer && domContainer.parentNode) {
            domContainer.parentNode.removeChild(domContainer)
          }
          domContainerMapRef.current.delete(el.id())
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
            startEvt.stopPropagation() // prevent canvas pan / box-select start
            startEvt.preventDefault()

            // Shift+click: toggle this node in/out of multi-selection
            if (startEvt.shiftKey) {
              const { selectedTableIds, setSelectedTableIds } = useStore.getState()
              const next = selectedTableIds.includes(id)
                ? selectedTableIds.filter(sid => sid !== id)
                : [...selectedTableIds, id]
              setSelectedTableIds(next)
              return
            }

            const cy = cyRef.current
            const cyEl = cy?.getElementById(id)
            if (!cyEl || cyEl.length === 0) return

            const startX = startEvt.clientX
            const startY = startEvt.clientY
            let moved = false

            // Multi-select drag: if this node is part of a multi-selection, move all together
            const selectedIds = useStore.getState().selectedTableIds
            const isMultiDrag = selectedIds.length > 1 && selectedIds.includes(id)
            const initPositions = new Map<string, { x: number; y: number }>()
            if (isMultiDrag) {
              selectedIds.forEach(selId => {
                const node = cy?.getElementById(selId)
                if (node && node.length > 0) initPositions.set(selId, { ...node.position() })
              })
            } else {
              initPositions.set(id, { ...cyEl.position() })
            }

            const onMouseMove = (moveEvt: MouseEvent) => {
              const zoom: number = cyRef.current?.zoom() ?? 1
              const dx = (moveEvt.clientX - startX) / zoom
              const dy = (moveEvt.clientY - startY) / zoom
              if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true
              initPositions.forEach((initPos, nodeId) => {
                const node = cyRef.current?.getElementById(nodeId)
                if (node && node.length > 0) node.position({ x: initPos.x + dx, y: initPos.y + dy })
              })
            }

            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove)
              window.removeEventListener('mouseup', onMouseUp)
              if (moved) {
                if (isMultiDrag) {
                  const updates = Array.from(initPositions.keys()).map(nodeId => {
                    const node = cyRef.current?.getElementById(nodeId)
                    const pos: { x: number; y: number } = node.position()
                    return { id: nodeId, x: pos.x, y: pos.y }
                  })
                  useStore.getState().updateNodesPosition(updates)
                } else {
                  const pos: { x: number; y: number } = cyEl.position()
                  useStore.getState().updateNodePosition(id, pos.x, pos.y)
                }
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
          domContainerMapRef.current.set(id, domContainer)
        }
      }
    })

    // Edge visibility
    cy.edges('.er-edge').style('display', showER ? 'element' : 'none')
    cy.edges('.lineage-edge').style('display', showLineage ? 'element' : 'none')

    // Update overlays
    if (domBgRef.current) renderDomainBackgrounds(cy, schema, domBgRef.current)
    if (domHandleRef.current && domBgRef.current) renderDomainHandles(cy, schema, domHandleRef.current, domBgRef.current, theme, onDomainDragEndRef.current, onDomainClickRef.current)
    if (domAnnRef.current) {
      if (showAnnotations) renderAnnotations(cy, schema, domAnnRef.current, theme, onAnnotationDragEndRef.current, onAnnotationClickRef.current, selectedAnnotationIdRef.current)
      else domAnnRef.current.innerHTML = ''
    }

    updateAllCards()
  }, [schema, showER, showLineage, showAnnotations, theme, updateAllCards])

  // ── Sync selection / highlight → cards + edge styles ────────────────
  useEffect(() => {
    isCompactModeRef.current = isCompactMode
    updateAllCards()
  }, [isCompactMode, updateAllCards])

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

  // ── Rebuild Cytoscape style when theme changes ────────────────────────
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.style(buildCytoscapeStyle(theme, zoomRef.current < LOW_ZOOM_THRESHOLD))
  }, [theme])

  // ── Connect mode: reset pending source + clear hover highlight ──────
  // DOM containers intercept mousedown (stopPropagation) to handle drag.
  // In connect mode we disable pointer-events on them so clicks fall through
  // to Cytoscape's canvas and the tap handler can fire.
  useEffect(() => {
    if (connectMode) {
      hoveredNodeIdRef.current = null
      highlightedIdsRef.current = []
      domContainerMapRef.current.forEach(c => { c.style.pointerEvents = 'none' })
    } else {
      connectPendingSourceRef.current = null
      domContainerMapRef.current.forEach(c => { c.style.pointerEvents = 'auto' })
    }
    updateAllCards()
  }, [connectMode, updateAllCards])

  // ── Expose canvas API to parent ──────────────────────────────────────
  useEffect(() => {
    const fitFn = () => {
      const cy = cyRef.current
      if (!cy) return
      cy.fit(undefined, 40)
      // If the result is too zoomed out (e.g. 1000 tables), cap at a readable minimum
      const MIN_ZOOM = 0.3
      if (cy.zoom() < MIN_ZOOM) {
        cy.zoom(MIN_ZOOM)
        cy.center(cy.elements())
      }
    }
    onFitView(fitFn)
    ;(window as any).__modscapeFitView = fitFn
  }, [onFitView])

  // ── Auto Layout (dagre LR + domain grid packing) ─────────────────────
  useEffect(() => {
    onAutoLayout(() => {
      const cy = cyRef.current
      if (!cy) return
      const schema = schemaRef.current
      if (!schema) return

      // Set actual DOM heights so dagre spaces rows correctly
      cy.nodes().forEach((n: CyInstance) => {
        const domEl: HTMLElement | undefined = n.data('dom')
        if (domEl && domEl.offsetHeight > 0) n.style('height', domEl.offsetHeight)
      })

      const cyLayout = cy.layout({
        name: 'dagre',
        rankDir: 'LR',
        nodeSep: 80,
        rankSep: 200,
        padding: 80,
        fit: false,
      })

      cyLayout.on('layoutstop', () => {
        cy.nodes().forEach((n: CyInstance) => n.removeStyle('height'))

        // Read dagre-computed positions
        const dagrePos = new Map<string, { x: number; y: number }>()
        cy.nodes().forEach((n: CyInstance) => {
          const id = n.id() as string
          if (schema.tables.some(t => t.id === id)) dagrePos.set(id, { ...n.position() })
        })

        const newLayout: Record<string, any> = {}
        const PAD = 48
        const TABLE_W = 280
        const GAP = 40

        const getH = (tid: string) => {
          const domEl: HTMLElement | undefined = cy.getElementById(tid).data('dom')
          return domEl?.offsetHeight ?? 220
        }

        // Domain members: rearrange into grid preserving dagre rank order
        schema.domains?.forEach(domain => {
          const members = domain.tables.filter(tid => dagrePos.has(tid))
          if (members.length === 0) return

          // Sort by dagre x (rank = left→right order)
          members.sort((a, b) => dagrePos.get(a)!.x - dagrePos.get(b)!.x)

          const cols = Math.min(3, Math.ceil(Math.sqrt(members.length)))
          const rowCount = Math.ceil(members.length / cols)

          // Row heights: max DOM height per row
          const rowH: number[] = Array.from({ length: rowCount }, (_, row) => {
            let max = 0
            for (let c = 0; c < cols; c++) {
              const m = members[row * cols + c]
              if (m) max = Math.max(max, getH(m))
            }
            return max
          })

          const gridW = cols * (TABLE_W + GAP) - GAP
          const gridH = rowH.reduce((s, h) => s + h + GAP, 0) - GAP

          // Anchor grid to dagre centroid
          const cx = members.reduce((s, tid) => s + dagrePos.get(tid)!.x, 0) / members.length
          const cy2 = members.reduce((s, tid) => s + dagrePos.get(tid)!.y, 0) / members.length
          const originX = cx - gridW / 2
          const originY = cy2 - gridH / 2

          members.forEach((tid, idx) => {
            const col = idx % cols
            const row = Math.floor(idx / cols)
            const xOff = col * (TABLE_W + GAP) + TABLE_W / 2
            const yOff = rowH.slice(0, row).reduce((s, h) => s + h + GAP, 0) + rowH[row] / 2
            newLayout[tid] = { x: Math.round(originX + xOff), y: Math.round(originY + yOff), parentId: domain.id }
          })

          // Domain bounding box
          const HEADER = 28
          newLayout[domain.id] = {
            x: Math.round(originX - PAD),
            y: Math.round(originY - PAD - HEADER),
            width: Math.round(gridW + PAD * 2),
            height: Math.round(gridH + PAD * 2 + HEADER),
            isLocked: schema.layout?.[domain.id]?.isLocked,
          }
        })

        // Standalone tables (not in any domain)
        const domainTableIds = new Set(schema.domains?.flatMap(d => d.tables) ?? [])
        schema.tables.forEach(t => {
          if (!domainTableIds.has(t.id) && dagrePos.has(t.id)) {
            const pos = dagrePos.get(t.id)!
            newLayout[t.id] = { x: Math.round(pos.x), y: Math.round(pos.y) }
          }
        })

        useStore.getState().applyLayout(newLayout)

        // Fit view after layout settles
        setTimeout(() => {
          const cyi = cyRef.current
          if (!cyi) return
          cyi.fit(undefined, 40)
          const MIN_ZOOM = 0.3
          if (cyi.zoom() < MIN_ZOOM) { cyi.zoom(MIN_ZOOM); cyi.center(cyi.elements()) }
        }, 300)
      })

      cyLayout.run()
    })
  }, [onAutoLayout])

  useEffect(() => {
    onFocusNode((id: string) => {
      const cy = cyRef.current
      if (!cy) return
      const node = cy.getElementById(id)
      if (node.length === 0) return
      cy.animate({ fit: { eles: node, padding: 120 }, duration: 800, easing: 'ease-in-out' })
    })
  }, [onFocusNode])

  // ── Minimap ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = minimapCanvasRef.current
    const cy = cyRef.current
    if (!canvas || !cy) return

    const W = canvas.width
    const H = canvas.height
    const PAD = 6

    const draw = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, W, H)

      const nodes = cy.nodes()
      if (nodes.length === 0) return

      const bb = nodes.boundingBox({})
      if (bb.w === 0 || bb.h === 0) return

      const scale = Math.min((W - PAD * 2) / bb.w, (H - PAD * 2) / bb.h)
      const ox = PAD + ((W - PAD * 2) - bb.w * scale) / 2
      const oy = PAD + ((H - PAD * 2) - bb.h * scale) / 2
      const toX = (x: number) => (x - bb.x1) * scale + ox
      const toY = (y: number) => (y - bb.y1) * scale + oy

      // Nodes
      nodes.forEach((n: CyInstance) => {
        const pos = n.position()
        const color: string = n.data('typeColor') || '#64748b'
        const nw = 280 * scale
        const nh = 160 * scale
        ctx.fillStyle = color
        ctx.globalAlpha = 0.85
        ctx.beginPath()
        ctx.roundRect(toX(pos.x) - nw / 2, toY(pos.y) - nh / 2, nw, nh, 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // Viewport rect
      const zoom: number = cy.zoom()
      const pan: { x: number; y: number } = cy.pan()
      const container = cy.container() as HTMLElement
      const vx1 = toX(-pan.x / zoom)
      const vy1 = toY(-pan.y / zoom)
      const vx2 = toX((container.offsetWidth - pan.x) / zoom)
      const vy2 = toY((container.offsetHeight - pan.y) / zoom)
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.9
      ctx.strokeRect(vx1, vy1, vx2 - vx1, vy2 - vy1)
      ctx.fillStyle = '#3b82f6'
      ctx.globalAlpha = 0.1
      ctx.fillRect(vx1, vy1, vx2 - vx1, vy2 - vy1)
      ctx.globalAlpha = 1
    }

    cy.on('pan zoom add remove move data', draw)
    draw()
    return () => { cy.removeListener('pan zoom add remove move data', draw) }
  }, [schema]) // redraw when schema changes too

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
      if (key === 'c') {
        e.preventDefault()
        const { connectMode, setConnectMode } = useStore.getState()
        setConnectMode(connectMode === 'lineage' ? null : 'lineage')
        return
      }

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

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={cyContainerRef} style={{ width: '100%', height: '100%' }} />
      <canvas
        ref={minimapCanvasRef}
        width={140}
        height={90}
        style={{
          position: 'absolute',
          bottom: 48,
          right: 16,
          width: 140,
          height: 90,
          borderRadius: 6,
          border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
          background: theme === 'dark' ? '#0f172a' : '#f8fafc',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
