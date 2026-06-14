import { useMemo } from 'react'
import QuestionBody from './QuestionBody.jsx'

const OPT = ['A', 'B', 'C', 'D', 'E', 'F']

export default function Scorecard({ paper, answers, timeSpentSec, onRetake, onHome }) {
  const stats = useMemo(() => computeStats(paper, answers), [paper, answers])

  return (
    <div className="scorecard">
      <header className="sc-header">
        <h1>Test Result — {paper.title}</h1>
        <p className="sc-sub">{paper.paperLabel}</p>
      </header>

      <section className="sc-score-hero">
        <div className="score-ring" style={{ '--pct': stats.percentObtained }}>
          <div className="ring-inner">
            <span className="score-big">{stats.marksObtained}</span>
            <span className="score-small">/ {stats.maxMarks}</span>
          </div>
        </div>
        <div className="score-headline">
          <div className="headline-pct">{stats.percentObtained.toFixed(1)}%</div>
          <div className="headline-label">Marks obtained</div>
          <div className="time-spent">⏱️ Time used: {fmtTime(timeSpentSec)}</div>
        </div>
      </section>

      <section className="sc-grid">
        <Stat label="Correct" value={stats.correct} cls="ok" />
        <Stat label="Incorrect" value={stats.incorrect} cls="bad" />
        <Stat label="Unattempted" value={stats.unattempted} cls="muted" />
        <Stat label="Attempted" value={stats.attempted} cls="info" />
        <Stat label="Accuracy" value={`${stats.accuracy.toFixed(1)}%`} cls="info" />
        <Stat label="Excluded*" value={stats.excluded} cls="muted" />
      </section>

      <p className="sc-note">
        * {stats.excluded} question(s) were dropped/keyless in the official source and are excluded
        from scoring. Scoring: +{paper.marksPerQuestion} per correct, {paper.negativeMark === 0 ? 'no' : `-${paper.negativeMark}`} negative marking.
      </p>

      <div className="sc-actions">
        <button className="btn btn-secondary" onClick={onRetake}>Retake Test</button>
        <button className="btn btn-primary" onClick={onHome}>Back to Home</button>
      </div>

      <section className="sc-review">
        <h2>Detailed Solutions</h2>
        {paper.questions.map((q, idx) => {
          const userIdx = answers[q.id]
          const excluded = q.answer == null
          const isCorrect = !excluded && userIdx === q.answer
          const attempted = userIdx != null
          let stateCls = 'rev-unattempted'
          if (excluded) stateCls = 'rev-excluded'
          else if (isCorrect) stateCls = 'rev-correct'
          else if (attempted) stateCls = 'rev-wrong'

          return (
            <div key={q.id} className={`rev-card ${stateCls}`}>
              <div className="rev-top">
                <span className="rev-num">Q{idx + 1}</span>
                <span className="rev-tag">
                  {excluded ? (q.status === 'dropped' ? 'Dropped' : 'No official key') :
                    isCorrect ? 'Correct' : attempted ? 'Incorrect' : 'Unattempted'}
                </span>
              </div>
              <QuestionBody q={q} passage={q.passageId ? paper.passages[q.passageId] : null} />
              <ul className="rev-options">
                {q.options.map((opt, i) => {
                  const cls = [
                    'rev-opt',
                    !excluded && i === q.answer ? 'opt-correct' : '',
                    i === userIdx && i !== q.answer ? 'opt-chosen-wrong' : '',
                  ].join(' ')
                  return (
                    <li key={i} className={cls}>
                      <span className="opt-key">{OPT[i]}</span>
                      <span>{opt}</span>
                      {!excluded && i === q.answer && <span className="opt-flag">✓ Correct</span>}
                      {i === userIdx && i !== q.answer && <span className="opt-flag">Your choice</span>}
                    </li>
                  )
                })}
              </ul>
              {q.explanation ? (
                <div className="rev-explain">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              ) : (
                <div className="rev-explain rev-explain-empty">
                  Explanation will be added.
                </div>
              )}
              {q.verify && (
                <div className="rev-verify">⚠️ Answer not confirmed against an official key.</div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}

function Stat({ label, value, cls }) {
  return (
    <div className={`stat ${cls}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export function computeStats(paper, answers) {
  let correct = 0, incorrect = 0, unattempted = 0, excluded = 0
  for (const q of paper.questions) {
    if (q.answer == null) { excluded++; continue }
    const u = answers[q.id]
    if (u == null) unattempted++
    else if (u === q.answer) correct++
    else incorrect++
  }
  const scorable = paper.questions.length - excluded
  const attempted = correct + incorrect
  const marksObtained = correct * paper.marksPerQuestion - incorrect * paper.negativeMark
  const maxMarks = scorable * paper.marksPerQuestion
  const accuracy = attempted ? (correct / attempted) * 100 : 0
  const percentObtained = maxMarks ? (marksObtained / maxMarks) * 100 : 0
  return { correct, incorrect, unattempted, excluded, attempted, scorable, marksObtained, maxMarks, accuracy, percentObtained: Math.max(0, percentObtained) }
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  const h = Math.floor(m / 60)
  const mm = m % 60
  return h > 0 ? `${h}h ${mm}m ${s}s` : `${mm}m ${s}s`
}
