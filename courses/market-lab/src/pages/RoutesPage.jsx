import Bars from '../components/Bars';
import DataTable from '../components/DataTable';
import { routeRows } from '../lib/data';

export default function RoutesPage({ c }) {
  const { routeGroup, setRouteGroup, routeFocus, setRouteFocus, sortState, onSort } = c;
  const options = routeRows(routeGroup);
  let rr = [...options];
  if (routeFocus !== 'all') rr = rr.filter((r) => r.name === routeFocus);
  rr.sort((a, b) => b.rpk - a.rpk);
  return (
    <>
      <div className="eyebrow">06 / International route areas</div>
      <h2>Compare corridors, not carrier regions</h2>
      <p className="subtitle">July 2025 vs July 2024 only · Selected areas from pp.3–4</p>
      <div className="controls">
        <label>
          Route-area group
          <select id="routeGroup" value={routeGroup} onChange={(e) => setRouteGroup(e.target.value)}>
            <option value="all">All selected route areas</option>
            <option value="asia">Asia Pacific corridors</option>
            <option value="americas">Americas corridors</option>
            <option value="other">Other reported areas</option>
          </select>
        </label>
        <label>
          Focus route
          <select id="routeFocus" value={routeFocus} onChange={(e) => setRouteFocus(e.target.value)}>
            <option value="all">All in selected group</option>
            {options.map((r) => (
              <option key={r.name}>{r.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="note">
        Route areas describe geographic connections. They are distinct from airline registration regions. The North America–Asia corridor is included once, even though it appears in both discussions. Areas can overlap; do not sum their growth rates or interpret this as complete global coverage.
      </div>
      <div className="card">
        <h3>RPK growth (%)</h3>
        <div id="routeChart">
          <Bars rows={rr} mode="route" />
        </div>
        <p className="small">A fast percentage increase can arise from a small base. The report identifies Africa–Asia’s 21.3% increase as growth from a low base (pp.3–4).</p>
      </div>
      <div id="routeTable">
        <DataTable id="routeTable" rows={rr} caption="Route areas · July 2025 vs July 2024 · pp.3–4" state={sortState.routeTable} onSort={(k) => onSort('routeTable', k)} />
      </div>
    </>
  );
}
