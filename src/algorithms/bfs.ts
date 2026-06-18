import type {
  Graph,
  GraphEdge,
  GraphNode,
  AlgorithmStep,
  NodeState,
  EdgeState,
} from './types'
import type { BfsMsgs } from './msgTypes'

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

const KA: BfsMsgs = {
  start: (label) => `ვიწყებთ ${label}-დან. ეს წვერო პირველი შევიდა რიგში — სწორედ აქედან დავიწყებთ სიგანეში ძიებას.`,
  dequeue: (label, neighbors) => `რიგიდან ამოვიღეთ ${label}. მის მეზობლებს შევამოწმებთ: ${neighbors}`,
  dequeueNoNeighbors: (label) => `რიგიდან ამოვიღეთ ${label}. მეზობლები არ აქვს — გავაგრძელებთ.`,
  alreadyQueued: (label) => `${label} უკვე რიგშია, ხელახლა დამატება არ სჭირდება.`,
  enqueue: (label) => `${label} პირველად ვხვდებით — რიგის ბოლოში ვამატებთ.`,
  done: 'BFS დასრულდა. ყველა მიღწევადი წვერო თავის დონეზე მონახულებულია.',
}

// ── BFS ───────────────────────────────────────────────────────────

export function bfs(graph: Graph, startNodeId: string, msgs: BfsMsgs = KA): AlgorithmStep[] {
  const steps: AlgorithmStep[] = []

  const nodeStates: Record<string, NodeState> = Object.fromEntries(
    graph.nodes.map((n) => [n.id, 'unvisited' as NodeState])
  )
  const visited = new Set<string>()
  const queue: string[] = []
  const treeEdges = new Set<string>()

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

  // ── Step 0: enqueue start node ───────────────────────────────────
  visited.add(startNodeId)
  queue.push(startNodeId)
  nodeStates[startNodeId] = 'start'

  pushStep({
    currentNode: null,
    activeEdge: null,
    dataStructure: queue.map((id) => labelOf(graph, id)),
    message: msgs.start(labelOf(graph, startNodeId)),
  })

  // ── Main BFS loop ────────────────────────────────────────────────
  while (queue.length > 0) {
    const currentId = queue.shift()!

    for (const id of Object.keys(nodeStates)) {
      if (nodeStates[id] === 'current') nodeStates[id] = 'visited'
    }
    nodeStates[currentId] = 'current'

    const neighbors = getNeighbors(graph, currentId)
    const neighborLabels = [...new Set(neighbors.map(({ neighbor }) => neighbor.label))].join(', ')

    pushStep({
      currentNode: currentId,
      activeEdge: null,
      dataStructure: queue.map((id) => labelOf(graph, id)),
      message: neighbors.length > 0
        ? msgs.dequeue(labelOf(graph, currentId), neighborLabels)
        : msgs.dequeueNoNeighbors(labelOf(graph, currentId)),
    })

    for (const { neighbor, edge } of neighbors) {
      if (visited.has(neighbor.id)) {
        treeEdges.add(edge.id)
        pushStep({
          currentNode: currentId,
          activeEdge: edge.id,
          dataStructure: queue.map((id) => labelOf(graph, id)),
          edgeOverrides: { [edge.id]: 'active' },
          message: msgs.alreadyQueued(neighbor.label),
        })
      } else {
        visited.add(neighbor.id)
        queue.push(neighbor.id)
        nodeStates[neighbor.id] = 'queued'
        treeEdges.add(edge.id)

        pushStep({
          currentNode: currentId,
          activeEdge: edge.id,
          dataStructure: queue.map((id) => labelOf(graph, id)),
          edgeOverrides: { [edge.id]: 'active' },
          message: msgs.enqueue(neighbor.label),
        })
      }
    }
  }

  // ── Final step ───────────────────────────────────────────────────
  for (const id of Object.keys(nodeStates)) {
    if (nodeStates[id] === 'current') nodeStates[id] = 'visited'
  }

  pushStep({
    currentNode: null,
    activeEdge: null,
    dataStructure: [],
    message: msgs.done,
  })

  return steps
}
