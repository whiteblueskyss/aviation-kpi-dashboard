import { displayName } from '../lib/data';
import { fmt, sign } from '../lib/format';

const COLS = [
  ['name', 'Market'],
  ['rpk', 'RPK %'],
  ['ask', 'ASK %'],
  ['gap', 'Gap pp¹'],
  ['plf', 'PLF %'],
  ['delta', 'PLF Δ pp'],
  ['share', '2024 share %'],
];

const NA = 'Not available in this report';

/** Sortable results table. `state` = {key, dir} | undefined, `onSort(key)` toggles it. */
export default function DataTable({ id, rows, caption, state, onSort }) {
  const ordered = [...rows];
  if (state) {
    const val = (r) => (state.key === 'gap' ? (r.ask == null ? null : r.rpk - r.ask) : state.key === 'name' ? displayName(r) : r[state.key]);
    ordered.sort((a, b) => {
      const av = val(a), bv = val(b);
      return (typeof av === 'string' ? av.localeCompare(bv) : (av ?? -Infinity) - (bv ?? -Infinity)) * state.dir;
    });
  }
  return (
    <>
      <div className="tablewrap">
        <table>
          <caption>{caption} · Click a heading to sort.</caption>
          <thead>
            <tr>
              {COLS.map(([k, n]) => (
                <th key={k} scope="col" aria-sort={state?.key === k ? (state.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                  <button data-table={id} data-key={k} onClick={() => onSort(k)}>
                    {n} ↕
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordered.map((r, i) => (
              <tr key={displayName(r) + i}>
                <td>{displayName(r)}</td>
                <td>{fmt(r.rpk)}</td>
                <td>{fmt(r.ask)}</td>
                <td>{r.ask == null ? NA : sign(r.rpk - r.ask)}</td>
                <td>{fmt(r.plf)}</td>
                <td>{r.delta == null ? NA : sign(r.delta)}</td>
                <td>{fmt(r.share)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small">¹ Calculated RPK growth minus ASK growth. Share = % of total industry RPK in 2024. Growth gap is not PLF change.</p>
    </>
  );
}
