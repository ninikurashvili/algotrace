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

// ── DFS ───────────────────────────────────────────────────────────
//
// Uses an explicit call-stack of frames (nodeId + nextNeighborIndex).
// Each frame advances through its neighbors one at a time, going deep
// before moving to the next sibling — matching recursive DFS exactly.

export const dfs: AlgorithmFn = (graph, startNodeId) => {
  const steps: AlgorithmStep[] = []

  const nodeStates: Record<string, NodeState> = Object.fromEntries(
    graph.nodes.map((n) => [n.id, 'unvisited' as NodeState])
  )
  const visited  = new Set<string>()
  const treeEdges = new Set<string>()

  // Call-stack frames — each frame = one active node + which neighbor is next
  const callStack: { nodeId: string; nextIdx: number }[] = []

  // Display: current node first (top of stack), then ancestors
  function stackDisplay(): string[] {
    return [...callStack].reverse().map((f) => labelOf(graph, f.nodeId))
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

  // ── Enter start node ──────────────────────────────────────────────
  visited.add(startNodeId)
  nodeStates[startNodeId] = 'start'
  callStack.push({ nodeId: startNodeId, nextIdx: 0 })

  pushStep({
    currentNode: startNodeId,
    activeEdge: null,
    dataStructure: stackDisplay(),
    message: `DFS იწყება ${labelOf(graph, startNodeId)}-დან`,
  })

  // ── Main loop ─────────────────────────────────────────────────────
  while (callStack.length > 0) {
    const frame     = callStack[callStack.length - 1]   // peek top
    const { nodeId } = frame
    const neighbors = getNeighbors(graph, nodeId)

    if (frame.nextIdx >= neighbors.length) {
      // All neighbors explored — backtrack
      callStack.pop()
      nodeStates[nodeId] = 'visited'

      if (callStack.length > 0) {
        const parentId = callStack[callStack.length - 1].nodeId
        nodeStates[parentId] = 'current'

        pushStep({
          currentNode: parentId,
          activeEdge: null,
          dataStructure: stackDisplay(),
          message: `${labelOf(graph, nodeId)}-ს ყველა მეზობელი დამუშავდა — ვბრუნდებით ${labelOf(graph, parentId)}-ში`,
        })
      } else {
        // Last node popped — DFS complete
        pushStep({
          currentNode: null,
          activeEdge: null,
          dataStructure: [],
          message: 'DFS დასრულდა — ყველა მიღწევადი ნოდი მონახულებულია',
        })
      }
      continue
    }

    const { neighbor, edge } = neighbors[frame.nextIdx]
    frame.nextIdx++

    if (visited.has(neighbor.id)) {
      // Neighbor already visited — flash edge orange then green, skip
      treeEdges.add(edge.id)
      pushStep({
        currentNode: nodeId,
        activeEdge: edge.id,
        dataStructure: stackDisplay(),
        edgeOverrides: { [edge.id]: 'active' },
        message: `${neighbor.label} უკვე მონახულებულია — გამოვტოვებთ`,
      })
    } else {
      // Go deeper into this neighbor
      visited.add(neighbor.id)
      nodeStates[nodeId]       = 'queued'    // current node stays in path (blue)
      nodeStates[neighbor.id]  = 'current'   // neighbor becomes active (orange)
      treeEdges.add(edge.id)
      callStack.push({ nodeId: neighbor.id, nextIdx: 0 })

      pushStep({
        currentNode: neighbor.id,
        activeEdge: edge.id,
        dataStructure: stackDisplay(),
        edgeOverrides: { [edge.id]: 'active' },
        message: `${labelOf(graph, nodeId)}-დან ${neighbor.label}-ში გადავდივართ`,
      })
    }
  }

  return steps
}
