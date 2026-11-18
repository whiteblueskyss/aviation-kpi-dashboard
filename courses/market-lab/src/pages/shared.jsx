import { PERIODS } from '../lib/format';

export const PeriodSelect = ({ period, setPeriod, id }) => (
  <label>
    Comparison period
    <select id={id} className={id ? undefined : 'periodMirror'} value={period} onChange={(e) => setPeriod(+e.target.value)}>
      <option value="0">{PERIODS[0]}</option>
      <option value="1">{PERIODS[1]}</option>
    </select>
  </label>
);

export const PeriodLabel = ({ period }) => <span className="periodLabel">{PERIODS[period]}</span>;
