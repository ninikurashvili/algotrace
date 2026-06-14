import type { Graph } from '../algorithms/types'

export interface Preset {
  name: string
  graph: Graph
}

// ── BFS ───────────────────────────────────────────────────────────

export const BFS_PRESETS: Preset[] = [
  {
    name: 'ორობითი ხე',
    graph: {
      directed: false,
      nodes: [
        { id: 'a', label: 'A', x: 400, y:  80 },
        { id: 'b', label: 'B', x: 200, y: 260 },
        { id: 'c', label: 'C', x: 600, y: 260 },
        { id: 'd', label: 'D', x: 100, y: 450 },
        { id: 'e', label: 'E', x: 300, y: 450 },
        { id: 'f', label: 'F', x: 500, y: 450 },
        { id: 'g', label: 'G', x: 700, y: 450 },
      ],
      edges: [
        { id: 'ab', from: 'a', to: 'b' },
        { id: 'ac', from: 'a', to: 'c' },
        { id: 'bd', from: 'b', to: 'd' },
        { id: 'be', from: 'b', to: 'e' },
        { id: 'cf', from: 'c', to: 'f' },
        { id: 'cg', from: 'c', to: 'g' },
      ],
    },
  },
  {
    name: 'ვარსკვლავი',
    graph: {
      directed: false,
      nodes: [
        { id: 'a', label: 'A', x: 400, y: 300 },
        { id: 'b', label: 'B', x: 400, y: 100 },
        { id: 'c', label: 'C', x: 620, y: 210 },
        { id: 'd', label: 'D', x: 540, y: 480 },
        { id: 'e', label: 'E', x: 260, y: 480 },
        { id: 'f', label: 'F', x: 180, y: 210 },
      ],
      edges: [
        { id: 'ab', from: 'a', to: 'b' },
        { id: 'ac', from: 'a', to: 'c' },
        { id: 'ad', from: 'a', to: 'd' },
        { id: 'ae', from: 'a', to: 'e' },
        { id: 'af', from: 'a', to: 'f' },
      ],
    },
  },
  {
    name: 'ციკლიანი',
    graph: {
      directed: false,
      nodes: [
        { id: 'a', label: 'A', x: 400, y:  80 },
        { id: 'b', label: 'B', x: 640, y: 220 },
        { id: 'c', label: 'C', x: 640, y: 430 },
        { id: 'd', label: 'D', x: 400, y: 560 },
        { id: 'e', label: 'E', x: 160, y: 430 },
        { id: 'f', label: 'F', x: 160, y: 220 },
      ],
      edges: [
        { id: 'ab', from: 'a', to: 'b' },
        { id: 'bc', from: 'b', to: 'c' },
        { id: 'cd', from: 'c', to: 'd' },
        { id: 'de', from: 'd', to: 'e' },
        { id: 'ef', from: 'e', to: 'f' },
        { id: 'fa', from: 'f', to: 'a' },
        { id: 'ad', from: 'a', to: 'd' },
      ],
    },
  },
]

// ── DFS ───────────────────────────────────────────────────────────

export const DFS_PRESETS: Preset[] = [
  {
    name: 'ციკლი (back edge)',
    graph: {
      directed: true,
      nodes: [
        { id: 'a', label: 'A', x: 400, y:  90 },
        { id: 'b', label: 'B', x: 200, y: 280 },
        { id: 'c', label: 'C', x: 600, y: 280 },
        { id: 'd', label: 'D', x: 200, y: 480 },
      ],
      edges: [
        { id: 'ab', from: 'a', to: 'b' },
        { id: 'ac', from: 'a', to: 'c' },
        { id: 'bd', from: 'b', to: 'd' },
        { id: 'dc', from: 'd', to: 'c' },
      ],
    },
  },
  {
    name: 'ღრმა გზა',
    graph: {
      directed: true,
      nodes: [
        { id: 'a', label: 'A', x: 100, y: 300 },
        { id: 'b', label: 'B', x: 240, y: 170 },
        { id: 'c', label: 'C', x: 390, y: 300 },
        { id: 'd', label: 'D', x: 530, y: 170 },
        { id: 'e', label: 'E', x: 670, y: 300 },
        { id: 'f', label: 'F', x: 530, y: 430 },
      ],
      edges: [
        { id: 'ab', from: 'a', to: 'b' },
        { id: 'bc', from: 'b', to: 'c' },
        { id: 'cd', from: 'c', to: 'd' },
        { id: 'de', from: 'd', to: 'e' },
        { id: 'cf', from: 'c', to: 'f' },
      ],
    },
  },
]

