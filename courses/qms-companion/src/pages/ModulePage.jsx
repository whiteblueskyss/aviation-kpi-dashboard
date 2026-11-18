import { useLayoutEffect, useRef } from 'react';
import { MODULES } from '../data/modules';
import { STAGES, minsLeft } from '../lib/constants';
import { esc, styleApp, stylePractice, teaser } from '../lib/html';
import { saveDraft } from '../lib/storage';
import { Chip, DraftField, RawHtml } from '../components/common';
import SlidesCard, { slidesHref } from '../components/SlidesCard';
import LearningCheck from '../components/LearningCheck';

function StartStage({ m, i }) {
  return (
    <>
      <h3>Start · What do you think?</h3>
      <div className="lo-box">
        <p>
          <b>By the end of this module you can</b>
        </p>
        <ol>
          {m.objectives.map((x, k) => (
            <li key={k}>{x}</li>
          ))}
        </ol>
      </div>
      <SlidesCard i={i} />
      <div className="turn-box">
        <Chip cls="turn">Your turn</Chip>
        <p>{m.opening}</p>
        {i === 0 ? (
          <ol>
            <li>What can you tell the customer about this part?</li>
            <li>What else would you want to know before saying the workshop usually does good repair work?</li>
          </ol>
        ) : (
          <p>Write your initial judgement and one reason. Keep it for the final reflection.</p>
        )}
        <label className="small" htmlFor={'open' + i}>
          Your answer
        </label>
        <DraftField id={'open' + i} draftId={'open-' + i} rows={3} />
        {i === 0 && (
          <details>
            <summary>After you try: see one possible answer</summary>
            <ul className="cmp-list">
              <li>
                <b>Question 1:</b> This part passed the test after repair.
              </li>
              <li>
                <b>Question 2:</b> I would also want to see results for other parts the workshop repaired.
              </li>
            </ul>
          </details>
        )}
      </div>
    </>
  );
}

