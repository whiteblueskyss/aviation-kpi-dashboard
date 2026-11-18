import { makeContext, evaluateById } from '../kpi/engine.js';
import { METRIC_BY_ID } from '../kpi/metrics.js';
import { formatMetric } from '../kpi/format.js';

const COLUMNS = ['scheduled', 'plf', 'otp', 'cask'];

export default function CompareTable({ data, filters, airlineCodes }) {
  const rows = airlineCodes.map((code) => {
    const ctx = makeContext(data, filters, { airlines: [code] });
    const airline = data.airlines.find((a) => a.code === code);
    return { airline, values: COLUMNS.map((id) => evaluateById(id, ctx)) };
  });

  return (
    <section className="panel">
      <h2>Compare simulated performance</h2>
      <div className="table-wrap">
        <table className="compare">
          <thead>
            <tr>
              <th scope="col">Airline</th>
              {COLUMNS.map((id) => (
                <th key={id} scope="col" className="num">{METRIC_BY_ID[id].label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={COLUMNS.length + 1}>No airline matches the current filters.</td></tr>
            )}
            {rows.map(({ airline, values }) => (
              <tr key={airline.code}>
                <th scope="row">
                  <span className="dot" style={{ background: airline.color }} aria-hidden="true" /> {airline.name}
                </th>
                {values.map((v, i) => (
                  <td key={COLUMNS[i]} className="num">{formatMetric(METRIC_BY_ID[COLUMNS[i]], v.value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">
        Selected-route samples, not actual airline results. Different route mixes can explain differences.
      </p>
    </section>
  );
}
