import type { Graph, GraphNode, NodeState, EdgeState } from '../algorithms/types'

// ── Constants ─────────────────────────────────────────────────────

const R = 24          // node circle radius
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

// Marker IDs keyed by EdgeState — one arrowhead per color
const MARKER_ID: Record<EdgeState, string> = {
  default:  'arrow-default',
  active:   'arrow-active',
  accepted: 'arrow-accepted',
  rejected: 'arrow-rejected',
}

// ── Geometry helpers ──────────────────────────────────────────────

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

// ── Sub-components ────────────────────────────────────────────────

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

// ── Props ─────────────────────────────────────────────────────────

interface Props {
  graph: Graph
  nodeStates?: Record<string, NodeState>
  edgeStates?: Record<string, EdgeState>
}

// ── Component ─────────────────────────────────────────────────────

export default function GraphCanvas({ graph, nodeStates = {}, edgeStates = {} }: Props) {
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]))

  return (
    <svg
      width={W}
      height={H}
      className="bg-gray-950 rounded-xl"
      style={{ display: 'block' }}
    >
      {graph.directed && <ArrowDefs />}

      {/* Edges — rendered first so nodes sit on top */}
      {graph.edges.map((edge) => {
        const from = nodeMap.get(edge.from)
        const to   = nodeMap.get(edge.to)
        if (!from || !to) return null

        const state  = edgeStates[edge.id] ?? 'default'
        const color  = EDGE_COLOR[state]
        const { x1, y1, x2, y2 } = edgeEndpoints(from, to)
        const mx = (from.x + to.x) / 2
        const my = (from.y + to.y) / 2

        return (
          <g key={edge.id}>
            <line
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              style={{ stroke: color, strokeWidth: 2 }}
              markerEnd={graph.directed ? `url(#${MARKER_ID[state]})` : undefined}
            />
            {edge.weight !== undefined && (
              <text
                x={mx}
                y={my - 8}
                textAnchor="middle"
                fontSize={12}
                style={{ fill: color }}
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

        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={R}
              style={{ fill, stroke: '#1F2937', strokeWidth: 2 }}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={14}
              fontWeight="bold"
              style={{ fill: '#ffffff' }}
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

// ── Hardcoded test data ───────────────────────────────────────────
// Remove once GraphBuilder wires up real graph state.

export const TEST_GRAPH: Graph = {
  directed: true,
  nodes: [
    { id: 'a', label: 'A', x: 400, y:  80 },
    { id: 'b', label: 'B', x: 200, y: 280 },
    { id: 'c', label: 'C', x: 600, y: 280 },
    { id: 'd', label: 'D', x: 300, y: 480 },
    { id: 'e', label: 'E', x: 500, y: 480 },
  ],
  edges: [
    { id: 'ab', from: 'a', to: 'b', weight: 4 },
    { id: 'ac', from: 'a', to: 'c', weight: 2 },
    { id: 'bd', from: 'b', to: 'd', weight: 5 },
    { id: 'cd', from: 'c', to: 'd', weight: 1 },
    { id: 'de', from: 'd', to: 'e', weight: 3 },
  ],
}

export const TEST_NODE_STATES: Record<string, NodeState> = {
  a: 'start',
  b: 'visited',
  c: 'current',
  d: 'unvisited',
  e: 'unvisited',
}

export const TEST_EDGE_STATES: Record<string, EdgeState> = {
  ab: 'accepted',
  ac: 'active',
  bd: 'default',
  cd: 'default',
  de: 'default',
}
