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
  homeBtn: string
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
  bfsDesc: 'გრაფის ან ხის ძიების ალგორითმია, რომელიც კვანძებს დონეების მიხედვით იკვლევს და საწყისი წერტილიდან უმოკლეს გზას პოულობს არაწონიან გრაფში.',
  bfsDsLabel: 'Queue (FIFO)',

  dfsNameGeo: 'სიღრმეში ძიება',
  dfsDesc: 'გრაფის ან ხის ძიების ალგორითმია, რომელიც ჯერ მაქსიმალურად ღრმად მოძრაობს ერთ მიმართულებით და შემდეგ უკან ბრუნდება სხვა გზების შესასწავლად.',
  dfsDsLabel: 'Stack (LIFO)',

  dijkstraNameGeo: 'უმოკლესი გზა',
  dijkstraDesc: 'გამოიყენება დადებითი წონების მქონე გრაფში ერთი საწყისი კვანძიდან ყველა სხვა კვანძამდე უმოკლესი გზების საპოვნელად.',
  dijkstraDsLabel: 'Priority Queue',

  mstName: 'MST — Kruskal',
  mstNameGeo: 'მინიმალური ხე',
  mstDesc: 'გამოიყენება გრაფის მინიმალური დამაკავშირებელი ხის (MST) შესაქმნელად, სადაც ეტაპობრივად ირჩევა ყველაზე მცირე წონის წიბო ისე, რომ ციკლი არ წარმოიქმნას.',
  mstDsLabel: 'Union-Find',

  graphBuilderTitle: 'გრაფის კონსტრუქტორი',
  presetsLabel: 'მაგალითები',
  modeLabel: 'რეჟიმი',
  modeSelect: 'მონიშვნა',
  modeAddEdge: 'წიბოს დამატება',
  modeDelete: 'წაშლა',
  addNodeBtn: '+ წვეროს დამატება',
  maxNodesTitle: 'მაქსიმუმ 50 წვერო',
  weightLabel: 'წონა',
  clickSecondNode: 'დააჭირე მეორე წვეროს…',
  clickFirstNode: 'დააჭირე პირველ წვეროს…',
  edgeWeightLabel: 'წიბოს წონა',
  deleteSelectedBtn: 'მონიშნულის წაშლა',
  startNodeLabel: 'საწყისი წვერო',
  noNodesOption: '— წვეროები არ არის —',
  directedLabel: 'მიმართული',
  resetGraphBtn: 'გრაფის გასუფთავება',
  nodeCountFn: (n) => `${n} წვერო`,

  editGraphBtn: '← გრაფის რედაქტირება',
  slowLabel: 'ნელი',
  mediumLabel: 'საშუალო',
  fastLabel: 'სწრაფი',
  resetBtn: 'თავიდან',
  backBtn: 'უკან',
  homeBtn: '← მთავარი',
  playBtn: 'გაშვება',
  pauseBtn: 'პაუზა',
  forwardBtn: 'წინ',
  stepCounter: (cur, total) => `ნაბიჯი ${cur} / ${total}`,

  bfsHeader: 'BFS — სიგანეში ძიება',
  dfsHeader: 'DFS — სიღრმეში ძიება',
  dijkstraHeader: 'Dijkstra — უმოკლესი გზა',
  mstHeader: 'Kruskal — მინიმალური დამფარავი ხე',
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
start: (label) => `ძიებას ვიწყებთ ${label}-დან. მოცემული წვერო პირველი ემატება რიგში, რადგან სწორედ ის წარმოადგენს სიგანეში ძიების საწყის წერტილს.`,
  dequeue: (label, neighbors) => `რიგიდან ამოვიღეთ ${label}. ახლა შევისწავლით მის მეზობელ წვეროებს: ${neighbors}.`,
  dequeueNoNeighbors: (label) => `რიგიდან ამოვიღეთ ${label}. მასთან დაკავშირებული მეზობელი წვეროები არ არსებობს, ამიტომ ძიებას ვაგრძელებთ.`,
  alreadyQueued: (label) => `${label} უკვე დამატებულია რიგში, ამიტომ მისი ხელახლა დამატება საჭირო არ არის.`,
  enqueue: (label) => `${label} პირველად აღმოვაჩინეთ, ამიტომ მას რიგის ბოლოში ვამატებთ შემდგომი დამუშავებისთვის.`,
  done: 'BFS ალგორითმის მუშაობა დასრულდა. მონახულებულია ყველა ის წვერო, რომელიც საწყისი წერტილიდან მიღწევადია, თანაც მათი დონის (სიშორის) მიხედვით.'
  },

  dfsMsgs: {
  start: (label) => `ძიებას ვიწყებთ ${label}-დან. DFS ალგორითმი ცდილობს, არჩეული მიმართულებით რაც შეიძლება ღრმად გადავიდეს, სანამ უკან დაბრუნება გახდება საჭირო.`,
  goDeeper: (from, to) => `${from}-დან გადავდივართ ${to}-ში. წვეროს Stack-ში ვინახავთ და ძიებას სიღრმის მიმართულებით ვაგრძელებთ.`,
  alreadyVisited: (label) => `${label} უკვე მონახულებულია, ამიტომ ამ მიმართულებით ძიებას აღარ გავაგრძელებთ.`,
  backtrack: (from, to) => `${from}-დან ყველა შესაძლო მიმართულება უკვე შესწავლილია. ვბრუნდებით ${to}-ში, რათა დარჩენილი გზები შევამოწმოთ.`,
  done: 'DFS ალგორითმის მუშაობა დასრულდა. მონახულებულია ყველა ის წვერო, რომელიც საწყისი წერტილიდან მიღწევადია.'
},

