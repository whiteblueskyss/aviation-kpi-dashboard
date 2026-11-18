import { displayName } from '../lib/data';
import { fmt, sign } from '../lib/format';

/**
 * Horizontal bar chart (inline SVG). mode:
 *   'growth' – RPK and ASK growth per row
 *   'plf'    – passenger load factor level, with PLF change underneath
 *   'route'  – RPK growth only
 */
export default function Bars({ rows, mode = 'growth' }) {
  const plf = mode === 'plf';
  const route = mode === 'route';
  const w = 690, left = 220, right = 90;
  const step = plf ? 61 : route ? 48 : 76;
  const h = rows.length * step + 48;
  const plot = w - left - right;
  const vals = rows.flatMap((r) => (plf ? [r.plf] : route ? [r.rpk] : [r.rpk, r.ask])).filter((v) => v != null);
  const min = plf ? 0 : Math.min(0, Math.floor(Math.min(...vals) / 5) * 5);
  let max = plf ? 100 : Math.max(5, Math.ceil(Math.max(...vals) / 5) * 5);
  if (max === min) max = min + 5;
  const x = (v) => left + ((v - min) / (max - min)) * plot;
  const metrics = plf ? [['plf', '#06265e', 'PLF']] : route ? [['rpk', '#0072ce', 'RPK']] : [['rpk', '#0072ce', 'RPK'], ['ask', '#64778e', 'ASK']];

  return (
    <>
      {!plf && (
        <div className="legend">
          <span>
            <i></i>RPK · demand
          </span>
          {!route && (
            <span>
              <i className="ask"></i>ASK · capacity
            </span>
          )}
        </div>
      )}
      <svg
        className="chart"
        role="img"
        aria-label={`${plf ? 'Passenger load factor levels' : route ? 'Route-area RPK growth' : 'RPK and ASK growth'}; exact values in the accompanying table`}
        viewBox={`0 0 ${w} ${h}`}
      >
        <title>{plf ? 'Load factor (%)' : 'Growth (%)'}</title>
        {[0, 1, 2, 3, 4].map((i) => {
          const v = min + ((max - min) * i) / 4;
          return (
            <g key={i}>
              <line x1={x(v)} y1="12" x2={x(v)} y2={h - 30} stroke="#dfe3e8" />
              <text x={x(v)} y={h - 8} textAnchor="middle" fill="#626971" fontSize="11">
                {v.toFixed(1)}%
              </text>
            </g>
          );
        })}
        <line x1={x(0)} y1="10" x2={x(0)} y2={h - 28} stroke="#7d969f" />
        {rows.map((r, i) => {
          const y = 20 + i * step;
          const name = displayName(r);
          const labels = name === 'Latin America and Caribbean' ? ['Latin America', 'and Caribbean'] : [name];
          return (
            <g key={name + i}>
              {labels.map((a, j) => (
                <text key={j} x="0" y={y + 12 + j * 15} fill="#373c43" fontSize="12">
                  {a}
                </text>
              ))}
              {metrics.map(([key, c, label], j) => {
                const v = r[key];
                if (v == null) return null;
                const yy = y + j * 24;
                return (
                  <g key={key}>
                    <rect x={Math.min(x(0), x(v))} y={yy} width={Math.max(0.8, Math.abs(x(v) - x(0)))} height="15" rx="2" fill={c}>
                      <title>{`${name}: ${label} ${fmt(v, '%')}`}</title>
                    </rect>
                    <text x={w - right + 9} y={yy + 12} fontSize="11" fill={c}>
                      {`${label} ${fmt(v, '%')}`}
                    </text>
                  </g>
                );
              })}
              {plf && (
                <text x={left} y={y + 34} fontSize="11" fill="#626971">
                  Change: {r.delta == null ? 'unavailable' : sign(r.delta) + ' pp'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </>
  );
}
