import type {
  Graph,
  GraphEdge,
  GraphNode,
  AlgorithmStep,
  NodeState,
  EdgeState,
} from './types'
import type { DijkstraMsgs } from './msgTypes'

// ── Helpers ───────────────────────────────────────────────────────

function blankEdgeStates(edges: GraphEdge[]): Record<string, EdgeState> {
  return Object.fromEntries(edges.map((e) => [e.id, 'default' as EdgeState]))
}

function getNeighbors(
  graph: Graph,
  nodeId: string
): { neighbor: GraphNode; edge: GraphEdge }[] {
  const results: { neighbor: GraphNode; edge: GraphEdge }[] = []
  for (const edge of graph.edges) {
    if (edge.from === nodeId) {
      const neighbor = graph.nodes.find((n) => n.id === edge.to)
      if (neighbor) results.push({ neighbor, edge })
    } else if (!graph.directed && edge.to === nodeId) {
      const neighbor = graph.nodes.find((n) => n.id === edge.from)
      if (neighbor) results.push({ neighbor, edge })
    }
  }
  return results
}

function labelOf(graph: Graph, id: string): string {
  return graph.nodes.find((n) => n.id === id)?.label ?? id
}

const KA: DijkstraMsgs = {
  start: (label) => `საწყისი ნოდი ${label}. მასთან მანძილი 0-ია, დანარჩენი ყველა ჯერჯერობით უსასრულოა (∞). Priority Queue-ში ვამატებთ.`,
  alreadySettled: (label) => `${label} უკვე საბოლოოდ დამუშავდა — მისი მინიმალური მანძილი ცნობილია, ისევ არ ვამუშავებთ.`,
  dequeue: (label, d) => `Priority Queue-დან ამოვიღეთ ${label} — ამჟამად ყველაზე ახლო ნოდი (მანძილი: ${d}). ვამოწმებთ მის მეზობლებს.`,
  relaxed: (from, to, d, w, nd) => `${from} → ${to}: ${d} + ${w} = ${nd}. ეს მოკლე გზაა! dist[${to}] განახლდა ${nd}-ზე.`,
  notRelaxed: (from, to, d, w, nd, od) => `${from} → ${to}: ${d} + ${w} = ${nd}. უკეთესი გზა უკვე გვაქვს (dist[${to}] = ${od}) — არ ვცვლით.`,
  done: 'Dijkstra დასრულდა. ნაჩვენებია ყველაზე მოკლე გზა საწყისი ნოდიდან ყველა მიღწევად ნოდამდე.',
}

// ── Dijkstra ──────────────────────────────────────────────────────
//
// Priority Queue as a sorted array — correct for small graphs.

export function dijkstra(graph: Graph, startNodeId: string, msgs: DijkstraMsgs = KA): AlgorithmStep[] {
  const steps: AlgorithmStep[] = []

  const nodeStates: Record<string, NodeState> = Object.fromEntries(
    graph.nodes.map((n) => [n.id, 'unvisited' as NodeState])
  )
  const visited   = new Set<string>()
  const treeEdges = new Set<string>()

  const dist: Record<string, number> = Object.fromEntries(
    graph.nodes.map((n) => [n.id, Infinity])
  )
  dist[startNodeId] = 0

  const pq: [number, string][] = [[0, startNodeId]]

  function pqPush(d: number, nodeId: string) {
    pq.push([d, nodeId])
    pq.sort((a, b) => a[0] - b[0])
  }

  function pqPop(): [number, string] | undefined {
    return pq.shift()
  }

  function pqDisplay(): string[] {
    return pq.map(([, id]) => labelOf(graph, id))
  }

  function distSnapshot(): Record<string, number> {
    return { ...dist }
  }

  function edgeSnapshot(overrides: Record<string, EdgeState> = {}): Record<string, EdgeState> {
    const states = blankEdgeStates(graph.edges)
    for (const id of treeEdges) states[id] = 'accepted'
    for (const [id, s] of Object.entries(overrides)) states[id] = s
    return states
  }

  function pushStep(
    partial: Omit<AlgorithmStep, 'visitedNodes' | 'graphState'> & {
      edgeOverrides?: Record<string, EdgeState>
    }
  ) {
    const { edgeOverrides, ...rest } = partial
    steps.push({
      ...rest,
      visitedNodes: new Set(visited),
      graphState: {
        nodeStates: { ...nodeStates },
        edgeStates: edgeSnapshot(edgeOverrides),
      },
    })
  }

  // ── Step 0: initialise ────────────────────────────────────────────
  nodeStates[startNodeId] = 'start'

  pushStep({
    currentNode: null,
    activeEdge: null,
    dataStructure: pqDisplay(),
    distanceTable: distSnapshot(),
    message: msgs.start(labelOf(graph, startNodeId)),
  })

  // ── Main loop ─────────────────────────────────────────────────────
  while (pq.length > 0) {
    const [d, currentId] = pqPop()!

    if (visited.has(currentId)) {
      pushStep({
        currentNode: currentId,
        activeEdge: null,
        dataStructure: pqDisplay(),
        distanceTable: distSnapshot(),
        message: msgs.alreadySettled(labelOf(graph, currentId)),
      })
      continue
    }

    visited.add(currentId)
    for (const id of Object.keys(nodeStates)) {
      if (nodeStates[id] === 'current') nodeStates[id] = 'visited'
    }
    nodeStates[currentId] = 'current'

    pushStep({
      currentNode: currentId,
      activeEdge: null,
      dataStructure: pqDisplay(),
      distanceTable: distSnapshot(),
      message: msgs.dequeue(labelOf(graph, currentId), d),
    })

    for (const { neighbor, edge } of getNeighbors(graph, currentId)) {
      const w       = edge.weight ?? 1
      const newDist = d + w

      if (newDist < dist[neighbor.id]) {
        dist[neighbor.id] = newDist
        pqPush(newDist, neighbor.id)
        if (!visited.has(neighbor.id)) nodeStates[neighbor.id] = 'queued'
        treeEdges.add(edge.id)

        pushStep({
          currentNode: currentId,
          activeEdge: edge.id,
          dataStructure: pqDisplay(),
          distanceTable: distSnapshot(),
          edgeOverrides: { [edge.id]: 'active' },
          message: msgs.relaxed(labelOf(graph, currentId), neighbor.label, d, w, newDist),
        })
      } else {
        pushStep({
          currentNode: currentId,
          activeEdge: edge.id,
          dataStructure: pqDisplay(),
          distanceTable: distSnapshot(),
          edgeOverrides: { [edge.id]: 'active' },
          message: msgs.notRelaxed(labelOf(graph, currentId), neighbor.label, d, w, newDist, dist[neighbor.id]),
        })
      }
    }
  }

  // ── Final step ────────────────────────────────────────────────────
  for (const id of Object.keys(nodeStates)) {
    if (nodeStates[id] === 'current') nodeStates[id] = 'visited'
  }

  pushStep({
    currentNode: null,
    activeEdge: null,
    dataStructure: [],
    distanceTable: distSnapshot(),
    message: msgs.done,
  })

  return steps
}
