import type { AlgorithmStep, Graph } from '../algorithms/types'

interface Props {
  step: AlgorithmStep | null
  graph: Graph
  algorithmLabel?: string
}

function NodeChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white text-sm font-bold shrink-0"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  )
}

function Section({
  title,
  count,
  accentColor,
  empty,
  children,
}: {
  title: string
  count: number
  accentColor: string
  empty: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
          {title}
        </p>
        <span
          className="ml-auto text-xs font-mono px-1.5 py-0.5 rounded shrink-0"
          style={{ backgroundColor: accentColor + '33', color: accentColor }}
        >
          {count}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] items-start content-start">
        {empty ? <span className="text-gray-600 text-xs italic self-center">—</span> : children}
      </div>
    </div>
  )
}

export default function DataPanel({ step, graph, algorithmLabel = 'BFS' }: Props) {
  const labelOf = (id: string) => graph.nodes.find((n) => n.id === id)?.label ?? id

  const queue: string[]      = step?.dataStructure ?? []
  const discovered: string[] = step ? [...step.visitedNodes].map(labelOf) : []
  const processed: string[]  = step
    ? graph.nodes.filter((n) => step.graphState.nodeStates[n.id] === 'visited').map((n) => n.label)
    : []
  const currentLabel = step?.currentNode ? labelOf(step.currentNode) : null

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
        {currentLabel ? (
          <NodeChip label={currentLabel} color="#F97316" />
        ) : (
          <span className="text-gray-600 text-sm">—</span>
        )}
      </div>

      <div className="border-t border-gray-700" />

      <Section title="Queue" count={queue.length} accentColor="#3B82F6" empty={queue.length === 0}>
        {queue.map((label, i) => <NodeChip key={i} label={label} color="#3B82F6" />)}
      </Section>

      <Section title="Discovered" count={discovered.length} accentColor="#F59E0B" empty={discovered.length === 0}>
        {discovered.map((label, i) => <NodeChip key={i} label={label} color="#F59E0B" />)}
      </Section>

      <Section title="Processed" count={processed.length} accentColor="#22C55E" empty={processed.length === 0}>
        {processed.map((label, i) => <NodeChip key={i} label={label} color="#22C55E" />)}
      </Section>
    </div>
  )
}
