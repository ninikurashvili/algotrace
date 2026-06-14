import { AnimatePresence, motion } from 'framer-motion'
import type { AlgorithmStep, Graph } from '../algorithms/types'
import { useLang } from '../LanguageContext'

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
  const { t } = useLang()
  const labelOf = (id: string) => graph.nodes.find((n) => n.id === id)?.label ?? id

  const queue: string[]      = step?.dataStructure ?? []
  const discovered: string[] = step ? [...step.visitedNodes].map(labelOf) : []
  const processed: string[]  = step
    ? graph.nodes
        .filter((n) => step.graphState.nodeStates[n.id] === 'visited')
        .map((n) => n.label)
    : []
  const currentLabel = step?.currentNode ? labelOf(step.currentNode) : null

  // MST: show the active edge in the Current slot instead of a node
  const activeEdge      = algorithmLabel === 'MST' && step?.activeEdge
    ? graph.edges.find((e) => e.id === step.activeEdge)
    : null
  const currentEdgeLabel = activeEdge
    ? `${labelOf(activeEdge.from)}–${labelOf(activeEdge.to)}`
    : null

  const dsTitle = DS_TITLE[algorithmLabel] ?? 'Queue'
  const dsDir   = DS_DIRECTION[algorithmLabel]

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-6 bg-gray-800 rounded-xl w-full">

      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-700 pb-3">
        <span className="text-white text-sm font-bold">{algorithmLabel}</span>
        <span className="text-gray-500 text-xs">{t.stateLabel}</span>
      </div>

      {/* Current — node for BFS/DFS/Dijkstra, edge for MST */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 w-16 shrink-0">{t.currentLabel}</span>
        <AnimatePresence mode="wait">
          {algorithmLabel === 'MST' ? (
            currentEdgeLabel ? (
              <motion.span
                key={currentEdgeLabel}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{    scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center justify-center px-3 h-9 rounded-full text-white text-sm font-bold"
                style={{ backgroundColor: '#10B981' }}
              >
                {currentEdgeLabel}
              </motion.span>
            ) : (
              <motion.span key="__empty__" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-600 text-sm">—</motion.span>
            )
          ) : (
            currentLabel ? (
              <motion.span
                key={currentLabel}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                exit={{    scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center justify-center w-8 h-8 lg:w-11 lg:h-11 rounded-full text-white text-xs lg:text-sm font-bold"
                style={{ backgroundColor: '#F97316' }}
              >
                {currentLabel}
              </motion.span>
            ) : (
              <motion.span key="__empty__" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-600 text-sm">—</motion.span>
            )
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-gray-700" />

      {/* MST edge list — replaces queue/discovered/processed for Kruskal */}
      {algorithmLabel === 'MST' && (
        <div className="flex flex-col gap-2">
          <SectionHeader title="Edge List" count={graph.edges.length} color="#10B981" />
          <div className="flex flex-col gap-1">
            {[...graph.edges]
              .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0))
              .map((edge) => {
                const state     = step?.graphState.edgeStates[edge.id] ?? 'default'
                const fromLabel = graph.nodes.find((n) => n.id === edge.from)?.label ?? edge.from
                const toLabel   = graph.nodes.find((n) => n.id === edge.to)?.label   ?? edge.to
                const bg    = state === 'accepted' ? 'rgba(34,197,94,0.15)'
                            : state === 'rejected' ? 'rgba(239,68,68,0.12)'
                            : state === 'active'   ? 'rgba(249,115,22,0.15)'
                            : 'rgba(255,255,255,0.04)'
                const color = state === 'accepted' ? '#22C55E'
                            : state === 'rejected' ? '#EF4444'
                            : state === 'active'   ? '#F97316'
                            : '#6B7280'
                const icon  = state === 'accepted' ? '✓'
                            : state === 'rejected' ? '✗'
                            : state === 'active'   ? '·'
                            : ''
                return (
                  <motion.div
                    key={edge.id}
                    layout
                    className="flex items-center gap-2 px-2.5 py-1 rounded-lg"
                    style={{ backgroundColor: bg }}
                  >
                    <span className="text-xs font-mono font-bold flex-1" style={{ color }}>
                      {fromLabel}–{toLabel}
                    </span>
                    <span className="text-xs font-mono text-gray-500">{edge.weight ?? 0}</span>
                    <span className="text-xs font-bold w-3 text-right" style={{ color }}>{icon}</span>
                  </motion.div>
                )
              })}
          </div>
          {step && (
            <p className="text-[11px] text-gray-500 text-right tabular-nums">
              {t.mstWeightLabel}:{' '}
              {Object.entries(step.graphState.edgeStates)
                .filter(([, s]) => s === 'accepted')
                .reduce((sum, [id]) => sum + (graph.edges.find((e) => e.id === id)?.weight ?? 0), 0)}
            </p>
          )}
        </div>
      )}

      {/* Queue / Stack / Priority Queue — hidden for MST */}
      {algorithmLabel !== 'MST' && <div className="flex flex-col gap-2">
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
                  className="inline-flex items-center justify-center w-8 h-8 lg:w-11 lg:h-11 rounded-full text-white text-xs lg:text-sm font-bold shrink-0"
                  style={{ backgroundColor: '#3B82F6' }}
                >
                  {label}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>}

      {/* Discovered — hidden for MST */}
      {algorithmLabel !== 'MST' && <div className="flex flex-col gap-2">
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
                  className="inline-flex items-center justify-center w-8 h-8 lg:w-11 lg:h-11 rounded-full text-white text-xs lg:text-sm font-bold shrink-0"
                  style={{ backgroundColor: '#F59E0B' }}
                >
                  {label}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>}

      {/* Distance table — Dijkstra only */}
      {step?.distanceTable && (
        <div className="flex flex-col gap-2">
          <SectionHeader title="dist[ ]" count={graph.nodes.length} color="#F59E0B" />
          <div className="flex flex-col gap-1">
            {graph.nodes.map((n) => {
              const d       = step.distanceTable![n.id]
              const settled = step.graphState.nodeStates[n.id] === 'visited'
              const reached = d !== Infinity
              return (
                <motion.div
                  key={n.id}
                  layout
                  className="flex items-center justify-between px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: settled
                      ? 'rgba(34,197,94,0.12)'
                      : reached
                      ? 'rgba(245,158,11,0.10)'
                      : 'rgba(255,255,255,0.04)',
                  }}
                >
                  <span className="text-white text-xs font-bold font-mono">{n.label}</span>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: settled ? '#22C55E' : reached ? '#F59E0B' : '#4B5563' }}
                  >
                    {d === Infinity ? '∞' : d}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Processed — hidden for MST */}
      {algorithmLabel !== 'MST' && <div className="flex flex-col gap-2">
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
                  className="inline-flex items-center justify-center w-8 h-8 lg:w-11 lg:h-11 rounded-full text-white text-xs lg:text-sm font-bold shrink-0"
                  style={{ backgroundColor: '#22C55E' }}
                >
                  {label}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>}

    </div>
  )
}
