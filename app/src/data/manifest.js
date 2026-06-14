// Manifest of available papers shown on the home page.
// Each paper points to a loader for its question data (code-split via dynamic import).
//
// `partsAvailable` documents exactly which sections exist for the paper, so the UI
// can be honest about coverage (e.g. March 2023 has no Part-1 source anywhere).
//
// Source provenance:
//   - Psychology (Part 2): "UGC NET JRF Psychology" by Arvind Otta (Utsaah/UPS Education), 4th ed. 2023.
//   - Part 1 (General Aptitude): individual NTA question-paper PDFs (image-based, transcribed).
//   - Answer keys: Otta book key section, cross-verified against standard references where flagged.

export const PAPERS = [
  {
    id: '2023-june',
    year: 2023,
    cycle: 'June 2023',
    label: 'June 2023',
    sublabel: 'Full paper — General Aptitude + Psychology',
    examDate: '15 June 2023',
    status: 'available',
    partsAvailable: { part1: true, part2: true },
    note: 'Full 150-question paper: Part-1 General Aptitude (50 Qs, transcribed from the NTA paper) + Part-2 Psychology (100 Qs, from the Otta PYQ book). Some Part-1 answers are computed/derived and a few aptitude items are flagged as unverified (no official key).',
    load: () => import('./papers/2023-june.js').then((m) => m.default),
  },
  {
    id: '2023-march',
    year: 2023,
    cycle: 'March 2023',
    label: 'March 2023',
    sublabel: 'UGC NET Paper II (Psychology)',
    examDate: 'Feb–Mar 2023',
    status: 'coming-soon',
    partsAvailable: { part1: false, part2: false },
    note: 'Psychology questions exist in the source books; Part-1 General Aptitude has no available source for this shift.',
    load: null,
  },
  {
    id: '2023-december',
    year: 2023,
    cycle: 'December 2023',
    label: 'December 2023',
    sublabel: 'UGC NET Paper II (Psychology)',
    examDate: '14 December 2023',
    status: 'coming-soon',
    partsAvailable: { part1: true, part2: true },
    note: 'Full paper planned: Psychology from the Otta book + Part-1 transcribed from the individual NTA file.',
    load: null,
  },
]

export const YEARS = [...new Set(PAPERS.map((p) => p.year))].sort((a, b) => b - a)

export function getPaper(id) {
  return PAPERS.find((p) => p.id === id) || null
}
