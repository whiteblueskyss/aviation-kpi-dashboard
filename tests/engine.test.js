import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { indexData, makeContext, evaluateById, DEFAULT_FILTERS, monthlySeries, routeOptions, routeCarriers } from '../src/kpi/engine.js';
import { METRIC_BY_ID, METRICS } from '../src/kpi/metrics.js';
import { toCsv } from '../src/kpi/exportCsv.js';

const raw = JSON.parse(readFileSync(new URL('../public/data/CAM145_SYNTHETIC_all_data_2025.json', import.meta.url), 'utf8'));
const data = indexData(raw);
const ALL = ['TK', 'LH', 'AY', 'BT', 'FR'];

const val = (id, filters, overrides) => evaluateById(id, makeContext(data, { ...DEFAULT_FILTERS, ...filters }, overrides)).value;

/* ---- helpers to build a tiny synthetic dataset for the lesson examples ---- */
function flight(over = {}) {
  const base = {
    id: 'X', date: '2025-01-01', month: 1, airline: 'XX', origin: 'AAA', destination: 'BBB', distance_km: 1000,
    status: 'Completed', seats: 0, passengers: 0, cargo_capacity_kg: 0, cargo_kg: 0, baggage_kg: 0,
    arrival_delay_min: 0, block_min: 0, turnaround_min: null, gate_change: 0,
    delayed_bags: 0, lost_bags: 0, damaged_bags: 0, complaints: 0, compliments: 0,
    passenger_revenue_eur: 0, ancillary_revenue_eur: 0, cargo_revenue_eur: 0, operating_cost_eur: 0,
    depreciation_eur: 0, rpk: 0, ask: 0, ctk: 0, actk: 0, operating_revenue_eur: 0,
  };
  const f = { ...base, ...over };
  if (over.seats != null || over.passengers != null || over.distance_km != null) {
    f.ask = f.status === 'Cancelled' ? 0 : f.seats * f.distance_km;
    f.rpk = f.passengers * f.distance_km;
  }
  return f;
}
function tiny(flights, extra = {}) {
  return indexData({
    airlines: [{ code: 'XX', type: 'A320', model: 'Test A320' }],
    flights,
    aircraftDays: [],
    crewDays: [],
    finance: [],
    ...extra,
  });
}
const tinyFilters = { ...DEFAULT_FILTERS, airlines: ['XX'] };
const tinyVal = (d, id, over = {}) => evaluateById(id, makeContext(d, { ...tinyFilters, ...over })).value;

describe('real dataset matches the reference dashboard (Turkish Airlines, full year)', () => {
  it('status counts', () => {
    const t = makeContext(data, DEFAULT_FILTERS).t;
    expect([t.scheduled, t.operated, t.cancelled, t.diverted]).toEqual([1000, 984, 16, 4]);
  });
  it('headline KPIs', () => {
    expect(val('passengers')).toBe(150915);
    expect(val('plf')).toBeCloseTo(84.33, 2);
    expect(val('otp')).toBeCloseTo(85.67, 2);
    expect(val('clf')).toBeCloseTo(48.35, 2);
    expect(val('cask')).toBeCloseTo(0.0728, 4);
    expect(val('profit')).toBe(9020454);
  });
});

describe('real dataset, all five airlines', () => {
  const f = { mode: 'compare', airlines: ALL };
  it('status counts', () => {
    const t = makeContext(data, { ...DEFAULT_FILTERS, ...f }).t;
    expect([t.scheduled, t.operated, t.cancelled, t.diverted]).toEqual([5000, 4922, 78, 21]);
  });
  it('headline KPIs', () => {
    expect(val('passengers', f)).toBe(706563);
    expect(val('plf', f)).toBeCloseTo(83.06, 2);
    expect(val('otp', f)).toBeCloseTo(85.03, 2);
    expect(val('clf', f)).toBeCloseTo(48.32, 2);
    expect(val('cask', f)).toBeCloseTo(0.0842, 4);
    expect(val('profit', f)).toBe(33183741);
  });
  it('profit from flights reconciles with the finance table', () => {
    const fin = raw.finance.reduce((s, r) => s + r.operating_profit_eur, 0);
    expect(val('profit', f)).toBe(fin);
  });
  it('mishandled bags are the sum of the three exclusive categories', () => {
    const t = makeContext(data, { ...DEFAULT_FILTERS, ...f }).t;
    expect(t.mishandled).toBe(t.delayed + t.lost + t.damaged);
  });
});

