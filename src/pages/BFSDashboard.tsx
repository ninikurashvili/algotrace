import { useMemo, useState } from 'react'
import GraphCanvas, { TEST_GRAPH } from '../components/GraphCanvas'
import GraphBuilder, { type BuildMode } from '../components/GraphBuilder'
import DataPanel from '../components/DataPanel'
import InfoModal from '../components/InfoModal'
import { bfs } from '../algorithms/bfs'
import { usePlayback, type Speed } from '../hooks/useInterval'
import type { Graph, GraphEdge, GraphNode } from '../algorithms/types'
import { BFS_PRESETS } from '../data/presets'
import { useLang } from '../LanguageContext'

const SPEEDS: Speed[] = [1000, 500, 150]

function nextLabel(nodes: GraphNode[]): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const i = nodes.length
  if (i < 26) return letters[i]
  return letters[Math.floor(i / 26) - 1] + letters[i % 26]
}

function nextPosition(index: number): { x: number; y: number } {
  if (index === 0) return { x: 400, y: 300 }
  const angle = index * 2.4   // golden-angle spiral
  const r = 70 + index * 28
  return {
    x: Math.min(Math.max(Math.round(400 + r * Math.cos(angle)), 60), 740),
    y: Math.min(Math.max(Math.round(300 + r * Math.sin(angle)), 60), 540),
  }
}

