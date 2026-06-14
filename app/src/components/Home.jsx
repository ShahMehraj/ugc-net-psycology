import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PAPERS, YEARS } from '../data/manifest.js'

export default function Home() {
  const navigate = useNavigate()
  const [year, setYear] = useState(YEARS[0])
  const [paperId, setPaperId] = useState(
    PAPERS.find((p) => p.year === YEARS[0] && p.status === 'available')?.id ||
      PAPERS.find((p) => p.year === YEARS[0])?.id,
  )

  const papersForYear = useMemo(() => PAPERS.filter((p) => p.year === year), [year])
  const selected = PAPERS.find((p) => p.id === paperId)
  const canStart = selected && selected.status === 'available'

  function onYearChange(y) {
    setYear(y)
    const first =
      PAPERS.find((p) => p.year === y && p.status === 'available') ||
      PAPERS.find((p) => p.year === y)
    setPaperId(first?.id)
  }

  function start(mode) {
    if (!canStart) return
    navigate(`/exam/${paperId}/${mode}`)
  }

  return (
    <div className="home">
      <header className="home-hero">
        <div className="brand">
          <svg className="brand-icon" viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="var(--navy)" />
            <g
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M32 18v30" />
              <path d="M32 20c-2-4-7-5-10-2-4-1-7 2-6 6-3 2-3 6 0 8-1 4 2 7 6 6 2 3 7 3 10 0" />
              <path d="M32 20c2-4 7-5 10-2 4-1 7 2 6 6 3 2 3 6 0 8 1 4-2 7-6 6-2 3-7 3-10 0" />
              <path d="M32 27c-2 1-4 1-5-1M32 35c-2-1-4-1-5 1M32 27c2 1 4 1 5-1M32 35c2-1 4-1 5 1" />
            </g>
          </svg>
          UGC&nbsp;NET Psychology
        </div>
        <h1>Previous-Year Question Practice</h1>
        <p className="tagline">
          Attempt real UGC&nbsp;NET Psychology papers in the official NTA style — learn with
          explanations in <strong>Practice mode</strong>, or take a timed{' '}
          <strong>CBT mock test</strong> with a detailed scorecard.
        </p>
      </header>

      <main className="home-main">
        <section className="selector-card">
          <div className="field">
            <label>1. Select Year</label>
            <div className="chip-row">
              {YEARS.map((y) => (
                <button
                  key={y}
                  className={`chip ${y === year ? 'chip-active' : ''}`}
                  onClick={() => onYearChange(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>2. Select Shift / Cycle</label>
            <div className="paper-grid">
              {papersForYear.map((p) => {
                const isAvail = p.status === 'available'
                return (
                  <button
                    key={p.id}
                    className={`paper-tile ${p.id === paperId ? 'tile-active' : ''} ${
                      isAvail ? '' : 'tile-disabled'
                    }`}
                    onClick={() => setPaperId(p.id)}
                  >
                    <div className="tile-head">
                      <span className="tile-title">{p.label}</span>
                      {isAvail ? (
                        <span className="badge badge-ok">Ready</span>
                      ) : (
                        <span className="badge badge-soon">Coming soon</span>
                      )}
                    </div>
                    <div className="tile-sub">{p.sublabel}</div>
                    <div className="tile-meta">
                      <span className="tile-date">
                        <span className="tile-date-icon">📅</span> {p.examDate}
                      </span>
                      {p.partsAvailable && (
                        <div className="tile-parts">
                          <span
                            className={`part-chip ${
                              p.partsAvailable.part2 ? 'part-on' : 'part-off'
                            }`}
                          >
                            {p.partsAvailable.part2 ? '✓' : '—'} Psychology
                          </span>
                          <span
                            className={`part-chip ${
                              p.partsAvailable.part1 ? 'part-on' : 'part-off'
                            }`}
                          >
                            {p.partsAvailable.part1 ? '✓' : '—'} Part-1
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            {selected?.note && (
              <p className="paper-note">
                <span className="paper-note-icon">ℹ️</span>
                <span className="paper-note-text">{selected.note}</span>
              </p>
            )}
          </div>

          <div className="field">
            <label>3. Choose Mode</label>
            <div className="mode-row">
              <div className="mode-card">
                <div className="mode-icon">📖</div>
                <h3>Practice Mode</h3>
                <p>
                  Answer is revealed with a detailed explanation as soon as you submit each
                  question. No timer. Learn as you go.
                </p>
                <button className="btn btn-secondary" disabled={!canStart} onClick={() => start('practice')}>
                  Start Practice
                </button>
              </div>
              <div className="mode-card mode-card-primary">
                <div className="mode-icon">⏱️</div>
                <h3>CBT Test Mode</h3>
                <p>
                  Full NTA-style timed test. Navigate freely, mark for review, and submit to get a
                  detailed scorecard with analysis.
                </p>
                <button className="btn btn-primary" disabled={!canStart} onClick={() => start('cbt')}>
                  Start CBT Test
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="info-strip">
          <div>
            <strong>+2</strong>
            <span>marks / correct</span>
          </div>
          <div>
            <strong>0</strong>
            <span>negative marking</span>
          </div>
          <div>
            <strong>150</strong>
            <span>questions (full paper)</span>
          </div>
          <div>
            <strong>180</strong>
            <span>minutes (CBT)</span>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>
          Questions sourced from published previous-year papers for educational practice. Answer
          keys are cross-checked but may contain errors — always verify with official UGC keys.
        </p>
      </footer>
    </div>
  )
}
