import Bars from '../components/Bars';
import DataTable from '../components/DataTable';
import { PeriodSelect } from './shared';
import { records } from '../lib/data';
import { PERIODS } from '../lib/format';

const MARKETS = ['Australia', 'Brazil', 'China P.R.', 'India', 'Japan', 'United States'];

export default function DomesticPage({ c }) {
  const { period, setPeriod, sortState, onSort, domSort, setDomSort, selectedDomestic, toggleDomestic } = c;
  const rows = records('Domestic', 'Domestic market', period).filter((r) => !selectedDomestic.length || selectedDomestic.includes(r.name));
  rows.sort((a, b) => b[domSort] - a[domSort]);
  return (
    <>
      <div className="eyebrow">05 / Domestic markets</div>
      <h2>Read the contrast behind the growth</h2>
      <div className="controls">
        <PeriodSelect period={period} setPeriod={setPeriod} />
        <label>
          Sort descending by
          <select id="domSort" value={domSort} onChange={(e) => setDomSort(e.target.value)}>
            <option value="rpk">RPK growth</option>
            <option value="ask">ASK growth</option>
            <option value="plf">PLF level</option>
            <option value="delta">PLF change</option>
          </select>
        </label>
      </div>
      <div className="checks" id="domChecks">
        {MARKETS.map((n) => (
          <label key={n}>
            <input type="checkbox" value={n} checked={selectedDomestic.includes(n)} onChange={() => toggleDomestic(n)} />
            {n}
          </label>
        ))}
      </div>
      <p className="small">Select markets for comparison; no selection shows all six. These markets do not exhaust global domestic traffic.</p>
      <div className="grid">
        <div className="card">
          <h3>Demand and capacity growth</h3>
          <div id="domChart">
            <Bars rows={rows} />
          </div>
        </div>
        <div className="card">
          <h3>Load factor level and change</h3>
          <div id="domPlf">
            <Bars rows={rows} mode="plf" />
          </div>
        </div>
      </div>
      <div id="domTable">
        <DataTable id="domTable" rows={rows} caption={'Domestic · ' + PERIODS[period] + ' · p.5'} state={sortState.domTable} onSort={(k) => onSort('domTable', k)} />
      </div>
      <details>
        <summary>July case study: Japan, India and Brazil</summary>
        <p>
          <b>Japan:</b> RPK +2.9%, ASK −1.2%, PLF +3.3 pp to 81.4%. Demand increased while capacity fell. <b>India:</b> RPK −1.3%, ASK +1.2%, PLF −2.1 pp to 83.0%. Demand and capacity moved in opposite directions. <b>Brazil:</b> RPK +9.4%, ASK +7.5%, PLF +1.5 pp to 85.8%. Demand outpaced expanding capacity. These are July comparisons, regardless of the selected chart period. Source: p.5.
        </p>
      </details>
    </>
  );
}
