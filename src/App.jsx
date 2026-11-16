import { useEffect, useMemo, useState } from 'react';
import { loadData } from './data/loadData.js';
import {
  DEFAULT_FILTERS,
  makeContext,
  evaluateAll,
  monthlySeries,
  statusSummary,
} from './kpi/engine.js';
import { METRICS, METRIC_BY_ID, GROUPS, OVERVIEW_IDS } from './kpi/metrics.js';
import FilterBar from './components/FilterBar.jsx';
import KpiCard from './components/KpiCard.jsx';
import CompareTable from './components/CompareTable.jsx';
import Explainer from './components/Explainer.jsx';
import TrendChart from './components/TrendChart.jsx';
import DataPage from './components/DataPage.jsx';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  ...GROUPS.map((g) => ({ id: g.id, label: g.label })),
  { id: 'data', label: 'Definitions & data' },
];

const DISCUSSION = {
  overview: [
    'Switch to Compare airlines. Which airline has the highest PLF, and does it also have the best operating profit? What does that tell you?',
    'Filter to one route that two airlines share (FRA–IST). Do the gaps between them get smaller or larger than on the full sample?',
    'Narrow the months to June–August and compare ASK, RPK and PLF with January–March.',
  ],
  Commercial: [
    'RASK = yield × PLF when only passenger revenue is counted. Use that to explain why an airline with a low yield can still have a healthy RASK.',
    'Compare CASK for sectors under 1,000 km with sectors of 1,000 km or more. Why is the short-sector figure higher?',
  ],
  Cargo: [
    'Why is cargo load factor usually lower than passenger load factor on passenger flights?',
    'Select Ryanair. Why is CLF shown as n/a rather than 0%?',
  ],
  Operations: [
    'Compare mean arrival delay with OTP for each airline. Can they point in different directions?',
    'Which airline has the shortest average turnaround, and what risk comes with a short turnaround?',
    'Check the cancellation and diversion rates. Why do they use different bases?',
  ],
  Baggage: [
    'Delayed bags are far more common than lost bags. What does that mean for how you read the mishandled baggage rate?',
    'Complaints are counted per 100,000 passengers. Why use a rate rather than a count?',
  ],
  Financial: [
    'Pick one airline and compare net profit with net cash flow. Can the two differ in sign?',
    'Move the To month filter. Which KPIs change with the period (flows) and which use only the last month (stocks)?',
  ],
  data: [],
};

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [section, setSection] = useState('overview');
  const [metricId, setMetricId] = useState('plf');

  useEffect(() => {
    let cancelled = false;
    loadData()
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const allCodes = useMemo(() => (data ? data.airlines.map((a) => a.code) : []), [data]);

  function update(patch) {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      if (next.fromMonth > next.toMonth) {
        if ('fromMonth' in patch) next.toMonth = next.fromMonth;
        else next.fromMonth = next.toMonth;
      }
      return next;
    });
  }

  function setMode(mode) {
    setFilters((prev) => {
      return { ...prev, mode, airlines: mode === 'single' ? [prev.airlines[0] || allCodes[0]] : allCodes };
    });
  }

  function toggleAirline(code) {
    setFilters((prev) => {
      let airlines;
      if (prev.mode === 'single') airlines = [code];
      else if (prev.airlines.includes(code)) airlines = prev.airlines.length > 1 ? prev.airlines.filter((c) => c !== code) : prev.airlines;
      else airlines = allCodes.filter((c) => c === code || prev.airlines.includes(c));
      return { ...prev, airlines };
    });
  }

  const ctx = useMemo(() => (data ? makeContext(data, filters) : null), [data, filters]);
  const results = useMemo(() => (ctx ? evaluateAll(ctx) : null), [ctx]);

  const metric = METRIC_BY_ID[metricId];
  const series = useMemo(() => {
    if (!data || !ctx) return [];
    return ctx.airlineCodes.map((code) => {
      const a = data.airlines.find((x) => x.code === code);
      return { code, name: a.name, color: a.color, points: monthlySeries(data, filters, metric, code) };
    });
  }, [data, ctx, filters, metric]);

  if (error) {
    return (
      <main className="state">
        <h1>Could not load the data</h1>
        <p>{error}</p>
        <p>Check that <code>public/data/CAM145_SYNTHETIC_all_data_2025.json</code> exists and reload the page.</p>
      </main>
    );
  }
  if (!data) {
    return (
      <main className="state" aria-busy="true">
        <h1>Aviation KPI Learning Dashboard</h1>
        <p>Loading the 2025 dataset…</p>
      </main>
    );
  }

  const status = statusSummary(ctx);
  const isGroup = section !== 'overview' && section !== 'data';
  const cardMetrics = section === 'overview'
    ? OVERVIEW_IDS.map((id) => METRIC_BY_ID[id])
    : METRICS.filter((m) => m.group === section);
  const sectionLabel = SECTIONS.find((s) => s.id === section).label;

  function pickSection(id) {
    setSection(id);
    if (id !== 'overview' && id !== 'data') {
      const first = METRICS.find((m) => m.group === id);
      if (first && METRIC_BY_ID[metricId].group !== id) setMetricId(first.id);
    }
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Sections">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">✈</span>
          <span>Aviation KPIs</span>
        </div>
        <nav>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={section === s.id ? 'on' : ''}
              aria-current={section === s.id ? 'page' : undefined}
              onClick={() => pickSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <p className="side-note">Real identities.<br />Synthetic measurements.<br /><br />12 months · 2025</p>
      </aside>

      <main className="content">
        <div className="banner" role="note">
          <strong>Educational simulation</strong> — real airline and airport identities; all performance and financial figures are synthetic and do not represent actual results.
        </div>

        <header className="page-head">
          <h1>{section === 'overview' ? 'Aviation KPI Learning Dashboard' : sectionLabel}</h1>
          <div className="head-right">
            <span className="muted-text">{data.airlines.length} airlines · {data.flights.length.toLocaleString('en-GB')} scheduled sectors · 2025</span>
            <button type="button" className="btn" onClick={() => window.print()}>Print current view</button>
          </div>
        </header>

        <FilterBar data={data} filters={filters} onChange={update} onMode={setMode} onToggleAirline={toggleAirline} onReset={() => setFilters(DEFAULT_FILTERS)} />

        <p className="status" role="status">
          {status.range} · {status.airlines} airline(s) selected · {status.scheduled.toLocaleString('en-GB')} scheduled ·{' '}
          {status.operated.toLocaleString('en-GB')} operated · {status.cancelled.toLocaleString('en-GB')} cancelled ·{' '}
          {status.diverted.toLocaleString('en-GB')} diverted. Balances use the last selected month. Utilisation covers sample flying only.
        </p>

        {section === 'data' ? (
          <DataPage data={data} filters={filters} />
        ) : (
          <>
            {ctx.airlineCodes.length === 0 && (
              <p className="warn" role="alert">
                No airline matches this combination of airline and aircraft type. Change the aircraft type or the selected airline.
              </p>
            )}
            {ctx.airlineCodes.length > 0 && ctx.flights.length === 0 && (
              <p className="warn" role="alert">
                The selected airline(s) do not fly this route or distance in the sample, so there is nothing to show. Choose another route, or select an airline that flies it.
              </p>
            )}
            <div className="cards">
              {cardMetrics.map((m) => (
                <KpiCard key={m.id} metric={m} result={results[m.id]} selected={m.id === metricId} onSelect={setMetricId} />
              ))}
            </div>

            <div className="two-col">
              {section === 'overview' && <CompareTable data={data} filters={filters} airlineCodes={ctx.airlineCodes} />}
              <Explainer metric={metric} result={results[metricId]} />
            </div>

            <TrendChart metric={metric} series={series} fromMonth={filters.fromMonth} toMonth={filters.toMonth} onMetric={setMetricId} />

            {section === 'overview' && (
              <section className="panel callout">
                <p>
                  <strong>Explore:</strong> Did summer passenger growth come from more capacity, higher load factor, or both? Compare ASK, RPK and PLF.
                </p>
                <div className="toolbar">
                  {['ask', 'rpk', 'plf'].map((id) => (
                    <button key={id} type="button" className={`btn ${metricId === id ? 'primary' : ''}`} onClick={() => setMetricId(id)}>
                      Show {METRIC_BY_ID[id].label.match(/\(([^)]+)\)/)[1]}
                    </button>
                  ))}
                </div>
                <p className="note">Hint: RPK = ASK × PLF, so RPK growth comes from capacity growth, load-factor growth, or both.</p>
              </section>
            )}

            {DISCUSSION[section]?.length > 0 && (
              <details className="panel">
                <summary>Discussion guidance</summary>
                <ul className="plain">
                  {DISCUSSION[section].map((q) => <li key={q}>{q}</li>)}
                </ul>
              </details>
            )}
          </>
        )}

        <footer className="foot">
          Data: {data.notes[0]} Dataset prepared by Dr. Bahtiyar Eren (see the dataset notes). This app is an independent learning clone.
        </footer>
      </main>
    </div>
  );
}
