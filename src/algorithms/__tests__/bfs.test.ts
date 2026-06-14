import { describe, it, expect } from 'vitest'
import { bfs } from '../bfs'
import { makeGraph, finalStep, visitOrder } from './helpers'

describe('BFS', () => {

  it('single node — visits it and finishes', () => {
    const g = makeGraph(['a'], [])
    const steps = bfs(g, 'a')
    expect(steps.length).toBeGreaterThan(0)
    expect(finalStep(steps).visitedNodes.has('a')).toBe(true)
    expect(finalStep(steps).dataStructure).toEqual([])
  })

  it('linear A→B→C — visits all three in order', () => {
    const g = makeGraph(['a', 'b', 'c'], [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }])
    const steps = bfs(g, 'a')
    const order = visitOrder(steps)
    expect(order).toEqual(['a', 'b', 'c'])
    expect(finalStep(steps).visitedNodes).toEqual(new Set(['a', 'b', 'c']))
  })

  it('level-order: A→B, A→C, B→D — visits B and C before D', () => {
    const g = makeGraph(
      ['a', 'b', 'c', 'd'],
      [{ from: 'a', to: 'b' }, { from: 'a', to: 'c' }, { from: 'b', to: 'd' }],
    )
    const order = visitOrder(bfs(g, 'a'))
    expect(order.indexOf('b')).toBeLessThan(order.indexOf('d'))
    expect(order.indexOf('c')).toBeLessThan(order.indexOf('d'))
  })

  it('disconnected graph — only reachable nodes visited', () => {
    const g = makeGraph(['a', 'b', 'c'], [{ from: 'a', to: 'b' }])
    const visited = finalStep(bfs(g, 'a')).visitedNodes
    expect(visited.has('a')).toBe(true)
    expect(visited.has('b')).toBe(true)
    expect(visited.has('c')).toBe(false)
  })

  it('undirected cycle A-B-C-A — all visited, no infinite loop', () => {
    const g = makeGraph(
      ['a', 'b', 'c'],
      [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'a' }],
      false,
    )
    const steps = bfs(g, 'a')
    expect(finalStep(steps).visitedNodes).toEqual(new Set(['a', 'b', 'c']))
    expect(steps.length).toBeLessThan(30) // sanity: no infinite loop
  })

  it('queue is empty in the final step', () => {
    const g = makeGraph(['a', 'b'], [{ from: 'a', to: 'b' }])
    expect(finalStep(bfs(g, 'a')).dataStructure).toEqual([])
  })

  it('start from middle node — only reachable-from-B visited', () => {
    const g = makeGraph(
      ['a', 'b', 'c'],
      [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }],
    )
    const visited = finalStep(bfs(g, 'b')).visitedNodes
    expect(visited.has('a')).toBe(false)
    expect(visited.has('b')).toBe(true)
    expect(visited.has('c')).toBe(true)
  })

})
