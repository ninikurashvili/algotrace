import type {
  Graph,
  GraphEdge,
  GraphNode,
  AlgorithmStep,
  AlgorithmFn,
  NodeState,
  EdgeState,
} from './types'

// ── Helpers (same shape as bfs.ts) ───────────────────────────────

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

export const dfs: AlgorithmFn = (graph, startNodeId) => {
  const steps: AlgorithmStep[] = []

  const nodeStates: Record<string, NodeState> = Object.fromEntries(
    graph.nodes.map((n) => [n.id, 'unvisited' as NodeState])
  )
  const visited = new Set<string>()
  const stack: string[] = []
  // Edges that have been traversed — shown green in every subsequent snapshot
  const treeEdges = new Set<string>()

  function edgeSnapshot(overrides: Record<string, EdgeState> = {}): Record<string, EdgeState> {
    const states = blankEdgeStates(graph.edges)
    for (const id of treeEdges) states[id] = 'accepted'
    for (const [id, s] of Object.entries(overrides)) states[id] = s
    return states
  }

  function stackDisplay(): string[] {
    return [...stack].reverse().map((id) => labelOf(graph, id))
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

  // ── Step 0: push start node ──────────────────────────────────────
  nodeStates[startNodeId] = 'start'
  stack.push(startNodeId)

  pushStep({
    currentNode: null,
    activeEdge: null,
    dataStructure: stackDisplay(),
    message: `საწყისი ნოდი ${labelOf(graph, startNodeId)} — Stack-ზე ვდებთ`,
  })

  // ── Main DFS loop ────────────────────────────────────────────────
  while (stack.length > 0) {
    const currentId = stack.pop()!

    if (visited.has(currentId)) {
      pushStep({
        currentNode: null,
        activeEdge: null,
        dataStructure: stackDisplay(),
        message: `${labelOf(graph, currentId)} უკვე მონახულებულია — გამოვტოვებთ`,
      })
      continue
    }

    for (const id of Object.keys(nodeStates)) {
      if (nodeStates[id] === 'current') nodeStates[id] = 'visited'
    }

    visited.add(currentId)
    nodeStates[currentId] = 'current'

    const neighbors = getNeighbors(graph, currentId)
    const neighborLabels = neighbors.map(({ neighbor }) => neighbor.label).join(', ')

    pushStep({
      currentNode: currentId,
      activeEdge: null,
      dataStructure: stackDisplay(),
      message:
        neighbors.length > 0
          ? `Stack-დან ამოვიღეთ ${labelOf(graph, currentId)} — მეზობლები: ${neighborLabels}`
          : `Stack-დან ამოვიღეთ ${labelOf(graph, currentId)} — მეზობლები არ არის`,
    })

    // Push neighbors in reverse order so the first neighbor ends up on top
    for (const { neighbor, edge } of [...neighbors].reverse()) {
      if (visited.has(neighbor.id)) {
        pushStep({
          currentNode: currentId,
          activeEdge: edge.id,
          dataStructure: stackDisplay(),
          edgeOverrides: { [edge.id]: 'active' },
          message: `${neighbor.label} უკვე მონახულებულია — გამოვტოვებთ`,
        })
      } else {
        stack.push(neighbor.id)
        // Mark as tree edge before snapshot so it turns green from the next step onward
        treeEdges.add(edge.id)

        pushStep({
          currentNode: currentId,
          activeEdge: edge.id,
          dataStructure: stackDisplay(),
          edgeOverrides: { [edge.id]: 'active' },
          message: `${neighbor.label}-ს Stack-ზე ვდებთ`,
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
    message: 'DFS დასრულდა — ყველა მიღწევადი ნოდი მონახულებულია',
  })

  return steps
}
