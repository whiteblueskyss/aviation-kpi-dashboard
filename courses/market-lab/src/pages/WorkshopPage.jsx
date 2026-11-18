import { TASKS } from '../data/tasks';

export default function WorkshopPage() {
  return (
    <>
      <div className="eyebrow">09 / Lecturer’s analysis workshop</div>
      <h2>Use evidence. Explain your reasoning.</h2>
      <p className="subtitle">Five guided tasks · Suggested learning time: 20–33 minutes</p>
      <div className="note">Timings are flexible guides; take additional time where needed. Responses are not submitted or stored. Do not enter personal information. Copy your work before closing this page.</div>
      <div id="tasks">
        {TASKS.map((t, i) => (
          <article className="card task" key={i}>
            <div className="tasknum">TASK {i + 1} · {t[1]} MINUTES</div>
            <h3>{t[0]}</h3>
            <p>{t[2]}</p>
            <div className="note">
              <b>Evidence:</b> {t[3]}
            </div>
            <label htmlFor={'answer' + i} className="small">
              Your response (temporary; not submitted)
            </label>
            <textarea id={'answer' + i} placeholder="Use the evidence to explain your reasoning…"></textarea>
            <details>
              <summary>Hint</summary>
              <p>{t[4]}</p>
            </details>
            <details>
              <summary>Reveal model explanation</summary>
              <p>{t[5]}</p>
            </details>
            <p className="small">
              <b>Assessment criterion:</b> {t[6]}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
