# AlgoTrace — Interactive Algorithm Visualizer

> Georgian-language interactive platform for step-by-step visualization of graph algorithms: BFS, DFS, Dijkstra, and Minimum Spanning Tree (MST).

---

## Project Overview

AlgoTrace lets students build their own graph and watch algorithms execute step by step. Every decision the algorithm makes is shown in three synchronized layers simultaneously:

1. **Graph canvas** — nodes highlight as the algorithm visits them
2. **Data structure panel** — Queue / Stack / Priority Queue animates in real time
3. **Text explanation** — plain Georgian-language description of each step

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3 + TypeScript 5.x |
| Build tool | Vite 5.x |
| Graph rendering | SVG (native, no library) |
| Animation | Framer Motion 11 |
| Styling | Tailwind CSS 3.x |
| State | React useState + useReducer + Context API |
| Version control | Git + GitHub |
| Deployment | Vercel (auto-deploy from main branch) |
| IDE | VS Code |

### Why SVG over React Flow / D3?
- Full control over node appearance, edge arrows, highlight colors
- No extra bundle size
- React's virtual DOM manages SVG elements natively

### Key TypeScript interfaces (define these first)
```ts
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

export type NodeState = 'unvisited' | 'current' | 'visited' | 'start'
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
```

---

## Application Layout

The app has **one main page** divided into three zones:

```
┌─────────────────────────────────────────────────────┐
│  TOP BAR: algorithm selector + playback controls    │
├──────────────┬──────────────────────────┬───────────┤
│  LEFT PANEL  │    CENTER CANVAS         │  RIGHT    │
│              │                          │  PANEL    │
│  - Add node  │   SVG graph rendering    │           │
│  - Add edge  │   (nodes + edges)        │  Queue /  │
│  - Delete    │                          │  Stack /  │
│  - Directed/ │   Node colors:           │  Priority │
│    Undirected│   🟠 current             │  Queue    │
│  - Weight    │   🟢 visited             │  panel    │
│    input     │   ⚪ unvisited           │           │
│              │   ── active edge         │           │
├──────────────┴──────────────────────────┴───────────┤
│  BOTTOM BAR: Georgian text explanation of step      │
└─────────────────────────────────────────────────────┘
```

---

## Graph Builder (must be built first)

Students build their own graph before running any algorithm.

### Features
- **Add node** — click button → node appears on canvas with auto-label (A, B, C... or custom)
- **Add edge** — click node 1, then click node 2 → edge drawn between them
- **Edge weight** — input field for weight (used in Dijkstra and MST)
- **Delete node** — select node → delete button → removes node AND all its edges
- **Delete edge** — click edge to select (turns red) → delete button
- **Drag nodes** — mouse drag to reposition any node
- **Toggle mode** — directed (arrows) / undirected (plain lines)
- **Reset** — clear entire graph
- **Preset graphs** — 2-3 ready-made example graphs students can load instantly

### Graph input (text-based alternative)
Students can also type edges as text and the graph builds automatically:
```
Nodes: A, B, C, D, E
Edges: A-B:4, A-C:2, B-D:5, C-D:1, D-E:3
```

---

## Algorithm Engine — Core Architecture

**CRITICAL DESIGN RULE:** Algorithm logic must be completely separate from UI.

Each algorithm is a pure function that receives the graph and returns `AlgorithmStep[]`. All steps are pre-computed before animation starts. The UI simply plays through the array.

```
algorithm(graph, startNode) → Step[]
                                 ↓
                          stored in state
                                 ↓
                    timer fires every N ms
                                 ↓
                     currentStepIndex++
                                 ↓
              SVG re-renders + panel updates + text updates
```

### File structure for algorithms
```
src/
├── algorithms/
│   ├── types.ts          ← shared interfaces (AlgorithmStep, GraphNode, etc.)
│   ├── bfs.ts            ← returns Step[]
│   ├── dfs.ts            ← returns Step[]
│   ├── dijkstra.ts       ← returns Step[]
│   └── kruskal.ts        ← returns Step[] (MST)
├── components/
│   ├── GraphCanvas.tsx   ← SVG rendering
│   ├── GraphBuilder.tsx  ← add/delete nodes and edges
│   ├── DataPanel.tsx     ← Queue / Stack / Priority Queue animation
│   ├── StepText.tsx      ← Georgian text explanation
│   ├── Controls.tsx      ← Play/Pause/Step/Speed
│   └── AlgoSelector.tsx  ← BFS / DFS / Dijkstra / MST tabs
└── App.tsx
```

---

## Algorithms — Behavior Specification

### BFS (Breadth-First Search)
- Data structure shown: **Queue** (FIFO)
- Queue panel: elements slide in from right (enqueue), slide out from left (dequeue)
- Label: `Queue: Front → [A, C, D] → Back`
- Step messages (Georgian):
  - "საწყისი ნოდი A — Queue-ში ვამატებთ"
  - "A-ს ამოვიღებთ Queue-დან — მეზობლები: B, C"
  - "B უკვე მონახულებულია — გამოვტოვებთ"

