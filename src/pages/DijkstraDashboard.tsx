import { useMemo, useState } from 'react'
import GraphCanvas from '../components/GraphCanvas'
import GraphBuilder, { type BuildMode } from '../components/GraphBuilder'
import DataPanel from '../components/DataPanel'
import InfoModal from '../components/InfoModal'
import { dijkstra } from '../algorithms/dijkstra'
import { usePlayback, type Speed } from '../hooks/useInterval'
import type { Graph, GraphEdge, GraphNode } from '../algorithms/types'
import { DIJKSTRA_PRESETS } from '../data/presets'
import { useLang } from '../LanguageContext'

const SPEEDS: Speed[] = [1000, 500, 150]

// Default graph — weighted, demonstrates edge relaxation clearly:
// A→C→D is cheaper (2+1=3) than A→B→D (4+5=9)
const DIJKSTRA_DEFAULT_GRAPH: Graph = {
  directed: true,
  nodes: [
    { id: 'a', label: 'A', x: 400, y:  80 },
    { id: 'b', label: 'B', x: 200, y: 280 },
    { id: 'c', label: 'C', x: 600, y: 280 },
    { id: 'd', label: 'D', x: 300, y: 480 },
    { id: 'e', label: 'E', x: 500, y: 480 },
  ],
  edges: [
    { id: 'ab', from: 'a', to: 'b', weight: 4 },
    { id: 'ac', from: 'a', to: 'c', weight: 2 },
    { id: 'bd', from: 'b', to: 'd', weight: 5 },
    { id: 'cd', from: 'c', to: 'd', weight: 1 },
    { id: 'de', from: 'd', to: 'e', weight: 3 },
  ],
}

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

export default function DijkstraDashboard() {
  const { t } = useLang()
  const [infoOpen, setInfoOpen] = useState(false)

  // ── Graph state ───────────────────────────────────────────────────
  const [graph, setGraph] = useState<Graph>(DIJKSTRA_DEFAULT_GRAPH)

  // ── Builder state ─────────────────────────────────────────────────
  const [buildMode, setBuildMode]             = useState<BuildMode>('select')
  const [pendingEdgeFrom, setPendingEdgeFrom] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId]   = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId]   = useState<string | null>(null)
  const [weightInput, setWeightInput]         = useState('1')
  const [isBuilding, setIsBuilding]           = useState(true)

  // ── Algorithm state ───────────────────────────────────────────────
  const [startNodeId, setStartNodeId] = useState<string>(DIJKSTRA_DEFAULT_GRAPH.nodes[0]?.id ?? '')

  const effectiveStartId =
    graph.nodes.find((n) => n.id === startNodeId)?.id ?? graph.nodes[0]?.id ?? ''

  const steps = useMemo(
    () => (!isBuilding && graph.nodes.length > 0) ? dijkstra(graph, effectiveStartId, t.dijkstraMsgs) : [],
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
        const w = parseFloat(weightInput)
        const newEdge: GraphEdge = {
          id: `e-${pendingEdgeFrom}-${nodeId}-${Date.now()}`,
          from: pendingEdgeFrom,
          to: nodeId,
          weight: isNaN(w) ? 1 : w,
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
    setGraph({ nodes: [], edges: [], directed: true })
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setPendingEdgeFrom(null)
  }

  function handleEditGraph() {
    setIsBuilding(true)
    reset()
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
        <div className="flex flex-col gap-3 w-full lg:flex-1 lg:min-w-[400px] lg:max-w-[720px]">

          {/* Algorithm header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-amber-400 font-semibold text-sm">{t.dijkstraHeader}</span>
            <button
              onClick={() => setInfoOpen(true)}
              className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-amber-400 text-base font-bold transition-colors flex items-center justify-center"
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
                onClick={() => { if (graph.nodes.length > 0) { setIsBuilding(false); setSelectedEdgeId(null) } }}
                disabled={graph.nodes.length === 0}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
              >
                {t.runDijkstraFromFn(graph.nodes.find((n) => n.id === effectiveStartId)?.label ?? '…')}
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
              showWeights={true}
              selectedEdgeWeight={selectedEdgeWeight}
              onModeChange={(m) => { setBuildMode(m); setPendingEdgeFrom(null) }}
              onAddNode={handleAddNode}
              onDeleteSelected={handleDeleteSelected}
              onToggleDirected={() => setGraph((g) => ({ ...g, directed: !g.directed }))}
              onReset={handleReset}
              onWeightChange={setWeightInput}
              onSelectedEdgeWeightChange={handleSelectedEdgeWeightChange}
              presets={DIJKSTRA_PRESETS.map((p, i) => ({ name: t.dijkstraPresetNames[i] ?? p.name, onLoad: () => loadPreset(p.graph) }))}
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
                  <button onClick={play} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-colors">
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
                  className="w-full accent-amber-500 disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>

              <span className="text-center text-gray-500 text-xs tabular-nums">
                {t.stepCounter(currentStepIndex + 1, steps.length)}
              </span>
            </div>

            <DataPanel step={currentStep} graph={graph} algorithmLabel="Dijkstra" />
          </div>
        )}
      </div>

      </div>

      <InfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        algoName={t.dijkstraInfoAlgoName}
        color="#F59E0B"
        sections={t.dijkstraInfo}
      />
    </div>
  )
}
