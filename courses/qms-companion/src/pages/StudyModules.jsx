import { MODULES } from '../data/modules';
import { STAGES, minsLeft } from '../lib/constants';
import { QUIZ } from '../lib/quiz';

export default function StudyModules({ progress, record, openModule, nav }) {
  const last = progress.last;
  const doneCount = (mi) => (progress.done[mi] || []).length;
  return (
    <>
      <p className="study-time">
        <strong>Four modules · 45 minutes each · 3 hours total</strong>
      </p>
      <p>Select a module to begin. Each module has six short stages; your progress is saved in this browser.</p>
      {last && MODULES[last.mod] && (
        <div className="continue-box">
          <div>
            <p className="small" style={{ margin: 0 }}>
              Continue where you left off
            </p>
            <p style={{ margin: '2px 0 0' }}>
              <b>
                Module {last.mod + 1} · {STAGES[last.stage][0]} · about {minsLeft(last.stage)} min left
              </b>
            </p>
          </div>
          <button className="btn primary" onClick={() => openModule(last.mod, last.stage)}>
            Continue →
          </button>
        </div>
      )}
      <div className="mod-list">
        {MODULES.map((m, i) => {
          const n = doneCount(i);
          const pct = Math.round((100 * n) / 6);
          const status = n === 6 ? 'Completed' : n ? `In progress · ${n} of 6 stages` : 'Not started · 6 stages';
          return (
            <button
              key={i}
              className={'mod-card' + (n === 6 ? ' done' : '')}
              onClick={() => openModule(i, n > 0 && n < 6 && last && last.mod === i ? last.stage : 0)}
            >
              <span className="mod-num" aria-hidden="true">
                {n === 6 ? '✓' : i + 1}
              </span>
              <span className="mod-text">
                <span className="mod-title">
                  Module {i + 1} · {m.title}
                </span>
                <span className="mod-status">
                  {n > 0 && n < 6 && (
                    <span className="mini-bar" role="img" aria-label={`${n} of 6 stages done`}>
                      <span style={{ width: pct + '%' }}></span>
                    </span>
                  )}
                  {status}
                </span>
              </span>
              <span className="mod-mins">45 min</span>
            </button>
          );
        })}
      </div>
      <div className="panel assess-box">
        <div>
          <h3 style={{ margin: 0 }}>Readiness assessment</h3>
          <p className="small" style={{ margin: '4px 0 0' }}>
            {QUIZ.count} scored questions · pass mark {QUIZ.threshold}% · {QUIZ.maxAttempts} attempts ·{' '}
            {record.passed ? 'passed' : record.attempts + ' used'}
          </p>
        </div>
        <button className="btn" onClick={() => nav('quiz')}>
          Open assessment →
        </button>
      </div>
    </>
  );
}