### DFS (Depth-First Search)
- Data structure shown: **Stack** (LIFO)
- Stack panel: elements drop in from top (push), fly out from top (pop)
- Label: `Stack: Top → [D, C, A] → Bottom`
- Step messages (Georgian):
  - "საწყისი ნოდი A — Stack-ზე ვდებთ"
  - "Stack-დან ამოვიღეთ A — ვიკვლევთ"
  - "C-ს Stack-ზე ვდებთ"

### Dijkstra
- Data structure shown: **Priority Queue** (min-heap by distance)
- Also shows: **distance table** `dist[]` updating at each step
- Step messages (Georgian):
  - "A-დან B-მდე მანძილი: 4 — Priority Queue-ში ვამატებთ"
  - "Priority Queue-დან ამოვიღეთ C (მანძილი: 2)"
  - "D-მდე ახალი გზა უფრო მოკლეა — dist[D] განვაახლეთ"
- Graph must be **weighted** — show edge weights as labels

### MST — Minimum Spanning Tree (Kruskal's algorithm)
- Shows: sorted edge list + which edges are accepted/rejected
- Step messages (Georgian):
  - "წიბოები წონით დავალაგეთ"
  - "წიბო C-D (წონა: 1) — ვამატებთ ხეში"
  - "წიბო A-B (წონა: 4) — ციკლს შექმნიდა, უარვყოფთ"
- Accepted edges turn green, rejected edges turn red
- Graph must be **weighted and undirected**

---

## Playback Controls

| Control | Behavior |
|---|---|
| ▶ Play | auto-advance steps at current speed |
| ⏸ Pause | freeze at current step |
| ⏭ Step Forward | advance one step manually |
| ⏮ Step Back | go back one step |
| ⏹ Reset | return to step 0, clear highlights |
| Speed slider | slow (1s/step) → medium (500ms) → fast (100ms) |

---

## Node Colors (SVG)

| State | Color |
|---|---|
| Unvisited | Gray `#9CA3AF` |
| Current / being processed | Orange `#F97316` |
| Visited / done | Green `#22C55E` |
| Selected by user | Blue outline |
| Start node | Blue fill `#3B82F6` |

---

## In-Scope (build this semester)

- Graph builder with add/delete nodes and edges, drag-and-drop, directed/undirected, weights
- BFS with Queue animation
- DFS with Stack animation
- Dijkstra with Priority Queue animation and distance table
- MST (Kruskal) with edge sort visualization
- Play/Pause/Step controls + speed slider
- Georgian text explanations for every step
- Preset example graphs
- Text input for graph construction
- Vercel deployment + open-source GitHub repo

## Out-of-Scope (future versions only)

- User authentication or accounts
- Backend server or database
- Graph persistence (graphs lost on page refresh — localStorage is future work)
- Other algorithms: A*, Bellman-Ford, Floyd-Warshall, topological sort, BST/AVL/Heap visualization
- Mobile native app
- Multi-language interface
- Collaborative/multiplayer mode

> **Note on extensibility:** The step-generator architecture is designed so that adding a new algorithm in the future only requires writing one new `algorithmName.ts` file that returns `AlgorithmStep[]`. The player, renderer, and UI components require no changes.

---

## Technical Constraints

- **Client-side only** — no backend, no server
- SVG may slow down on 50+ node graphs — fallback is Canvas API
- Optimized for Chrome, Firefox, Safari latest versions
- Target screen size: 1280px and above

---

## Timeline

| Weeks | Milestone | Deliverable |
|---|---|---|
| 1–2 | Dev Environment | React+TS project running on localhost with folder structure |
| 3–4 | Graph Builder | Add/delete nodes and edges, drag-and-drop, modes |
| 5–6 | BFS/DFS Logic | `bfs.ts` and `dfs.ts` returning correct `Step[]` |
| 7–8 | BFS/DFS Visualization | Full animated visualizer with Queue/Stack panel |
| 9–10 | Dijkstra | Priority Queue animation + distance table |
| 11–12 | MST + UI Polish | Kruskal visualization + Tailwind responsive layout |
| 13 | Testing & Bug Fixes | Edge cases, cross-browser, performance |
| 14 | Deployment | Vercel deploy + README documentation |

---

## Build Order for Claude Code

Follow this exact order. Do not skip ahead.

1. Define all TypeScript interfaces in `src/algorithms/types.ts`
2. Write `bfs.ts` — pure function, no UI, unit test it
3. Write `dfs.ts` — same pattern
4. Build `GraphCanvas.tsx` — static SVG rendering of nodes and edges
5. Build `GraphBuilder.tsx` — add/delete/drag interactions
6. Build the step player — `useInterval` hook advancing `currentStepIndex`
7. Connect player to `GraphCanvas` — highlight nodes based on current step
8. Build `DataPanel.tsx` — Queue/Stack animation with Framer Motion
9. Build `StepText.tsx` — display `step.message`
10. Write `dijkstra.ts` — add Priority Queue panel
11. Write `kruskal.ts` — add MST visualization
12. Add preset graphs and text input mode
13. Tailwind responsive layout polish
14. Deploy to Vercel