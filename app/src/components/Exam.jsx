import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPaper } from '../data/manifest.js'
import QuestionBody from './QuestionBody.jsx'
import Palette from './Palette.jsx'
import Scorecard from './Scorecard.jsx'

const OPT = ['A', 'B', 'C', 'D', 'E', 'F']

export default function Exam() {
  const { paperId, mode } = useParams()
  const navigate = useNavigate()
  const meta = getPaper(paperId)

  const [paper, setPaper] = useState(null)
  const [loadError, setLoadError] = useState(null)

  // exam state
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})        // { [qid]: optionIndex }
  const [marked, setMarked] = useState(new Set())   // set of qid marked for review
  const [revealed, setRevealed] = useState(new Set()) // practice mode: qids whose answer is shown
  const [submitted, setSubmitted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showPaletteMobile, setShowPaletteMobile] = useState(false)
  const startRef = useRef(null)

  // load paper data
  useEffect(() => {
    let alive = true
    if (!meta || !meta.load) { setLoadError('This paper is not available yet.'); return }
    meta.load().then((data) => { if (alive) setPaper(data) }).catch(() => {
      if (alive) setLoadError('Failed to load this paper.')
    })
    return () => { alive = false }
  }, [meta])

  // timer (CBT only)
  useEffect(() => {
    if (!paper || mode !== 'cbt' || submitted) return
    if (secondsLeft == null) {
      setSecondsLeft(paper.durationMinutes * 60)
      startRef.current = Date.now()
      return
    }
    if (secondsLeft <= 0) { handleSubmit(); return }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [paper, mode, secondsLeft, submitted])

  const questions = paper?.questions || []
  const q = questions[current]
  const passage = q?.passageId ? paper.passages[q.passageId] : null
  const isPractice = mode === 'practice'
  // Section label for the current question (sections are defined by display-number ranges).
  const currentSection = paper?.sections?.find(
    (s) => current + 1 >= s.range[0] && current + 1 <= s.range[1],
  )

  const progress = useMemo(() => {
    const answered = Object.keys(answers).length
    return { answered, total: questions.length }
  }, [answers, questions.length])

  if (loadError) {
    return (
      <div className="exam-error">
        <h2>{loadError}</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    )
  }
  if (!paper) return <div className="loading">Loading paper…</div>

  if (submitted) {
    return (
      <Scorecard
        paper={paper}
        answers={answers}
        timeSpentSec={timeSpent}
        onRetake={() => window.location.reload()}
        onHome={() => navigate('/')}
      />
    )
  }

  function choose(optIdx) {
    if (isPractice && revealed.has(q.id)) return // locked after reveal
    setAnswers((a) => ({ ...a, [q.id]: optIdx }))
  }

  function toggleMark() {
    setMarked((m) => {
      const n = new Set(m)
      n.has(q.id) ? n.delete(q.id) : n.add(q.id)
      return n
    })
  }

  function goNext() {
    if (isPractice && answers[q.id] != null && !revealed.has(q.id)) {
      // first click reveals answer; advancing happens on the next click
      setRevealed((r) => new Set(r).add(q.id))
      return
    }
    if (current < questions.length - 1) setCurrent((c) => c + 1)
  }

  function goPrev() {
    if (current > 0) setCurrent((c) => c - 1)
  }

  function jump(idx) {
    setCurrent(idx)
    setShowPaletteMobile(false)
  }

  function handleSubmit() {
    const used = mode === 'cbt' && startRef.current
      ? Math.round((Date.now() - startRef.current) / 1000)
      : 0
    setTimeSpent(used)
    setSubmitted(true)
  }

  const showReveal = isPractice && revealed.has(q.id)
  const userIdx = answers[q.id]

  return (
    <div className="exam">
      <header className="exam-bar">
        <button className="link-btn" onClick={() => { if (confirm('Quit this attempt? Progress will be lost.')) navigate('/') }}>
          ← Exit
        </button>
        <div className="exam-title">
          {paper.title} <span className="mode-pill">{isPractice ? 'Practice' : 'CBT'}</span>
        </div>
        {mode === 'cbt' && secondsLeft != null && (
          <div className={`timer ${secondsLeft < 300 ? 'timer-low' : ''}`}>
            ⏱️ {fmtClock(secondsLeft)}
          </div>
        )}
        {isPractice && <div className="practice-progress">{progress.answered}/{progress.total} answered</div>}
      </header>

      <div className="exam-layout">
        <main className="question-pane">
          {currentSection && <div className="section-banner">{currentSection.name}</div>}
          <div className="q-meta-row">
            <span className="q-number">Question {current + 1} <span className="q-of">of {questions.length}</span></span>
            <div className="q-actions">
              <span className="q-marks">+{paper.marksPerQuestion} · {paper.negativeMark ? `-${paper.negativeMark}` : 'no negative'}</span>
            </div>
          </div>

          <QuestionBody q={q} passage={passage} />

          {q.answer == null && (
            <div className="excluded-banner">
              ⚠️ This question was {q.status === 'dropped' ? 'dropped by NTA' : 'published without a definitive answer key'} and is not scored.
            </div>
          )}

          <ul className="options">
            {q.options.map((opt, i) => {
              const chosen = userIdx === i
              let cls = 'option'
              if (showReveal) {
                if (i === q.answer) cls += ' option-correct'
                else if (chosen) cls += ' option-wrong'
              } else if (chosen) cls += ' option-selected'
              return (
                <li key={i}>
                  <button className={cls} onClick={() => choose(i)} disabled={showReveal}>
                    <span className="option-key">{OPT[i]}</span>
                    <span className="option-text">{opt}</span>
                    {showReveal && i === q.answer && <span className="option-mark">✓</span>}
                    {showReveal && chosen && i !== q.answer && <span className="option-mark">✗</span>}
                  </button>
                </li>
              )
            })}
          </ul>

          {showReveal && (
            <div className={`practice-feedback ${userIdx === q.answer ? 'fb-correct' : 'fb-wrong'}`}>
              <div className="fb-head">
                {userIdx === q.answer ? '✓ Correct!' : `✗ Incorrect — correct answer is ${OPT[q.answer]}`}
              </div>
              {q.explanation ? (
                <p className="fb-explain"><strong>Why:</strong> {q.explanation}</p>
              ) : (
                <p className="fb-explain fb-explain-empty">Detailed explanation coming soon.</p>
              )}
              {q.verify && (
                <p className="fb-verify">⚠️ This answer is our best determination but is not confirmed against an official key — treat with caution.</p>
              )}
            </div>
          )}

          <div className="nav-row">
            <button className="btn btn-ghost" onClick={goPrev} disabled={current === 0}>← Previous</button>
            <button className="btn btn-ghost" onClick={toggleMark}>
              {marked.has(q.id) ? '★ Unmark' : '☆ Mark for review'}
            </button>
            {isPractice && answers[q.id] != null && !revealed.has(q.id) ? (
              <button className="btn btn-primary" onClick={goNext}>Submit answer</button>
            ) : current < questions.length - 1 ? (
              <button className="btn btn-primary" onClick={goNext}>Next →</button>
            ) : (
              <button className="btn btn-submit" onClick={() => { if (confirm('Submit the test now?')) handleSubmit() }}>
                Submit Test
              </button>
            )}
          </div>
        </main>

        <aside className={`palette-pane ${showPaletteMobile ? 'open' : ''}`}>
          <Palette
            questions={questions}
            current={current}
            answers={answers}
            marked={marked}
            onJump={jump}
          />
          <button className="btn btn-submit full" onClick={() => { if (confirm('Submit the test now?')) handleSubmit() }}>
            Submit Test
          </button>
        </aside>
      </div>

      <button className="palette-toggle" onClick={() => setShowPaletteMobile((v) => !v)}>
        {showPaletteMobile ? 'Close' : 'Questions'} ▾
      </button>
    </div>
  )
}

function fmtClock(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}
