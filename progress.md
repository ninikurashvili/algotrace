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

### 8. `GraphBuilder.tsx` (`src/components/GraphBuilder.tsx`)
Left-panel UI component for building graphs before running an algorithm.
- Three mode buttons: **Select**, **Add Edge**, **Delete** — active mode highlighted in blue
- **Add Node** button — places a new node on the canvas using a golden-angle spiral layout so nodes don't stack on top of each other; labels auto-increment A, B, C…
- **Edge weight input** — visible only in Add Edge mode; accepts any number; attached to the next edge created
- Status hint text — "Click first node…" / "Click second node…" guides the user through the two-click edge creation flow
- **Delete Selected** button — appears only when a node or edge is selected in Select mode; removes the node and all its connected edges
- **Directed toggle** — switch that toggles arrow rendering on the canvas in real time
- **Reset Graph** — clears all nodes and edges
- **Edge weight editor** — when an edge is selected in Select mode, a number input appears pre-filled with its current weight; editing it updates the weight in real time without needing to delete and re-add the edge. Clearing the field removes the weight entirely (`weight: undefined`)
- Node count display at the bottom

### 9. `GraphCanvas.tsx` interaction layer (`src/components/GraphCanvas.tsx`)
Extended the existing pure SVG renderer with optional interaction props (all optional — existing algorithm-only usage is unchanged):
- `onNodeClick(nodeId)` — fires on click but NOT after a drag (tracked via a `hasDragged` ref)
- `onEdgeClick(edgeId)` — 14px-wide invisible hit overlay on each edge so thin lines are easy to click
- `onNodeDrag(nodeId, x, y)` — SVG-coordinate-aware drag (converts screen px → SVG units via `getBoundingClientRect`); drag tracked at SVG level so fast mouse movement never loses the node
- `selectedNodeId` — renders a dashed orange ring around the highlighted node (used for both selected node in Select mode and the pending source node in Add Edge mode)
- `selectedEdgeId` — renders the edge in blue at 3px stroke width
- `userSelect: none` + `e.preventDefault()` on mousedown prevent text selection during drag

### 10. `BFSDashboard.tsx` graph-state wiring (`src/pages/BFSDashboard.tsx`)
Rewrote the dashboard to own all graph and builder state:
- **Build phase** (`isBuilding = true`): shows GraphBuilder left panel + interactive canvas; graph editing fully enabled
- **Run phase** (`isBuilding = false`): hides builder, locks canvas read-only, shows playback controls and DataPanel
- Node click handler dispatches to the correct action based on active mode (select / addEdge / delete)
- Edge click handler: select toggles `selectedEdgeId`; delete removes it immediately
- Node drag updates the node's `x/y` in graph state on every mouse-move event
- "Run BFS" uses `selectedNodeId` as the start node (falls back to `graph.nodes[0]`) — so the student can pick a start by clicking a node before pressing Run
- "← Edit Graph" returns to build phase and resets playback to step 0
- Helper `nextLabel` generates A–Z then AA, AB… labels; `nextPosition` places nodes on a golden-angle spiral within canvas bounds (60–740 x, 60–540 y)

---

## Bugs fixed along the way (continued)

| Bug | Cause | Fix |
|---|---|---|
| Click fires after drag ends | `onClick` fires after every `mouseup` regardless of movement | Track `hasDragged` ref; node click handler early-returns if true |
| Drag loses node when mouse moves fast | `onMouseMove` was on the circle, not the SVG | Moved drag handlers to SVG-level `onMouseMove` / `onMouseUp` / `onMouseLeave` |
| BFS neighbors message shows duplicate labels (e.g. "B, C, C, D") | `getNeighbors` returns one entry per edge — two edges A→C produce two C entries | Deduplicate labels with `[...new Set(...)]` before joining |
| Directed toggle thumb slides outside pill | No `left` anchor on the thumb + no `overflow-hidden` on button | Added `left-0` and `overflow-hidden` to contain the thumb within the pill |
| Queue chips escape DataPanel border during animation | Framer Motion uses `position: absolute` for `popLayout` exits; `overflow: hidden` only clips abs-positioned children when the parent is a containing block | Added `position: relative` to the chip container so `overflow: hidden` clamps the slide-out animation |

---

### 11. `DataPanel.tsx` animation (`src/components/DataPanel.tsx`)
Replaced static node chips with Framer Motion animations:
- **Queue row** — `AnimatePresence mode="popLayout"` + `layout` on each chip: new entries slide in from the right (`x: 36 → 0`), dequeued entries slide out to the left (`x: 0 → -36`); remaining chips shift smoothly via layout animation. Direction hint "Front → Back" shown below the header.
- **Discovered / Processed rows** — chips pop in with a spring scale animation (`scale: 0 → 1`) when a node is first added; no exit animation since nodes are never removed from these sets.
- **Current node** — crossfades with `mode="wait"` so the old chip fades out before the new one fades in.
- `DS_TITLE` and `DS_DIRECTION` maps make the panel label-agnostic: passing `algorithmLabel="DFS"` will show "Stack / Top → Bottom", `"Dijkstra"` shows "Priority Queue / Min → Max", ready for future dashboards.

---

### 12. `dfs.ts` fixes (`src/algorithms/dfs.ts`)
Applied the same correctness fixes as BFS:
- Deduplicated neighbor labels in the dequeue message with `[...new Set(...)]`
- Added `treeEdges.add(edge.id)` for already-visited neighbors so their edges flash orange then go green (same pattern as new-neighbor edges)

### 13. `DFSDashboard.tsx` (`src/pages/DFSDashboard.tsx`)
New page mirroring BFSDashboard with DFS-specific changes:
- Imports `dfs` instead of `bfs`; passes `algorithmLabel="DFS"` to DataPanel → Stack panel shows "Stack / Top → Bottom" with the correct animation
- Play button and Run button use purple (`bg-purple-600`) to visually distinguish DFS from BFS (blue)
- Speed slider accent also purple (`accent-purple-500`)
- `showWeights={false}` — weights hidden in builder since DFS ignores them
- Wired into `App.tsx` routing and `HomePage.tsx` (`available: true` for DFS card)

---

## What's next (spec build order)

- [ ] `Controls.tsx` — extract playback UI into its own reusable component with speed slider
- [ ] `StepText.tsx` — Georgian message display component
- [ ] `AlgoSelector.tsx` — BFS/DFS/Dijkstra/MST tabs
- [ ] `dijkstra.ts` — Priority Queue + distance table
- [ ] `kruskal.ts` — MST edge sort visualization
- [ ] `AlgoContext.tsx` — global state wiring
- [ ] `graphParser.ts` — text input parser
- [ ] `presets.ts` — 2–3 example graphs
- [ ] Vercel deployment