describe('filters and availability', () => {
  it('route filter keeps both directions', () => {
    const ctx = makeContext(data, { ...DEFAULT_FILTERS, airlines: ['TK'], route: 'IST–TLL' });
    expect(ctx.flights.length).toBeGreaterThan(0);
    expect(ctx.flights.every((x) => [x.origin, x.destination].sort().join('–') === 'IST–TLL')).toBe(true);
    const dirs = new Set(ctx.flights.map((x) => `${x.origin}>${x.destination}`));
    expect(dirs.size).toBe(2);
  });
  it('route list always contains all nine routes, whichever airline is selected', () => {
    expect(routeOptions(data)).toEqual([
      'BER–DUB', 'BER–HEL', 'BER–RIX', 'DUB–STN', 'FRA–HEL', 'FRA–IST', 'FRA–TLL', 'IST–TLL', 'RIX–TLL',
    ]);
  });
  it('shared routes list every airline that flies them', () => {
    const carriers = routeCarriers(data);
    expect(carriers['FRA–IST']).toEqual(['LH', 'TK']);
    expect(carriers['DUB–STN']).toEqual(['FR']);
  });
  it('a route the selected airline does not fly gives no sectors and n/a values', () => {
    const ctx = makeContext(data, { ...DEFAULT_FILTERS, airlines: ['TK'], route: 'DUB–STN' });
    expect(ctx.flights.length).toBe(0);
    expect(evaluateById('plf', ctx).status).toBe('na');
  });
  it('distance filter splits at 1,000 km', () => {
    const short = makeContext(data, { ...DEFAULT_FILTERS, airlines: ALL, distance: 'short' });
    const long = makeContext(data, { ...DEFAULT_FILTERS, airlines: ALL, distance: 'long' });
    expect(short.flights.every((x) => x.distance_km < 1000)).toBe(true);
    expect(long.flights.every((x) => x.distance_km >= 1000)).toBe(true);
    expect(short.flights.length + long.flights.length).toBe(5000);
  });
  it('aircraft type filter keeps only airlines that fly that type', () => {
    const ctx = makeContext(data, { ...DEFAULT_FILTERS, airlines: ALL, aircraftType: 'B738' });
    expect(ctx.airlineCodes).toEqual(['FR']);
  });
  it('fleet, crew and finance KPIs are unavailable under route or distance filters', () => {
    const r = evaluateById('aircraftUtil', makeContext(data, { ...DEFAULT_FILTERS, distance: 'short' }));
    expect(r.status).toBe('scope');
    expect(r.value).toBeNull();
    expect(evaluateById('net', makeContext(data, { ...DEFAULT_FILTERS, route: 'IST–TLL' })).status).toBe('scope');
    expect(evaluateById('aircraftUtil', makeContext(data, DEFAULT_FILTERS)).status).toBe('ok');
  });
  it('cargo load factor is n/a for Ryanair (no cargo service)', () => {
    const r = evaluateById('clf', makeContext(data, { ...DEFAULT_FILTERS, airlines: ['FR'] }));
    expect(r.status).toBe('na');
    expect(r.value).toBeNull();
  });
  it('every metric refers to a known numerator and denominator', () => {
    const ctx = makeContext(data, DEFAULT_FILTERS);
    for (const m of METRICS) {
      const r = evaluateById(m.id, ctx);
      expect(['ok', 'na', 'scope']).toContain(r.status);
    }
  });
});

describe('stocks versus flows', () => {
  it('debt uses the last selected month; profit flows are added over the period', () => {
    const rows = raw.finance.filter((r) => r.airline === 'TK');
    const dec = rows.find((r) => r.month === 12);
    const jun = rows.find((r) => r.month === 6);
    expect(val('shortDebt', { airlines: ['TK'] })).toBe(dec.short_debt_eur);
    expect(val('shortDebt', { airlines: ['TK'], toMonth: 6 })).toBe(jun.short_debt_eur);
    const netJanJun = rows.filter((r) => r.month <= 6).reduce((s, r) => s + r.net_profit_eur, 0);
    expect(val('net', { airlines: ['TK'], toMonth: 6 })).toBe(netJanJun);
  });
  it('monthly series has one point per month in range', () => {
    const s = monthlySeries(data, { ...DEFAULT_FILTERS, fromMonth: 3, toMonth: 8 }, METRIC_BY_ID.plf, 'TK');
    expect(s.map((p) => p.month)).toEqual([3, 4, 5, 6, 7, 8]);
  });
});

