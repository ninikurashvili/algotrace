import { describe, it, expect } from 'vitest'
import { kruskal } from '../kruskal'
import { makeGraph, finalStep, acceptedEdgeIds, rejectedEdgeIds } from './helpers'

describe('Kruskal MST', () => {

  it('single edge — accepted, total weight correct', () => {
    const g = makeGraph(['a', 'b'], [{ from: 'a', to: 'b', weight: 3 }], false)
    const last = finalStep(kruskal(g, ''))
    expect(acceptedEdgeIds(last)).toHaveLength(1)
    expect(last.message).toContain('3')
  })

  it('triangle A-B:1, B-C:2, A-C:5 — accepts cheapest 2, rejects cycle-forming edge', () => {
    const g = makeGraph(
      ['a', 'b', 'c'],
      [{ from: 'a', to: 'b', weight: 1 }, { from: 'b', to: 'c', weight: 2 }, { from: 'a', to: 'c', weight: 5 }],
      false,
    )
    const last = finalStep(kruskal(g, ''))
    expect(acceptedEdgeIds(last)).toHaveLength(2)  // n-1 = 2 edges
    expect(rejectedEdgeIds(last)).toHaveLength(1)  // A-C:5 would form cycle
  })

  it('MST weight equals sum of accepted edge weights', () => {
    const g = makeGraph(
      ['a', 'b', 'c'],
      [{ from: 'a', to: 'b', weight: 1 }, { from: 'b', to: 'c', weight: 2 }, { from: 'a', to: 'c', weight: 5 }],
      false,
    )
    // MST = a-b:1 + b-c:2 = 3
    expect(finalStep(kruskal(g, '')).message).toContain('3')
  })

  it('5-node default graph — accepts exactly 4 edges (n-1)', () => {
    const g = makeGraph(
      ['a', 'b', 'c', 'd', 'e'],
      [
        { from: 'a', to: 'b', weight: 4 },
        { from: 'a', to: 'c', weight: 2 },
        { from: 'b', to: 'c', weight: 1 },
        { from: 'b', to: 'd', weight: 5 },
        { from: 'c', to: 'd', weight: 3 },
        { from: 'd', to: 'e', weight: 2 },
      ],
      false,
    )
    const last = finalStep(kruskal(g, ''))
    expect(acceptedEdgeIds(last)).toHaveLength(4)
    expect(acceptedEdgeIds(last).length + rejectedEdgeIds(last).length).toBe(6)
  })

  it('cheapest edge is always accepted', () => {
    const g = makeGraph(
      ['a', 'b', 'c'],
      [{ from: 'a', to: 'b', weight: 1 }, { from: 'b', to: 'c', weight: 10 }, { from: 'a', to: 'c', weight: 8 }],
      false,
    )
    const last = finalStep(kruskal(g, ''))
    // e0 = a-b:1 must be accepted (cheapest)
    expect(last.graphState.edgeStates['e0']).toBe('accepted')
  })

  it('parallel path — picks lower weight route', () => {
    // a-b:5, a-c:1, c-b:2 → MST = a-c + c-b = 3, skip a-b:5
    const g = makeGraph(
      ['a', 'b', 'c'],
      [{ from: 'a', to: 'b', weight: 5 }, { from: 'a', to: 'c', weight: 1 }, { from: 'c', to: 'b', weight: 2 }],
      false,
    )
    const last = finalStep(kruskal(g, ''))
    expect(last.graphState.edgeStates['e0']).toBe('rejected')  // a-b:5
    expect(last.graphState.edgeStates['e1']).toBe('accepted')  // a-c:1
    expect(last.graphState.edgeStates['e2']).toBe('accepted')  // c-b:2
  })

  it('every node in the graph ends up visited', () => {
    const g = makeGraph(
      ['a', 'b', 'c', 'd'],
      [
        { from: 'a', to: 'b', weight: 1 },
        { from: 'b', to: 'c', weight: 2 },
        { from: 'c', to: 'd', weight: 3 },
        { from: 'a', to: 'd', weight: 10 },
      ],
      false,
    )
    const last = finalStep(kruskal(g, ''))
    for (const node of g.nodes) {
      expect(last.graphState.nodeStates[node.id]).toBe('visited')
    }
  })

})
