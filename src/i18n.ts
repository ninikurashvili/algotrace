import type { BfsMsgs, DfsMsgs, DijkstraMsgs, KruskalMsgs } from './algorithms/msgTypes'

export type Lang = 'ka' | 'en'

export interface InfoSection {
  title: string
  body: string
}

export interface Translations {
  // HomePage
  subtitle: string
  soon: string
  bfsNameGeo: string
  bfsDesc: string
  bfsDsLabel: string
  dfsNameGeo: string
  dfsDesc: string
  dfsDsLabel: string
  dijkstraNameGeo: string
  dijkstraDesc: string
  dijkstraDsLabel: string
  mstName: string
  mstNameGeo: string
  mstDesc: string
  mstDsLabel: string

  // GraphBuilder
  graphBuilderTitle: string
  presetsLabel: string
  modeLabel: string
  modeSelect: string
  modeAddEdge: string
  modeDelete: string
  addNodeBtn: string
  maxNodesTitle: string
  weightLabel: string
  clickSecondNode: string
  clickFirstNode: string
  edgeWeightLabel: string
  deleteSelectedBtn: string
  startNodeLabel: string
  noNodesOption: string
  directedLabel: string
  resetGraphBtn: string
  nodeCountFn: (n: number) => string

  // Dashboard controls
  editGraphBtn: string
  slowLabel: string
  mediumLabel: string
  fastLabel: string
  resetBtn: string
  backBtn: string
  playBtn: string
  pauseBtn: string
  forwardBtn: string
  stepCounter: (cur: number, total: number) => string

  // Dashboard headers & run buttons
  bfsHeader: string
  dfsHeader: string
  dijkstraHeader: string
  mstHeader: string
  runBfsFromFn: (label: string) => string
  runDfsFromFn: (label: string) => string
  runDijkstraFromFn: (label: string) => string
  runKruskalBtn: string

  // DataPanel
  stateLabel: string
  currentLabel: string
  mstWeightLabel: string

  // Preset names
  bfsPresetNames: string[]
  dfsPresetNames: string[]
  dijkstraPresetNames: string[]
  mstPresetNames: string[]

  // Algorithm step messages
  bfsMsgs: BfsMsgs
  dfsMsgs: DfsMsgs
  dijkstraMsgs: DijkstraMsgs
  kruskalMsgs: KruskalMsgs

  // InfoModal — algo names & section content
  bfsInfoAlgoName: string
  bfsInfo: InfoSection[]
  dfsInfoAlgoName: string
  dfsInfo: InfoSection[]
  dijkstraInfoAlgoName: string
  dijkstraInfo: InfoSection[]
  mstInfoAlgoName: string
  mstInfo: InfoSection[]
}

// ── Georgian ──────────────────────────────────────────────────────────────────

