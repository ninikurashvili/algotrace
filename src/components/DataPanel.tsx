import { AnimatePresence, motion } from 'framer-motion'
import type { AlgorithmStep, Graph } from '../algorithms/types'

interface Props {
  step: AlgorithmStep | null
  graph: Graph
  algorithmLabel?: string
}

// ── Per-algorithm labels ──────────────────────────────────────────

const DS_TITLE: Record<string, string> = {
  BFS:      'Queue',
  DFS:      'Stack',
  Dijkstra: 'Priority Queue',
  MST:      'Edge List',
}

const DS_DIRECTION: Record<string, string> = {
  BFS:      'Front → Back',
  DFS:      'Top → Bottom',
  Dijkstra: 'Min → Max',
}

// ── Shared sub-components ─────────────────────────────────────────

function SectionHeader({ title, count, color }: { title: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
        {title}
      </p>
      <span
        className="ml-auto text-xs font-mono px-1.5 py-0.5 rounded shrink-0"
        style={{ backgroundColor: color + '33', color }}
      >
        {count}
      </span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────

export default function DataPanel({ step, graph, algorithmLabel = 'BFS' }: Props) {
  const labelOf = (id: string) => graph.nodes.find((n) => n.id === id)?.label ?? id

  const queue: string[]      = step?.dataStructure ?? []
  const discovered: string[] = step ? [...step.visitedNodes].map(labelOf) : []
  const processed: string[]  = step
    ? graph.nodes
        .filter((n) => step.graphState.nodeStates[n.id] === 'visited')
        .map((n) => n.label)
    : []
  const currentLabel = step?.currentNode ? labelOf(step.currentNode) : null

  const dsTitle = DS_TITLE[algorithmLabel] ?? 'Queue'
  const dsDir   = DS_DIRECTION[algorithmLabel]

  return (
    <div className="flex flex-col gap-5 p-5 bg-gray-800 rounded-xl w-full">

      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-700 pb-3">
        <span className="text-white text-sm font-bold">{algorithmLabel}</span>
        <span className="text-gray-500 text-xs">state</span>
      </div>

      {/* Current node */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 w-16 shrink-0">Current</span>
        <AnimatePresence mode="wait">
          {currentLabel ? (
            <motion.span
              key={currentLabel}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{    scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white text-sm font-bold"
              style={{ backgroundColor: '#F97316' }}
            >
              {currentLabel}
            </motion.span>
          ) : (
            <motion.span
              key="__empty__"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              className="text-gray-600 text-sm"
            >
              —
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-gray-700" />

      {/* Queue / Stack / Priority Queue */}
      <div className="flex flex-col gap-2">
        <SectionHeader title={dsTitle} count={queue.length} color="#3B82F6" />
        {dsDir && <p className="text-[10px] text-gray-600">{dsDir}</p>}

        {/* Chips — slide in from right, slide out to left */}
        <div className="relative flex flex-wrap gap-2 min-h-[2.5rem] items-center content-start overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {queue.length === 0 ? (
              <motion.span
                key="__empty__"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{    opacity: 0 }}
                className="text-gray-600 text-xs italic"
              >
                —
              </motion.span>
            ) : (
              queue.map((label) => (
                <motion.span
                  key={label}
                  layout
                  initial={{ x: 36,  opacity: 0 }}
                  animate={{ x: 0,   opacity: 1 }}
                  exit={{    x: -36, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: '#3B82F6' }}
                >
                  {label}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Discovered */}
      <div className="flex flex-col gap-2">
        <SectionHeader title="Discovered" count={discovered.length} color="#F59E0B" />
        <div className="flex flex-wrap gap-2 min-h-[2.5rem] items-center content-start">
          <AnimatePresence initial={false}>
            {discovered.length === 0 ? (
              <span className="text-gray-600 text-xs italic">—</span>
            ) : (
              discovered.map((label) => (
                <motion.span
                  key={label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.18, type: 'spring', stiffness: 300, damping: 20 }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: '#F59E0B' }}
                >
                  {label}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Processed */}
      <div className="flex flex-col gap-2">
        <SectionHeader title="Processed" count={processed.length} color="#22C55E" />
        <div className="flex flex-wrap gap-2 min-h-[2.5rem] items-center content-start">
          <AnimatePresence initial={false}>
            {processed.length === 0 ? (
              <span className="text-gray-600 text-xs italic">—</span>
            ) : (
              processed.map((label) => (
                <motion.span
                  key={label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.18, type: 'spring', stiffness: 300, damping: 20 }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: '#22C55E' }}
                >
                  {label}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  )
}
