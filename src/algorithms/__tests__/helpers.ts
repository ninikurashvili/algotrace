import type { Graph, AlgorithmStep } from '../types'

// ── Graph builders ────────────────────────────────────────────────

export function makeGraph(
  nodes: string[],
  edges: { from: string; to: string; weight?: number }[],
  directed = true,
): Graph {
  return {
    directed,
    nodes: nodes.map((id) => ({ id, label: id.toUpperCase(), x: 0, y: 0 })),
    edges: edges.map(({ from, to, weight }, i) => ({ id: `e${i}`, from, to, weight })),
  }
}

// ── Step extractors ───────────────────────────────────────────────

export function finalStep(steps: AlgorithmStep[]): AlgorithmStep {
  return steps[steps.length - 1]
}

export function visitOrder(steps: AlgorithmStep[]): string[] {
  const seen = new Set<string>()
  const order: string[] = []
  for (const step of steps) {
    for (const id of step.visitedNodes) {
      if (!seen.has(id)) { seen.add(id); order.push(id) }
    }
  }
  return order
}

export function acceptedEdgeIds(step: AlgorithmStep): string[] {
  return Object.entries(step.graphState.edgeStates)
    .filter(([, s]) => s === 'accepted')
    .map(([id]) => id)
}

export function rejectedEdgeIds(step: AlgorithmStep): string[] {
  return Object.entries(step.graphState.edgeStates)
    .filter(([, s]) => s === 'rejected')
    .map(([id]) => id)
}
