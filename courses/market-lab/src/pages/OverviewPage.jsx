import Bars from '../components/Bars';
import DataTable from '../components/DataTable';
import { PeriodSelect } from './shared';
import { D, records } from '../lib/data';
import { PERIODS, fmt, sign } from '../lib/format';

export default function OverviewPage({ c }) {
  const { period, segment, setSegment, go, sortState, onSort, resetAll } = c;
  const r = records(segment, 'Global aggregate', period)[0];
  const gr = D.filter((x) => x.period === PERIODS[period] && x.name === 'World');
  const kpis = [
    ['RPK growth', r.rpk, '%', '', 'Revenue Passenger Kilometres: distance-weighted demand'],
    ['ASK growth', r.ask, '%', 'ask', 'Available Seat Kilometres: offered capacity'],
    ['PLF level', r.plf, '%', 'plf', 'RPK divided by ASK, multiplied by 100'],
    ['PLF change', r.delta, ' pp', 'plf', 'Change from the corresponding prior-year period'],
  ];
  return (
    <>
      <div className="sectionhead">
        <div className="eyebrow">02 / Global overview</div>
        <h2>The passenger market at a glance</h2>
        <p className="subtitle">Choose a segment and comparison period. Every indicator updates together.</p>
      </div>
      <div className="controls">
        <label>
          Market segment
          <select id="segment" value={segment} onChange={(e) => setSegment(e.target.value)}>
            <option>Total</option>
            <option>International</option>
            <option>Domestic</option>
          </select>
        </label>
        <PeriodSelect id="period" period={period} setPeriod={c.setPeriod} />
        <button id="reset" onClick={resetAll}>
          Reset filters
        </button>
      </div>
      <div id="kpis" className="kpis">
        {kpis.map(([n, v, u, cls, t]) => (
          <div key={n} className={`kpi ${cls}`} title={t}>
            <strong>{n}</strong>
            <div className="value">
              {n === 'PLF change' ? sign(v) : fmt(v)}
              {u}
            </div>
            <small>
              {r.segment} · {PERIODS[period]}
            </small>
            <small>Reported · p.5 detailed table</small>
          </div>
        ))}
      </div>
      <div id="overviewNote" className="note" aria-live="polite">
        <b>
          {r.segment} · {PERIODS[period]}.
        </b>{' '}
        Demand grew {fmt(r.rpk, '%')}, while capacity grew {fmt(r.ask, '%')}. {r.rpk >= r.ask ? 'Demand grew faster than capacity' : 'Capacity grew faster than demand'}. Reported utilisation{' '}
        {r.delta === 0 ? 'was unchanged at the displayed precision' : r.delta > 0 ? 'increased' : 'decreased'}
        {r.delta === 0 ? '' : ' by ' + fmt(Math.abs(r.delta), ' pp')} to {fmt(r.plf, '%')}.
      </div>
      <div className="grid">
        <div className="card">
          <h3>Demand and capacity</h3>
          <div id="globalChart">
            <Bars rows={[r]} />
          </div>
        </div>
        <div className="card">
          <h3>Before making a commercial decision</h3>
          <p>Investigate yields, fares, operating costs, route mix and seasonal patterns. These indicators describe traffic and utilisation; they cannot establish profitability.</p>
          <p className="small">World shares refer to 2024 industry RPK. International and domestic are components of total traffic; do not add the total to its components.</p>
          <button onClick={() => go('demand')}>Compare demand and capacity →</button>
        </div>
      </div>
      <div id="globalTable">
        <DataTable id="globalTable" rows={gr} caption={PERIODS[period] + ' · Global segments · p.5'} state={sortState.globalTable} onSort={(k) => onSort('globalTable', k)} />
      </div>
    </>
  );
}

export function DemandPage({ c }) {
  const { period, setPeriod, sortState, onSort } = c;
  const gr = D.filter((x) => x.period === PERIODS[period] && x.name === 'World');
  return (
    <>
      <div className="eyebrow">03 / Demand versus capacity</div>
      <h2>Is supply keeping pace with demand?</h2>
      <p className="subtitle">
        Global segments · <span className="periodLabel">{PERIODS[period]}</span> · Source: p.5
      </p>
      <div className="controls">
        <PeriodSelect period={period} setPeriod={setPeriod} />
      </div>
      <div className="note">
        <b>Growth gap = RPK growth − ASK growth.</b> The result is in percentage points. It is not the change in PLF; PLF depends on the starting level and the ratio of demand to capacity.
      </div>
      <div className="grid">
        <div className="card">
          <h3>Growth rates (%)</h3>
          <div id="demandChart">
            <Bars rows={gr} />
          </div>
        </div>
        <div className="card">
          <h3>Utilisation (%)</h3>
          <div id="demandPlf">
            <Bars rows={gr} mode="plf" />
          </div>
        </div>
      </div>
      <div id="demandTable">
        <DataTable id="demandTable" rows={gr} caption={PERIODS[period] + ' · Global segments · p.5'} state={sortState.demandTable} onSort={(k) => onSort('demandTable', k)} />
      </div>
    </>
  );
}
