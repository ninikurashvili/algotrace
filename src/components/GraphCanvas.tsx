import { useRef, useEffect } from 'react'
import type { Graph, GraphNode, NodeState, EdgeState } from '../algorithms/types'

const R = 24
const W = 800
const H = 600

const NODE_COLOR: Record<NodeState, string> = {
  unvisited: '#9CA3AF',
  queued:    '#3B82F6',
  current:   '#F97316',
  visited:   '#22C55E',
  start:     '#3B82F6',
}

const EDGE_COLOR: Record<EdgeState, string> = {
  default:  '#D1D5DB',
  active:   '#F97316',
  accepted: '#22C55E',
  rejected: '#EF4444',
}

const MARKER_ID: Record<EdgeState, string> = {
  default:  'arrow-default',
  active:   'arrow-active',
  accepted: 'arrow-accepted',
  rejected: 'arrow-rejected',
}

function edgeEndpoints(from: GraphNode, to: GraphNode) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return { x1: from.x, y1: from.y, x2: to.x, y2: to.y }
  const ux = dx / len
  const uy = dy / len
  return {
    x1: from.x + ux * R,
    y1: from.y + uy * R,
    x2: to.x  - ux * R,
    y2: to.y  - uy * R,
  }
}

function ArrowDefs() {
  return (
    <defs>
      {(Object.keys(EDGE_COLOR) as EdgeState[]).map((state) => (
        <marker
          key={state}
          id={MARKER_ID[state]}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            style={{ fill: EDGE_COLOR[state] }}
          />
        </marker>
      ))}
    </defs>
  )
}

interface Props {
  graph: Graph
  nodeStates?: Record<string, NodeState>
  edgeStates?: Record<string, EdgeState>
  onNodeClick?: (nodeId: string) => void
  onEdgeClick?: (edgeId: string) => void
  onNodeDrag?: (nodeId: string, x: number, y: number) => void
  selectedNodeId?: string | null
  selectedEdgeId?: string | null
}