// ── Dijkstra ──────────────────────────────────────────────────────

export const DIJKSTRA_PRESETS: Preset[] = [
  {
    name: 'მრავალი განახლება',
    // dist[B] relaxed 10→7 via C; dist[D] relaxed 11→9 via B
    graph: {
      directed: true,
      nodes: [
        { id: 'a', label: 'A', x: 130, y: 300 },
        { id: 'b', label: 'B', x: 480, y: 130 },
        { id: 'c', label: 'C', x: 380, y: 470 },
        { id: 'd', label: 'D', x: 660, y: 300 },
        { id: 'e', label: 'E', x: 750, y: 490 },
      ],
      edges: [
        { id: 'ab', from: 'a', to: 'b', weight: 10 },
        { id: 'ac', from: 'a', to: 'c', weight:  3 },
        { id: 'cb', from: 'c', to: 'b', weight:  4 },
        { id: 'bd', from: 'b', to: 'd', weight:  2 },
        { id: 'cd', from: 'c', to: 'd', weight:  8 },
        { id: 'de', from: 'd', to: 'e', weight:  1 },
      ],
    },
  },
  {
    name: 'შემოვლითი გზა',
    // A→B direct costs 10; A→D→C→B costs only 6
    graph: {
      directed: true,
      nodes: [
        { id: 'a', label: 'A', x: 150, y: 300 },
        { id: 'b', label: 'B', x: 660, y: 150 },
        { id: 'c', label: 'C', x: 500, y: 390 },
        { id: 'd', label: 'D', x: 330, y: 470 },
      ],
      edges: [
        { id: 'ab', from: 'a', to: 'b', weight: 10 },
        { id: 'ad', from: 'a', to: 'd', weight:  2 },
        { id: 'dc', from: 'd', to: 'c', weight:  3 },
        { id: 'cb', from: 'c', to: 'b', weight:  1 },
      ],
    },
  },
]

// ── MST ───────────────────────────────────────────────────────────

export const MST_PRESETS: Preset[] = [
  {
    name: 'K4 სრული',
    // 4-node complete graph — 3 accepted, 3 rejected
    graph: {
      directed: false,
      nodes: [
        { id: 'a', label: 'A', x: 250, y: 180 },
        { id: 'b', label: 'B', x: 560, y: 180 },
        { id: 'c', label: 'C', x: 250, y: 440 },
        { id: 'd', label: 'D', x: 560, y: 440 },
      ],
      edges: [
        { id: 'ab', from: 'a', to: 'b', weight: 1 },
        { id: 'ac', from: 'a', to: 'c', weight: 3 },
        { id: 'ad', from: 'a', to: 'd', weight: 5 },
        { id: 'bc', from: 'b', to: 'c', weight: 6 },
        { id: 'bd', from: 'b', to: 'd', weight: 2 },
        { id: 'cd', from: 'c', to: 'd', weight: 4 },
      ],
    },
  },
  {
    name: 'ბადე',
    graph: {
      directed: false,
      nodes: [
        { id: 'a', label: 'A', x: 130, y: 190 },
        { id: 'b', label: 'B', x: 430, y: 190 },
        { id: 'c', label: 'C', x: 730, y: 190 },
        { id: 'd', label: 'D', x: 280, y: 440 },
        { id: 'e', label: 'E', x: 580, y: 440 },
      ],
      edges: [
        { id: 'ab', from: 'a', to: 'b', weight: 3 },
        { id: 'bc', from: 'b', to: 'c', weight: 2 },
        { id: 'bd', from: 'b', to: 'd', weight: 1 },
        { id: 'be', from: 'b', to: 'e', weight: 4 },
        { id: 'ad', from: 'a', to: 'd', weight: 5 },
        { id: 'ce', from: 'c', to: 'e', weight: 2 },
        { id: 'de', from: 'd', to: 'e', weight: 6 },
      ],
    },
  },
]
