import { describe, it, expect } from 'vitest'
import { dfs } from '../dfs'
import { makeGraph, finalStep, visitOrder } from './helpers'

describe('DFS', () => {

  it('single node — visits it and finishes', () => {
    const g = makeGraph(['a'], [])
    const steps = dfs(g, 'a')
    expect(finalStep(steps).visitedNodes.has('a')).toBe(true)
    expect(finalStep(steps).dataStructure).toEqual([])
  })

  it('linear A→B→C — visits in depth order A, B, C', () => {
    const g = makeGraph(['a', 'b', 'c'], [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }])
    const order = visitOrder(dfs(g, 'a'))
    expect(order).toEqual(['a', 'b', 'c'])
  })

  it('tree A→(B,C), B→D — goes deep before sibling: A,B,D before C', () => {
    const g = makeGraph(
      ['a', 'b', 'c', 'd'],
      [{ from: 'a', to: 'b' }, { from: 'a', to: 'c' }, { from: 'b', to: 'd' }],
    )
    const order = visitOrder(dfs(g, 'a'))
    // D must be visited before C (depth-first: go all the way down B→D before touching C)
    expect(order.indexOf('d')).toBeLessThan(order.indexOf('c'))
  })

  it('disconnected graph — only reachable nodes visited', () => {
    const g = makeGraph(['a', 'b', 'c'], [{ from: 'a', to: 'b' }])
    const visited = finalStep(dfs(g, 'a')).visitedNodes
    expect(visited.has('a')).toBe(true)
    expect(visited.has('b')).toBe(true)
    expect(visited.has('c')).toBe(false)
  })

  it('undirected cycle — all visited, no infinite loop', () => {
    const g = makeGraph(
      ['a', 'b', 'c'],
      [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'a' }],
      false,
    )
    const steps = dfs(g, 'a')
    expect(finalStep(steps).visitedNodes).toEqual(new Set(['a', 'b', 'c']))
    expect(steps.length).toBeLessThan(30)
  })

  it('stack display in final step is empty', () => {
    const g = makeGraph(['a', 'b'], [{ from: 'a', to: 'b' }])
    expect(finalStep(dfs(g, 'a')).dataStructure).toEqual([])
  })

  it('all visited nodes appear as "visited" state in final step', () => {
    const g = makeGraph(['a', 'b', 'c'], [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }])
    const last = finalStep(dfs(g, 'a'))
    for (const id of last.visitedNodes) {
      expect(last.graphState.nodeStates[id]).toBe('visited')
    }
  })

})
