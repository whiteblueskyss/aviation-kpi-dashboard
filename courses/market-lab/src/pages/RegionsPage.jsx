import Bars from '../components/Bars';
import DataTable from '../components/DataTable';
import { PeriodSelect } from './shared';
import { records } from '../lib/data';
import { PERIODS } from '../lib/format';

const REGIONS = ['Africa', 'Asia Pacific', 'Europe', 'Latin America and Caribbean', 'Middle East', 'North America'];

export default function RegionsPage({ c }) {
  const { period, setPeriod, sortState, onSort, regionSegment, setRegionSegment, regionSort, setRegionSort, selectedRegions, toggleRegion, clearRegions, regionMessage } = c;
  let rows = records(regionSegment, 'Airline registration region', period).filter((r) => !selectedRegions.length || selectedRegions.includes(r.name));
  const k = regionSort;
  rows.sort((a, b) => (k === 'gap' ? b.rpk - b.ask - (a.rpk - a.ask) : b[k] - a[k]));
  return (
    <>
      <div className="eyebrow">04 / Regional comparison</div>
      <h2>Different regions, different dynamics</h2>
      <p className="subtitle">Airline region of registration · Source: p.5</p>
      <div className="controls">
        <label>
          Market segment
          <select id="regionSegment" value={regionSegment} onChange={(e) => setRegionSegment(e.target.value)}>
            <option>Total</option>
            <option>International</option>
          </select>
        </label>
        <PeriodSelect period={period} setPeriod={setPeriod} />
        <label>
          Sort descending by
          <select id="regionSort" value={regionSort} onChange={(e) => setRegionSort(e.target.value)}>
            <option value="rpk">RPK growth</option>
            <option value="ask">ASK growth</option>
            <option value="plf">PLF level</option>
            <option value="delta">PLF change</option>
            <option value="share">2024 world share</option>
            <option value="gap">Growth gap</option>
          </select>
        </label>
        <button id="clearRegions" onClick={clearRegions}>
          Show all regions
        </button>
      </div>
      <p className="small">Select up to three regions to compare, or leave all boxes clear to show all six.</p>
      <div className="checks" id="regionChecks">
        {REGIONS.map((n) => (
          <label key={n}>
            <input type="checkbox" value={n} checked={selectedRegions.includes(n)} onChange={() => toggleRegion(n)} />
            {n}
          </label>
        ))}
      </div>
      <p id="regionMessage" role="status" className="small">
        {regionMessage}
      </p>
      <div className="note">
        Regional results follow the carrier’s registration. They do not measure all traffic taking place geographically within a region. A 2024 world share is a historical size indicator, not a July 2025 share.
      </div>
      <div className="grid">
        <div className="card">
          <h3>Demand and capacity growth</h3>
          <div id="regionChart">
            <Bars rows={rows} />
          </div>
        </div>
        <div className="card">
          <h3>Load factor level and change</h3>
          <div id="regionPlf">
            <Bars rows={rows} mode="plf" />
          </div>
        </div>
      </div>
      <div id="regionTable">
        <DataTable id="regionTable" rows={rows} caption={regionSegment + ' · ' + PERIODS[period] + ' · p.5'} state={sortState.regionTable} onSort={(key) => onSort('regionTable', key)} />
      </div>
      <details>
        <summary>Growth, size and contribution are different</summary>
        <p>
          For total traffic in July, Latin America and Caribbean carriers grew fastest at 7.2%, while Asia Pacific had the largest 2024 world RPK share (33.5%). The report attributes around 45% of July’s net RPK increase to Asia Pacific and around 10% to Latin America and Caribbean (p.2). These are reported approximate contributions, not calculations from annual shares. The appropriate weights for exact July contributions would be July 2024 traffic shares.
        </p>
      </details>
    </>
  );
}
