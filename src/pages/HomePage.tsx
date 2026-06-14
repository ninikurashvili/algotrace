import { useNavigate } from 'react-router-dom'
import { useLang } from '../LanguageContext'

type AlgoKey = 'bfs' | 'dfs' | 'dijkstra' | 'mst'

const ALGO_COLORS: Record<AlgoKey, { color: string; bg: string; border: string }> = {
  bfs:      { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.3)'  },
  dfs:      { color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.3)'  },
  dijkstra: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.3)'  },
  mst:      { color: '#10B981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.3)'  },
}

export default function HomePage() {
  const navigate = useNavigate()
  const { t } = useLang()

  const algos = [
    { key: 'bfs'      as AlgoKey, name: 'BFS',          nameGeo: t.bfsNameGeo,      description: t.bfsDesc,      dataStructure: t.bfsDsLabel,      available: true  },
    { key: 'dfs'      as AlgoKey, name: 'DFS',          nameGeo: t.dfsNameGeo,      description: t.dfsDesc,      dataStructure: t.dfsDsLabel,      available: true  },
    { key: 'dijkstra' as AlgoKey, name: 'Dijkstra',     nameGeo: t.dijkstraNameGeo, description: t.dijkstraDesc, dataStructure: t.dijkstraDsLabel, available: true  },
    { key: 'mst'      as AlgoKey, name: t.mstName,      nameGeo: t.mstNameGeo,      description: t.mstDesc,      dataStructure: t.mstDsLabel,      available: true  },
  ]

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 sm:gap-12 p-4 sm:p-8">

      {/* Header */}
      <div className="flex flex-col items-center gap-2 sm:gap-3 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">AlgoTrace</h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-md">{t.subtitle}</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {algos.map((algo) => {
          const { color, bg, border } = ALGO_COLORS[algo.key]
          return (
            <button
              key={algo.key}
              onClick={() => algo.available && navigate(`/${algo.key}`)}
              disabled={!algo.available}
              className="relative flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl text-left transition-all duration-200 group"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                cursor: algo.available ? 'pointer' : 'default',
                opacity: algo.available ? 1 : 0.55,
              }}
            >
              {/* Coming soon badge */}
              {!algo.available && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: border, color }}
                >
                  {t.soon}
                </span>
              )}

              {/* Name */}
              <div className="flex flex-col gap-1">
                <span className="text-xl sm:text-2xl font-bold" style={{ color }}>
                  {algo.name}
                </span>
                <span className="text-gray-400 text-xs sm:text-sm">{algo.nameGeo}</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{algo.description}</p>

              {/* Data structure badge */}
              <span
                className="self-start text-[11px] sm:text-xs font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg"
                style={{ background: border, color }}
              >
                {algo.dataStructure}
              </span>

              {/* Arrow */}
              {algo.available && (
                <span
                  className="absolute bottom-5 right-5 text-xl transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color }}
                >
                  →
                </span>
              )}
            </button>
          )
        })}
      </div>

    </div>
  )
}
