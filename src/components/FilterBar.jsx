import { MONTHS, routeOptions, routeCarriers, aircraftTypes } from '../kpi/engine.js';

export default function FilterBar({ data, filters, onChange, onMode, onToggleAirline, onReset }) {
  const routes = routeOptions(data);
  const carriers = routeCarriers(data);
  const types = aircraftTypes(data);

  return (
    <section className="panel filters" aria-label="Filters">
      <div className="filter-row">
        <div className="field">
          <span className="field-label" id="view-label">View</span>
          <div className="segmented" role="group" aria-labelledby="view-label">
            <button type="button" className={filters.mode === 'single' ? 'on' : ''} aria-pressed={filters.mode === 'single'} onClick={() => onMode('single')}>
              Single airline
            </button>
            <button type="button" className={filters.mode === 'compare' ? 'on' : ''} aria-pressed={filters.mode === 'compare'} onClick={() => onMode('compare')}>
              Compare airlines
            </button>
          </div>
        </div>

        <label className="field">
          <span className="field-label">From month</span>
          <select value={filters.fromMonth} onChange={(e) => onChange({ fromMonth: Number(e.target.value) })}>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">To month</span>
          <select value={filters.toMonth} onChange={(e) => onChange({ toMonth: Number(e.target.value) })}>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Route (both directions)</span>
          <select value={filters.route} onChange={(e) => onChange({ route: e.target.value })}>
            <option value="all">All selected routes</option>
            {routes.map((r) => (
              <option key={r} value={r}>{r} ({carriers[r].join(', ')})</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Aircraft type</span>
          <select value={filters.aircraftType} onChange={(e) => onChange({ aircraftType: e.target.value })}>
            <option value="all">All types</option>
            {types.map((t) => (
              <option key={t.type} value={t.type}>{t.model} ({t.type})</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Sector distance</span>
          <select value={filters.distance} onChange={(e) => onChange({ distance: e.target.value })}>
            <option value="all">All distances</option>
            <option value="short">Under 1,000 km</option>
            <option value="long">1,000 km or more</option>
          </select>
        </label>

        <button type="button" className="btn" onClick={onReset}>Reset</button>
      </div>

      <div className="chips" role="group" aria-label="Airlines">
        {data.airlines.map((a) => {
          const on = filters.airlines.includes(a.code);
          return (
            <button
              key={a.code}
              type="button"
              className={`chip ${on ? 'on' : ''}`}
              aria-pressed={on}
              onClick={() => onToggleAirline(a.code)}
              style={{ '--airline': a.color }}
            >
              <span className="dot" aria-hidden="true" />
              {a.name} · {a.code}
            </button>
          );
        })}
      </div>
    </section>
  );
}
