import { useState, useEffect, useRef } from 'react'
import type { Graph } from '../algorithms/types'

export function useLocalGraph(
  storageKey: string,
  defaultGraph: Graph,
): [Graph, React.Dispatch<React.SetStateAction<Graph>>, () => void] {
  const skipNextSave = useRef(false)

  const [graph, setGraph] = useState<Graph>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) return JSON.parse(raw) as Graph
    } catch {}
    return defaultGraph
  })

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    localStorage.setItem(storageKey, JSON.stringify(graph))
  }, [graph, storageKey])

  function clearStorage() {
    skipNextSave.current = true
    localStorage.removeItem(storageKey)
  }

  return [graph, setGraph, clearStorage]
}
