export const PERIODS = ['July 2025 vs July 2024', 'Jan–Jul 2025 vs Jan–Jul 2024'];

export const SECTIONS = [
  ['start', 'Start here'],
  ['overview', 'Global overview'],
  ['demand', 'Demand vs capacity'],
  ['regions', 'Regional comparison'],
  ['domestic', 'Domestic markets'],
  ['routes', 'Route areas'],
  ['time', 'Time & outlook'],
  ['lab', 'Load factor laboratory'],
  ['workshop', 'Analysis workshop'],
  ['sources', 'Sources & data'],
];

export const fmt = (v, unit = '') => (v == null ? 'Not available in this report' : Number(v).toFixed(1) + unit);
export const sign = (v) => (v > 0 ? '+' : '') + Number(v).toFixed(1);