export default function GraphCanvas({
  graph,
  nodeStates = {},
  edgeStates = {},
  onNodeClick,
  onEdgeClick,
  onNodeDrag,
  selectedNodeId,
  selectedEdgeId,
}: Props) {
  const svgRef      = useRef<SVGSVGElement>(null)
  const draggingId  = useRef<string | null>(null)
  const hasDragged  = useRef(false)

  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]))

  // Non-passive touchmove so preventDefault() can suppress page scroll while dragging
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const handler = (e: TouchEvent) => {
      if (draggingId.current && onNodeDrag) e.preventDefault()
    }
    el.addEventListener('touchmove', handler, { passive: false })
    return () => el.removeEventListener('touchmove', handler)
  }, [onNodeDrag])

  function toSVGCoords(clientX: number, clientY: number): { x: number; y: number } {
    if (!svgRef.current) return { x: 0, y: 0 }
    const rect = svgRef.current.getBoundingClientRect()
    return {
      x: Math.round(((clientX - rect.left) / rect.width)  * W),
      y: Math.round(((clientY - rect.top)  / rect.height) * H),
    }
  }

  // ── Mouse handlers ────────────────────────────────────────────────
  function handleSVGMouseMove(e: React.MouseEvent) {
    if (!draggingId.current || !onNodeDrag) return
    hasDragged.current = true
    const { x, y } = toSVGCoords(e.clientX, e.clientY)
    onNodeDrag(draggingId.current, x, y)
  }

  function handleSVGMouseUp() {
    draggingId.current = null
  }

  function handleNodeMouseDown(nodeId: string, e: React.MouseEvent) {
    if (!onNodeDrag) return
    e.preventDefault()
    e.stopPropagation()
    draggingId.current = nodeId
    hasDragged.current = false
  }

  function handleNodeClick(nodeId: string) {
    if (hasDragged.current) return
    onNodeClick?.(nodeId)
  }

  // ── Touch handlers ────────────────────────────────────────────────
  function handleNodeTouchStart(nodeId: string, e: React.TouchEvent) {
    e.stopPropagation()
    draggingId.current = nodeId
    hasDragged.current = false
  }

  function handleSVGTouchMove(e: React.TouchEvent) {
    if (!draggingId.current || !onNodeDrag) return
    e.preventDefault()
    hasDragged.current = true
    const t = e.touches[0]
    const { x, y } = toSVGCoords(t.clientX, t.clientY)
    onNodeDrag(draggingId.current, x, y)
  }

  function handleSVGTouchEnd(e: React.TouchEvent) {
    if (!hasDragged.current && draggingId.current) {
      onNodeClick?.(draggingId.current)
      e.preventDefault()
    }
    e.stopPropagation()
    draggingId.current = null
  }

  const interactive = !!(onNodeClick || onNodeDrag)

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="bg-gray-950 rounded-xl block w-full"
      style={{ aspectRatio: `${W} / ${H}`, userSelect: 'none' }}
      onMouseMove={handleSVGMouseMove}
      onMouseUp={handleSVGMouseUp}
      onMouseLeave={handleSVGMouseUp}
      onTouchMove={handleSVGTouchMove}
      onTouchEnd={handleSVGTouchEnd}
      onTouchCancel={handleSVGTouchEnd}
    >
      {graph.directed && <ArrowDefs />}

      {/* Edges — rendered before nodes so nodes sit on top */}
      {graph.edges.map((edge) => {
        const from = nodeMap.get(edge.from)
        const to   = nodeMap.get(edge.to)
        if (!from || !to) return null

        const isSelected = edge.id === selectedEdgeId
        const state  = edgeStates[edge.id] ?? 'default'
        const color  = isSelected ? '#3B82F6' : EDGE_COLOR[state]
        const { x1, y1, x2, y2 } = edgeEndpoints(from, to)
        const mx = (from.x + to.x) / 2
        const my = (from.y + to.y) / 2
        // Perpendicular offset so the weight label never sits on the line
        const dx  = to.x - from.x
        const dy  = to.y - from.y
        const len = Math.sqrt(dx * dx + dy * dy) || 1
        const ux  = dx / len
        const uy  = dy / len
        const labelX = mx + uy * 12     // perpendicular: (uy, -ux)
        const labelY = my - ux * 12

        return (
          <g key={edge.id}>
            {/* Wide invisible hit area for easier clicking */}
            {onEdgeClick && (
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                style={{ stroke: 'transparent', strokeWidth: 14, cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); onEdgeClick(edge.id) }}
              />
            )}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              style={{ stroke: color, strokeWidth: isSelected ? 3 : 2, pointerEvents: 'none' }}
              markerEnd={graph.directed ? `url(#${MARKER_ID[state]})` : undefined}
            />
            {edge.weight !== undefined && (
              <text
                x={labelX} y={labelY}
                textAnchor="middle"
                fontSize={12}
                style={{ fill: color, pointerEvents: 'none' }}
                className="select-none"
              >
                {edge.weight}
              </text>
            )}
          </g>
        )
      })}

      {/* Nodes */}
      {graph.nodes.map((node) => {
        const state = nodeStates[node.id] ?? 'unvisited'
        const fill  = NODE_COLOR[state]
        const isSelected = node.id === selectedNodeId

        return (
          <g
            key={node.id}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
            onClick={() => handleNodeClick(node.id)}
            onTouchStart={(e) => handleNodeTouchStart(node.id, e)}
          >
            {/* Selection ring */}
            {isSelected && (
              <circle
                cx={node.x} cy={node.y} r={R + 7}
                style={{ fill: 'none', stroke: '#F97316', strokeWidth: 2, strokeDasharray: '4 3' }}
              />
            )}
            <circle
              cx={node.x} cy={node.y} r={R}
              style={{ fill, stroke: '#1F2937', strokeWidth: 2 }}
            />
            <text
              x={node.x} y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={14}
              fontWeight="bold"
              style={{ fill: '#ffffff', pointerEvents: 'none' }}
              className="select-none"
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
