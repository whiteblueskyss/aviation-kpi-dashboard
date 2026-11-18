import { formatMetric, unitLabel, whyUnavailable } from '../kpi/format.js';

export default function KpiCard({ metric, result, selected, onSelect }) {
  const unavailable = result.status !== 'ok';
  return (
    <button
      type="button"
      className={`kpi-card ${selected ? 'selected' : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect(metric.id)}
      title={unavailable ? whyUnavailable(result.status) : metric.short}
    >
      <span className="kpi-label">{metric.label}</span>
      <span className={`kpi-value ${unavailable ? 'muted' : ''}`}>{formatMetric(metric, result.value)}</span>
      <span className="kpi-unit">{unitLabel(metric)}</span>
      <span className="kpi-link">definition &amp; calculation</span>
    </button>
  );
}