describe('lesson examples (sum first, divide last)', () => {
  it('combined PLF is 62%, not the 65% simple average', () => {
    const d = tiny([
      flight({ seats: 150, passengers: 120, distance_km: 800 }),
      flight({ seats: 150, passengers: 75, distance_km: 1200 }),
    ]);
    expect(tinyVal(d, 'plf')).toBeCloseTo(62, 6);
  });
  it('combined PLF is 58% for the 500 km and 2,000 km pair', () => {
    const d = tiny([
      flight({ seats: 180, passengers: 162, distance_km: 500 }),
      flight({ seats: 180, passengers: 90, distance_km: 2000 }),
    ]);
    expect(tinyVal(d, 'plf')).toBeCloseTo(58, 6);
  });
  it('unit economics: PLF 80%, yield 0.09, RASK 0.072, CASK 0.068, margin 5.56%', () => {
    const d = tiny([
      flight({
        seats: 1000, passengers: 800, distance_km: 1000,
        passenger_revenue_eur: 72000, operating_revenue_eur: 72000, operating_cost_eur: 68000,
      }),
    ]);
    expect(tinyVal(d, 'plf')).toBeCloseTo(80, 6);
    expect(tinyVal(d, 'yield')).toBeCloseTo(0.09, 6);
    expect(tinyVal(d, 'rask')).toBeCloseTo(0.072, 6);
    expect(tinyVal(d, 'cask')).toBeCloseTo(0.068, 6);
    expect(tinyVal(d, 'profit')).toBe(4000);
    expect(tinyVal(d, 'margin')).toBeCloseTo(5.5556, 3);
    // RASK = yield × PLF when revenue is passenger revenue only
    expect(tinyVal(d, 'rask')).toBeCloseTo(tinyVal(d, 'yield') * (tinyVal(d, 'plf') / 100), 6);
  });
  it('cancellation rate uses scheduled as its base, diversion rate uses operated', () => {
    const flights = [];
    for (let i = 0; i < 10; i += 1) flights.push(flight({ status: 'Cancelled', arrival_delay_min: null }));
    for (let i = 0; i < 5; i += 1) flights.push(flight({ status: 'Diverted', arrival_delay_min: 30 }));
    for (let i = 0; i < 185; i += 1) flights.push(flight());
    const d = tiny(flights);
    expect(tinyVal(d, 'cancel')).toBeCloseTo((10 / 200) * 100, 6);
    expect(tinyVal(d, 'diversion')).toBeCloseTo((5 / 190) * 100, 6);
  });
  it('OTP is 70% while the mean delay (early = 0) is 11.5 minutes', () => {
    const delays = [-5, 0, 3, 10, 14, 16, 20, 45, 0, 7];
    const d = tiny(delays.map((x) => flight({ arrival_delay_min: x })));
    expect(tinyVal(d, 'otp')).toBeCloseTo(70, 6);
    expect(tinyVal(d, 'delay')).toBeCloseTo(11.5, 6);
  });
  it('a diverted flight is operated but never on time', () => {
    const d = tiny([flight({ status: 'Diverted', arrival_delay_min: 0 }), flight({ arrival_delay_min: 0 })]);
    expect(tinyVal(d, 'otp')).toBeCloseTo(50, 6);
  });
  it('baggage rates: 48 mishandled bags per 20,000 passengers is 2.4 per 1,000', () => {
    const d = tiny([flight({ seats: 200, passengers: 20000, delayed_bags: 36, damaged_bags: 10, lost_bags: 2 })]);
    expect(tinyVal(d, 'mishandled')).toBeCloseTo(2.4, 6);
    expect(tinyVal(d, 'lost')).toBeCloseTo(0.1, 6);
  });
  it('turnaround averages only the observed turnarounds', () => {
    const d = tiny([flight({ turnaround_min: 40 }), flight({ turnaround_min: 50 }), flight({ turnaround_min: null })]);
    expect(tinyVal(d, 'turn')).toBeCloseTo(45, 6);
  });
});

describe('csv export', () => {
  it('quotes commas and keeps missing values blank, not zero', () => {
    const csv = toCsv([{ a: 'x,y', b: null, c: 0 }], ['a', 'b', 'c']);
    expect(csv).toBe('a,b,c\n"x,y",,0');
  });
});
