// Renders a question's stem plus any structured sub-parts:
//   - statements (A,B,C,…) for "choose the correct option" style
//   - matchA / matchB for "Match List I with List II"
//   - passage text (for comprehension sets)
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function QuestionBody({ q, passage }) {
  return (
    <div className="q-body">
      {passage && (
        <details className="passage" open>
          <summary>{passage.title}</summary>
          <pre className="passage-text">{passage.text}</pre>
        </details>
      )}

      <div className="q-stem">{renderMultiline(q.text)}</div>

      {q.statements && (
        <ol className="statement-list">
          {q.statements.map((s, i) => (
            <li key={i}>
              <span className="stmt-letter">({LETTERS[i]})</span> {s}
            </li>
          ))}
        </ol>
      )}

      {q.matchA && q.matchB && (
        <table className="match-table">
          <thead>
            <tr>
              <th>List I</th>
              <th>List II</th>
            </tr>
          </thead>
          <tbody>
            {q.matchA.map((a, i) => (
              <tr key={i}>
                <td>{a}</td>
                <td>{q.matchB[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function renderMultiline(text) {
  return String(text)
    .split('\n')
    .map((line, i) =>
      line.trim() === '' ? <br key={i} /> : <p key={i} className="stem-line">{line}</p>,
    )
}
