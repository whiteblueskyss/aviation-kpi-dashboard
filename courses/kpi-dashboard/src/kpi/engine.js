import { METRICS, METRIC_BY_ID } from './metrics.js';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const SHORT_SECTOR_KM = 1000;
export const ON_TIME_MINUTES = 15;

export const DEFAULT_FILTERS = {
  mode: 'single', // 'single' | 'compare'
  airlines: ['TK'],
  fromMonth: 1,
  toMonth: 12,
  route: 'all',
  aircraftType: 'all',
  distance: 'all', // 'all' | 'short' | 'long'
};

/* ------------------------------------------------------------------ data */

export function routeKey(a, b) {
  return [a, b].sort().join('–');
}

function groupBy(rows, key) {
  const map = {};
  for (const r of rows) (map[r[key]] ||= []).push(r);
  return map;
}

/** Add a route key to every flight and index the tables by airline. */
export function indexData(raw) {
  const flights = raw.flights.map((f) => ({ ...f, route: routeKey(f.origin, f.destination) }));
  return {
    ...raw,
    flights,
    flightsBy: groupBy(flights, 'airline'),
    aircraftDaysBy: groupBy(raw.aircraftDays, 'airline'),
    crewDaysBy: groupBy(raw.crewDays, 'airline'),
    financeBy: groupBy(raw.finance, 'airline'),
  };
}

export function airlineList(data) {
  return data.airlines;
}

export function aircraftTypes(data) {
  return [...new Map(data.airlines.map((a) => [a.type, a.model])).entries()].map(([type, model]) => ({ type, model }));
}

/**
 * Every route in the dataset (both directions merged), sorted. The list does not
 * depend on the selected airlines, so all routes can always be chosen; a route the
 * selected airline does not fly simply has no sectors.
 */
export function routeOptions(data) {
  return [...new Set(data.flights.map((f) => f.route))].sort();
}

/** Map of route key to the airline codes that fly it, e.g. 'FRA–IST' -> ['LH', 'TK']. */
export function routeCarriers(data) {
  const map = {};
  for (const f of data.flights) {
    const list = (map[f.route] ||= []);
    if (!list.includes(f.airline)) list.push(f.airline);
  }
  for (const k of Object.keys(map)) map[k].sort();
  return map;
}

/* --------------------------------------------------------------- context */

/**
 * Build the filtered view of every table. `overrides` lets callers narrow the
 * airlines or months without touching the user's filters (used for the
 * per-airline comparison and for the monthly series).
 */
export function makeContext(data, filters, overrides = {}) {
  const f = { ...filters, ...overrides };
  const typeOk = (code) => {
    if (f.aircraftType === 'all') return true;
    const a = data.airlines.find((x) => x.code === code);
    return a && a.type === f.aircraftType;
  };
  const airlineCodes = f.airlines.filter(typeOk);
  const routeScoped = f.route !== 'all' || f.distance !== 'all';

  const inMonths = (r) => r.month >= f.fromMonth && r.month <= f.toMonth;
  const flightOk = (r) => {
    if (!inMonths(r)) return false;
    if (f.route !== 'all' && r.route !== f.route) return false;
    if (f.distance === 'short' && !(r.distance_km < SHORT_SECTOR_KM)) return false;
    if (f.distance === 'long' && !(r.distance_km >= SHORT_SECTOR_KM)) return false;
    return true;
  };

  const flights = [];
  const aircraftDays = [];
  const crewDays = [];
  const finance = [];
  for (const code of airlineCodes) {
    for (const r of data.flightsBy[code] || []) if (flightOk(r)) flights.push(r);
    for (const r of data.aircraftDaysBy[code] || []) if (inMonths(r)) aircraftDays.push(r);
    for (const r of data.crewDaysBy[code] || []) if (inMonths(r)) crewDays.push(r);
    for (const r of data.financeBy[code] || []) if (inMonths(r)) finance.push(r);
  }

  const ctx = {
    filters: f,
    airlineCodes,
    routeScoped,
    flights,
    aircraftDays,
    crewDays,
    finance,
  };
  ctx.t = totalFlights(flights);
  ctx.a = totalAircraft(aircraftDays);
  ctx.c = totalCrew(crewDays);
  ctx.fin = totalFinance(finance, f.toMonth);
  return ctx;
}

/* ---------------------------------------------------------------- totals */

export function totalFlights(flights) {
  const t = {
    scheduled: 0, operated: 0, cancelled: 0, diverted: 0,
    passengers: 0, rpk: 0, ask: 0, ctk: 0, actk: 0,
    revenue: 0, cost: 0, passengerRevenue: 0,
    ontime: 0, gate: 0, delay: 0, turn: 0, turns: 0,
    bag: 0, mishandled: 0, delayed: 0, lost: 0, damaged: 0,
    complaints: 0, compliments: 0,
  };
  for (const f of flights) {
    t.scheduled += 1;
    const cancelled = f.status === 'Cancelled';
    const diverted = f.status === 'Diverted';
    if (cancelled) t.cancelled += 1;
    else t.operated += 1;
    if (diverted) t.diverted += 1;

    t.passengers += f.passengers;
    t.rpk += f.rpk;
    t.ask += f.ask;
    t.ctk += f.ctk;
    t.actk += f.actk;
    t.revenue += f.operating_revenue_eur;
    t.cost += f.operating_cost_eur;
    t.passengerRevenue += f.passenger_revenue_eur;
    t.bag += f.baggage_kg;
    t.delayed += f.delayed_bags;
    t.lost += f.lost_bags;
    t.damaged += f.damaged_bags;
    t.complaints += f.complaints;
    t.compliments += f.compliments;

    if (!cancelled) {
      t.gate += f.gate_change;
      const delay = f.arrival_delay_min;
      if (delay != null) {
        t.delay += Math.max(delay, 0); // early arrivals count as zero
        if (!diverted && delay < ON_TIME_MINUTES) t.ontime += 1;
      }
      if (f.turnaround_min != null) {
        t.turn += f.turnaround_min;
        t.turns += 1;
      }
    }
  }
  t.mishandled = t.delayed + t.lost + t.damaged;
  return t;
}

