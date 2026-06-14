import { useLang } from '../LanguageContext'

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
  showStartNode?: boolean
  presets?: { name: string; onLoad: () => void }[]
  selectedEdgeWeight: string | undefined
  onModeChange: (m: BuildMode) => void
  onStartNodeChange: (id: string) => void
  onAddNode: () => void
  onDeleteSelected: () => void
  onToggleDirected: () => void
  onReset: () => void
  onWeightChange: (w: string) => void
  onSelectedEdgeWeightChange: (w: string) => void
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
  showStartNode = true,
  presets,
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
  const { t } = useLang()

  const modeLabels: Record<BuildMode, string> = {
    select:  t.modeSelect,
    addEdge: t.modeAddEdge,
    delete:  t.modeDelete,
  }

  return (
    <div className="flex flex-col gap-4 w-full bg-gray-800 rounded-xl p-5 self-start">
      <h3 className="text-white font-semibold text-sm">{t.graphBuilderTitle}</h3>

      {/* Preset graphs */}
      {presets && presets.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-gray-500 text-xs uppercase tracking-wider">{t.presetsLabel}</span>
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={p.onLoad}
              className="text-xs py-1.5 px-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors text-left"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Mode selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-gray-500 text-xs uppercase tracking-wider">{t.modeLabel}</span>
        {(Object.keys(modeLabels) as BuildMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`text-xs py-1.5 px-3 rounded-lg text-left transition-colors ${
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      {/* Add node */}
      <button
        onClick={onAddNode}
        disabled={nodeCount >= 50}
        title={nodeCount >= 50 ? t.maxNodesTitle : undefined}
        className="text-xs py-1.5 px-3 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
      >
        {t.addNodeBtn} {nodeCount >= 50 && '(50/50)'}
      </button>

      {/* Edge weight input — only in addEdge mode and when weights are relevant */}
      {mode === 'addEdge' && showWeights && (
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-500 text-xs uppercase tracking-wider">{t.weightLabel}</label>
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
              ? <span className="text-orange-400">{t.clickSecondNode}</span>
              : <span className="text-gray-500">{t.clickFirstNode}</span>
            }
          </p>
        </div>
      )}

      {/* Edge weight editor — shown when an edge is selected in Select mode */}
      {mode === 'select' && showWeights && selectedEdgeWeight !== undefined && (
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-500 text-xs uppercase tracking-wider">{t.edgeWeightLabel}</label>
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
          {t.deleteSelectedBtn}
        </button>
      )}

      {/* Start node selector — hidden for MST */}
      {showStartNode && (
        <div className="flex flex-col gap-1.5">
          <span className="text-gray-500 text-xs uppercase tracking-wider">{t.startNodeLabel}</span>
          <select
            value={startNodeId}
            onChange={(e) => onStartNodeChange(e.target.value)}
            disabled={nodeOptions.length === 0}
            className="bg-gray-700 text-white text-sm rounded-lg px-2 py-1.5 w-full outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-40 cursor-pointer"
          >
            {nodeOptions.length === 0
              ? <option value="">{t.noNodesOption}</option>
              : nodeOptions.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))
            }
          </select>
        </div>
      )}

      {/* Directed toggle */}
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-xs">{t.directedLabel}</span>
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
        {t.resetGraphBtn}
      </button>

      <span className="text-gray-600 text-xs">
        {t.nodeCountFn(nodeCount)}
      </span>
    </div>
  )
}
