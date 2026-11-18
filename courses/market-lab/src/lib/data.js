import D from '../data/records.json';
import { TIME_INDICATORS as T } from '../data/timeIndicators';
import { PERIODS } from './format';

export { D };

export const records = (segment, kind, period) =>
  D.filter((r) => r.segment === segment && r.period === PERIODS[period] && r.classification === kind);

export const displayName = (r) => (r.name === 'World' ? r.segment : r.name);

/** The fifteen route-area records, in report order. */
export const ROUTE_AREAS = D.filter((r) => r.classification === 'Route area');

export function routeRows(group) {
  return ROUTE_AREAS.filter(
    (r, i) =>
      group === 'all' ||
      (group === 'asia' && i < 6) ||
      (group === 'americas' && (i === 3 || (i >= 6 && i <= 10))) ||
      (group === 'other' && i >= 11)
  );
}

// ---- flat "source records" table + CSV export ----
export const SOURCE_ROWS = (() => {
  const rows = D.map((r) => ({
    name: r.name,
    classification: r.classification,
    segment: r.segment,
    period: r.period,
    basis: r.period.startsWith('Jan') ? 'YTD' : 'YoY',
    rpk: r.rpk,
    ask: r.ask,
    plf: r.plf,
    plf_change_pp: r.delta,
    growth_gap_pp: r.ask == null ? null : +(r.rpk - r.ask).toFixed(1),
    world_share_pct: r.share,
    share_year: r.shareYear,
    indicator: null,
    value: null,
    unit: null,
    source: r.source,
    status: r.status,
    gap_status: r.ask == null ? 'Not available' : 'Calculated',
  }));
  T.forEach((r) =>
    rows.push({
      name: 'World',
      classification: 'Time / outlook indicator',
      segment: r[0].startsWith('International') ? 'International' : r[0].startsWith('Domestic') ? 'Domestic' : 'Total',
      period: r[1],
      basis: r[4],
      rpk: null,
      ask: null,
      plf: null,
      plf_change_pp: null,
      growth_gap_pp: null,
      world_share_pct: null,
      share_year: null,
      indicator: r[0],
      value: r[2],
      unit: r[3],
      source: r[6] + ' • Narrative',
      status: 'Reported • ' + r[5],
      gap_status: 'Not available',
    })
  );
  return rows;
})();

export function toCsv(rows) {
  const keys = Object.keys(SOURCE_ROWS[0]);
  const quote = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  return '﻿' + [keys.map(quote).join(','), ...rows.map((r) => keys.map((k) => quote(r[k])).join(','))].join('\r\n');
}

export function downloadCsv(rows) {
  const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'IATA_July_2025_filtered_data.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