function totalAircraft(rows) {
  let block = 0;
  let days = 0;
  for (const r of rows) {
    block += r.block_hours;
    days += r.aircraft_days;
  }
  return { block, days };
}

function totalCrew(rows) {
  let hours = 0;
  let days = 0;
  for (const r of rows) {
    hours += r.pilot_block_hours;
    days += r.pilot_person_days;
  }
  return { hours, days };
}

/**
 * Finance: profit and cash flows are FLOWS (added over the period);
 * debt is a STOCK (read at the last selected month, never summed over months).
 */
function totalFinance(rows, lastMonth) {
  if (rows.length === 0) return null;
  const fin = { net: 0, ocf: 0, cashflow: 0, shortDebt: 0, longDebt: 0 };
  for (const r of rows) {
    fin.net += r.net_profit_eur;
    fin.ocf += r.operating_cashflow_eur;
    fin.cashflow += r.net_cashflow_eur;
    if (r.month === lastMonth) {
      fin.shortDebt += r.short_debt_eur;
      fin.longDebt += r.long_debt_eur;
    }
  }
  return fin;
}

/* ----------------------------------------------------------------- terms */

// Every numerator and denominator used by METRICS.
export const TERMS = {
  scheduled: (c) => c.t.scheduled,
  operated: (c) => c.t.operated,
  cancelled: (c) => c.t.cancelled,
  diverted: (c) => c.t.diverted,
  passengers: (c) => c.t.passengers,
  rpk: (c) => c.t.rpk,
  ask: (c) => c.t.ask,
  ctk: (c) => c.t.ctk,
  actk: (c) => c.t.actk,
  revenue: (c) => c.t.revenue,
  cost: (c) => c.t.cost,
  passengerRevenue: (c) => c.t.passengerRevenue,
  ontime: (c) => c.t.ontime,
  gate: (c) => c.t.gate,
  delay: (c) => c.t.delay,
  turn: (c) => c.t.turn,
  turns: (c) => c.t.turns,
  bag: (c) => c.t.bag,
  mishandled: (c) => c.t.mishandled,
  delayed: (c) => c.t.delayed,
  lost: (c) => c.t.lost,
  complaints: (c) => c.t.complaints,
  compliments: (c) => c.t.compliments,
  profit: (c) => c.t.revenue - c.t.cost,
  block: (c) => c.a.block,
  aircraftDays: (c) => c.a.days,
  crewHours: (c) => c.c.hours,
  crewDays: (c) => c.c.days,
  net: (c) => (c.fin ? c.fin.net : null),
  ocf: (c) => (c.fin ? c.fin.ocf : null),
  cashflow: (c) => (c.fin ? c.fin.cashflow : null),
  shortDebt: (c) => (c.fin ? c.fin.shortDebt : null),
  longDebt: (c) => (c.fin ? c.fin.longDebt : null),
};

/**
 * Evaluate one metric on a context.
 * status: 'ok' | 'scope' (needs full-airline scope) | 'na' (denominator is zero / no data)
 */
export function evaluate(metric, ctx) {
  if (metric.fullScopeOnly && ctx.routeScoped) return { value: null, status: 'scope', num: null, den: null };
  const num = TERMS[metric.num](ctx);
  if (num == null) return { value: null, status: 'na', num: null, den: null };
  if (!metric.den) return { value: num * metric.scale, status: 'ok', num, den: null };
  const den = TERMS[metric.den](ctx);
  if (!den) return { value: null, status: 'na', num, den };
  return { value: (num / den) * metric.scale, status: 'ok', num, den };
}

export function evaluateById(id, ctx) {
  return evaluate(METRIC_BY_ID[id], ctx);
}

export function evaluateAll(ctx) {
  return Object.fromEntries(METRICS.map((m) => [m.id, evaluate(m, ctx)]));
}

/* ---------------------------------------------------------- derived views */

/** One value per month in the selected range for one airline. */
export function monthlySeries(data, filters, metric, airlineCode) {
  const out = [];
  for (let month = filters.fromMonth; month <= filters.toMonth; month += 1) {
    const ctx = makeContext(data, filters, { airlines: [airlineCode], fromMonth: month, toMonth: month });
    out.push({ month, ...evaluate(metric, ctx) });
  }
  return out;
}

export function statusSummary(ctx) {
  const t = ctx.t;
  const range = ctx.filters.fromMonth === ctx.filters.toMonth
    ? `${MONTHS[ctx.filters.fromMonth - 1]} 2025`
    : `${MONTHS[ctx.filters.fromMonth - 1]}–${MONTHS[ctx.filters.toMonth - 1]} 2025`;
  return {
    range,
    airlines: ctx.airlineCodes.length,
    scheduled: t.scheduled,
    operated: t.operated,
    cancelled: t.cancelled,
    diverted: t.diverted,
  };
}