export default function BFSDashboard() {
  const { t } = useLang()
  const [infoOpen, setInfoOpen] = useState(false)

  // ── Graph state ───────────────────────────────────────────────────
  const [graph, setGraph] = useState<Graph>(TEST_GRAPH)

  // ── Builder state ─────────────────────────────────────────────────
  const [buildMode, setBuildMode]         = useState<BuildMode>('select')
  const [pendingEdgeFrom, setPendingEdgeFrom] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId]   = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId]   = useState<string | null>(null)
  const [weightInput, setWeightInput]         = useState('1')
  const [isBuilding, setIsBuilding]           = useState(true)

  // ── Algorithm state ───────────────────────────────────────────────
  const [startNodeId, setStartNodeId] = useState<string>(TEST_GRAPH.nodes[0]?.id ?? '')

  // Falls back to first node if the chosen start node was deleted
  const effectiveStartId =
    graph.nodes.find((n) => n.id === startNodeId)?.id ?? graph.nodes[0]?.id ?? ''

  const steps = useMemo(
    () => (!isBuilding && graph.nodes.length > 0) ? bfs(graph, effectiveStartId, t.bfsMsgs) : [],
    [isBuilding, graph, effectiveStartId, t],
  )

  const {
    currentStep, currentStepIndex, isPlaying, speed,
    play, pause, stepForward, stepBack, reset, setSpeed,
  } = usePlayback(steps)

  // ── Builder handlers ──────────────────────────────────────────────

  function handleNodeClick(nodeId: string) {
    if (buildMode === 'select') {
      setSelectedNodeId((prev) => prev === nodeId ? null : nodeId)
      setSelectedEdgeId(null)
    } else if (buildMode === 'addEdge') {
      if (!pendingEdgeFrom) {
        setPendingEdgeFrom(nodeId)
      } else if (pendingEdgeFrom === nodeId) {
        setPendingEdgeFrom(null)
      } else {
        const newEdge: GraphEdge = {
          id: `e-${pendingEdgeFrom}-${nodeId}-${Date.now()}`,
          from: pendingEdgeFrom,
          to: nodeId,
        }
        setGraph((g) => ({ ...g, edges: [...g.edges, newEdge] }))
        setPendingEdgeFrom(null)
      }
    } else if (buildMode === 'delete') {
      setGraph((g) => ({
        ...g,
        nodes: g.nodes.filter((n) => n.id !== nodeId),
        edges: g.edges.filter((e) => e.from !== nodeId && e.to !== nodeId),
      }))
      if (selectedNodeId === nodeId) setSelectedNodeId(null)
    }
  }

  function handleEdgeClick(edgeId: string) {
    if (buildMode === 'select') {
      setSelectedEdgeId((prev) => prev === edgeId ? null : edgeId)
      setSelectedNodeId(null)
    } else if (buildMode === 'delete') {
      setGraph((g) => ({ ...g, edges: g.edges.filter((e) => e.id !== edgeId) }))
      if (selectedEdgeId === edgeId) setSelectedEdgeId(null)
    }
  }

  function handleNodeDrag(nodeId: string, x: number, y: number) {
    setGraph((g) => ({
      ...g,
      nodes: g.nodes.map((n) => n.id === nodeId ? { ...n, x, y } : n),
    }))
  }

  function handleAddNode() {
    const label = nextLabel(graph.nodes)
    const { x, y } = nextPosition(graph.nodes.length)
    const id = `n-${label.toLowerCase()}-${Date.now()}`
    setGraph((g) => ({ ...g, nodes: [...g.nodes, { id, label, x, y }] }))
  }

  function handleDeleteSelected() {
    if (selectedNodeId) {
      setGraph((g) => ({
        ...g,
        nodes: g.nodes.filter((n) => n.id !== selectedNodeId),
        edges: g.edges.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId),
      }))
      setSelectedNodeId(null)
    } else if (selectedEdgeId) {
      setGraph((g) => ({ ...g, edges: g.edges.filter((e) => e.id !== selectedEdgeId) }))
      setSelectedEdgeId(null)
    }
  }

  function loadPreset(graph: Graph) {
    setGraph(graph)
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setPendingEdgeFrom(null)
    setStartNodeId(graph.nodes[0]?.id ?? '')
  }

  function handleReset() {
    setGraph({ nodes: [], edges: [], directed: false })
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setPendingEdgeFrom(null)
  }

  function handleRunBFS() {
    if (graph.nodes.length === 0) return
    setIsBuilding(false)
    setSelectedEdgeId(null)
  }

  function handleEditGraph() {
    setIsBuilding(true)
    reset()
  }

  // In addEdge mode the pending-from node gets the selection ring
  const highlightedNodeId = buildMode === 'addEdge' ? pendingEdgeFrom : selectedNodeId

  // Weight of the currently selected edge (undefined when a node is selected or nothing is selected)
  const selectedEdge = graph.edges.find((e) => e.id === selectedEdgeId)
  const selectedEdgeWeight = selectedEdge !== undefined ? String(selectedEdge.weight ?? '') : undefined

  function handleSelectedEdgeWeightChange(w: string) {
    if (!selectedEdgeId) return
    const parsed = parseFloat(w)
    setGraph((g) => ({
      ...g,
      edges: g.edges.map((e) =>
        e.id === selectedEdgeId ? { ...e, weight: isNaN(parsed) ? undefined : parsed } : e
      ),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-4 p-6">

      {/* Main row */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full lg:justify-center">

        {/* Canvas column */}
        <div className="flex flex-col gap-3 w-full lg:flex-1 lg:min-w-[400px] lg:max-w-[720px]">

          {/* Algorithm header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-blue-400 font-semibold text-sm">{t.bfsHeader}</span>
            <button
              onClick={() => setInfoOpen(true)}
              className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-blue-400 text-base font-bold transition-colors flex items-center justify-center"
              title="ალგორითმის შესახებ"
            >
              ℹ
            </button>
          </div>

          <GraphCanvas
            graph={graph}
            nodeStates={
              !isBuilding
                ? currentStep?.graphState.nodeStates
                : effectiveStartId ? { [effectiveStartId]: 'start' } : undefined
            }
            edgeStates={!isBuilding ? currentStep?.graphState.edgeStates : undefined}
            onNodeClick={isBuilding ? handleNodeClick : undefined}
            onEdgeClick={isBuilding ? handleEdgeClick : undefined}
            onNodeDrag={isBuilding ? handleNodeDrag : undefined}
            selectedNodeId={isBuilding ? highlightedNodeId : undefined}
            selectedEdgeId={isBuilding ? selectedEdgeId : undefined}
          />

          {/* Run / Edit toggle */}
          <div className="flex justify-center">
            {isBuilding ? (
              <button
                onClick={handleRunBFS}
                disabled={graph.nodes.length === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
              >
                {t.runBfsFromFn(graph.nodes.find((n) => n.id === effectiveStartId)?.label ?? '…')}
              </button>
            ) : (
              <button
                onClick={handleEditGraph}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-xl transition-colors"
              >
                {t.editGraphBtn}
              </button>
            )}
          </div>

          {!isBuilding && (
            <p className="text-white text-sm text-center min-h-[6rem] lg:min-h-[2.5rem]">
              {currentStep?.message ?? ''}
            </p>
          )}
        </div>

        {/* Right panel — swaps between builder and playback controls */}
        {isBuilding ? (
          <div className="w-full lg:w-[420px] lg:shrink-0">
            <GraphBuilder
              directed={graph.directed}
              mode={buildMode}
              pendingEdgeFrom={pendingEdgeFrom}
              weightInput={weightInput}
              hasSelection={!!selectedNodeId || !!selectedEdgeId}
              nodeCount={graph.nodes.length}
              nodeOptions={graph.nodes.map((n) => ({ id: n.id, label: n.label }))}
              startNodeId={effectiveStartId}
              onStartNodeChange={setStartNodeId}
              showWeights={false}
              selectedEdgeWeight={selectedEdgeWeight}
              onModeChange={(m) => { setBuildMode(m); setPendingEdgeFrom(null) }}
              onAddNode={handleAddNode}
              onDeleteSelected={handleDeleteSelected}
              onToggleDirected={() => setGraph((g) => ({ ...g, directed: !g.directed }))}
              onReset={handleReset}
              onWeightChange={setWeightInput}
              presets={BFS_PRESETS.map((p, i) => ({ name: t.bfsPresetNames[i] ?? p.name, onLoad: () => loadPreset(p.graph) }))}
              onSelectedEdgeWeightChange={handleSelectedEdgeWeightChange}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full lg:w-[420px] lg:shrink-0">

            {/* Controls */}
            <div className="flex flex-col gap-3 bg-gray-800 rounded-xl px-4 py-4">
              <div className="grid grid-cols-4 gap-2">
                <button onClick={reset} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                  <span className="text-base leading-none">⏮</span>
                  <span className="text-[10px] text-gray-400">{t.resetBtn}</span>
                </button>
                <button onClick={stepBack} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                  <span className="text-base leading-none">⏪</span>
                  <span className="text-[10px] text-gray-400">{t.backBtn}</span>
                </button>
                {isPlaying ? (
                  <button onClick={pause} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors">
                    <span className="text-base leading-none">⏸</span>
                    <span className="text-[10px]">{t.pauseBtn}</span>
                  </button>
                ) : (
                  <button onClick={play} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white transition-colors">
                    <span className="text-base leading-none">▶</span>
                    <span className="text-[10px]">{t.playBtn}</span>
                  </button>
                )}
                <button onClick={stepForward} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                  <span className="text-base leading-none">⏩</span>
                  <span className="text-[10px] text-gray-400">{t.forwardBtn}</span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] text-gray-500">
                  {[t.slowLabel, t.mediumLabel, t.fastLabel].map((label) => <span key={label}>{label}</span>)}
                </div>
                <input
                  type="range"
                  min={0} max={2} step={1}
                  value={SPEEDS.indexOf(speed)}
                  onChange={(e) => setSpeed(SPEEDS[Number(e.target.value)])}
                  disabled={isPlaying}
                  className="w-full accent-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>

              <span className="text-center text-gray-500 text-xs tabular-nums">
                {t.stepCounter(currentStepIndex + 1, steps.length)}
              </span>
            </div>

            <DataPanel step={currentStep} graph={graph} algorithmLabel="BFS" />
          </div>
        )}
      </div>

      </div>

      <InfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        algoName={t.bfsInfoAlgoName}
        color="#3B82F6"
        sections={t.bfsInfo}
      />
    </div>
  )
}
