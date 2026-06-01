import type {
  Graph,
  GraphEdge,
  GraphNode,
  AlgorithmStep,
  AlgorithmFn,
  NodeState,
  EdgeState,
} from './types'

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

// ── BFS ───────────────────────────────────────────────────────────

export const bfs: AlgorithmFn = (graph, startNodeId) => {
  const steps: AlgorithmStep[] = []

  const nodeStates: Record<string, NodeState> = Object.fromEntries(
    graph.nodes.map((n) => [n.id, 'unvisited' as NodeState])
  )
  const visited = new Set<string>()
  const queue: string[] = []
  // Edges that have been traversed — shown green in every subsequent snapshot
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
    message: `საწყისი ნოდი ${labelOf(graph, startNodeId)} — Queue-ში ვამატებთ`,
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

    // Step: dequeue
    pushStep({
      currentNode: currentId,
      activeEdge: null,
      dataStructure: queue.map((id) => labelOf(graph, id)),
      message:
        neighbors.length > 0
          ? `${labelOf(graph, currentId)}-ს ამოვიღებთ Queue-დან — მეზობლები: ${neighborLabels}`
          : `${labelOf(graph, currentId)}-ს ამოვიღებთ Queue-დან — მეზობლები არ არის`,
    })

    // Step per neighbor
    for (const { neighbor, edge } of neighbors) {
      if (visited.has(neighbor.id)) {
        treeEdges.add(edge.id)
        pushStep({
          currentNode: currentId,
          activeEdge: edge.id,
          dataStructure: queue.map((id) => labelOf(graph, id)),
          edgeOverrides: { [edge.id]: 'active' },
          message: `${neighbor.label} უკვე Queue-შია — გამოვტოვებთ`,
        })
      } else {
        visited.add(neighbor.id)
        queue.push(neighbor.id)
        nodeStates[neighbor.id] = 'queued'
        // Mark as tree edge before snapshot — it shows green on all future steps
        treeEdges.add(edge.id)

        pushStep({
          currentNode: currentId,
          activeEdge: edge.id,
          dataStructure: queue.map((id) => labelOf(graph, id)),
          // 'active' overrides 'accepted' for this one step (orange while announcing)
          edgeOverrides: { [edge.id]: 'active' },
          message: `${neighbor.label}-ს Queue-ში ვამატებთ`,
        })
      }
    }
  }

  // ── Final step: done ─────────────────────────────────────────────
  for (const id of Object.keys(nodeStates)) {
    if (nodeStates[id] === 'current') nodeStates[id] = 'visited'
  }

  pushStep({
    currentNode: null,
    activeEdge: null,
    dataStructure: [],
    message: 'BFS დასრულდა — ყველა მიღწევადი ნოდი მონახულებულია',
  })

  return steps
}
