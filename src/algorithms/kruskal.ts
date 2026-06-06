import type {
  Graph,
  GraphEdge,
  AlgorithmStep,
  AlgorithmFn,
  NodeState,
  EdgeState,
} from './types'

// ── Union-Find ────────────────────────────────────────────────────

function makeUF(nodes: string[]): Record<string, string> {
  return Object.fromEntries(nodes.map((n) => [n, n]))
}

function find(parent: Record<string, string>, x: string): string {
  if (parent[x] !== x) parent[x] = find(parent, parent[x])   // path compression
  return parent[x]
}

function union(parent: Record<string, string>, rank: Record<string, number>, x: string, y: string): boolean {
  const px = find(parent, x)
  const py = find(parent, y)
  if (px === py) return false   // already in same component → cycle
  if (rank[px] < rank[py])      { parent[px] = py }
  else if (rank[px] > rank[py]) { parent[py] = px }
  else                          { parent[py] = px; rank[px]++ }
  return true
}

// ── Helpers ───────────────────────────────────────────────────────

function blankEdgeStates(edges: GraphEdge[]): Record<string, EdgeState> {
  return Object.fromEntries(edges.map((e) => [e.id, 'default' as EdgeState]))
}

function labelOf(graph: Graph, id: string): string {
  return graph.nodes.find((n) => n.id === id)?.label ?? id
}

// ── Kruskal ───────────────────────────────────────────────────────
//
// startNodeId is ignored — Kruskal processes the whole graph at once.
// Graph must be undirected and weighted for meaningful output.

export const kruskal: AlgorithmFn = (graph) => {
  const steps: AlgorithmStep[] = []

  const nodeStates: Record<string, NodeState> = Object.fromEntries(
    graph.nodes.map((n) => [n.id, 'unvisited' as NodeState])
  )
  // Edge states persist and accumulate (accepted = green, rejected = red)
  const edgeStates: Record<string, EdgeState> = blankEdgeStates(graph.edges)

  const parent = makeUF(graph.nodes.map((n) => n.id))
  const rank: Record<string, number> = Object.fromEntries(
    graph.nodes.map((n) => [n.id, 0])
  )

  function snapshot(): Record<string, EdgeState> {
    return { ...edgeStates }
  }

  function pushStep(
    partial: Omit<AlgorithmStep, 'visitedNodes' | 'graphState'> & {
      edgeOverride?: [string, EdgeState]
    }
  ) {
    const { edgeOverride, ...rest } = partial
    const states = snapshot()
    if (edgeOverride) states[edgeOverride[0]] = edgeOverride[1]
    steps.push({
      ...rest,
      visitedNodes: new Set<string>(),
      graphState: { nodeStates: { ...nodeStates }, edgeStates: states },
    })
  }

  // Sort edges by weight ascending
  const sorted = [...graph.edges].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
  const sortedDesc = sorted
    .map((e) => `${labelOf(graph, e.from)}-${labelOf(graph, e.to)}:${e.weight ?? 0}`)
    .join(', ')

  const needed = graph.nodes.length - 1   // MST has n-1 edges
  let mstEdgeCount = 0
  let mstWeight = 0

  // ── Step 0: announce sorted edge order ───────────────────────────
  pushStep({
    currentNode: null,
    activeEdge: null,
    dataStructure: [],
    message: `წიბოები წონით დავალაგეთ: ${sortedDesc}`,
  })

  // ── Process edges in weight order ─────────────────────────────────
  for (const edge of sorted) {
    const fl = labelOf(graph, edge.from)
    const tl = labelOf(graph, edge.to)
    const w  = edge.weight ?? 0

    // Flash orange — "considering this edge"
    pushStep({
      currentNode: null,
      activeEdge: edge.id,
      dataStructure: [],
      edgeOverride: [edge.id, 'active'],
      message: `განვიხილავთ წიბოს ${fl}-${tl} (წონა: ${w})`,
    })

    if (union(parent, rank, edge.from, edge.to)) {
      // ── Accept ────────────────────────────────────────────────────
      edgeStates[edge.id] = 'accepted'
      mstWeight += w
      mstEdgeCount++
      nodeStates[edge.from] = 'visited'
      nodeStates[edge.to]   = 'visited'

      pushStep({
        currentNode: null,
        activeEdge: edge.id,
        dataStructure: [],
        message: `წიბო ${fl}-${tl} (წონა: ${w}) — ვამატებთ MST-ში  ✓  (MST წონა: ${mstWeight})`,
      })

      // deliberately no break — continue so remaining edges are shown as rejected
    } else {
      // ── Reject — would form a cycle ───────────────────────────────
      edgeStates[edge.id] = 'rejected'

      pushStep({
        currentNode: null,
        activeEdge: edge.id,
        dataStructure: [],
        message: `წიბო ${fl}-${tl} (წონა: ${w}) — ციკლს შექმნიდა, უარვყოფთ  ✗`,
      })
    }
  }

  // ── Final step ────────────────────────────────────────────────────
  pushStep({
    currentNode: null,
    activeEdge: null,
    dataStructure: [],
    message: `MST დასრულდა — მინიმალური გამჭოლი ხის საერთო წონა: ${mstWeight}`,
  })

  return steps
}
