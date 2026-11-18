import { useState } from 'react';
import { WRITTEN } from '../lib/quiz';
import { DraftField } from '../components/common';

function PracticeItem({ q, i }) {
  const [checked, setChecked] = useState({});
  const n = Object.values(checked).filter(Boolean).length;
  return (
    <div className="panel quest">
      <h3>
        Module {q.module} · {q.objective} · {q.level}
      </h3>
      <p>{q.question}</p>
      <label className="small" htmlFor={'w' + i}>
        Your answer
      </label>
      <DraftField id={'w' + i} draftId={'w-' + q.id} rows={5} style={{ width: '100%', boxSizing: 'border-box', padding: 8, font: 'inherit' }} />
      <details>
        <summary>Compare with the model answer</summary>
        <div className="feedback">
          <p>
            <b>Model answer.</b> {q.model_answer}
          </p>
          <p className="small">
            <b>Tick the points your answer covers:</b>
          </p>
          {q.marking_points.map((p, k) => (
            <label className="choice" key={k}>
              <input type="checkbox" checked={!!checked[k]} onChange={(e) => setChecked({ ...checked, [k]: e.target.checked })} />
              <span>{p}</span>
            </label>
          ))}
          <p className="small" id={'tally' + i}>
            {n} of {q.marking_points.length} points covered
          </p>
          <p className="small">
            {q.accept_note || ''} <b>Reference:</b> {q.source}
          </p>
        </div>
      </details>
    </div>
  );
}

export default function PracticePage() {
  return (
    <>
      <div className="panel">
        <p>
          These written questions practise applying and analysing what you studied. They are <b>not scored</b>. Write your answer, then compare it with the model answer and tick the points you covered.
        </p>
      </div>
      {WRITTEN.map((q, i) => (
        <PracticeItem key={q.id} q={q} i={i} />
      ))}
    </>
  );
}