dijkstraMsgs: {
  start: (label) => `საწყის წვეროდ ავირჩიეთ ${label}. მისი მანძილი განისაზღვრა 0-ით, ხოლო დანარჩენი წვეროების მანძილი დროებით უსასრულობად (∞) ჩაითვალა. საწყისი წვერო ემატება პრიორიტეტულ რიგში.`,
  alreadySettled: (label) => `${label} უკვე საბოლოოდ დამუშავებულია და მისი უმოკლესი მანძილი ცნობილია, ამიტომ ხელახლა აღარ განიხილება.`,
  dequeue: (label, d) => `პრიორიტეტული რიგიდან ამოვიღეთ ${label}, რადგან ამ მომენტისთვის ის საწყის წერტილთან ყველაზე ახლოს მდებარე წვეროა (მანძილი: ${d}). ახლა შევამოწმებთ მის მეზობლებს.`,
  relaxed: (from, to, d, w, nd) => `${from} → ${to}: ${d} + ${w} = ${nd}. აღმოჩნდა უფრო მოკლე გზა, ამიტომ ${to}-მდე მანძილი განახლდა ${nd}-ით.`,
  notRelaxed: (from, to, d, w, nd, od) => `${from} → ${to}: ${d} + ${w} = ${nd}. არსებული გზა უფრო ეფექტურია (ამჟამინდელი მანძილი: ${od}), ამიტომ მნიშვნელობა არ შეიცვლება.`,
  done: 'Dijkstra-ს ალგორითმის მუშაობა დასრულდა. ნაპოვნია უმოკლესი გზები საწყისი წვეროდან ყველა მიღწევად წვერომდე.'
},

kruskalMsgs: {
  sorted: (desc) => `ყველა წიბო დალაგდა წონის ზრდის მიხედვით — ყველაზე მცირე წონიდან ყველაზე დიდამდე: ${desc}.`,
  considering: (fl, tl, w) => `განვიხილავთ ${fl}–${tl} წიბოს (წონა: ${w}) და შევამოწმებთ, გამოიწვევს თუ არა მისი დამატება ციკლის წარმოქმნას.`,
  accept: (fl, tl, w, total) => `${fl}–${tl} წიბო (წონა: ${w}) დაემატა მინიმალურ დამფარავ ხეს (MST), რადგან ციკლი არ წარმოიქმნება. მიმდინარე ჯამური წონა არის ${total}.`,
  reject: (fl, tl, w) => `${fl}–${tl} წიბო (წონა: ${w}) არ დაემატება, რადგან ეს ორი წვერო უკვე დაკავშირებულია და მისი დამატება ციკლს შექმნიდა.`,
  done: (total) => `Kruskal-ის ალგორითმის მუშაობა დასრულდა. მიღებულია მინიმალური დამფარავი ხე (MST), რომლის საერთო წონაა ${total}.`
},
  bfsInfoAlgoName: 'BFS — სიგანეში ძიება',
