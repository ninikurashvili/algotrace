// Shared interfaces — define these before writing any algorithm

// ── Graph structure ──────────────────────────────────────────────

export interface GraphNode {
  id: string
  label: string
  x: number
  y: number
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  weight?: number
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
  directed: boolean
}

// ── Per-step rendering state ─────────────────────────────────────

export type NodeState = 'unvisited' | 'queued' | 'current' | 'visited' | 'start'
export type EdgeState = 'default' | 'active' | 'accepted' | 'rejected'

export interface GraphSnapshot {
  nodeStates: Record<string, NodeState>    // nodeId → state
  edgeStates: Record<string, EdgeState>    // edgeId → state
}

// ── One step of an algorithm execution ───────────────────────────

export interface AlgorithmStep {
  graphState: GraphSnapshot
  currentNode: string | null
  visitedNodes: Set<string>
  activeEdge: string | null
  dataStructure: string[]                  // Queue / Stack / PQ contents as display strings
  distanceTable?: Record<string, number>   // Dijkstra only
  message: string                          // Georgian explanation
}

// ── Algorithm function signature ─────────────────────────────────

export type AlgorithmFn = (graph: Graph, startNodeId: string) => AlgorithmStep[]
