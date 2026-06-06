import { useState } from 'react'
import HomePage from './pages/HomePage'
import BFSDashboard from './pages/BFSDashboard'
import DFSDashboard from './pages/DFSDashboard'
import DijkstraDashboard from './pages/DijkstraDashboard'
import MSTDashboard from './pages/MSTDashboard'

type Page = 'home' | 'bfs' | 'dfs' | 'dijkstra' | 'mst'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'bfs')      return <BFSDashboard      onBack={() => setPage('home')} />
  if (page === 'dfs')      return <DFSDashboard      onBack={() => setPage('home')} />
  if (page === 'dijkstra') return <DijkstraDashboard onBack={() => setPage('home')} />
  if (page === 'mst')      return <MSTDashboard      onBack={() => setPage('home')} />

  return <HomePage onSelect={(algo) => setPage(algo)} />
}
