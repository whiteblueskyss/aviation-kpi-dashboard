const nf = new Map();
function numberFormat(decimals) {
  if (!nf.has(decimals)) {
    nf.set(decimals, new Intl.NumberFormat('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }));
  }
  return nf.get(decimals);
}

export function formatNumber(value, decimals = 0) {
  if (value == null || Number.isNaN(value)) return 'n/a';
  return numberFormat(decimals).format(value);
}

/** Display text for a metric value, e.g. "84.33%", "€0.0728", "150,915". */
export function formatMetric(metric, value) {
  if (value == null || Number.isNaN(value)) return 'n/a';
  const text = formatNumber(value, metric.decimals);
  if (metric.unit === '%') return `${text}%`;
  if (metric.unit.startsWith('€')) return `${value < 0 ? '−' : ''}€${formatNumber(Math.abs(value), metric.decimals)}`;
  return text;
}

/** Unit label shown under the number (the % and € are already in the number). */
export function unitLabel(metric) {
  return metric.unit;
}

export function whyUnavailable(status) {
  if (status === 'scope') return 'Not available when a route or distance filter is applied: this KPI is only defined for whole airlines.';
  if (status === 'na') return 'Not applicable: the denominator is zero for this selection (for example no cargo service).';
  return '';
}
