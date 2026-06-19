# AlgoTrace

Interactive graph algorithm visualizer — step-by-step animations of BFS, DFS, Dijkstra, and Kruskal MST with Georgian and English explanations.

**[Live Demo](https://algotrace-n.vercel.app/) · [GitHub](https://github.com/ninikurashvili/algotrace)**

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI components |
| TypeScript | 6.x | Type safety |
| Vite | 8.x | Build tool + HMR |
| Tailwind CSS | 3.x | Styling |
| Framer Motion | 12.x | Animations |
| React Router DOM | 7.x | Routing |
| Vitest | 4.x | Unit tests |

---

## Installation

```bash
git clone https://github.com/ninikurashvili/algotrace.git
cd algotrace
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
npm run build    # production build
npm run test     # run 30 unit tests
```

---

## User Guide

### 1. Choose an Algorithm
Open the app and select one of the four algorithm cards on the home page: BFS, DFS, Dijkstra, or Kruskal MST.

### 2. Build a Graph
- **[+ Add Node]** — adds a new node (auto-labeled A, B, C...)
- **[+Edge] mode** — click two nodes to connect them
- **[Select] mode** — drag nodes to reposition them
- **[Delete] mode** — click a node or edge to remove it
- **Presets** — load a ready-made graph from the sidebar
- **Start Node** — choose which node the algorithm starts from

### 3. Run the Algorithm
Click **[▶ Run from A]** to start. The canvas becomes read-only and playback controls appear.

| Button | Action |
|---|---|
| ⏮ | Reset to beginning |
| ⏪ | One step back |
| ▶ / ⏸ | Play / Pause |
| ⏩ | One step forward |
| Speed slider | Slow / Medium / Fast |

Each step shows a text explanation below the canvas. The right panel displays the algorithm's internal data structure (Queue, Stack, distance table, or edge list) in real time.

### 4. Language
Toggle between **Georgian (GE)** and **English (EN)** using the button in the bottom-right corner — available on every page.

---

## License

MIT © 2026 ninikurashvili

---

## Technical Notes

### Algorithm Architecture

All four algorithms are implemented as **pure functions** — no side effects, no shared state. Given the same graph and start node, they always return the same result. This makes them trivially unit-testable and completely decoupled from the UI.

```
bfs(graph, startNodeId, msgs?) → AlgorithmStep[]
dfs(graph, startNodeId, msgs?) → AlgorithmStep[]
dijkstra(graph, startNodeId, msgs?) → AlgorithmStep[]
kruskal(graph, startNodeId, msgs?) → AlgorithmStep[]
```

Each function computes **all steps upfront** (eager evaluation). Every `AlgorithmStep` holds a full snapshot of the graph state at that moment — node colors, edge colors, queue/stack contents, and a human-readable message. This means stepping backward is just `index--`, with zero re-computation.

### Two-Phase Dashboard Pattern

Every algorithm page follows the same state machine:

- **Build phase** (`isBuilding = true`) — interactive canvas, GraphBuilder controls visible
- **Run phase** (`isBuilding = false`) — read-only canvas, playback controls visible

The algorithm runs once (via `useMemo`) when entering Run phase. Switching back to Build phase resets playback.

### SVG Rendering

`GraphCanvas` is a hand-rolled SVG renderer — no D3, no graph library. The viewBox is fixed at `800×600` SVG units and scales responsively. Node drag uses `getBoundingClientRect()` to convert client coordinates to SVG space. Touch events use `{ passive: false }` so `preventDefault()` can block page scroll during drag.

Tailwind's CSS preflight overrides `fill` on SVG elements, so all colors are applied via inline `style` props rather than SVG presentation attributes.

### Project Structure

```
src/
├── algorithms/          # Pure functions + TypeScript types
│   ├── types.ts
│   ├── msgTypes.ts
│   ├── bfs.ts
│   ├── dfs.ts
│   ├── dijkstra.ts
│   ├── kruskal.ts
│   └── __tests__/
├── components/          # Shared UI components
│   ├── GraphCanvas.tsx
│   ├── GraphBuilder.tsx
│   ├── DataPanel.tsx
│   └── InfoModal.tsx
├── hooks/
│   ├── useInterval.ts   # usePlayback hook
│   └── useLocalGraph.ts
├── pages/               # One Dashboard per algorithm
├── data/presets.ts
├── i18n.ts              # Georgian + English translations
└── LanguageContext.tsx
```

### Localization

No i18n library — translations are plain TypeScript objects typed against a `Translations` interface. Algorithm functions accept an optional `msgs` parameter so their step messages are also localized. A separate `msgTypes.ts` file holds the message interfaces to avoid circular imports between `algorithms/` and `i18n.ts`.

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```