const ka: Translations = {
  subtitle: 'გრაფის ალგორითმების ვიზუალიზატორი',
  soon: 'მალე',

  bfsNameGeo: 'სიგანეში ძიება',
  bfsDesc: 'სათითაოდ ამოწმებს ყველა მეზობელს, შემდეგ გადადის შემდეგ დონეზე.',
  bfsDsLabel: 'Queue (FIFO)',

  dfsNameGeo: 'სიღრმეში ძიება',
  dfsDesc: 'მიდის რაც შეიძლება ღრმად, შემდეგ უბრუნდება და სხვა გზას ირჩევს.',
  dfsDsLabel: 'Stack (LIFO)',

  dijkstraNameGeo: 'უმოკლესი გზა',
  dijkstraDesc: 'პოულობს ყველაზე მოკლე გზას საწყისი ნოდიდან დანარჩენ ნოდებამდე.',
  dijkstraDsLabel: 'Priority Queue',

  mstName: 'MST — Kruskal',
  mstNameGeo: 'მინიმალური ხე',
  mstDesc: 'პოულობს წვეროთა მინიმალური ჯამური წონის შემაერთებელ ხეს.',
  mstDsLabel: 'Union-Find',

  graphBuilderTitle: 'გრაფის კონსტრუქტორი',
  presetsLabel: 'მაგალითები',
  modeLabel: 'რეჟიმი',
  modeSelect: 'მონიშვნა',
  modeAddEdge: 'წიბოს დამატება',
  modeDelete: 'წაშლა',
  addNodeBtn: '+ ნოდის დამატება',
  maxNodesTitle: 'მაქსიმუმ 50 ნოდი',
  weightLabel: 'წონა',
  clickSecondNode: 'დააჭირე მეორე ნოდს…',
  clickFirstNode: 'დააჭირე პირველ ნოდს…',
  edgeWeightLabel: 'წიბოს წონა',
  deleteSelectedBtn: 'მონიშნულის წაშლა',
  startNodeLabel: 'საწყისი ნოდი',
  noNodesOption: '— ნოდები არ არის —',
  directedLabel: 'მიმართული',
  resetGraphBtn: 'გრაფის გასუფთავება',
  nodeCountFn: (n) => `${n} ნოდი`,

  editGraphBtn: '← გრაფის რედაქტირება',
  slowLabel: 'ნელი',
  mediumLabel: 'საშუალო',
  fastLabel: 'სწრაფი',
  resetBtn: 'თავიდან',
  backBtn: 'უკან',
  playBtn: 'გაშვება',
  pauseBtn: 'პაუზა',
  forwardBtn: 'წინ',
  stepCounter: (cur, total) => `ნაბიჯი ${cur} / ${total}`,

  bfsHeader: 'BFS — სიგანეში ძიება',
  dfsHeader: 'DFS — სიღრმეში ძიება',
  dijkstraHeader: 'Dijkstra — უმოკლესი გზა',
  mstHeader: 'Kruskal — მინიმალური გამფენი ხე',
  runBfsFromFn: (label) => `▶ BFS-ის გაშვება — ${label}-დან`,
  runDfsFromFn: (label) => `▶ DFS-ის გაშვება — ${label}-დან`,
  runDijkstraFromFn: (label) => `▶ Dijkstra — ${label}-დან`,
  runKruskalBtn: '▶ Kruskal MST-ის გაშვება',

  stateLabel: 'მდგომარეობა',
  currentLabel: 'მიმდინარე',
  mstWeightLabel: 'MST წონა',

  bfsPresetNames: ['ორობითი ხე', 'ვარსკვლავი', 'ციკლიანი'],
  dfsPresetNames: ['ციკლი (back edge)', 'ღრმა გზა'],
  dijkstraPresetNames: ['მრავალი განახლება', 'შემოვლითი გზა'],
  mstPresetNames: ['K4 სრული', 'ბადე'],

  bfsMsgs: {
    start: (label) => `ვიწყებთ ${label}-დან. ეს ნოდი პირველი შევიდა რიგში — სწორედ აქედან დავიწყებთ სიგანეში ძიებას.`,
    dequeue: (label, neighbors) => `რიგიდან ამოვიღეთ ${label}. მის მეზობლებს შევამოწმებთ: ${neighbors}`,
    dequeueNoNeighbors: (label) => `რიგიდან ამოვიღეთ ${label}. მეზობლები არ აქვს — გავაგრძელებთ.`,
    alreadyQueued: (label) => `${label} უკვე რიგშია, ხელახლა დამატება არ სჭირდება.`,
    enqueue: (label) => `${label} პირველად ვხვდებით — რიგის ბოლოში ვამატებთ.`,
    done: 'BFS დასრულდა. ყველა მიღწევადი ნოდი თავის დონეზე მონახულებულია.',
  },

  dfsMsgs: {
    start: (label) => `ვიწყებთ ${label}-დან. DFS რაც შეიძლება ღრმად წავა ამ მიმართულებით.`,
    goDeeper: (from, to) => `${from}-დან ${to}-ში ვეშვებით. Stack-ზე ვდებთ და სიღრმეში ვაგრძელებთ.`,
    alreadyVisited: (label) => `${label} უკვე მონახულებულია — ამ გზას ისევ არ გავყვებით.`,
    backtrack: (from, to) => `${from}-ს ყველა გზა ამოიწურა. უკან ვბრუნდებით ${to}-ში და სხვა მიმართულებას ვცდით.`,
    done: 'DFS დასრულდა. ყველა მიღწევადი ნოდი სიღრმეში გავიარეთ.',
  },

  dijkstraMsgs: {
    start: (label) => `საწყისი ნოდი ${label}. მასთან მანძილი 0-ია, დანარჩენი ყველა ჯერჯერობით უსასრულოა (∞). Priority Queue-ში ვამატებთ.`,
    alreadySettled: (label) => `${label} უკვე საბოლოოდ დამუშავდა — მისი მინიმალური მანძილი ცნობილია, ისევ არ ვამუშავებთ.`,
    dequeue: (label, d) => `Priority Queue-დან ამოვიღეთ ${label} — ამჟამად ყველაზე ახლო ნოდი (მანძილი: ${d}). ვამოწმებთ მის მეზობლებს.`,
    relaxed: (from, to, d, w, nd) => `${from} → ${to}: ${d} + ${w} = ${nd}. ეს მოკლე გზაა! dist[${to}] განახლდა ${nd}-ზე.`,
    notRelaxed: (from, to, d, w, nd, od) => `${from} → ${to}: ${d} + ${w} = ${nd}. უკეთესი გზა უკვე გვაქვს (dist[${to}] = ${od}) — არ ვცვლით.`,
    done: 'Dijkstra დასრულდა. ნაჩვენებია ყველაზე მოკლე გზა საწყისი ნოდიდან ყველა მიღწევად ნოდამდე.',
  },

  kruskalMsgs: {
    sorted: (desc) => `ყველა წიბო წონის მიხედვით დავალაგეთ — ყველაზე მსუბუქიდან ყველაზე მძიმემდე: ${desc}`,
    considering: (fl, tl, w) => `განვიხილავთ წიბოს ${fl}–${tl} (წონა: ${w}). შევამოწმოთ, ციკლს ხომ არ შექმნის?`,
    accept: (fl, tl, w, total) => `✓ წიბო ${fl}–${tl} (წონა: ${w}) — ციკლი არ იქმნება, MST-ში ვამატებთ. MST-ის ჯამური წონა: ${total}`,
    reject: (fl, tl, w) => `✗ წიბო ${fl}–${tl} (წონა: ${w}) — ეს ორი ნოდი უკვე დაკავშირებულია! ციკლს შექმნიდა, ამიტომ გამოვტოვებთ.`,
    done: (total) => `MST დასრულდა. მინიმალური გამფენი ხის საერთო წონა: ${total}`,
  },

  bfsInfoAlgoName: 'BFS — სიგანეში ძიება',
  bfsInfo: [
    {
      title: 'მუშაობის პრინციპი',
      body: 'BFS იწყებს საწყისი ნოდიდან და სათითაოდ ამოწმებს ყველა მეზობელს ერთ დონეზე, სანამ შემდეგ დონეზე გადავა. ამისთვის Queue (რიგი) გამოიყენება — პირველი შემოსული, პირველი გამოდის.',
    },
    {
      title: 'მონაცემთა სტრუქტურა',
      body: 'Queue (FIFO) — ნოდები იდება რიგის ბოლოში და გამოდის დასაწყისიდან. ეს იძლევა level-by-level დამუშავების გარანტიას.',
    },
    {
      title: 'სირთულე',
      body: 'დრო: O(V + E) — თითოეული ნოდი და წიბო ზუსტად ერთხელ მუშავდება. სივრცე: O(V) Queue-სთვის.',
    },
    {
      title: 'გამოყენება',
      body: 'უმოკლესი გზა unweighted გრაფში, სოციალური ქსელების ანალიზი (მეგობრების "ხარისხი"), Web Crawling, peer-to-peer ქსელები.',
    },
  ],

  dfsInfoAlgoName: 'DFS — სიღრმეში ძიება',
  dfsInfo: [
    {
      title: 'მუშაობის პრინციპი',
      body: 'DFS ღრმად შედის გრაფში ერთი გზით — მიდის ჩიხამდე, შემდეგ უბრუნდება (backtrack) და სხვა გზას ირჩევს. გამოიყენება Stack ან რეკურსია.',
    },
    {
      title: 'მონაცემთა სტრუქტურა',
      body: 'Stack (LIFO) — ბოლო შემოსული, პირველი გამოდის. რეკურსიული DFS-ში call stack-ი ასრულებს ამ როლს.',
    },
    {
      title: 'სირთულე',
      body: 'დრო: O(V + E) — ყველა ნოდი და წიბო ზუსტად ერთხელ ინახება. სივრცე: O(V) recursion-ის სიღრმისთვის.',
    },
    {
      title: 'გამოყენება',
      body: 'ციკლების გამოვლენა, ტოპოლოგიური დალაგება (dependency resolution), Maze solving, strongly connected components.',
    },
  ],

  dijkstraInfoAlgoName: 'Dijkstra — უმოკლესი გზა',
  dijkstraInfo: [
    {
      title: 'მუშაობის პრინციპი',
      body: 'ყოველ ნაბიჯზე ირჩევს ყველაზე იაფ ნოდს Priority Queue-დან (მინიმალური ჯამური მანძილი) და განაახლებს მისი მეზობლების მანძილებს — ე.წ. edge relaxation.',
    },
    {
      title: 'მონაცემთა სტრუქტურა',
      body: 'Priority Queue (Min-Heap) — ყველაზე მცირე ჯამური წონის ნოდი პირველი მუშავდება. ეს უზრუნველყოფს greedy სტრატეგიის სისწორეს.',
    },
    {
      title: 'სირთულე',
      body: 'დრო: O((V + E) log V) Min-Heap-ით. სივრცე: O(V) distance და visited მასივებისთვის.',
    },
    {
      title: 'შეზღუდვა',
      body: 'მუშაობს მხოლოდ დადებითი (≥ 0) წონებისთვის. უარყოფითი წონებისთვის Bellman-Ford, ყველა წყვილისთვის კი Floyd-Warshall გამოიყენება.',
    },
    {
      title: 'გამოყენება',
      body: 'GPS ნავიგაცია, ქსელის მარშრუტიზაცია (OSPF), თამაშების pathfinding (A*-ის ბაზა).',
    },
  ],

  mstInfoAlgoName: 'Kruskal — მინიმალური გამფენი ხე',
  mstInfo: [
    {
      title: 'მუშაობის პრინციპი',
      body: 'Kruskal ყველა წიბოს წონის მიხედვით ალაგებს. შემდეგ სათითაოდ ამატებს ყველაზე მსუბუქ წიბოს, მხოლოდ თუ ის ციკლს არ ქმნის (Union-Find-ის შემოწმებით).',
    },
    {
      title: 'მონაცემთა სტრუქტურა',
      body: 'Union-Find (Disjoint Set Union) — ეფექტურად ამოწმებს, ორი ნოდი ერთ კომპონენტშია თუ სხვადასხვაში. Path compression-ითა და rank-ით O(α(V)) სიჩქარე.',
    },
    {
      title: 'სირთულე',
      body: 'დრო: O(E log E) წიბოების დასალაგებლად. Union-Find ოპერაციები პრაქტიკულად O(1). სივრცე: O(V + E).',
    },
    {
      title: 'გამოყენება',
      body: 'ელექტრო და სატელეკომუნიკაციო ქსელების ოპტიმიზაცია, კლასტერიზაცია, image segmentation, transport ინფრასტრუქტურა.',
    },
  ],
}

