export type BuildMode = 'select' | 'addEdge' | 'delete'

interface Props {
  directed: boolean
  mode: BuildMode
  pendingEdgeFrom: string | null
  weightInput: string
  hasSelection: boolean
  nodeCount: number
  nodeOptions: { id: string; label: string }[]
  startNodeId: string
  showWeights: boolean
  selectedEdgeWeight: string | undefined  // defined only when an edge is selected
  onModeChange: (m: BuildMode) => void
  onStartNodeChange: (id: string) => void
  onAddNode: () => void
  onDeleteSelected: () => void
  onToggleDirected: () => void
  onReset: () => void
  onWeightChange: (w: string) => void
  onSelectedEdgeWeightChange: (w: string) => void
}

const MODE_LABELS: Record<BuildMode, string> = {
  select:  'Select',
  addEdge: 'Add Edge',
  delete:  'Delete',
}

export default function GraphBuilder({
  directed,
  mode,
  pendingEdgeFrom,
  weightInput,
  hasSelection,
  nodeCount,
  nodeOptions,
  startNodeId,
  showWeights,
  selectedEdgeWeight,
  onModeChange,
  onStartNodeChange,
  onAddNode,
  onDeleteSelected,
  onToggleDirected,
  onReset,
  onWeightChange,
  onSelectedEdgeWeightChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 w-44 bg-gray-800 rounded-xl p-4 self-start">
      <h3 className="text-white font-semibold text-sm">Graph Builder</h3>

      {/* Mode selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-gray-500 text-xs uppercase tracking-wider">Mode</span>
        {(Object.keys(MODE_LABELS) as BuildMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`text-xs py-1.5 px-3 rounded-lg text-left transition-colors ${
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Add node */}
      <button
        onClick={onAddNode}
        className="text-xs py-1.5 px-3 rounded-lg bg-green-700 hover:bg-green-600 text-white transition-colors"
      >
        + Add Node
      </button>

      {/* Edge weight input — only in addEdge mode and when weights are relevant */}
      {mode === 'addEdge' && showWeights && (
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-500 text-xs uppercase tracking-wider">Weight</label>
          <input
            type="number"
            value={weightInput}
            onChange={(e) => onWeightChange(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded-lg px-2 py-1.5 w-full outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="1"
            min={0}
          />
          <p className="text-xs min-h-[1rem]">
            {pendingEdgeFrom
              ? <span className="text-orange-400">Click second node…</span>
              : <span className="text-gray-500">Click first node…</span>
            }
          </p>
        </div>
      )}

      {/* Edge weight editor — shown when an edge is selected in Select mode */}
      {mode === 'select' && showWeights && selectedEdgeWeight !== undefined && (
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-500 text-xs uppercase tracking-wider">Edge Weight</label>
          <input
            type="number"
            value={selectedEdgeWeight}
            onChange={(e) => onSelectedEdgeWeightChange(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded-lg px-2 py-1.5 w-full outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="none"
            min={0}
          />
        </div>
      )}

      {/* Delete selected — only when something is selected */}
      {hasSelection && mode === 'select' && (
        <button
          onClick={onDeleteSelected}
          className="text-xs py-1.5 px-3 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-colors"
        >
          Delete Selected
        </button>
      )}

      {/* Start node selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-gray-500 text-xs uppercase tracking-wider">Start Node</span>
        <select
          value={startNodeId}
          onChange={(e) => onStartNodeChange(e.target.value)}
          disabled={nodeOptions.length === 0}
          className="bg-gray-700 text-white text-sm rounded-lg px-2 py-1.5 w-full outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-40 cursor-pointer"
        >
          {nodeOptions.length === 0
            ? <option value="">— no nodes —</option>
            : nodeOptions.map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))
          }
        </select>
      </div>

      {/* Directed toggle */}
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-xs">Directed</span>
        <button
          onClick={onToggleDirected}
          className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 overflow-hidden ${
            directed ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full transition-transform ${
              directed ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="text-xs py-1.5 px-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
      >
        Reset Graph
      </button>

      <span className="text-gray-600 text-xs">
        {nodeCount} node{nodeCount !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
