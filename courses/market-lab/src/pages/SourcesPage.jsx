import { SOURCE_ROWS, downloadCsv } from '../lib/data';
import { fmt } from '../lib/format';

const HEADS = ['Market / indicator', 'Classification', 'Segment', 'Period / basis', 'RPK %', 'ASK %', 'PLF %', 'PLF Δ pp', 'Gap pp', '2024 share %', 'Other value', 'Source / status'];

export default function SourcesPage({ c }) {
  const { search, setSearch } = c;
  const q = search.toLowerCase().trim();
  const visible = SOURCE_ROWS.filter((r) => Object.values(r).join(' ').toLowerCase().includes(q));
  return (
    <>
      <div className="eyebrow">10 / Sources and data</div>
      <h2>Trace every comparison to its source</h2>
      <p>
        IATA Sustainability &amp; Economics. <i>Air Passenger Market Analysis — July 2025.</i> Published 29 August 2025. Primary source: the supplied five-page PDF.
      </p>
      <div className="sourcegrid">
        <div>
          <strong>Page 5</strong>
          <span>Detailed table: 42 period-specific records covering global segments, carrier regions and domestic markets.</span>
        </div>
        <div>
          <strong>Pages 3–4</strong>
          <span>15 deduplicated selected route areas. Only explicitly stated figures are used.</span>
        </div>
        <div>
          <strong>Pages 1–4</strong>
          <span>13 time/outlook indicators, plus narrative evidence and approximate contributions used in teaching notes.</span>
        </div>
      </div>
      <details open>
        <summary>Methods, limitations and source issue</summary>
        <p>Reported statistics combine a constant airline sample with estimates for missing observations; historical figures may be revised (p.5, Note 2). This is a snapshot of this publication, not a live database.</p>
        <p>The page-one heading “Slower growth momentum continued in June” conflicts with the July-focused paragraph below it. This dashboard follows the explicit July figures and records the heading as a likely editorial error.</p>
        <p>All shares are percentages of total industry RPK in 2024, including international regional shares. They are not shares within the international segment. PLF changes are reproduced as reported; calculations from rounded RPK and ASK growth can differ slightly. A reported 0.0 pp does not prove exact equality before rounding.</p>
        <p>Growth gap is calculated. Missing metrics are unavailable, not zero. No financial outcomes, causal estimates or exact growth contributions are inferred. Route areas and global totals must not be added together.</p>
      </details>
      <article className="card ai-disclosure" aria-labelledby="ai-disclosure-title">
        <h3 id="ai-disclosure-title">AI disclosure</h3>
        <p>
          AI assisted with the development of this educational dashboard, including its organisation, explanatory text and interactive features. The underlying data come from IATA’s Air Passenger Market Analysis — July 2025. AI-generated content may contain errors; lecturer review and academic judgement remain essential before classroom use. This is an independent educational resource and does not imply IATA endorsement.
        </p>
      </article>
      <details>
        <summary>Reuse and future updates</summary>
        <p>
          IATA is the underlying data source. This independent educational dashboard does not imply IATA endorsement. Source links:{' '}
          <a href="https://www.iata.org/monthly-traffic-statistics" target="_blank" rel="noopener">
            Monthly Statistics
          </a>{' '}
          ·{' '}
          <a href="https://www.iata.org/economics-terms" target="_blank" rel="noopener">
            Report terms
          </a>
          . External links require an internet connection.
        </p>
        <p>For future editions, validate extracted values, reporting periods, definitions and source references, then update the embedded dataset and associated teaching notes. This file does not automatically import reports or refresh statistics.</p>
      </details>
      <div className="controls">
        <label>
          Search all source records
          <input id="search" type="search" placeholder="Try Japan, route area, YTD…" style={{ padding: '9px 12px' }} value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <button className="primary" id="export" onClick={() => downloadCsv(visible)}>
          Export visible data as CSV
        </button>
        <button id="clearSearch" onClick={() => setSearch('')}>
          Clear search
        </button>
      </div>
      <p className="small" id="dataCount">{`${visible.length} of ${SOURCE_ROWS.length} records shown. CSV includes all metric fields, source, period and status; empty fields mean not available.`}</p>
      <div id="sourceTable">
        <div className="tablewrap">
          <table>
            <caption>Underlying data · horizontally scroll for additional fields</caption>
            <thead>
              <tr>
                {HEADS.map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => (
                <tr key={i}>
                  <td>{r.indicator || r.name}</td>
                  <td>{r.classification}</td>
                  <td>{r.segment}</td>
                  <td>
                    {r.period} · {r.basis}
                  </td>
                  <td>{fmt(r.rpk)}</td>
                  <td>{fmt(r.ask)}</td>
                  <td>{fmt(r.plf)}</td>
                  <td>{fmt(r.plf_change_pp)}</td>
                  <td>{fmt(r.growth_gap_pp)}</td>
                  <td>{fmt(r.world_share_pct)}</td>
                  <td>{r.value == null ? 'Not available in this report' : fmt(r.value) + ' ' + r.unit}</td>
                  <td>
                    {r.source}
                    <br />
                    {r.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
