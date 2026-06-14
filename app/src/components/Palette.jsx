// NTA-style question palette: numbered grid with status colours.
// Paginated so the grid stays roughly as tall as the question box instead of
// running the full length of a 150-question paper.
import { useEffect, useState } from 'react'

const PAGE_SIZE = 50 // 10 rows × 5 cols per page

export default function Palette({ questions, current, answers, marked, onJump }) {
  const pageCount = Math.max(1, Math.ceil(questions.length / PAGE_SIZE))
  const [page, setPage] = useState(0)

  // Follow the current question so jumping (next/prev, palette on another page)
  // keeps the active question visible.
  useEffect(() => {
    setPage(Math.floor(current / PAGE_SIZE))
  }, [current])

  function statusClass(q, idx) {
    const answered = answers[q.id] != null
    const isMarked = marked.has(q.id)
    if (idx === current) return 'pal current'
    if (isMarked && answered) return 'pal answered-marked'
    if (isMarked) return 'pal marked'
    if (answered) return 'pal answered'
    return 'pal not-answered'
  }

  const start = page * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, questions.length)
  const pageQuestions = questions.slice(start, end)

  return (
    <div className="palette">
      <div className="palette-legend">
        <span><i className="dot answered" /> Answered</span>
        <span><i className="dot not-answered" /> Not answered</span>
        <span><i className="dot marked" /> Marked</span>
        <span><i className="dot answered-marked" /> Answered &amp; marked</span>
      </div>
      <div className="palette-grid">
        {pageQuestions.map((q, i) => {
          const idx = start + i
          return (
            <button key={q.id} className={statusClass(q, idx)} onClick={() => onJump(idx)}>
              {idx + 1}
            </button>
          )
        })}
      </div>
      {pageCount > 1 && (
        <div className="palette-pager">
          <button
            className="pager-btn"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous questions"
          >
            ‹
          </button>
          <span className="pager-label">
            {start + 1}–{end} of {questions.length}
          </span>
          <button
            className="pager-btn"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page === pageCount - 1}
            aria-label="Next questions"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
