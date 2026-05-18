import { useMemo } from 'react'
import GraphCanvas, { TEST_GRAPH } from '../components/GraphCanvas'
import DataPanel from '../components/DataPanel'
import { bfs } from '../algorithms/bfs'
import { usePlayback, type Speed } from '../hooks/useInterval'

const SPEEDS: Speed[] = [1000, 500, 150]
const SPEED_LABELS = ['Slow', 'Medium', 'Fast']

interface Props {
  onBack: () => void
}

export default function BFSDashboard({ onBack }: Props) {
  const steps = useMemo(() => bfs(TEST_GRAPH, 'a'), [])

  const {
    currentStep,
    currentStepIndex,
    isPlaying,
    speed,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    setSpeed,
  } = usePlayback(steps)

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4 p-8">

      {/* Back button */}
      <div className="self-start">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← ალგორითმები
        </button>
      </div>

      {/* Canvas + right column */}
      <div className="flex gap-4 items-start">

        <GraphCanvas
          graph={TEST_GRAPH}
          nodeStates={currentStep?.graphState.nodeStates}
          edgeStates={currentStep?.graphState.edgeStates}
        />

        {/* Right column: controls + BFS state panel */}
        <div className="flex flex-col gap-4 w-72">

          {/* Controls */}
          <div className="flex flex-col gap-3 bg-gray-800 rounded-xl px-4 py-4 w-full">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={reset}
                className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                <span className="text-base leading-none">⏮</span>
                <span className="text-[10px] text-gray-400">Reset</span>
              </button>
              <button
                onClick={stepBack}
                className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                <span className="text-base leading-none">⏪</span>
                <span className="text-[10px] text-gray-400">Back</span>
              </button>
              {isPlaying ? (
                <button
                  onClick={pause}
                  className="flex flex-col items-center gap-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors"
                >
                  <span className="text-base leading-none">⏸</span>
                  <span className="text-[10px]">Pause</span>
                </button>
              ) : (
                <button
                  onClick={play}
                  className="flex flex-col items-center gap-1 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white transition-colors"
                >
                  <span className="text-base leading-none">▶</span>
                  <span className="text-[10px]">Play</span>
                </button>
              )}
              <button
                onClick={stepForward}
                className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                <span className="text-base leading-none">⏩</span>
                <span className="text-[10px] text-gray-400">Forward</span>
              </button>
            </div>
            {/* Speed slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] text-gray-500">
                {SPEED_LABELS.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={1}
                value={SPEEDS.indexOf(speed)}
                onChange={(e) => setSpeed(SPEEDS[Number(e.target.value)])}
                disabled={isPlaying}
                className="w-full accent-blue-500 disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>

            <span className="text-center text-gray-500 text-xs tabular-nums">
              Step {currentStepIndex + 1} / {steps.length}
            </span>
          </div>

          <DataPanel step={currentStep} graph={TEST_GRAPH} algorithmLabel="BFS" />
        </div>

      </div>

      {/* Georgian step message */}
      <p className="text-white text-base text-center max-w-3xl min-h-[1.5rem]">
        {currentStep?.message ?? ''}
      </p>

    </div>
  )
}
