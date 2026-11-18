import { SOURCE_GROUPS } from '../data/sources';

const FILTERS = ['All', 'M1', 'M2', 'M3', 'M4'];

export default function SourcesPage({ srcFilter: f, setSrcFilter }) {
  let count = 0;
  const groups = SOURCE_GROUPS.map((g) => {
    const items = g.items.filter((e) => f === 'All' || e.tags.includes(f));
    count += items.length;
    if (!items.length) return null;
    return (
      <div key={g.title} style={{ display: 'contents' }}>
        <h4 className="src-group">{g.title}</h4>
        {g.note && <p className="small src-gnote">{g.note}</p>}
        <ul className="src-list">
          {items.map((e, k) => (
            <li key={k}>
              <p className="apa">
                {e.pre}
                <i>{e.title}</i>
                {e.post}{' '}
                <a href={e.url} target="_blank" rel="noopener">
                  {e.url}
                </a>{' '}
                <span className="src-inline">
                  {e.tags.map((t) => (
                    <span className="src-tag" key={t}>
                      {t}
                    </span>
                  ))}
                  {e.guided && (
                    <span className="chip turn" style={{ margin: 0 }}>
                      Guided reading · {e.guided}
                    </span>
                  )}
                </span>
              </p>
              {e.note && <p className="small src-note">{e.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    );
  });
  return (
    <>
      <section className="ai-box" aria-labelledby="ai-h">
        <h3 id="ai-h">AI disclosure</h3>
        <p>
          Prepared by Dr. Bahtiyar Eren. AI tools assisted with drafting and organising the study text, assessment questions and slides, and with an independent check of content and sources. The lecturer reviewed the content, and assessment questions are validated by the lecturer before use. Classroom cases and figures are illustrative; the NTSB investigation and the regulations are real and cited below.
        </p>
        <p className="small" style={{ margin: 0 }}>
          Version: November 2026
        </p>
      </section>
      <div className="src-head">
        <h3>References</h3>
        <div className="src-filters" role="group" aria-label="Show references for">
          {FILTERS.map((k) => (
            <button key={k} type="button" className={'src-filter' + (f === k ? ' on' : '')} aria-pressed={f === k} onClick={() => setSrcFilter(k)}>
              {k === 'All' ? 'All modules' : 'Module ' + k.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <p className="small">
        APA 7th edition. <b>Guided reading</b> marks the source each module asks you to read. {count} {count === 1 ? 'source' : 'sources'} shown.
      </p>
      <div className="src-wrap">{groups}</div>
    </>
  );
}
