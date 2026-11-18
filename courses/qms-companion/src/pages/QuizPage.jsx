import { QUIZ, answeredCount, attemptsLeft, fmt } from '../lib/quiz';

function StatusPanel({ q }) {
  const { record: r, selected, submitted, nav, startQuiz } = q;
  const left = attemptsLeft(r);
  let msg;
  if (r.passed)
    msg = (
      <p>
        <b className="good">Passed.</b> You reached the {QUIZ.threshold}% readiness threshold. Best score: {r.best.toFixed(1)}%.
      </p>
    );
  else if (left === 0)
    msg = (
      <p>
        <b className="bad">No attempts left.</b> Best score: {r.best.toFixed(1)}%. Please contact your lecturer, Dr. Bahtiyar Eren, before continuing.
      </p>
    );
  else
    msg = (
      <p>
        Attempts used:{' '}
        <b>
          {r.attempts} of {QUIZ.maxAttempts}
        </b>
        {r.attempts ? ` · Best score: ${r.best.toFixed(1)}%` : ''}
      </p>
    );
  return (
    <div className="panel">
      <h3>How the assessment works</h3>
      <ul className="small">
        <li>
          <b>{QUIZ.count} scored questions</b> per attempt: five per module, one for each learning objective. Later attempts use questions you have not seen yet.
        </li>
        <li>
          Pass mark: <b>{QUIZ.threshold}%</b>. You have at most <b>{QUIZ.maxAttempts} attempts</b>; an attempt counts once started.
        </li>
        <li>Question types: multiple choice, True/False, matching (partial credit for each correct pair) and fill-in-the-blank (capital letters and spaces are ignored).</li>
        <li>Written practice questions are separate and not scored.</li>
        <li>Allow about 25–30 minutes per attempt.</li>
      </ul>
      {msg}
      <div className="row">
        {!r.passed && left > 0 && !(selected.length && !submitted) && (
          <button className="btn primary" onClick={startQuiz}>
            Start attempt {r.attempts + 1} of {QUIZ.maxAttempts} →
          </button>
        )}
        <button className="btn" onClick={() => nav('practice')}>
          Written practice
        </button>
        <button className="btn" onClick={() => nav('before')}>
          Return to reading
        </button>
      </div>
    </div>
  );
}

