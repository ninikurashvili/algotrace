import { useReducer, useRef, useEffect, useCallback } from 'react'
import type { AlgorithmStep } from '../algorithms/types'

export type Speed = 1000 | 500 | 150

// ── Reducer ───────────────────────────────────────────────────────

type State = {
  currentStepIndex: number
  isPlaying: boolean
  speed: Speed
}

type Action =
  | { type: 'PLAY' }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'SET_INDEX'; index: number }
  | { type: 'SET_SPEED'; speed: Speed }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'PLAY':      return { ...state, isPlaying: true }
    case 'STOP':      return { ...state, isPlaying: false }
    case 'RESET':     return { ...state, currentStepIndex: 0, isPlaying: false }
    case 'SET_INDEX': return { ...state, currentStepIndex: action.index }
    case 'SET_SPEED': return { ...state, speed: action.speed }
  }
}

// ── Hook ──────────────────────────────────────────────────────────
//
// All values that live inside setInterval callbacks are kept in refs
// to avoid stale-closure bugs. Only the derived values the UI renders
// on are held in the reducer state.

export function usePlayback(steps: AlgorithmStep[]) {
  const [state, dispatch] = useReducer(reducer, {
    currentStepIndex: 0,
    isPlaying: false,
    speed: 500,
  })

  const indexRef    = useRef(0)
  const speedRef    = useRef<Speed>(500)
  const stepsLenRef = useRef(steps.length)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Timer primitives ───────────────────────────────────────────

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    intervalRef.current = setInterval(() => {
      const next = indexRef.current + 1
      if (next >= stepsLenRef.current) {
        stopTimer()
        dispatch({ type: 'STOP' })
        return
      }
      indexRef.current = next
      dispatch({ type: 'SET_INDEX', index: next })
    }, speedRef.current)
  }, [stopTimer])

  // ── Effects ────────────────────────────────────────────────────

  // When the steps array is replaced (new algorithm run or graph change),
  // sync the length ref and reset playback — one dispatch, no cascading renders
  useEffect(() => {
    stepsLenRef.current = steps.length
    stopTimer()
    indexRef.current = 0
    dispatch({ type: 'RESET' })
  }, [steps, stopTimer])

  // Clean up timer on unmount
  useEffect(() => stopTimer, [stopTimer])

  // ── Controls ───────────────────────────────────────────────────

  const play = useCallback(() => {
    if (!stepsLenRef.current || indexRef.current >= stepsLenRef.current - 1) return
    dispatch({ type: 'PLAY' })
    startTimer()
  }, [startTimer])

  const pause = useCallback(() => {
    dispatch({ type: 'STOP' })
    stopTimer()
  }, [stopTimer])

  const stepForward = useCallback(() => {
    stopTimer()
    const next = Math.min(indexRef.current + 1, stepsLenRef.current - 1)
    indexRef.current = next
    dispatch({ type: 'SET_INDEX', index: next })
    dispatch({ type: 'STOP' })
  }, [stopTimer])

  const stepBack = useCallback(() => {
    stopTimer()
    const prev = Math.max(indexRef.current - 1, 0)
    indexRef.current = prev
    dispatch({ type: 'SET_INDEX', index: prev })
    dispatch({ type: 'STOP' })
  }, [stopTimer])

  const reset = useCallback(() => {
    stopTimer()
    indexRef.current = 0
    dispatch({ type: 'RESET' })
  }, [stopTimer])

  const setSpeed = useCallback((newSpeed: Speed) => {
    speedRef.current = newSpeed
    dispatch({ type: 'SET_SPEED', speed: newSpeed })
    if (intervalRef.current !== null) startTimer()
  }, [startTimer])

  return {
    currentStep: steps[state.currentStepIndex] ?? null,
    currentStepIndex: state.currentStepIndex,
    isPlaying: state.isPlaying,
    speed: state.speed,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    setSpeed,
  }
}
