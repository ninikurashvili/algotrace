import type {
  Graph,
  GraphEdge,
  AlgorithmStep,
  NodeState,
  EdgeState,
} from './types'
import type { KruskalMsgs } from './msgTypes'

// ── Union-Find ────────────────────────────────────────────────────

function makeUF(nodes: string[]): Record<string, string> {
  return Object.fromEntries(nodes.map((n) => [n, n]))
}

function find(parent: Record<string, string>, x: string): string {
  if (parent[x] !== x) parent[x] = find(parent, parent[x])
  return parent[x]
}

function union(parent: Record<string, string>, rank: Record<string, number>, x: string, y: string): boolean {
  const px = find(parent, x)
  const py = find(parent, y)
  if (px === py) return false
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

const KA: KruskalMsgs = {
  sorted: (desc) => `ყველა წიბო წონის მიხედვით დავალაგეთ — ყველაზე მსუბუქიდან ყველაზე მძიმემდე: ${desc}`,
  considering: (fl, tl, w) => `განვიხილავთ წიბოს ${fl}–${tl} (წონა: ${w}). შევამოწმოთ, ციკლს ხომ არ შექმნის?`,
  accept: (fl, tl, w, total) => `✓ წიბო ${fl}–${tl} (წონა: ${w}) — ციკლი არ იქმნება, MST-ში ვამატებთ. MST-ის ჯამური წონა: ${total}`,
  reject: (fl, tl, w) => `✗ წიბო ${fl}–${tl} (წონა: ${w}) — ეს ორი ნოდი უკვე დაკავშირებულია! ციკლს შექმნიდა, ამიტომ გამოვტოვებთ.`,
  done: (total) => `MST დასრულდა. მინიმალური დამფარავი ხის საერთო წონა: ${total}`,
}

// ── Kruskal ───────────────────────────────────────────────────────

export function kruskal(graph: Graph, _startNodeId: string, msgs: KruskalMsgs = KA): AlgorithmStep[] {
  const steps: AlgorithmStep[] = []

  const nodeStates: Record<string, NodeState> = Object.fromEntries(
    graph.nodes.map((n) => [n.id, 'unvisited' as NodeState])
  )
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

  const sorted = [...graph.edges].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
  const sortedDesc = sorted
    .map((e) => `${labelOf(graph, e.from)}-${labelOf(graph, e.to)}:${e.weight ?? 0}`)
    .join(', ')

  let mstWeight = 0

  // ── Step 0: announce sorted order ───────────────────────────────
  pushStep({
    currentNode: null,
    activeEdge: null,
    dataStructure: [],
    message: msgs.sorted(sortedDesc),
  })

  // ── Process edges ─────────────────────────────────────────────────
  for (const edge of sorted) {
    const fl = labelOf(graph, edge.from)
    const tl = labelOf(graph, edge.to)
    const w  = edge.weight ?? 0

    pushStep({
      currentNode: null,
      activeEdge: edge.id,
      dataStructure: [],
      edgeOverride: [edge.id, 'active'],
      message: msgs.considering(fl, tl, w),
    })

    if (union(parent, rank, edge.from, edge.to)) {
      edgeStates[edge.id] = 'accepted'
      mstWeight += w
      nodeStates[edge.from] = 'visited'
      nodeStates[edge.to]   = 'visited'

      pushStep({
        currentNode: null,
        activeEdge: edge.id,
        dataStructure: [],
        message: msgs.accept(fl, tl, w, mstWeight),
      })
    } else {
      edgeStates[edge.id] = 'rejected'

      pushStep({
        currentNode: null,
        activeEdge: edge.id,
        dataStructure: [],
        message: msgs.reject(fl, tl, w),
      })
    }
  }

  // ── Final step ────────────────────────────────────────────────────
  pushStep({
    currentNode: null,
    activeEdge: null,
    dataStructure: [],
    message: msgs.done(mstWeight),
  })

  return steps
}