function Item({ q, i, v, submitted, choose, chooseMatch, openModule }) {
  const dis = submitted;
  let body = null;
  if (q.type === 'MCQ' || q.type === 'True/False')
    body = q.choices.map((k) => (
      <label className="choice" key={k}>
        <input type="radio" name={'item' + i} value={k} checked={v === k} disabled={dis} onChange={() => choose(i, k)} />
        <span>{q.options[k]}</span>
      </label>
    ));
  if (q.type === 'Matching')
    body = (
      <>
        <p className="small">Choose a match for each item. One option in each list does not match anything.</p>
        {q.pairs.map((p, j) => (
          <div className="match-row" key={j}>
            <label htmlFor={`m${i}-${j}`}>{p[0]}</label>
            <select id={`m${i}-${j}`} disabled={dis} value={v && v[j] !== undefined ? String(v[j]) : ''} onChange={(e) => chooseMatch(i, j, e.target.value)}>
              <option value="">Select a match…</option>
              {q.rights.map((t, k) => (
                <option key={k} value={String(k)}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        ))}
      </>
    );
  if (q.type === 'Fill-in-the-blank')
    body = (
      <>
        <label className="small" htmlFor={'f' + i}>
          Your answer
        </label>
        <input className="fill" id={'f' + i} type="text" autoComplete="off" value={v || ''} disabled={dis} onChange={(e) => choose(i, e.target.value)} />
      </>
    );

  let detail = null;
  if (submitted) {
    const s = q.earned;
    const cls = s === 1 ? 'good' : s > 0 ? 'part' : 'bad';
    const lab = s === 1 ? 'Correct' : s > 0 ? 'Partly correct' : 'Not correct';
    let key = null;
    if (q.type === 'MCQ' || q.type === 'True/False')
      key = (
        <>
          Correct answer: {q.options[q.answer]}
          <p className="small">{q.feedback[q.answer]}</p>
          {v && v !== q.answer && (
            <p className="small">
              <b>Your choice:</b> {q.feedback[v]}
            </p>
          )}
        </>
      );
    if (q.type === 'Matching')
      key = (
        <>
          <ul className="small">
            {q.pairs.map((p, j) => {
              const ok = v && v[j] !== undefined && q.rights[v[j]] === p[1];
              return (
                <li key={j}>
                  {ok ? '✓' : '✗'} {p[0]} → <b>{p[1]}</b>
                </li>
              );
            })}
          </ul>
          <p className="small">{q.feedback}</p>
        </>
      );
    if (q.type === 'Fill-in-the-blank')
      key = (
        <>
          Accepted answer: <b>{q.answers[0]}</b>
          <p className="small">{q.feedback}</p>
        </>
      );
    detail = (
      <div className="feedback">
        <b className={cls}>{lab}</b> · {fmt(s)} of 1 point · {key}
        <p className="small">
          <b>Reference:</b> {q.source} · <b>Mapped objective:</b> {q.objective}
        </p>
        <button className="btn" onClick={() => openModule(q.module - 1, 1)}>
          Review Module {q.module}
        </button>
      </div>
    );
  }
  return (
    <div className="quest">
      <fieldset>
        <legend>
          <h4>
            {i + 1}. {q.question}
          </h4>
        </legend>
        <span className="small">
          Module {q.module} · {q.objective} · {q.level} · {q.type}
        </span>
        {body}
      </fieldset>
      {detail}
    </div>
  );
}

export default function QuizPage(q) {
  const { selected, responses, submitted, result: z, record, attempt } = q;
  const left = attemptsLeft(record);
  let result = null;
  if (submitted && z)
    result = (
      <div className="panel">
        <h3>Result · {z.passed ? 'Pass' : 'Review needed'}</h3>
        <div className="summary-grid">
          <div className="metric">
            <strong>
              {fmt(z.score)}/{selected.length}
            </strong>
            <span>Points</span>
          </div>
          <div className="metric">
            <strong>{z.percent.toFixed(1)}%</strong>
            <span>Your score</span>
          </div>
          <div className="metric">
            <strong>{QUIZ.threshold}%</strong>
            <span>Pass mark</span>
          </div>
        </div>
        <h3>Performance by module</h3>
        {[1, 2, 3, 4].map((m) => {
          const x = z.breakdown[m];
          if (!x) return null;
          const pct = (100 * x.score) / x.total;
          return (
            <div key={m}>
              <p className="small">
                <b>Module {m}:</b> {fmt(x.score)}/{x.total} ({pct.toFixed(0)}%)
              </p>
              <div className="meter" role="img" aria-label={`Module ${m}: ${pct.toFixed(0)} percent`}>
                <span style={{ width: pct + '%' }}></span>
              </div>
            </div>
          );
        })}
        <p>
          {z.passed
            ? 'You reached the readiness threshold.'
            : left > 0
            ? `Revisit the modules where you lost points, then use one of your ${left} remaining attempt${left > 1 ? 's' : ''}.`
            : 'You have used all attempts. Please contact your lecturer, Dr. Bahtiyar Eren.'}
        </p>
      </div>
    );
  return (
    <>
      <StatusPanel q={q} />
      {result}
      {selected.length > 0 && (
        <div className="panel">
          <div className="row">
            <h3>
              Assessment questions · Attempt {attempt} of {QUIZ.maxAttempts}
            </h3>
            <span id="progressText" className="small">
              {answeredCount(selected, responses)} of {selected.length} answered
            </span>
          </div>
          {selected.map((item, i) => (
            <Item key={item.id} q={item} i={i} v={responses[i]} submitted={submitted} choose={q.choose} chooseMatch={q.chooseMatch} openModule={q.openModule} />
          ))}
          <div className="row" style={{ marginTop: 16 }}>
            {!submitted && (
              <button className="btn primary" onClick={q.submitQuiz}>
                Submit assessment
              </button>
            )}
            <button className="btn" onClick={q.exitQuiz}>
              {submitted ? 'Close results' : 'Leave attempt'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
