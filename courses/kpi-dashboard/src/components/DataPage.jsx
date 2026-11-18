import { useMemo, useState } from 'react';
import { makeContext } from '../kpi/engine.js';
import { toCsv, downloadText } from '../kpi/exportCsv.js';
import { DATA_URL, DATA_FILENAME } from '../data/loadData.js';

const TABLES = {
  flights: {
    label: 'Flights (sectors)',
    pick: (ctx) => ctx.flights,
    preview: ['id', 'date', 'airline', 'origin', 'destination', 'aircraft_type', 'distance_km', 'status', 'passengers', 'arrival_delay_min', 'operating_revenue_eur', 'operating_cost_eur'],
  },
  finance: {
    label: 'Monthly finance',
    pick: (ctx) => ctx.finance,
    preview: ['airline', 'month', 'operating_revenue_eur', 'operating_cost_eur', 'operating_profit_eur', 'net_profit_eur', 'operating_cashflow_eur', 'net_cashflow_eur', 'short_debt_eur', 'long_debt_eur'],
  },
  aircraftDays: {
    label: 'Aircraft-days',
    pick: (ctx) => ctx.aircraftDays,
    preview: ['date', 'airline', 'aircraft_id', 'aircraft_type', 'aircraft_days', 'block_hours', 'operated_sectors'],
  },
  crewDays: {
    label: 'Crew-days',
    pick: (ctx) => ctx.crewDays,
    preview: ['date', 'airline', 'pilot_person_days', 'pilot_block_hours'],
  },
};

const PREVIEW_ROWS = 50;

function cleanRows(rows) {
  // The route key is added by the app for filtering; keep exports identical to the source file.
  return rows.map(({ route, ...rest }) => rest);
}

export default function DataPage({ data, filters }) {
  const [table, setTable] = useState('flights');
  const [dictTable, setDictTable] = useState('all');
  const [query, setQuery] = useState('');

  const ctx = useMemo(() => makeContext(data, filters), [data, filters]);
  const def = TABLES[table];
  const rows = useMemo(() => cleanRows(def.pick(ctx)), [def, ctx]);

  const dictionary = data.dictionary.filter(
    (r) =>
      (dictTable === 'all' || r.table === dictTable) &&
      (!query || `${r.field} ${r.description}`.toLowerCase().includes(query.toLowerCase())),
  );
  const dictTables = [...new Set(data.dictionary.map((r) => r.table))];

  return (
    <>
      <section className="panel">
        <h2>View &amp; download data</h2>
        <p className="note">The table below follows your current filters. Downloads contain every column of the filtered rows.</p>
        <div className="toolbar">
          <label className="inline-field">
            <span>Table</span>
            <select value={table} onChange={(e) => setTable(e.target.value)}>
              {Object.entries(TABLES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </label>
          <span className="count">{rows.length.toLocaleString('en-GB')} rows (showing first {Math.min(PREVIEW_ROWS, rows.length)})</span>
          <button type="button" className="btn" disabled={!rows.length} onClick={() => downloadText(`${table}_filtered.csv`, toCsv(rows))}>
            Download filtered CSV
          </button>
          <a className="btn" href={DATA_URL} download={DATA_FILENAME}>Download full JSON</a>
        </div>
        <div className="table-wrap tall">
          <table>
            <thead>
              <tr>{def.preview.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.slice(0, PREVIEW_ROWS).map((r, i) => (
                <tr key={i}>
                  {def.preview.map((c) => <td key={c}>{r[c] == null ? '' : String(r[c])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Sources &amp; assumptions</h2>
        <ul className="plain">
          {data.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
        <p className="note">Random seed used to generate the data: {data.seed}</p>
        <h3>Reference pages</h3>
        <ul className="plain">
          {data.sources.map(([label, url, note]) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer">{label}</a> — {note}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Data dictionary</h2>
        <div className="toolbar">
          <label className="inline-field">
            <span>Table</span>
            <select value={dictTable} onChange={(e) => setDictTable(e.target.value)}>
              <option value="all">All tables</option>
              {dictTables.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="inline-field">
            <span>Search</span>
            <input type="search" value={query} placeholder="field or description" onChange={(e) => setQuery(e.target.value)} />
          </label>
          <span className="count">{dictionary.length} fields</span>
        </div>
        <div className="table-wrap tall">
          <table>
            <thead>
              <tr><th scope="col">Table</th><th scope="col">Field</th><th scope="col">Unit</th><th scope="col">Description</th><th scope="col">Missing values</th></tr>
            </thead>
            <tbody>
              {dictionary.map((r) => (
                <tr key={`${r.table}.${r.field}`}>
                  <td>{r.table}</td><td><code>{r.field}</code></td><td>{r.unit}</td><td>{r.description}</td><td>{r.missing_rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
