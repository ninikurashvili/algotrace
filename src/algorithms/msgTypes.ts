export interface BfsMsgs {
  start: (label: string) => string
  dequeue: (label: string, neighbors: string) => string
  dequeueNoNeighbors: (label: string) => string
  alreadyQueued: (label: string) => string
  enqueue: (label: string) => string
  done: string
}

export interface DfsMsgs {
  start: (label: string) => string
  goDeeper: (from: string, to: string) => string
  alreadyVisited: (label: string) => string
  backtrack: (from: string, to: string) => string
  done: string
}

export interface DijkstraMsgs {
  start: (label: string) => string
  alreadySettled: (label: string) => string
  dequeue: (label: string, d: number) => string
  relaxed: (from: string, to: string, d: number, w: number, newDist: number) => string
  notRelaxed: (from: string, to: string, d: number, w: number, newDist: number, oldDist: number) => string
  done: string
}

export interface KruskalMsgs {
  sorted: (desc: string) => string
  considering: (fl: string, tl: string, w: number) => string
  accept: (fl: string, tl: string, w: number, total: number) => string
  reject: (fl: string, tl: string, w: number) => string
  done: (total: number) => string
}
