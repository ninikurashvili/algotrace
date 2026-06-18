import { useMemo, useState } from 'react'
import { useLocalGraph } from '../hooks/useLocalGraph'
import { useNavigate } from 'react-router-dom'
import GraphCanvas from '../components/GraphCanvas'
import GraphBuilder, { type BuildMode } from '../components/GraphBuilder'
import DataPanel from '../components/DataPanel'
import InfoModal from '../components/InfoModal'
import { kruskal } from '../algorithms/kruskal'
import { usePlayback, type Speed } from '../hooks/useInterval'
import type { Graph, GraphEdge, GraphNode } from '../algorithms/types'
import { MST_PRESETS } from '../data/presets'
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
  const angle = index * 2.4
  const r = 70 + index * 28
  return {
    x: Math.min(Math.max(Math.round(400 + r * Math.cos(angle)), 60), 740),
    y: Math.min(Math.max(Math.round(300 + r * Math.sin(angle)), 60), 540),
  }
}

export default function MSTDashboard() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [infoOpen, setInfoOpen] = useState(false)

  // ── Graph state ───────────────────────────────────────────────────
  const [graph, setGraph, clearGraphStorage] = useLocalGraph('algotrace-mst-graph', MST_PRESETS[0].graph)

  // ── Builder state ─────────────────────────────────────────────────
  const [buildMode, setBuildMode]             = useState<BuildMode>('select')
  const [pendingEdgeFrom, setPendingEdgeFrom] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId]   = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId]   = useState<string | null>(null)
  const [weightInput, setWeightInput]         = useState('1')
  const [isBuilding, setIsBuilding]           = useState(true)

  // ── Algorithm (Kruskal ignores start node) ────────────────────────
  const steps = useMemo(
    () => (!isBuilding && graph.nodes.length > 1) ? kruskal(graph, '', t.kruskalMsgs) : [],
    [isBuilding, graph, t],
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
        const w = parseFloat(weightInput)
        const newEdge: GraphEdge = {
          id: `e-${pendingEdgeFrom}-${nodeId}-${Date.now()}`,
          from: pendingEdgeFrom,
          to: nodeId,
          weight: isNaN(w) ? 1 : w,
        }
        setGraph((g) => {
          const dup = g.directed
            ? g.edges.some((e) => e.from === newEdge.from && e.to === newEdge.to)
            : g.edges.some((e) =>
                (e.from === newEdge.from && e.to === newEdge.to) ||
                (e.from === newEdge.to   && e.to === newEdge.from)
              )
          return dup ? g : { ...g, edges: [...g.edges, newEdge] }
        })
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
  }

  function handleReset() {
    clearGraphStorage()
    setGraph({ nodes: [], edges: [], directed: false })
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setPendingEdgeFrom(null)
  }

  const highlightedNodeId = buildMode === 'addEdge' ? pendingEdgeFrom : selectedNodeId

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
        <div className="flex flex-col gap-3 w-full lg:flex-1 lg:min-w-[400px] lg:max-w-[720px] sticky top-0 z-10 bg-gray-900 py-2 lg:sticky lg:top-6 lg:self-start">

          {/* Algorithm header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white text-xs transition-colors shrink-0">{t.homeBtn}</button>
              <span className="text-emerald-400 font-semibold text-sm">{t.mstHeader}</span>
            </div>
            <button
              onClick={() => setInfoOpen(true)}
              className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-emerald-400 text-base font-bold transition-colors flex items-center justify-center"
              title="ალგორითმის შესახებ"
            >
              ℹ
            </button>
          </div>

          <GraphCanvas
            graph={graph}
            nodeStates={!isBuilding ? currentStep?.graphState.nodeStates : undefined}
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
                onClick={() => { if (graph.nodes.length > 1) { setIsBuilding(false); setSelectedEdgeId(null) } }}
                disabled={graph.nodes.length < 2}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
              >
                {t.runKruskalBtn}
              </button>
            ) : (
              <button
                onClick={() => { setIsBuilding(true); reset() }}
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
          <div className="w-full lg:w-[420px] lg:shrink-0 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto panel-scroll">
            <GraphBuilder
              directed={graph.directed}
              mode={buildMode}
              pendingEdgeFrom={pendingEdgeFrom}
              weightInput={weightInput}
              hasSelection={!!selectedNodeId || !!selectedEdgeId}
              nodeCount={graph.nodes.length}
              nodeOptions={graph.nodes.map((n) => ({ id: n.id, label: n.label }))}
              startNodeId=""
              showStartNode={false}
              showWeights={true}
              selectedEdgeWeight={selectedEdgeWeight}
              onModeChange={(m) => { setBuildMode(m); setPendingEdgeFrom(null) }}
              onStartNodeChange={() => {}}
              onAddNode={handleAddNode}
              onDeleteSelected={handleDeleteSelected}
              onToggleDirected={() => setGraph((g) => ({ ...g, directed: !g.directed }))}
              onReset={handleReset}
              onWeightChange={setWeightInput}
              onSelectedEdgeWeightChange={handleSelectedEdgeWeightChange}
              presets={MST_PRESETS.map((p, i) => ({ name: t.mstPresetNames[i] ?? p.name, onLoad: () => loadPreset(p.graph) }))}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full lg:w-[420px] lg:shrink-0 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto panel-scroll">

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
                  <button onClick={play} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
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
                  className="w-full accent-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>

              <span className="text-center text-gray-500 text-xs tabular-nums">
                {t.stepCounter(currentStepIndex + 1, steps.length)}
              </span>
            </div>

            <DataPanel step={currentStep} graph={graph} algorithmLabel="MST" />
          </div>
        )}
      </div>

      </div>

      <InfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        algoName={t.mstInfoAlgoName}
        color="#10B981"
        sections={t.mstInfo}
      />
    </div>
  )
}