bfsInfo: [
  {
    title: 'მუშაობის პრინციპი',
    body: 'BFS ძიებას იწყებს საწყისი წვეროდან და ეტაპობრივად იკვლევს ყველა მეზობელ წვეროს იმავე დონეზე, შემდეგ კი გადადის მომდევნო დონეზე. ამ პროცესისთვის გამოიყენება რიგი (Queue), რომელიც უზრუნველყოფს წვეროების თანმიმდევრულ დამუშავებას.',
  },
  {
    title: 'მონაცემთა სტრუქტურა',
    body: 'გამოიყენება რიგი (Queue, FIFO), სადაც პირველი დამატებული ელემენტი პირველი მუშავდება. ეს უზრუნველყოფს წვეროების დამუშავებას დონეების მიხედვით.',
  },
  {
    title: 'სირთულე',
    body: 'დროითი სირთულე: O(V + E) — თითოეული წვერო და წიბო მაქსიმუმ ერთხელ მუშავდება. სივრცითი სირთულე: O(V) — დამატებითი მეხსიერება საჭიროა რიგისა და მონახულებული წვეროების შესანახად.',
  },
  {
    title: 'გამოყენება',
    body: 'გამოიყენება არაწონიან (unweighted) გრაფებში უმოკლესი გზის საპოვნელად, სოციალური ქსელების ანალიზში, ვებგვერდების ავტომატური სკანირებისას (Web Crawling), Peer-to-Peer ქსელებსა და მიღწევადობის განსაზღვრის ამოცანებში.',
  },
],

dfsInfoAlgoName: 'DFS — სიღრმეში ძიება',

dfsInfo: [
  {
    title: 'მუშაობის პრინციპი',
    body: 'DFS ერთი მიმართულებით მაქსიმალურად ღრმად მოძრაობს, სანამ შემდგომი გადაადგილება შეუძლებელი გახდება. ამის შემდეგ უკან ბრუნდება და აგრძელებს დარჩენილი მიმართულებების შესწავლას.',
  },
  {
    title: 'მონაცემთა სტრუქტურა',
    body: 'გამოიყენება სტეკი (Stack, LIFO), სადაც ბოლო დამატებული ელემენტი პირველი მუშავდება. რეკურსიული განხორციელების შემთხვევაში ამ ფუნქციას გამოძახებების სტეკი (Call Stack) ასრულებს.',
  },
  {
    title: 'სირთულე',
    body: 'დროითი სირთულე: O(V + E) — თითოეული წვერო და წიბო მაქსიმუმ ერთხელ მუშავდება. სივრცითი სირთულე: O(V) — საჭიროა დამატებითი მეხსიერება სტეკის ან რეკურსიისთვის.',
  },
  {
    title: 'გამოყენება',
    body: 'გამოიყენება ციკლების აღმოსაჩენად, ტოპოლოგიური დალაგებისთვის, ლაბირინთების ამოსახსნელად და ძლიერად დაკავშირებული კომპონენტების (Strongly Connected Components) საპოვნელად.',
  },
],

dijkstraInfoAlgoName: 'Dijkstra — უმოკლესი გზის ალგორითმი',

dijkstraInfo: [
  {
    title: 'მუშაობის პრინციპი',
    body: 'ყოველ ეტაპზე აირჩევა ის წვერო, რომელსაც საწყისი წერტილიდან ყველაზე მცირე ჯამური მანძილი აქვს. შემდეგ ხდება მისი მეზობელი წვეროების მანძილების განახლება, თუ უფრო მოკლე გზა მოიძებნა.',
  },
  {
    title: 'მონაცემთა სტრუქტურა',
    body: 'გამოიყენება პრიორიტეტული რიგი (Priority Queue ან Min-Heap), რომელიც უზრუნველყოფს ყველაზე მცირე მანძილის მქონე წვეროს პირველ დამუშავებას.',
  },
  {
    title: 'სირთულე',
    body: 'დროითი სირთულე: O((V + E) log V) Min-Heap-ის გამოყენების შემთხვევაში. სივრცითი სირთულე: O(V) — მანძილებისა და მონახულებული წვეროების შესანახად.',
  },
  {
    title: 'შეზღუდვა',
    body: 'ალგორითმი მუშაობს მხოლოდ არაუარყოფითი (≥ 0) წონების მქონე გრაფებზე. უარყოფითი წონების არსებობის შემთხვევაში გამოიყენება Bellman-Ford-ის ალგორითმი.',
  },
  {
    title: 'გამოყენება',
    body: 'გამოიყენება GPS ნავიგაციაში, კომპიუტერული ქსელების მარშრუტიზაციაში და თამაშებში პერსონაჟების გადაადგილების ოპტიმალური გზების განსაზღვრისთვის.',
  },
],

