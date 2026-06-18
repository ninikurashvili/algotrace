import { Routes, Route } from 'react-router-dom'
import { LanguageProvider, useLang } from './LanguageContext'
import HomePage from './pages/HomePage'
import BFSDashboard from './pages/BFSDashboard'
import DFSDashboard from './pages/DFSDashboard'
import DijkstraDashboard from './pages/DijkstraDashboard'
import MSTDashboard from './pages/MSTDashboard'

function LangToggle() {
  const { lang, toggle } = useLang()
  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-30 flex items-center gap-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
    >
      <span className={lang === 'ka' ? 'text-white' : 'text-gray-500'}>GE</span>
      <span className={lang === 'en' ? 'text-white' : 'text-gray-500'}> (EN)</span>
    </button>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <LangToggle />
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/bfs"      element={<BFSDashboard />} />
        <Route path="/dfs"      element={<DFSDashboard />} />
        <Route path="/dijkstra" element={<DijkstraDashboard />} />
        <Route path="/mst"      element={<MSTDashboard />} />
      </Routes>
    </LanguageProvider>
  )
}
