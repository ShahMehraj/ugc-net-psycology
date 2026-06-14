// Renders a question's stem plus any structured sub-parts:
//   - statements (A,B,C,…) for "choose the correct option" style
//   - matchA / matchB for "Match List I with List II"
//   - passage text (for comprehension sets)
//
// Free text (stem + passage) may embed a Markdown-style pipe table, e.g.
//   | Village | Children % | Attending % |
//   | ------- | ---------- | ----------- |
//   | V1      | 16         | 15          |
// Such blocks are rendered as real <table>s; everything else stays as text.
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function QuestionBody({ q, passage }) {
  return (
    <div className="q-body">
      {passage && (
        <details className="passage" open>
          <summary>{passage.title}</summary>
          <div className="passage-text">{renderRichText(passage.text)}</div>
        </details>
      )}

      <div className="q-stem">{renderRichText(q.text)}</div>

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

// A line is a table row if it contains a pipe and (ignoring leading/trailing
// pipes) splits into 2+ cells.
function isTableRow(line) {
  const t = line.trim()
  if (!t.includes('|')) return false
  return splitRow(t).length >= 2
}

// A separator row is the Markdown header underline: | --- | :--: | etc.
function isSeparatorRow(line) {
  return splitRow(line.trim()).every((c) => /^:?-{2,}:?$/.test(c.replace(/\s/g, '')))
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

// Splits free text into a sequence of {type:'table', rows} and {type:'lines', lines}
// blocks, preserving original order, then renders each.
function renderRichText(text) {
  const lines = String(text).split('\n')
  const blocks = []
  let buf = []

  const flushText = () => {
    if (buf.length) {
      blocks.push({ type: 'lines', lines: buf })
      buf = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    if (isTableRow(lines[i])) {
      // Greedily consume the contiguous run of table rows.
      const rows = []
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(lines[i])
        i++
      }
      i-- // step back; for-loop will advance
      // Need at least a header + one body row to be a real table.
      const bodyRows = rows.filter((r) => !isSeparatorRow(r))
      if (bodyRows.length >= 2) {
        flushText()
        blocks.push({ type: 'table', rows: bodyRows.map(splitRow) })
        continue
      }
      // Not enough rows to be a table — treat as plain text.
      buf.push(...rows)
    } else {
      buf.push(lines[i])
    }
  }
  flushText()

  return blocks.map((b, i) =>
    b.type === 'table' ? renderTable(b.rows, i) : renderLines(b.lines, i),
  )
}

function renderTable(rows, key) {
  const [head, ...body] = rows
  const cols = Math.max(...rows.map((r) => r.length))
  const pad = (r) => [...r, ...Array(cols - r.length).fill('')]
  return (
    <table className="data-table" key={`t${key}`}>
      <thead>
        <tr>
          {pad(head).map((c, j) => (
            <th key={j}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((r, ri) => (
          <tr key={ri}>
            {pad(r).map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function renderLines(lines, key) {
  return (
    <div key={`l${key}`}>
      {lines.map((line, i) =>
        line.trim() === '' ? (
          <br key={i} />
        ) : (
          <p key={i} className="stem-line">
            {line}
          </p>
        ),
      )}
    </div>
  )
}