mstInfoAlgoName: 'Kruskal — მინიმალური დამფარავი ხე',

mstInfo: [
  {
    title: 'მუშაობის პრინციპი',
    body: 'Kruskal-ის ალგორითმი ყველა წიბოს ალაგებს წონის ზრდის მიხედვით და ეტაპობრივად ამატებს ყველაზე მცირე წონის წიბოს, თუ მისი დამატება ციკლს არ წარმოქმნის.',
  },
  {
    title: 'მონაცემთა სტრუქტურა',
    body: 'გამოიყენება Union-Find (Disjoint Set Union), რომელიც ეფექტურად ამოწმებს, ეკუთვნის თუ არა ორი წვერო ერთსა და იმავე კომპონენტს.',
  },
  {
    title: 'სირთულე',
    body: 'დროითი სირთულე: O(E log E) — ძირითადად წიბოების დალაგების გამო. Union-Find ოპერაციები პრაქტიკულად მუდმივ დროში სრულდება. სივრცითი სირთულე: O(V + E).',
  },
  {
    title: 'გამოყენება',
    body: 'გამოიყენება ელექტროენერგიის, სატელეკომუნიკაციო და სატრანსპორტო ქსელების ოპტიმიზაციისთვის, ასევე კლასტერიზაციისა და გამოსახულებების სეგმენტაციის ამოცანებში.',
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
  homeBtn: '← Home',
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
  start: (label) => `The search begins at ${label}. This node is added to the Queue first, as it serves as the starting point for the breadth-first traversal.`,

  dequeue: (label, neighbors) => `Removed ${label} from the Queue. We will now examine its neighboring nodes: ${neighbors}.`,

  dequeueNoNeighbors: (label) => `Removed ${label} from the Queue. It has no neighboring nodes, so the search will continue.`,

  alreadyQueued: (label) => `${label} has already been added to the Queue, so it does not need to be added again.`,

  enqueue: (label) => `${label} has been discovered for the first time and is added to the end of the Queue for future processing.`,

  done: 'The BFS algorithm has finished. All nodes reachable from the starting node have been visited according to their depth level.',
},

dfsMsgs: {
  start: (label) => `The search begins at ${label}. DFS attempts to explore as deeply as possible along the current path before backtracking.`,

  goDeeper: (from, to) => `Moving from ${from} to ${to}. The node is pushed onto the Stack and the search continues deeper.`,

  alreadyVisited: (label) => `${label} has already been visited, so this path will not be explored again.`,

  backtrack: (from, to) => `All possible paths from ${from} have been explored. Returning to ${to} to examine any remaining paths.`,

  done: 'The DFS algorithm has finished. All nodes reachable from the starting node have been visited.',
},

dijkstraMsgs: {
  start: (label) => `Selected ${label} as the source node. Its distance is set to 0, while all other nodes are temporarily assigned an infinite (∞) distance. The source node is added to the Priority Queue.`,

  alreadySettled: (label) => `${label} has already been finalized, and its shortest distance is known, so it will not be processed again.`,

  dequeue: (label, d) => `Removed ${label} from the Priority Queue because it currently has the smallest distance from the source node (${d}). Its neighboring nodes will now be examined.`,

  relaxed: (from, to, d, w, nd) => `${from} → ${to}: ${d} + ${w} = ${nd}. A shorter path has been found, so the distance to ${to} has been updated to ${nd}.`,

  notRelaxed: (from, to, d, w, nd, od) => `${from} → ${to}: ${d} + ${w} = ${nd}. The existing path is already shorter (current distance: ${od}), so no update is required.`,

  done: 'Dijkstra’s algorithm has finished. The shortest paths from the source node to all reachable nodes have been determined.',
},

kruskalMsgs: {
  sorted: (desc) => `All edges have been sorted in ascending order of weight, from the smallest to the largest: ${desc}.`,

  considering: (fl, tl, w) => `Considering edge ${fl}–${tl} (weight: ${w}) and checking whether adding it would create a cycle.`,

  accept: (fl, tl, w, total) => `Edge ${fl}–${tl} (weight: ${w}) has been added to the Minimum Spanning Tree (MST) because it does not create a cycle. The current total weight is ${total}.`,

  reject: (fl, tl, w) => `Edge ${fl}–${tl} (weight: ${w}) will not be added because these two nodes are already connected, and adding it would create a cycle.`,

  done: (total) => `Kruskal's algorithm has finished. The Minimum Spanning Tree (MST) has been constructed with a total weight of ${total}.`,
},

bfsInfoAlgoName: 'BFS — Breadth-First Search',

bfsInfo: [
  {
    title: 'How it works',
    body: 'BFS starts from a source node and explores all neighboring nodes at the current depth level before moving to the next level. This level-by-level traversal is achieved using a Queue.',
  },
  {
    title: 'Data structure',
    body: 'A Queue (FIFO) is used, where the first inserted element is the first one to be processed. This guarantees traversal by depth levels.',
  },
  {
    title: 'Complexity',
    body: 'Time complexity: O(V + E) — each node and each edge is processed at most once. Space complexity: O(V) — additional memory is required for the Queue and visited nodes.',
  },
  {
    title: 'Use cases',
    body: 'Finding the shortest path in unweighted graphs, social network analysis, web crawling, peer-to-peer networks, and reachability analysis.',
  },
],

dfsInfoAlgoName: 'DFS — Depth-First Search',

dfsInfo: [
  {
    title: 'How it works',
    body: 'DFS explores one path as deeply as possible before returning and continuing with unexplored paths.',
  },
  {
    title: 'Data structure',
    body: 'A Stack (LIFO) is used, where the most recently added element is processed first. In recursive implementations, the call stack performs this role automatically.',
  },
  {
    title: 'Complexity',
    body: 'Time complexity: O(V + E) — each node and each edge is processed at most once. Space complexity: O(V) — additional memory is required for the Stack or recursion.',
  },
  {
    title: 'Use cases',
    body: 'Cycle detection, topological sorting, maze solving, and finding strongly connected components.',
  },
],

dijkstraInfoAlgoName: "Dijkstra's Algorithm — Shortest Path",

dijkstraInfo: [
  {
    title: 'How it works',
    body: 'At each step, the algorithm selects the node with the smallest known distance from the source node and updates the distances of its neighbors if a shorter path is found.',
  },
  {
    title: 'Data structure',
    body: 'A Priority Queue (Min-Heap) is used to efficiently retrieve the node with the smallest distance value.',
  },
  {
    title: 'Complexity',
    body: 'Time complexity: O((V + E) log V) when using a Min-Heap. Space complexity: O(V) for storing distances and visited nodes.',
  },
  {
    title: 'Limitation',
    body: 'The algorithm only works with non-negative (≥ 0) edge weights. For graphs with negative weights, Bellman-Ford should be used.',
  },
  {
    title: 'Use cases',
    body: 'GPS navigation systems, network routing protocols, and shortest-path calculations in games and simulations.',
  },
],

mstInfoAlgoName: "Kruskal's Algorithm — Minimum Spanning Tree",

mstInfo: [
  {
    title: 'How it works',
    body: "Kruskal's algorithm sorts all edges by weight and repeatedly adds the lightest edge that does not create a cycle.",
  },
  {
    title: 'Data structure',
    body: 'Union-Find (Disjoint Set Union) is used to efficiently determine whether two nodes belong to the same connected component.',
  },
  {
    title: 'Complexity',
    body: 'Time complexity: O(E log E), mainly due to edge sorting. Union-Find operations are performed in near-constant time. Space complexity: O(V + E).',
  },
  {
    title: 'Use cases',
    body: 'Optimization of power grids, telecommunication and transportation networks, clustering algorithms, and image segmentation.',
  },
]
}

export const translations: Record<Lang, Translations> = { ka, en }
