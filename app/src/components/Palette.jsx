// NTA-style question palette: numbered grid with status colours.
export default function Palette({ questions, current, answers, marked, onJump }) {
  function statusClass(q, idx) {
    const answered = answers[q.id] != null
    const isMarked = marked.has(q.id)
    if (idx === current) return 'pal current'
    if (isMarked && answered) return 'pal answered-marked'
    if (isMarked) return 'pal marked'
    if (answered) return 'pal answered'
    return 'pal not-answered'
  }

  return (
    <div className="palette">
      <div className="palette-legend">
        <span><i className="dot answered" /> Answered</span>
        <span><i className="dot not-answered" /> Not answered</span>
        <span><i className="dot marked" /> Marked</span>
        <span><i className="dot answered-marked" /> Answered &amp; marked</span>
      </div>
      <div className="palette-grid">
        {questions.map((q, idx) => (
          <button key={q.id} className={statusClass(q, idx)} onClick={() => onJump(idx)}>
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
