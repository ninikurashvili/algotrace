type AlgoKey = 'bfs' | 'dfs' | 'dijkstra' | 'mst'

interface Props {
  onSelect: (algo: AlgoKey) => void
}

interface AlgoCard {
  key: AlgoKey
  name: string
  nameGeo: string
  description: string
  dataStructure: string
  color: string
  bg: string
  border: string
  available: boolean
}

const ALGOS: AlgoCard[] = [
  {
    key: 'bfs',
    name: 'BFS',
    nameGeo: 'სიგანეში ძიება',
    description: 'სათითაოდ ამოწმებს ყველა მეზობელს, შემდეგ გადადის შემდეგ დონეზე.',
    dataStructure: 'Queue (FIFO)',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.3)',
    available: true,
  },
  {
    key: 'dfs',
    name: 'DFS',
    nameGeo: 'სიღრმეში ძიება',
    description: 'მიდის რაც შეიძლება ღრმად, შემდეგ უბრუნდება და სხვა გზას ირჩევს.',
    dataStructure: 'Stack (LIFO)',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.3)',
    available: false,
  },
  {
    key: 'dijkstra',
    name: 'Dijkstra',
    nameGeo: 'უმოკლესი გზა',
    description: 'პოულობს ყველაზე მოკლე გზას საწყისი ნოდიდან დანარჩენ ნოდებამდე.',
    dataStructure: 'Priority Queue',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
    available: false,
  },
  {
    key: 'mst',
    name: 'MST — Kruskal',
    nameGeo: 'მინიმალური ხე',
    description: 'პოულობს წვეროთა მინიმალური ჯამური წონის შემაერთებელ ხეს.',
    dataStructure: 'Union-Find',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.3)',
    available: false,
  },
]

export default function HomePage({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-12 p-8">

      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-5xl font-bold text-white tracking-tight">AlgoTrace</h1>
        <p className="text-gray-400 text-lg max-w-md">
          გრაფის ალგორითმების ნაბიჯ-ნაბიჯ ვიზუალიზატორი
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-5 w-full max-w-2xl">
        {ALGOS.map((algo) => (
          <button
            key={algo.key}
            onClick={() => algo.available && onSelect(algo.key)}
            disabled={!algo.available}
            className="relative flex flex-col gap-4 p-6 rounded-2xl text-left transition-all duration-200 group"
            style={{
              background: algo.bg,
              border: `1px solid ${algo.border}`,
              cursor: algo.available ? 'pointer' : 'default',
              opacity: algo.available ? 1 : 0.55,
            }}
          >
            {/* Coming soon badge */}
            {!algo.available && (
              <span
                className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: algo.border, color: algo.color }}
              >
                Soon
              </span>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1">
              <span
                className="text-2xl font-bold"
                style={{ color: algo.color }}
              >
                {algo.name}
              </span>
              <span className="text-gray-400 text-sm">{algo.nameGeo}</span>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed">
              {algo.description}
            </p>

            {/* Data structure badge */}
            <span
              className="self-start text-xs font-mono px-2.5 py-1 rounded-lg"
              style={{ background: algo.border, color: algo.color }}
            >
              {algo.dataStructure}
            </span>

            {/* Arrow — visible only when available */}
            {algo.available && (
              <span
                className="absolute bottom-5 right-5 text-xl transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: algo.color }}
              >
                →
              </span>
            )}
          </button>
        ))}
      </div>

    </div>
  )
}