function ReadStage({ m, i, openSec, toggleSec }) {
  return (
    <>
      <h3>Read · five short sections</h3>
      <p className="small">Open one section at a time. Each takes two to three minutes.</p>
      <div className="acc">
        {m.sections.map((x, j) => {
          const open = openSec === j;
          return (
            <div key={j} className={'acc-item' + (open ? ' open' : '')} id={'sec-' + j}>
              <button className="acc-head" aria-expanded={open} onClick={() => toggleSec(j)}>
                <span className="acc-num">
                  {i + 1}.{j + 1}
                </span>
                <span className="acc-text">
                  <span className="acc-title">{x[0]}</span>
                  {!open && <span className="acc-teaser">{teaser(x[1])}</span>}
                </span>
                <span className="acc-icon" aria-hidden="true">
                  {open ? '−' : '+'}
                </span>
              </button>
              {open && (
                <div className="acc-body">
                  <Chip cls="concept">Concept</Chip>
                  <RawHtml html={styleApp(x[1])} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

const PractiseStage = ({ m }) => (
  <>
    <h3>Practise · work through the case</h3>
    <RawHtml className="practise" html={stylePractice(m.reading)} />
  </>
);

const SourceStage = ({ m }) => (
  <>
    <h3>Source · guided reading</h3>
    <a className="source-card" target="_blank" rel="noopener" href={m.source[1]}>
      <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#112e54" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h11l5 5v11H4z"></path>
        <path d="M15 4v5h5"></path>
        <path d="M8 13h8M8 17h6"></path>
      </svg>
      <span>
        <b>{m.source[0]}</b>
        <span className="small" style={{ display: 'block' }}>
          Free reading · opens in a new tab · about 8 minutes
        </span>
      </span>
    </a>
    <div className="turn-box">
      <Chip cls="turn">Your turn</Chip>
      <p>{m.guide}</p>
    </div>
  </>
);

function ApplyStage({ m }) {
  const formRef = useRef(null);
  // The form's inner markup is author-written HTML (fields, evidence tables),
  // so it is rendered raw and wired up here, exactly like the original page.
  const html = `<p>${esc(m.prompt)}</p>${m.fields}<p class="small">Try each part first, then compare your reasoning with the model.</p><button type="submit" class="btn">Compare your reasoning</button><div class="model" hidden><b>Model reasoning</b><div>${m.model}</div><p>Other answers can be supported by the evidence. Compare the limits of your conclusion with this example.</p></div>`;
  useLayoutEffect(() => {
    const form = formRef.current;
    const onSubmit = (e) => {
      e.preventDefault();
      form.querySelector('.model').hidden = false;
    };
    const onInput = (e) => {
      const f = e.target;
      if (f.dataset && f.dataset.answer) saveDraft(f.dataset.answer, f.value);
    };
    form.addEventListener('submit', onSubmit);
    form.addEventListener('input', onInput);
    return () => {
      form.removeEventListener('submit', onSubmit);
      form.removeEventListener('input', onInput);
    };
  }, []);
  return (
    <>
      <h3>Apply · {m.appliedTitle}</h3>
      <RawHtml as="form" ref={formRef} className="applied cards" noValidate html={html} />
    </>
  );
}

function CheckStage({ m, i, lc, goSources }) {
  return (
    <>
      <h3>Check · learning check and reflection</h3>
      <RawHtml
        className="summary-box"
        html={`<p><b>Module summary · ${esc(m.summaryTitle)}</b></p>${m.summaryHtml}`}
      />
      <h4 className="lc-head">Learning check</h4>
      <p className="small">Three self-check questions. They are not scored and do not count towards the readiness assessment.</p>
      {m.checkItems.map((c, k) => (
        <LearningCheck key={k} c={c} k={k} mi={i} state={lc.state} pick={lc.pick} check={lc.check} toggle={lc.toggle} />
      ))}
      <div className="turn-box">
        <Chip cls="turn">Reflect</Chip>
        <p>
          {i === 0
            ? 'Revisit your first two answers. Which part relates to quality control? What evidence about the workshop’s testing process would give you quality assurance?'
            : 'Revisit your opening answer. Which piece of evidence would you add or which claim would you narrow?'}
        </p>
      </div>
      {i === 3 && (
        <div className="turn-box">
          <Chip cls="turn">Final reflection across all four modules</Chip>
          <p>For the outdated task card, identify one quality control, one measure, one evidence request and one piece of feedback for the reporter.</p>
          <details>
            <summary>Compare your final reflection</summary>
            <ul className="cmp-list">
              <li>
                <b>Quality control:</b> Check the retrieved revision against the master.
              </li>
              <li>
                <b>Measure:</b> The share of sampled retrievals that are current.
              </li>
              <li>
                <b>Evidence request:</b> Dated access evidence for the workstation.
              </li>
              <li>
                <b>Feedback to the reporter:</b> What the team changed and when it will check again.
              </li>
            </ul>
          </details>
        </div>
      )}
      <p className="end-links">
        <a href={slidesHref(i)} download>
          Module {i + 1} slides (PDF) ↓
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goSources(i);
          }}
        >
          Sources for this module →
        </a>
      </p>
    </>
  );
}

export default function ModulePage({ mod: i, stage: si, progress, openSec, toggleSec, goStage, finishModule, nav, goSources, lc }) {
  const m = MODULES[i];
  const done = progress.done[i] || [];
  const pct = Math.round((100 * (si + 1)) / 6);
  const label = `Stage ${si + 1} of 6 · about ${minsLeft(si)} min left`;
  let body;
  if (si === 0) body = <StartStage m={m} i={i} />;
  else if (si === 1) body = <ReadStage m={m} i={i} openSec={openSec} toggleSec={toggleSec} />;
  else if (si === 2) body = <PractiseStage m={m} />;
  else if (si === 3) body = <SourceStage m={m} />;
  else if (si === 4) body = <ApplyStage m={m} key={i} />;
  else body = <CheckStage m={m} i={i} lc={lc} goSources={goSources} />;
  return (
    <>
      <div className="mod-top">
        <button className="linkbtn" onClick={() => nav('before')}>
          ← All modules
        </button>
        <span className="save-chip">Your progress is saved in this browser</span>
      </div>
      <ol className="stepper" aria-label="Module stages">
        {STAGES.map((s, k) => {
          const cur = k === si;
          const dn = done.includes(k) && !cur;
          return (
            <li key={k}>
              <button className={'step' + (cur ? ' cur' : '') + (dn ? ' done' : '')} onClick={() => goStage(k)} aria-current={cur ? 'step' : undefined}>
                <span className="step-dot" aria-hidden="true">
                  {dn ? '✓' : k + 1}
                </span>
                <span className="step-label">{s[0]}</span>
                <span className="step-min">{s[1]} min</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="prog">
        <div className="prog-bar" role="img" aria-label={label}>
          <span style={{ width: pct + '%' }}></span>
        </div>
        <span className="small">{label}</span>
      </div>
      <div className="stage-col reading">{body}</div>
      <div className="stage-nav">
        <button className="btn" onClick={() => goStage(si - 1)} disabled={si === 0}>
          ← Back
        </button>
        {si < 5 ? (
          <button className="btn primary" onClick={() => goStage(si + 1)}>
            Next: {STAGES[si + 1][0]} →
          </button>
        ) : (
          <button className="btn primary" onClick={finishModule}>
            {i < 3 ? `Finish · go to Module ${i + 2} →` : 'Finish · open the readiness assessment →'}
          </button>
        )}
      </div>
    </>
  );
}
