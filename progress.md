# AlgoTrace — Session Progress

## What was built

### 1. TypeScript interfaces (`src/algorithms/types.ts`)
Defined all shared types: `GraphNode`, `GraphEdge`, `Graph`, `GraphSnapshot`, `AlgorithmStep`, `AlgorithmFn`.
Added `NodeState` and `EdgeState` union types that the canvas maps directly to colors.
Also updated `SPEC.md` to include the full interface block (it was missing `Graph`, `GraphSnapshot`, and `AlgorithmFn`).

### 2. Folder structure (`src/`)
Created all directories and placeholder files per the spec's build order:
`algorithms/`, `components/`, `hooks/`, `context/`, `data/`, `utils/`

### 3. BFS (`src/algorithms/bfs.ts`)
Pure function — takes `Graph` + `startNodeId`, returns `AlgorithmStep[]`.
- Marks nodes as `'start'` → `'current'` → `'visited'` as the algorithm runs
- Tracks a `treeEdges` set so traversal edges stay green (`'accepted'`) across all future steps
- Per-step `edgeOverrides` layer lets the active edge flash orange for one step, then settle to green
- Georgian messages for every step: enqueue, dequeue, skip already-visited

### 4. DFS (`src/algorithms/dfs.ts`)
Same pattern as BFS but uses a Stack (LIFO).
- Marks visited **on pop**, not on push — stack can hold duplicates
- Pushes neighbors in reverse order so first neighbor processes first (left-to-right DFS)
- Already-visited neighbors are checked at **push time** and not added to the stack, preventing duplicate "already visited" messages on undirected graphs
- Same `treeEdges` green-edge persistence as BFS

### 5. GraphCanvas (`src/components/GraphCanvas.tsx`)
SVG renderer — no external library.
- Nodes: `circle r=24` with label text, colored by `NodeState`
- Edges: `line` with optional `markerEnd` arrowhead for directed graphs (4 colored SVG marker variants)
- Edge weights float above the midpoint of each line
- **All colors use inline `style` props**, not SVG presentation attributes — Tailwind's preflight overrides presentation attributes via the `*` selector, which was causing colors to not appear

### 6. `usePlayback` hook (`src/hooks/useInterval.ts`)
Manages step-by-step playback of a pre-computed `AlgorithmStep[]`.
- State in `useReducer` (index, isPlaying, speed) — avoids multiple `setState` calls in effects
- Timer refs (`indexRef`, `speedRef`, `stepsLenRef`) avoid stale closures inside `setInterval`
- `play()` / `pause()` / `stepForward()` / `stepBack()` / `reset()` / `setSpeed()`
- Auto-pauses at last step
- Resets automatically when the `steps` array reference changes (new algorithm run)

### 7. App.tsx wiring
Connected BFS → `usePlayback` → `GraphCanvas` with Play/Pause/Forward/Back buttons.
Canvas reads `currentStep.graphState.nodeStates` and `edgeStates` directly.

---

## Bugs fixed along the way

| Bug | Cause | Fix |
|---|---|---|
| DFS double "already visited" message on undirected graphs | Already-visited neighbors were pushed to stack and triggered a second skip message at pop time | Gate the push: only push unvisited neighbors; emit skip message at push time without pushing |
| Node/edge colors not showing | Tailwind preflight sets `fill: currentColor` on SVG elements via `*`, overriding SVG presentation attributes | Switch all dynamic colors to inline `style` props |
| Traversal edges not staying green | `edgeSnapshot()` rebuilt from blank every step, losing history | Added `treeEdges` Set; snapshot merges blank → accepted → per-step active override |

---

## What's next (spec build order)

- [ ] `GraphBuilder.tsx` — add/delete nodes and edges, drag-and-drop, directed toggle
- [ ] `Controls.tsx` — full playback UI with speed slider
- [ ] `DataPanel.tsx` — Queue/Stack animation with Framer Motion
- [ ] `StepText.tsx` — Georgian message display
- [ ] `AlgoSelector.tsx` — BFS/DFS/Dijkstra/MST tabs
- [ ] `dijkstra.ts` — Priority Queue + distance table
- [ ] `kruskal.ts` — MST edge sort visualization
- [ ] `AlgoContext.tsx` — global state wiring
- [ ] `graphParser.ts` — text input parser
- [ ] `presets.ts` — 2–3 example graphs
- [ ] Vercel deployment
