import { describe, it, expect } from 'vitest'
import { dijkstra } from '../dijkstra'
import { makeGraph, finalStep } from './helpers'

function distTable(steps: ReturnType<typeof dijkstra>) {
  return finalStep(steps).distanceTable!
}

describe('Dijkstra', () => {

  it('single node — dist[A]=0', () => {
    const g = makeGraph(['a'], [])
    const dist = distTable(dijkstra(g, 'a'))
    expect(dist['a']).toBe(0)
  })

  it('single edge A→B:5 — dist[B]=5', () => {
    const g = makeGraph(['a', 'b'], [{ from: 'a', to: 'b', weight: 5 }])
    const dist = distTable(dijkstra(g, 'a'))
    expect(dist['a']).toBe(0)
    expect(dist['b']).toBe(5)
  })

  it('picks shorter path: A→B:10, A→C:2, C→B:3 → dist[B]=5', () => {
    const g = makeGraph(
      ['a', 'b', 'c'],
      [{ from: 'a', to: 'b', weight: 10 }, { from: 'a', to: 'c', weight: 2 }, { from: 'c', to: 'b', weight: 3 }],
    )
    const dist = distTable(dijkstra(g, 'a'))
    expect(dist['b']).toBe(5)
    expect(dist['c']).toBe(2)
  })

  it('classic relaxation: A→C:2, C→D:1, A→B:4, B→D:5 → dist[D]=3', () => {
    const g = makeGraph(
      ['a', 'b', 'c', 'd'],
      [
        { from: 'a', to: 'b', weight: 4 },
        { from: 'a', to: 'c', weight: 2 },
        { from: 'b', to: 'd', weight: 5 },
        { from: 'c', to: 'd', weight: 1 },
      ],
    )
    const dist = distTable(dijkstra(g, 'a'))
    expect(dist['d']).toBe(3)  // a→c→d = 2+1
    expect(dist['b']).toBe(4)
  })

  it('unreachable node stays Infinity', () => {
    const g = makeGraph(['a', 'b', 'c'], [{ from: 'a', to: 'b', weight: 1 }])
    const dist = distTable(dijkstra(g, 'a'))
    expect(dist['c']).toBe(Infinity)
  })

  it('start node always has dist=0', () => {
    const g = makeGraph(['a', 'b', 'c'], [{ from: 'b', to: 'c', weight: 3 }])
    const dist = distTable(dijkstra(g, 'a'))
    expect(dist['a']).toBe(0)
  })

  it('chain A→B:1→C:1→D:1 — distances are cumulative', () => {
    const g = makeGraph(
      ['a', 'b', 'c', 'd'],
      [{ from: 'a', to: 'b', weight: 1 }, { from: 'b', to: 'c', weight: 1 }, { from: 'c', to: 'd', weight: 1 }],
    )
    const dist = distTable(dijkstra(g, 'a'))
    expect(dist['b']).toBe(1)
    expect(dist['c']).toBe(2)
    expect(dist['d']).toBe(3)
  })

  it('missing weight defaults to 1', () => {
    const g = makeGraph(['a', 'b'], [{ from: 'a', to: 'b' }])
    const dist = distTable(dijkstra(g, 'a'))
    expect(dist['b']).toBe(1)
  })

  it('priority queue is empty in final step', () => {
    const g = makeGraph(['a', 'b'], [{ from: 'a', to: 'b', weight: 2 }])
    expect(finalStep(dijkstra(g, 'a')).dataStructure).toEqual([])
  })

})
