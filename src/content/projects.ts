export interface Project {
  index: string
  name: string
  blurb: string
  tags: string[]
  year: string
  href?: string
}

/** Replace with your real projects. The ledger layout scales to any count. */
export const projectsContent = {
  intro: 'A few things I have designed, built, and shipped. Each one taught me something I now reach for by default.',
  items: [
    {
      index: '01',
      name: 'Latticework',
      blurb: 'A real-time collaborative graph editor. Conflict-free edits over CRDTs, 60fps canvas with 50k nodes.',
      tags: ['TypeScript', 'WebGL', 'CRDT', 'Rust/WASM'],
      year: '2025',
      href: 'https://github.com/',
    },
    {
      index: '02',
      name: 'Halfstep',
      blurb: 'An ear-training app that listens. Pitch detection in the browser, adaptive drills, no account required.',
      tags: ['Web Audio', 'React', 'DSP'],
      year: '2024',
      href: 'https://github.com/',
    },
    {
      index: '03',
      name: 'Drift',
      blurb: 'A self-hosted read-later service with full-text search and a clean reader mode. Runs on a $5 box.',
      tags: ['Go', 'SQLite', 'Full-text search'],
      year: '2024',
      href: 'https://github.com/',
    },
    {
      index: '04',
      name: 'Plumb',
      blurb: 'A tiny dependency-graph visualizer for monorepos. Drop it in CI, get a map of what actually changed.',
      tags: ['Node', 'D3', 'CLI'],
      year: '2023',
      href: 'https://github.com/',
    },
  ] as Project[],
}
