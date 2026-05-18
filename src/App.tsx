import { useState } from 'react'
import HomePage from './pages/HomePage'
import BFSDashboard from './pages/BFSDashboard'

type Page = 'home' | 'bfs' | 'dfs' | 'dijkstra' | 'mst'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'bfs') return <BFSDashboard onBack={() => setPage('home')} />

  return <HomePage onSelect={(algo) => setPage(algo)} />
}
