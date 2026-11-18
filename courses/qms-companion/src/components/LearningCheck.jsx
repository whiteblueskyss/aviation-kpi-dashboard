import { Chip } from './common';
import { DraftField } from './common';

export default function LearningCheck({ c, k, mi, state, pick, check, toggle }) {
  const key = mi + '-' + k;
  const r = state[key] || {};
  const n = k + 1;
  const head = (
    <p className="lc-label" id={'lc' + key}>
      Question {n} of 3 · {c.type}
    </p>
  );

  if (c.type === 'Short answer')
    return (
      <section className="lc-card" aria-labelledby={'lc' + key}>
        {head}
        <p className="lc-stem">{c.stem}</p>
        <label className="small" htmlFor={'lca' + key}>
          Your answer
        </label>
        <DraftField id={'lca' + key} draftId={'lc-' + key} rows={3} />
        <button type="button" className="btn" aria-expanded={!!r.show} onClick={() => toggle(key)}>
          {r.show ? 'Hide model answer' : 'Show model answer'}
        </button>
        {r.show && (
          <div className="lc-fb">
            <p>
              <b>Model answer</b>
            </p>
            <ul className="cmp-list">
              {c.modelRows.map((x, j) => (
                <li key={j}>
                  <b>{x[0]}</b> {x[1]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );

  const ok = r.sel === c.answer;
  const verdict = r.sel ? (ok ? 'Correct.' : 'Not quite.') : 'No answer selected.';
  return (
    <section className="lc-card" aria-labelledby={'lc' + key}>
      {head}
      <fieldset>
        <legend className="lc-stem">{c.stem}</legend>
        <div className="lc-opts">
          {c.options.map((o, j) => {
            const L = 'ABC'[j];
            const sel = r.sel === L;
            const cls = r.checked && L === c.answer ? ' right' : r.checked && sel ? ' wrong' : sel ? ' sel' : '';
            return (
              <label key={L} className={'lc-opt' + cls}>
                <input type="radio" name={'lc' + key} checked={sel} onChange={() => pick(key, L)} />
                <span>
                  <b>{L}.</b> {o}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <button type="button" className="btn" onClick={() => check(key)}>
        Check answer
      </button>
      {r.checked && (
        <div className="lc-fb" role="status">
          <p>
            <b className={ok ? 'good' : 'bad'}>{verdict}</b> · Correct answer:{' '}
            <b>
              {c.answer}. {c.options['ABC'.indexOf(c.answer)]}
            </b>
          </p>
          <p>{c.explain}</p>
        </div>
      )}
    </section>
  );
}