// ── English ───────────────────────────────────────────────────────────────────

const en: Translations = {
  subtitle: 'Graph Algorithm Visualizer',
  soon: 'Soon',

  bfsNameGeo: 'Breadth-First Search',
  bfsDesc: 'Explores all neighbors at the current depth level before moving to the next.',
  bfsDsLabel: 'Queue (FIFO)',

  dfsNameGeo: 'Depth-First Search',
  dfsDesc: 'Goes as deep as possible along one path, then backtracks to explore others.',
  dfsDsLabel: 'Stack (LIFO)',

  dijkstraNameGeo: 'Shortest Path',
  dijkstraDesc: 'Finds the minimum-weight path from a source node to every other node.',
  dijkstraDsLabel: 'Priority Queue',

  mstName: 'MST — Kruskal',
  mstNameGeo: 'Minimum Spanning Tree',
  mstDesc: 'Finds the minimum-weight tree that connects all nodes in the graph.',
  mstDsLabel: 'Union-Find',

  graphBuilderTitle: 'Graph Builder',
  presetsLabel: 'Presets',
  modeLabel: 'Mode',
  modeSelect: 'Select',
  modeAddEdge: 'Add Edge',
  modeDelete: 'Delete',
  addNodeBtn: '+ Add Node',
  maxNodesTitle: 'Maximum 50 nodes',
  weightLabel: 'Weight',
  clickSecondNode: 'Click second node…',
  clickFirstNode: 'Click first node…',
  edgeWeightLabel: 'Edge Weight',
  deleteSelectedBtn: 'Delete Selected',
  startNodeLabel: 'Start Node',
  noNodesOption: '— no nodes —',
  directedLabel: 'Directed',
  resetGraphBtn: 'Reset Graph',
  nodeCountFn: (n) => `${n} node${n !== 1 ? 's' : ''}`,

  editGraphBtn: '← Edit Graph',
  slowLabel: 'Slow',
  mediumLabel: 'Medium',
  fastLabel: 'Fast',
  resetBtn: 'Reset',
  backBtn: 'Back',
  playBtn: 'Play',
  pauseBtn: 'Pause',
  forwardBtn: 'Forward',
  stepCounter: (cur, total) => `Step ${cur} / ${total}`,

  bfsHeader: 'BFS — Breadth-First Search',
  dfsHeader: 'DFS — Depth-First Search',
  dijkstraHeader: 'Dijkstra — Shortest Path',
  mstHeader: 'Kruskal — Minimum Spanning Tree',
  runBfsFromFn: (label) => `▶ Run BFS from ${label}`,
  runDfsFromFn: (label) => `▶ Run DFS from ${label}`,
  runDijkstraFromFn: (label) => `▶ Run Dijkstra from ${label}`,
  runKruskalBtn: '▶ Run Kruskal MST',

  stateLabel: 'state',
  currentLabel: 'Current',
  mstWeightLabel: 'MST weight',

  bfsPresetNames: ['Binary Tree', 'Star Graph', 'Cyclic'],
  dfsPresetNames: ['Cycle (back edge)', 'Deep Path'],
  dijkstraPresetNames: ['Multiple Relaxations', 'Detour is Cheaper'],
  mstPresetNames: ['K4 Complete', 'Grid'],

  bfsMsgs: {
    start: (label) => `Start node ${label} — added to Queue`,
    dequeue: (label, neighbors) => `Dequeue ${label} — neighbors: ${neighbors}`,
    dequeueNoNeighbors: (label) => `Dequeue ${label} — no neighbors`,
    alreadyQueued: (label) => `${label} already in Queue — skip`,
    enqueue: (label) => `Enqueue ${label}`,
    done: 'BFS complete — all reachable nodes visited',
  },

  dfsMsgs: {
    start: (label) => `DFS starts at ${label}`,
    goDeeper: (from, to) => `Go from ${from} deeper into ${to}`,
    alreadyVisited: (label) => `${label} already visited — skip`,
    backtrack: (from, to) => `All neighbors of ${from} done — backtrack to ${to}`,
    done: 'DFS complete — all reachable nodes visited',
  },

  dijkstraMsgs: {
    start: (label) => `Source node ${label} — dist[${label}]=0, added to Priority Queue`,
    alreadySettled: (label) => `${label} already settled — skip`,
    dequeue: (label, d) => `Dequeue ${label} from Priority Queue (distance: ${d})`,
    relaxed: (from, to, d, w, nd) => `${from}→${to}: ${d}+${w}=${nd} — dist[${to}] updated`,
    notRelaxed: (from, to, d, w, nd, od) => `${from}→${to}: ${d}+${w}=${nd} — dist[${to}]=${od} is already better`,
    done: 'Dijkstra complete — shortest distances to all reachable nodes found',
  },

  kruskalMsgs: {
    sorted: (desc) => `Edges sorted by weight: ${desc}`,
    considering: (fl, tl, w) => `Considering edge ${fl}-${tl} (weight: ${w})`,
    accept: (fl, tl, w, total) => `Edge ${fl}-${tl} (weight: ${w}) — added to MST  ✓  (MST weight: ${total})`,
    reject: (fl, tl, w) => `Edge ${fl}-${tl} (weight: ${w}) — would form a cycle, rejected  ✗`,
    done: (total) => `MST complete — minimum spanning tree total weight: ${total}`,
  },

  bfsInfoAlgoName: 'BFS — Breadth-First Search',
  bfsInfo: [
    {
      title: 'How it works',
      body: 'BFS starts at the source node and explores all neighbors at the current depth level before moving to the next. It uses a Queue — first in, first out.',
    },
    {
      title: 'Data structure',
      body: 'Queue (FIFO) — nodes are enqueued at the back and dequeued from the front, guaranteeing level-by-level traversal.',
    },
    {
      title: 'Complexity',
      body: 'Time: O(V + E) — each node and edge is visited exactly once. Space: O(V) for the queue.',
    },
    {
      title: 'Use cases',
      body: 'Shortest path in unweighted graphs, social network analysis (degrees of separation), web crawling, peer-to-peer networks.',
    },
  ],

  dfsInfoAlgoName: 'DFS — Depth-First Search',
  dfsInfo: [
    {
      title: 'How it works',
      body: 'DFS plunges as deep as possible along one branch until it hits a dead end, then backtracks and tries another path. Uses a Stack or recursion.',
    },
    {
      title: 'Data structure',
      body: 'Stack (LIFO) — last in, first out. In recursive DFS the call stack plays this role automatically.',
    },
    {
      title: 'Complexity',
      body: 'Time: O(V + E) — every node and edge is visited exactly once. Space: O(V) for recursion depth.',
    },
    {
      title: 'Use cases',
      body: 'Cycle detection, topological sort (dependency resolution), maze solving, finding strongly connected components.',
    },
  ],

  dijkstraInfoAlgoName: 'Dijkstra — Shortest Path',
  dijkstraInfo: [
    {
      title: 'How it works',
      body: 'At each step, Dijkstra picks the unvisited node with the smallest tentative distance from the Priority Queue, then relaxes its outgoing edges — updating neighbors if a cheaper path is found.',
    },
    {
      title: 'Data structure',
      body: 'Priority Queue (Min-Heap) — always yields the node with the minimum cumulative cost, which guarantees the greedy strategy is correct.',
    },
    {
      title: 'Complexity',
      body: 'Time: O((V + E) log V) with a binary heap. Space: O(V) for distance and visited arrays.',
    },
    {
      title: 'Limitation',
      body: 'Only works with non-negative (≥ 0) edge weights. For negative weights use Bellman-Ford; for all-pairs shortest paths use Floyd-Warshall.',
    },
    {
      title: 'Use cases',
      body: 'GPS navigation, network routing (OSPF), game pathfinding (foundation of A*).',
    },
  ],

  mstInfoAlgoName: "Kruskal's MST",
  mstInfo: [
    {
      title: 'How it works',
      body: "Kruskal's algorithm sorts all edges by weight, then greedily adds the cheapest edge that does not form a cycle, using Union-Find to detect cycles efficiently.",
    },
    {
      title: 'Data structure',
      body: 'Union-Find (Disjoint Set Union) — efficiently checks whether two nodes belong to the same component. With path compression and union by rank, near O(1) per operation.',
    },
    {
      title: 'Complexity',
      body: 'Time: O(E log E) dominated by sorting edges. Union-Find operations are near-constant. Space: O(V + E).',
    },
    {
      title: 'Use cases',
      body: 'Network infrastructure design (power grids, telecoms), clustering algorithms, image segmentation, transport planning.',
    },
  ],
}

export const translations: Record<Lang, Translations> = { ka, en }
