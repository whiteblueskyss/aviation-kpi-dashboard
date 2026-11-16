import { useState } from 'react';
import { MONTHS } from '../kpi/engine.js';
import { METRICS } from '../kpi/metrics.js';
import { formatMetric } from '../kpi/format.js';

const W = 900;
const H = 340;
const M = { l: 74, r: 24, t: 18, b: 38 };

function niceStep(raw) {
  const p = 10 ** Math.floor(Math.log10(raw));
  const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}

function axis(values, isPercent) {
  const vals = values.filter((v) => v != null);
  let min = Math.min(0, ...vals);
  let max = Math.max(...vals, 0);
  if (!vals.length) return { lo: 0, hi: 1, ticks: [0, 1] };
  if (isPercent && min >= 0 && max <= 100) return { lo: 0, hi: 100, ticks: [0, 25, 50, 75, 100] };
  if (max === min) max = min + 1;
  const step = niceStep((max - min) / 4);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 1000; v += step) ticks.push(Number(v.toFixed(10)));
  return { lo, hi, ticks };
}

const compact = new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 2 });

export default function TrendChart({ metric, series, fromMonth, toMonth, onMetric }) {
  const [hover, setHover] = useState(null);
  const months = [];
  for (let m = fromMonth; m <= toMonth; m += 1) months.push(m);

  const allValues = series.flatMap((s) => s.points.map((p) => p.value));
  const { lo, hi, ticks } = axis(allValues, metric.unit === '%');
  const x = (m) => (months.length === 1 ? (M.l + W - M.r) / 2 : M.l + ((m - fromMonth) / (months.length - 1)) * (W - M.l - M.r));
  const y = (v) => M.t + (1 - (v - lo) / (hi - lo)) * (H - M.t - M.b);

  const linePath = (points) => {
    let d = '';
    let pen = false;
    for (const p of points) {
      if (p.value == null) {
        pen = false;
        continue;
      }
      d += `${pen ? 'L' : 'M'}${x(p.month).toFixed(1)},${y(p.value).toFixed(1)} `;
      pen = true;
    }
    return d.trim();
  };

  const tip = hover ? series[hover.si]?.points[hover.pi] : null;
  const tipSeries = hover ? series[hover.si] : null;

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Monthly pattern</h2>
        <label className="inline-field">
          <span>Trend measure</span>
          <select value={metric.id} onChange={(e) => onMetric(e.target.value)}>
            {METRICS.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="note">Hover or focus a point for its value. Use the table for exact figures.</p>

      {series.length === 0 ? (
        <p className="empty">No airline matches the current filters.</p>
      ) : (
        <div className="chart-wrap">
          <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`${metric.label} by month`} onMouseLeave={() => setHover(null)}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} className="grid" />
                <text x={M.l - 10} y={y(t) + 4} textAnchor="end" className="axis">{compact.format(t)}</text>
              </g>
            ))}
            {lo < 0 && <line x1={M.l} x2={W - M.r} y1={y(0)} y2={y(0)} className="zero" />}
            {months.map((m) => (
              <text key={m} x={x(m)} y={H - 12} textAnchor="middle" className="axis">{MONTHS[m - 1]}</text>
            ))}
            {series.map((s) => (
              <path key={s.code} d={linePath(s.points)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" />
            ))}
            {series.map((s, si) =>
              s.points.map((p, pi) =>
                p.value == null ? null : (
                  <circle
                    key={`${s.code}-${p.month}`}
                    cx={x(p.month)}
                    cy={y(p.value)}
                    r={hover && hover.si === si && hover.pi === pi ? 7 : 4.5}
                    fill={s.color}
                    stroke="#fff"
                    strokeWidth="1.5"
                    tabIndex={0}
                    role="img"
                    aria-label={`${s.name}, ${MONTHS[p.month - 1]}: ${formatMetric(metric, p.value)}`}
                    onMouseEnter={() => setHover({ si, pi })}
                    onFocus={() => setHover({ si, pi })}
                    onBlur={() => setHover(null)}
                  />
                ),
              ),
            )}
            {tip && tip.value != null && (
              <g pointerEvents="none" transform={`translate(${Math.min(Math.max(x(tip.month) - 80, M.l), W - M.r - 160)},${Math.max(y(tip.value) - 62, 2)})`}>
                <rect width="160" height="50" rx="6" className="tip" />
                <text x="10" y="21" className="tip-title">{tipSeries.name} · {MONTHS[tip.month - 1]}</text>
                <text x="10" y="40" className="tip-value">{formatMetric(metric, tip.value)}</text>
              </g>
            )}
          </svg>
        </div>
      )}

      <div className="legend">
        {series.map((s) => (
          <span key={s.code}><span className="dot" style={{ background: s.color }} aria-hidden="true" /> {s.name}</span>
        ))}
        <span className="unit">Unit: {metric.unit}</span>
      </div>

      {series.length > 0 && (
        <details>
          <summary>Show monthly values</summary>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  {series.map((s) => (
                    <th key={s.code} scope="col" className="num">{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {months.map((m, i) => (
                  <tr key={m}>
                    <th scope="row">{MONTHS[m - 1]}</th>
                    {series.map((s) => (
                      <td key={s.code} className="num">{formatMetric(metric, s.points[i].value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  );
}
